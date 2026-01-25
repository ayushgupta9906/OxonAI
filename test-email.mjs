// test-email.mjs
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from OxonAI directory
dotenv.config({ path: path.resolve('OxonAI', '.env') });

const emailUser = process.env.EMAIL_SERVER_USER || 'oxonaiagent@gmail.com';
const emailPass = process.env.EMAIL_SERVER_PASSWORD;

console.log('--- SMTP Config Debug ---');
console.log('User:', emailUser);
console.log('Pass Length:', emailPass ? emailPass.length : 0);

if (!emailPass) {
    console.error('❌ ERROR: EMAIL_SERVER_PASSWORD is missing or empty in OxonAI/.env');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

console.log('Attempting to verify connection...');

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Connection Failed:', error);
    } else {
        console.log('✅ Connection Successful! Server is ready to take our messages');
    }
});
