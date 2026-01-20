import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send an email using the configured SMTP server
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            html,
            text: text || stripHtml(html), // Fallback to stripped HTML if no text provided
        });

        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

/**
 * Simple HTML stripper for plain text fallback
 */
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection() {
    try {
        await transporter.verify();
        console.log('SMTP server is ready to send emails');
        return true;
    } catch (error) {
        console.error('SMTP server connection failed:', error);
        return false;
    }
}
