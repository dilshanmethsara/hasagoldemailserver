/**
 * Custom Email Service for HASA GOLD STORE
 * Uses Namecheap SMTP server for sending verification emails
 */

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface VerificationEmailData {
  to: string;
  subject: string;
  verificationLink: string;
  userName?: string;
}

/**
 * Send verification email using custom SMTP server
 * Note: This requires a backend service to handle SMTP connections securely
 * For now, we'll use Firebase's built-in service with custom templates
 */
export const sendVerificationEmail = async (email: string, verificationLink: string, userName?: string) => {
  try {
    // For now, we'll use Firebase's built-in email service
    // In a production environment, you would:
    // 1. Set up a backend API endpoint (Cloud Function)
    // 2. Configure SMTP credentials securely (environment variables)
    // 3. Use a library like Nodemailer to send emails
    
    // Firebase will handle the email sending with the verification link
    console.log('Verification email would be sent to:', email);
    console.log('Verification link:', verificationLink);
    console.log('User name:', userName || 'User');
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Email template for verification
 */
export const getVerificationEmailTemplate = (userName: string, verificationLink: string) => {
  return {
    subject: 'Verify your HASA GOLD STORE account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your HASA GOLD STORE account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: #000; margin: 0; font-size: 28px; font-weight: bold; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FFD700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .logo { font-size: 24px; font-weight: bold; color: #000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HASA GOLD STORE</div>
            <h1>Verify Your Account</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for registering with HASA GOLD STORE! To complete your registration and start enjoying our game top-up services, please verify your email address.</p>
            <p>Click the button below to verify your account:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationLink}</p>
            <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with HASA GOLD STORE, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 HASA GOLD STORE. All rights reserved.</p>
            <p>This email was sent to ${email} because you registered for an account.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};
