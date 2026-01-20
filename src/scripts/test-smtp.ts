import { config } from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
config();

async function testSMTP() {
    console.log('=== SMTP Configuration ===');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    console.log('From:', process.env.SMTP_FROM_EMAIL);
    console.log('From Name:', process.env.SMTP_FROM_NAME);
    console.log('');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        debug: true,
        logger: true,
    });

    try {
        console.log('Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');

        // Try sending a test email
        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: process.env.SMTP_USER, // Send to yourself for testing
            subject: 'Test Email from Credit Banc',
            html: '<h1>Test Email</h1><p>If you receive this, your SMTP is working!</p>',
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testSMTP();
