const nodemailer = require('nodemailer');

async function testSMTPConnection() {
  console.log('🔧 Testing HASA GOLD STORE SMTP Connection');
  console.log('=====================================');
  
  try {
    // Create transporter with your credentials
    const transporter = nodemailer.createTransporter({
      host: 'mail.hasagold.store',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    });

    console.log('📡 Testing SMTP connection...');
    
    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!');
    console.log('📧 Ready to send emails from no-reply@hasagold.store');
    
    // Test sending an email
    console.log('📧 Sending test email...');
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: 'no-reply@hasagold.store', // Send to yourself for testing
      subject: '🧪 HASA GOLD STORE - Email System Test',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: #000; margin: 0;">HASA GOLD STORE</h1>
            <h2 style="color: #000; margin: 10px 0;">Email System Test</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>🎉 Professional email system is working!</p>
            <p>✅ SMTP connection successful</p>
            <p>✅ Email template loaded</p>
            <p>✅ Ready for production use</p>
            <p><strong>Next step:</strong> Test the registration flow on hasagold.store</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 HASA GOLD STORE - Professional Email System</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', result.messageId);
    console.log('📧 Check your inbox at no-reply@hasagold.store');
    
    console.log('=====================================');
    console.log('🎉 Email system is ready for production!');
    console.log('📋 Ready to test user registration on hasagold.store');
    
  } catch (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check Namecheap email password');
    console.log('   2. Verify SMTP server: mail.hasagold.store');
    console.log('   3. Confirm port: 587 (TLS)');
    console.log('   4. Check email account: no-reply@hasagold.store');
  }
}

// Run the test
testSMTPConnection();
