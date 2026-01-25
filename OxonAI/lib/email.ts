import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_SERVER_USER || 'oxonaiagent@gmail.com';
const emailPass = process.env.EMAIL_SERVER_PASSWORD;

console.log('Email Config Check:', {
    user: emailUser,
    passLength: emailPass?.length || 0,
    hasPass: !!emailPass
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass, // App Password
    },
});

export async function sendOTPEmail(email: string, otp: string) {
    const mailOptions = {
        from: `"OxonAI Security" <${process.env.EMAIL_SERVER_USER || 'oxonaiagent@gmail.com'}>`,
        to: email,
        subject: 'Your OxonAI Login Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #6d28d9; text-align: center;">OxonAI Verification</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Use the following One-Time Password (OTP) to log in to your account. This code is valid for 10 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; background: #f3f4f6; padding: 10px 20px; border-radius: 5px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} OxonAI. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}
