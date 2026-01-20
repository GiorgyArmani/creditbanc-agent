import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import { PasswordResetEmail } from '@/components/emails/password-reset';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase())
            .single();

        // For security, we don't reveal if the email exists or not
        // Always return success, but only send email if user exists
        if (!userError && userData) {
            // Generate password reset link using Supabase Admin API
            const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const { data, error } = await supabase.auth.admin.generateLink({
                type: 'recovery',
                email: email.toLowerCase(),
                options: {
                    redirectTo: `${redirectUrl}/auth/update-password`,
                },
            });

            if (error) {
                console.error('Error generating reset link:', error);
                throw error;
            }

            if (data?.properties?.action_link) {
                // Send custom email with the reset link
                await sendEmail({
                    to: email,
                    subject: 'Reset Your Password - Finance Academy',
                    html: PasswordResetEmail({
                        resetLink: data.properties.action_link,
                        userEmail: email,
                    }),
                });
            }
        }

        // Always return success for security (don't reveal if email exists)
        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        });
    } catch (error) {
        console.error('Error in reset-password API:', error);
        return NextResponse.json(
            { error: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
}
