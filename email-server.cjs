/**
 * Simple Email Server for HASA GOLD STORE
 * Uses Namecheap SMTP to send professional verification emails
 * 
 * To run this server:
 * 1. npm install nodemailer cors express
 * 2. node email-server.js
 */

const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration - UPDATE WITH YOUR NAMECHEAP DETAILS
const emailConfig = {
  host: 'mail.hasagold.store', // Your Namecheap SMTP server
  port: 587, // TLS port
  secure: false, // TLS
  auth: {
    user: 'no-reply@hasagold.store', // Your email
    pass: '@hasa1234G' // Updated with actual password
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Professional email template
const getVerificationEmailTemplate = (userName, verificationLink) => {
  return {
    subject: 'Verify Your HASA GOLD STORE Account - Action Required',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your HASA GOLD STORE Account</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 650px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 40px 30px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="100" fill="rgba(255,255,255,0.1)">🎮</text></svg>') center/200px; }
          .logo { font-size: 32px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; position: relative; z-index: 1; }
          .tagline { color: #000; font-size: 14px; font-weight: 600; opacity: 0.8; position: relative; z-index: 1; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.8; }
          .button-container { text-align: center; margin: 30px 0; }
          .verify-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 25px rgba(255,215,0,0.3); transition: all 0.3s ease; }
          .verify-button:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(255,215,0,0.4); }
          .link-text { font-size: 14px; color: #999; margin: 20px 0; }
          .verification-link { background: #f8f9fa; padding: 15px; border-radius: 8px; word-break: break-all; font-family: 'Courier New', monospace; font-size: 12px; color: #666; border: 1px solid #e9ecef; }
          .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 30px 0; }
          .security-notice h4 { color: #856404; margin-bottom: 10px; font-size: 16px; }
          .security-notice p { color: #856404; font-size: 14px; margin: 5px 0; }
          .footer { background: #2c3e50; color: #ecf0f1; padding: 30px; text-align: center; }
          .footer-logo { font-size: 20px; font-weight: 700; color: #FFD700; margin-bottom: 15px; }
          .footer-links { margin: 20px 0; }
          .footer-links a { color: #FFD700; text-decoration: none; margin: 0 10px; font-size: 14px; }
          .footer-links a:hover { text-decoration: underline; }
          .social-links { margin: 20px 0; }
          .social-links a { display: inline-block; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 8px; line-height: 40px; text-align: center; color: #FFD700; text-decoration: none; }
          .copyright { font-size: 12px; color: #95a5a6; margin-top: 20px; }
          @media only screen and (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .logo { font-size: 28px; }
            .verify-button { padding: 15px 30px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HASA GOLD STORE</div>
            <div class="tagline">Premium Game Top-Up Services</div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Welcome, ${userName}! 🎮</h2>
            
            <p class="message">
              Thank you for joining HASA GOLD STORE! We're excited to have you as part of our gaming community. 
              To ensure the security of your account and unlock all features, please verify your email address.
            </p>
            
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">
                Verify Email Address
              </a>
            </div>
            
            <p class="link-text">
              Or copy and paste this link into your browser:
            </p>
            
            <div class="verification-link">
              ${verificationLink}
            </div>
            
            <div class="security-notice">
              <h4>🔒 Security Notice</h4>
              <p>• This verification link expires in 24 hours</p>
              <p>• Never share this link with anyone</p>
              <p>• If you didn't create an account, please ignore this email</p>
            </div>
            
            <p class="message">
              Once verified, you'll have access to:
            </p>
            <ul style="color: #666; margin-left: 20px; line-height: 2;">
              <li>✅ Instant game top-ups</li>
              <li>✅ Exclusive member rewards</li>
              <li>✅ 24/7 customer support</li>
              <li>✅ Secure payment processing</li>
            </ul>
          </div>
          
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/terms">Terms</a>
              <a href="https://hasagold.store/privacy">Privacy</a>
            </div>
            <div class="social-links">
              <a href="#">📧</a>
              <a href="#">💬</a>
              <a href="#">📱</a>
            </div>
            <div class="copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              This email was sent to you for account verification.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// API endpoint to send verification email
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { to, userName, verificationCode } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Create verification link (you'll need to generate this properly)
    const verificationLink = `https://hasagold.store/auth?verify=${verificationCode || 'generated-code'}`;
    
    const emailTemplate = getVerificationEmailTemplate(userName || 'Gamer', verificationLink);
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`Verification email sent to: ${to}`);
    res.json({ success: true, message: 'Verification email sent successfully' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Email server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`📧 Ready to send emails from no-reply@hasagold.store`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/send-verification-email`);
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
    console.log('💡 Please check your Namecheap SMTP settings');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});
