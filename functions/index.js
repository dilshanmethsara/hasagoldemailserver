const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'hasagoldstore@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email templates
const getVerificationEmailTemplate = (userName, verificationLink) => {
  return {
    subject: 'Verify Your HASA GOLD STORE Account',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your HASA GOLD STORE Account</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
          .container { max-width: 650px; margin: 20px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 50px 30px; text-align: center; position: relative; overflow: hidden; }
          .logo { font-size: 36px; font-weight: 900; color: #000; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; position: relative; z-index: 1; }
          .tagline { color: #000; font-size: 16px; font-weight: 600; opacity: 0.9; position: relative; z-index: 1; }
          .content { padding: 50px 30px; background: #fff; }
          .greeting { font-size: 28px; font-weight: 700; color: #333; margin-bottom: 20px; text-align: center; }
          .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.8; text-align: center; }
          .button-container { text-align: center; margin: 40px 0; }
          .verify-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 20px 50px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 10px 30px rgba(255,215,0,0.3); transition: all 0.3s ease; }
          .verify-button:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(255,215,0,0.4); }
          .footer { background: linear-gradient(135deg, #2c3e50, #34495e); color: #ecf0f1; padding: 40px; text-align: center; }
          .footer-logo { font-size: 24px; font-weight: 700; color: #FFD700; margin-bottom: 20px; }
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
              Thank you for joining HASA GOLD STORE! We're excited to have you as part of our elite gaming community. 
              To ensure the security of your account and unlock all premium features, please verify your email address.
            </p>
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

// Main email sending function
exports.sendEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

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
      from: '"HASA GOLD STORE" <hasagoldstore@gmail.com>',
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
});

// Debug function
exports.debugEmail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const envVars = {
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_PORT: '587',
      SMTP_USER: 'hasagoldstore@gmail.com',
      SMTP_PASS: process.env.SMTP_PASS ? '[SET]' : '[NOT SET]'
    };

    res.json({
      success: true,
      environment: envVars,
      nodemailer: 'LOADED',
      transporter: 'OK',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ 
      error: 'Debug error: ' + error.message,
      details: error.toString()
    });
  }
});

// Auto-send verification email on user creation
exports.sendUserVerificationEmail = functions.auth.user().onCreate(async (user) => {
  if (user.emailVerified) {
    console.log('Email already verified for user:', user.email);
    return null;
  }

  const displayName = user.displayName || 'Gamer';
  const verificationToken = generateVerificationToken(user.uid);
  const verificationLink = `https://hasagold.store/verify-email?token=${verificationToken}&uid=${user.uid}`;

  try {
    // Save verification token to Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: displayName,
      emailVerified: false,
      verificationToken: verificationToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send verification email
    const mailOptions = {
      from: '"HASA GOLD STORE" <hasagoldstore@gmail.com>',
      to: user.email,
      subject: 'Verify Your HASA GOLD STORE Account',
      html: getVerificationEmailTemplate(displayName, verificationLink).html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Verification email sent to:', user.email);
    console.log('📬 Message ID:', result.messageId);

  } catch (error) {
    console.error('❌ Error sending verification email:', error);
  }
});

function generateVerificationToken(uid) {
  return Buffer.from(`${uid}-${Date.now()}-${Math.random()}`).toString('base64');
}
