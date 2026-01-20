interface PasswordResetEmailProps {
  resetLink: string;
  userEmail: string;
}

export function PasswordResetEmail({ resetLink, userEmail }: PasswordResetEmailProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Finance Academy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #55cf9e 0%, #3da87a 100%); border-radius: 8px 8px 0 0;">
              <img src="${process.env.NEXT_PUBLIC_SITE_URL}/falogo.png" alt="Finance Academy" style="max-width: 200px; height: auto;" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your account associated with <strong>${userEmail}</strong> at Finance Academy.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #55cf9e 0%, #3da87a 100%);">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              
              <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f7fafc; border-radius: 4px; color: #4a5568; font-size: 14px; word-break: break-all;">
                ${resetLink}
              </p>
              
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                  <strong>Security Note:</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #718096; font-size: 14px; line-height: 1.6;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, you can safely ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #718096; font-size: 14px;">
                © ${new Date().getFullYear()} Finance Academy. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; color: #a0aec0; font-size: 12px;">
                Powered by Credit Banc
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
