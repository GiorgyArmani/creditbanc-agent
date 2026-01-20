interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  dashboardLink: string;
}

export function WelcomeEmail({ userName, userEmail, dashboardLink }: WelcomeEmailProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Finance Academy</title>
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
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Welcome, ${userName}! 🎉</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We're thrilled to have you join Finance Academy! Your account has been successfully created and you're all set to start your journey to financial success.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f7fafc; border-left: 4px solid #55cf9e; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                  Your Account Details:
                </p>
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                  Email: <strong>${userEmail}</strong>
                </p>
              </div>
              
              <h3 style="margin: 30px 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">What's Next?</h3>
              
              <ul style="margin: 0 0 30px 0; padding-left: 20px; color: #4a5568; font-size: 16px; line-height: 1.8;">
                <li>Complete your profile to get personalized recommendations</li>
                <li>Explore our credit improvement tools and resources</li>
                <li>Connect with our financial advisors for expert guidance</li>
                <li>Start building your path to better credit</li>
              </ul>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #55cf9e 0%, #3da87a 100%);">
                    <a href="${dashboardLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                  Need Help?
                </p>
                <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                  Our support team is here to help! If you have any questions or need assistance, don't hesitate to reach out to us at <a href="mailto:${process.env.SMTP_FROM_EMAIL}" style="color: #55cf9e; text-decoration: none;">${process.env.SMTP_FROM_EMAIL}</a>
                </p>
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
