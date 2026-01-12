export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token || !token.startsWith('oxon_')) {
            return NextResponse.json(
                { valid: false, error: 'Invalid token format' },
                { status: 400 }
            );
        }

        // Decode the token (format: oxon_base64(userId:timestamp))
        try {
            const encoded = token.replace('oxon_', '');
            const decoded = atob(encoded);
            const [userId, timestamp] = decoded.split(':');

            // Verify token is not too old (24 hours)
            const tokenAge = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (tokenAge > maxAge) {
                return NextResponse.json(
                    { valid: false, error: 'Token expired' },
                    { status: 401 }
                );
            }

            // Fetch user from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    plan: true,
                    credits: true,
                    role: true,
                },
            });

            if (!user) {
                return NextResponse.json(
                    { valid: false, error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    plan: user.plan,
                    credits: user.credits,
                    role: user.role,
                },
            });
        } catch (decodeError) {
            return NextResponse.json(
                { valid: false, error: 'Invalid token' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { valid: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
