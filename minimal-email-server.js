const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Email configuration
const transporter = nodemailer.createTransporter({
  host: 'mail.hasagold.store',
  port: 587,
  secure: false,
  auth: {
    user: 'no-reply@hasagold.store',
    pass: '@hasa1234G'
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email config error:', error.message);
  } else {
    console.log('✅ Email server ready');
  }
});

// Send verification email endpoint
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { to, userName } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Email required' });
    }

    const verificationLink = `https://hasagold.store/auth?verify=test`;
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: to,
      subject: 'Verify Your HASA GOLD STORE Account',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #000; margin: 0;">HASA GOLD STORE</h1>
            <h2 style="color: #000; margin: 10px 0;">Verify Your Account</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${userName || 'Gamer'},</p>
            <p>Thank you for registering! Please verify your email:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background: #FFD700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </div>
            <p>Link: ${verificationLink}</p>
            <p><strong>Note:</strong> This link expires in 24 hours.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 HASA GOLD STORE</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
    res.json({ success: true, message: 'Email sent!' });
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'running', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('🚀 HASA GOLD STORE Email Server');
  console.log(`📧 Running on http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/send-verification-email`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});
