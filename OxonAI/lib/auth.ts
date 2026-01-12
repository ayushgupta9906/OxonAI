import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60, // 30 minutes
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            console.log('NextAuth JWT Callback:', { email: token.email, sub: token.sub, hasUser: !!user, hasAccount: !!account });
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                    select: { id: true, role: true, plan: true, credits: true },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.plan = dbUser.plan;
                    token.credits = dbUser.credits;
                }
            }
            return token;
        },
        async session({ session, token }) {
            console.log('NextAuth Session Callback:', { email: session.user?.email, id: token.id });
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
                (session.user as any).credits = token.credits;
            }
            return session;
        },
    },
    events: {
        async signIn({ user, account, profile }) {
            console.log('NextAuth SignIn Event:', { user: user.email, provider: account?.provider });
        },
        async createUser({ user }) {
            console.log('NextAuth CreateUser Event:', user.email);
        },
        async linkAccount({ user, account }) {
            console.log('NextAuth LinkAccount Event:', { user: user.email, provider: account.provider });
        },
    },
    debug: process.env.NODE_ENV === 'development',
};
