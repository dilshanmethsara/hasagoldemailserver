// Vercel Serverless Function for Email Sending
const nodemailer = require('nodemailer');

// SMTP configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@hasagold.store',
    pass: process.env.SMTP_PASS || '@hasa1234G'
  }
});

// Verification email template
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
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 40px 30px; text-align: center; }
          .logo { font-size: 32px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; }
          .tagline { color: #000; font-size: 14px; font-weight: 600; opacity: 0.8; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.8; }
          .button-container { text-align: center; margin: 30px 0; }
          .verify-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 25px rgba(255,215,0,0.3); transition: all 0.3s ease; }
          .verify-button:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(255,215,0,0.4); }
          .footer { background: #2c3e50; color: #ecf0f1; padding: 30px; text-align: center; }
          .footer-logo { font-size: 20px; font-weight: 700; color: #FFD700; margin-bottom: 15px; }
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
            <p class="message">Thank you for joining HASA GOLD STORE! Please verify your email address.</p>
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
            </div>
          </div>
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            <p>© 2024 HASA GOLD STORE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Purchase confirmation template
const getPurchaseEmailTemplate = (userName, orderDetails) => {
  return {
    subject: `Purchase Confirmation - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Purchase Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; padding: 20px; }
          .container { max-width: 650px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 40px 30px; text-align: center; }
          .logo { font-size: 32px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; }
          .content { padding: 40px 30px; }
          .success-title { font-size: 28px; font-weight: 700; color: #28a745; margin-bottom: 20px; text-align: center; }
          .order-details { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #FFD700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HASA GOLD STORE</div>
          </div>
          <div class="content">
            <h2 class="success-title">🎉 Purchase Confirmed!</h2>
            <h3>Thank you, ${userName}!</h3>
            <div class="order-details">
              <h3>📋 Order Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Game:</strong> ${orderDetails.gameName}</p>
              <p><strong>Amount:</strong> ${orderDetails.currency} ${orderDetails.amount}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Main handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, to, userName, verificationLink, orderDetails } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    let emailTemplate;
    
    if (type === 'verification' && verificationLink) {
      emailTemplate = getVerificationEmailTemplate(userName || 'Gamer', verificationLink);
    } else if (type === 'purchase' && orderDetails) {
      emailTemplate = getPurchaseEmailTemplate(userName || 'Customer', orderDetails);
    } else {
      return res.status(400).json({ error: 'Invalid email type or missing parameters' });
    }

    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent to: ${to}`);
    console.log(`📬 Message ID: ${result.messageId}`);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
}
