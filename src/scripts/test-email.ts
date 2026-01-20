import { config } from 'dotenv';
import { verifyEmailConnection } from '@/lib/email';

// Load environment variables
config();

/**
 * Test script to verify SMTP connection
 * Run with: npx tsx src/scripts/test-email.ts
 */
async function testEmailConnection() {
    console.log('Testing SMTP connection...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP From:', process.env.SMTP_FROM_EMAIL);

    const isConnected = await verifyEmailConnection();

    if (isConnected) {
        console.log('✅ SMTP connection successful!');
    } else {
        console.log('❌ SMTP connection failed. Check your credentials.');
    }
}

testEmailConnection();
