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
        console.log(`[ResetPassword] Looking up user: ${email}`);
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase())
            .single();

        console.log(`[ResetPassword] User lookup result:`, { found: !!userData, error: userError?.message });

        // For security, we don't reveal if the email exists or not
        // Always return success, but only send email if user exists
        if (!userError && userData) {
            console.log(`[ResetPassword] Generating reset link for ${email}`);
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
                console.error('[ResetPassword] Error generating reset link:', error);
                throw error;
            }

            console.log(`[ResetPassword] Link generated successfully. Action link present: ${!!data?.properties?.action_link}`);

            if (data?.properties?.action_link) {
                console.log(`[ResetPassword] Sending custom email via Nodemailer to ${email}`);
                // Send custom email with the reset link
                await sendEmail({
                    to: email,
                    subject: 'Reset Your Password - Finance Academy',
                    html: PasswordResetEmail({
                        resetLink: data.properties.action_link,
                        userEmail: email,
                    }),
                });
                console.log(`[ResetPassword] Custom email sent code execution completed`);
            }
        } else {
            console.log(`[ResetPassword] User not found or error, skipping email generation`);
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
