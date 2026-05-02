const nodemailer = require('nodemailer');

async function testProtonMailDelivery() {
  console.log('📧 Testing Email Delivery to ProtonMail');
  console.log('=====================================');
  
  // Ask user for their ProtonMail address
  console.log('❓ Please enter your ProtonMail address:');
  console.log('   I need your actual ProtonMail address to test delivery');
  console.log('   The test was sending to no-reply@hasagold.store (internal email)');
  console.log('   But you need to receive it in your ProtonMail inbox');
  
  // Create transporter with working configuration
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'no-reply@hasagold.store',
      pass: '@hasa1234G'
    }
  });

  console.log('📡 Testing SMTP connection...');
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    // Test with a common ProtonMail format (you'll need to provide your actual address)
    const testAddresses = [
      // Add your actual ProtonMail address here
      // 'yourname@protonmail.com',
      // 'yourname@proton.me'
    ];
    
    if (testAddresses.length === 0) {
      console.log('⚠️  Please provide your ProtonMail address');
      console.log('📝 Update this file with your actual ProtonMail address');
      console.log('🔄 Then run: node test-protonmail.cjs');
      return;
    }
    
    for (const email of testAddresses) {
      console.log(`📧 Sending test to: ${email}`);
      
      const mailOptions = {
        from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
        to: email,
        subject: '🧪 HASA GOLD STORE - ProtonMail Test',
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px;">
              <h1 style="color: #000; margin: 0;">HASA GOLD STORE</h1>
              <h2 style="color: #000; margin: 10px 0;">ProtonMail Delivery Test</h2>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>🎯 This is a test email to verify ProtonMail delivery</p>
              <p>✅ SMTP: mail.privateemail.com:587</p>
              <p>✅ From: no-reply@hasagold.store</p>
              <p>✅ To: ${email}</p>
              <p>📅 Sent: ${new Date().toLocaleString()}</p>
              <p><strong>If you receive this, email delivery is working!</strong></p>
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>&copy; 2024 HASA GOLD STORE - Email Delivery Test</p>
            </div>
          </div>
        `
      };

      try {
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);
        console.log(`📬 Message ID: ${result.messageId}`);
        console.log(`📧 Check your ProtonMail inbox AND spam folder`);
      } catch (error) {
        console.log(`❌ Failed to send to ${email}: ${error.message}`);
      }
    }
    
    console.log('\n🔍 Troubleshooting Tips:');
    console.log('   1. Check ProtonMail spam folder');
    console.log('   2. Check "All Mail" folder in ProtonMail');
    console.log('   3. Verify no-reply@hasagold.store is not blocked');
    console.log('   4. Check ProtonMail filters/rules');
    
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check Namecheap email account status');
    console.log('   2. Verify SMTP credentials');
    console.log('   3. Check internet connection');
  }
}

// Run the test
testProtonMailDelivery();
