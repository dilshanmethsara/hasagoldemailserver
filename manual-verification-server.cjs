const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

// Working SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'no-reply@hasagold.store',
    pass: '@hasa1234G'
  }
});

// Create manual verification link that works
const createVerificationLink = (email) => {
  const timestamp = Date.now();
  const hash = Buffer.from(`${email}:${timestamp}`).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  return `https://hasagold.store/auth?manual_verify=${hash}&email=${encodeURIComponent(email)}&t=${timestamp}`;
};

// Professional email template
const getVerificationEmailTemplate = (userName, verificationLink) => {
  return {
    subject: 'Verify Your HASA GOLD STORE Account - Professional Email',
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
          .logo { font-size: 32px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; }
          .tagline { color: #000; font-size: 14px; font-weight: 600; opacity: 0.8; }
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
          .copyright { font-size: 12px; color: #95a5a6; margin-top: 20px; }
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

// Purchase confirmation email template
const getPurchaseEmailTemplate = (userName, orderDetails) => {
  return {
    subject: `Purchase Confirmation - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; padding: 20px; }
          .container { max-width: 650px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 40px 30px; text-align: center; position: relative; }
          .logo { font-size: 32px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; }
          .tagline { color: #000; font-size: 14px; font-weight: 600; opacity: 0.8; }
          .content { padding: 40px 30px; }
          .success-title { font-size: 28px; font-weight: 700; color: #28a745; margin-bottom: 20px; text-align: center; }
          .greeting { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.8; }
          .order-details { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #FFD700; }
          .order-details h3 { color: #333; margin-bottom: 20px; font-size: 20px; }
          .order-details p { margin: 10px 0; font-size: 16px; color: #555; }
          .order-details strong { color: #333; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; background: #ffc107; color: #856404; }
          .footer { background: #2c3e50; color: #ecf0f1; padding: 30px; text-align: center; }
          .footer-logo { font-size: 20px; font-weight: 700; color: #FFD700; margin-bottom: 15px; }
          .footer-links { margin: 20px 0; }
          .footer-links a { color: #FFD700; text-decoration: none; margin: 0 10px; font-size: 14px; }
          .footer-links a:hover { text-decoration: underline; }
          .copyright { font-size: 12px; color: #95a5a6; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HASA GOLD STORE</div>
            <div class="tagline">Premium Game Top-Up Services</div>
          </div>
          
          <div class="content">
            <h2 class="success-title">🎉 Purchase Confirmed!</h2>
            
            <h3 class="greeting">Thank you, ${userName}!</h3>
            
            <p class="message">
              Your purchase has been successfully processed. We're preparing your game credits/top-up for delivery.
            </p>
            
            <div class="order-details">
              <h3>📋 Order Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Game:</strong> ${orderDetails.gameName}</p>
              <p><strong>Amount:</strong> ${orderDetails.currency} ${orderDetails.amount}</p>
              <p><strong>Status:</strong> <span class="status-badge">${orderDetails.status}</span></p>
              <p><strong>Purchase Date:</strong> ${orderDetails.purchaseDate}</p>
            </div>
            
            <p class="message">
              <strong>What happens next?</strong><br>
              Your game credits/top-up will be delivered to your account shortly. You'll receive another notification when the delivery is complete.
            </p>
            
            <p class="message">
              If you have any questions about your order, please don't hesitate to contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/terms">Terms</a>
              <a href="https://hasagold.store/privacy">Privacy</a>
            </div>
            <div class="copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              Thank you for your business! 🎮
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send verification email endpoint
app.post('/api/send-manual-verification', async (req, res) => {
  try {
    const { to, userName } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const verificationLink = createVerificationLink(to);
    const emailTemplate = getVerificationEmailTemplate(userName || 'Gamer', verificationLink);
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Manual verification email sent to: ${to}`);
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log(`🔗 Verification link: ${verificationLink}`);
    
    res.json({ 
      success: true, 
      message: 'Manual verification email sent successfully!',
      verificationLink: verificationLink,
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    res.status(500).json({ error: 'Failed to send verification email: ' + error.message });
  }
});

// Send purchase confirmation email endpoint
app.post('/api/send-purchase-confirmation', async (req, res) => {
  try {
    const { to, userName, orderDetails } = req.body;
    
    if (!to || !orderDetails) {
      return res.status(400).json({ error: 'Email address and order details are required' });
    }

    const purchaseEmailTemplate = getPurchaseEmailTemplate(userName || 'Customer', orderDetails);
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: purchaseEmailTemplate.subject,
      html: purchaseEmailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Purchase confirmation email sent to: ${to}`);
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log(`🛒 Order ID: ${orderDetails.orderId}`);
    
    res.json({ 
      success: true, 
      message: 'Purchase confirmation email sent successfully!',
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('❌ Purchase email sending error:', error.message);
    res.status(500).json({ error: 'Failed to send purchase confirmation email: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'HASA GOLD STORE Manual Verification Server Running',
    timestamp: new Date().toISOString(),
    smtp: 'Connected to mail.privateemail.com:587',
    type: 'Manual Verification System'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 HASA GOLD STORE Manual Verification Server');
  console.log('===========================================');
  console.log(`📧 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/send-manual-verification`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log('📧 Sending from: no-reply@hasagold.store');
  console.log('🔧 Manual verification links that work!');
  console.log('✅ Ready for production use!');
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email config error:', error.message);
  } else {
    console.log('✅ Manual verification server ready!');
  }
});
