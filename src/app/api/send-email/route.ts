import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { PasswordResetEmail } from '@/components/emails/password-reset';
import { EmailConfirmation } from '@/components/emails/email-confirmation';
import { WelcomeEmail } from '@/components/emails/welcome';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, to, data } = body;

        if (!type || !to) {
            return NextResponse.json(
                { error: 'Missing required fields: type and to' },
                { status: 400 }
            );
        }

        let subject = '';
        let html = '';

        switch (type) {
            case 'password-reset':
                if (!data?.resetLink) {
                    return NextResponse.json(
                        { error: 'Missing resetLink in data' },
                        { status: 400 }
                    );
                }
                subject = 'Reset Your Password - Finance Academy';
                html = PasswordResetEmail({
                    resetLink: data.resetLink,
                    userEmail: to,
                });
                break;

            case 'email-confirmation':
                if (!data?.confirmationLink) {
                    return NextResponse.json(
                        { error: 'Missing confirmationLink in data' },
                        { status: 400 }
                    );
                }
                subject = 'Confirm Your Email - Finance Academy';
                html = EmailConfirmation({
                    confirmationLink: data.confirmationLink,
                    userEmail: to,
                });
                break;

            case 'welcome':
                if (!data?.userName || !data?.dashboardLink) {
                    return NextResponse.json(
                        { error: 'Missing userName or dashboardLink in data' },
                        { status: 400 }
                    );
                }
                subject = 'Welcome to Finance Academy! 🎉';
                html = WelcomeEmail({
                    userName: data.userName,
                    userEmail: to,
                    dashboardLink: data.dashboardLink,
                });
                break;

            default:
                return NextResponse.json(
                    { error: `Unknown email type: ${type}` },
                    { status: 400 }
                );
        }

        const result = await sendEmail({
            to,
            subject,
            html,
        });

        return NextResponse.json({
            success: true,
            messageId: result.messageId,
        });
    } catch (error) {
        console.error('Error in send-email API:', error);
        return NextResponse.json(
            { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
