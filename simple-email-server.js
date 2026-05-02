const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const emailConfig = {
  host: 'mail.hasagold.store',
  port: 587,
  secure: false,
  auth: {
    user: 'no-reply@hasagold.store',
    pass: '@hasa1234G'
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Simple email template
const getVerificationEmailTemplate = (userName, verificationLink) => {
  return {
    subject: 'Verify Your HASA GOLD STORE Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your HASA GOLD STORE Account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .logo { font-size: 24px; font-weight: bold; color: #000; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FFD700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
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
            <p>Thank you for registering with HASA GOLD STORE! Please verify your email address.</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationLink}</p>
            <p><strong>Note:</strong> This verification link expires in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 HASA GOLD STORE. All rights reserved.</p>
            <p>This email was sent to you for account verification.</p>
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

    const verificationLink = `https://hasagold.store/auth?verify=${verificationCode || 'test-code'}`;
    const emailTemplate = getVerificationEmailTemplate(userName || 'Gamer', verificationLink);
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Verification email sent to: ${to}`);
    res.json({ success: true, message: 'Verification email sent successfully' });
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification email: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Email server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 HASA GOLD STORE Email Server');
  console.log(`📧 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/send-verification-email`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
    console.log('💡 Check your Namecheap SMTP settings');
  } else {
    console.log('✅ Email server ready to send messages');
  }
});
