import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOTPEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store or update OTP in VerificationToken
        // We use 'otp' as the identifier strategy here for simplicity or maintain standard NextAuth schema
        // The standard schema uses (identifier, token) as unique.
        // We act as if 'identifier' is the email and 'token' is the OTP.

        // Delete existing token for this email if any
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        });

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: otp,
                expires
            }
        });

        // Send Email
        const sent = await sendOTPEmail(email, otp);

        if (!sent) {
            return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error: any) {
        console.error('OTP Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
