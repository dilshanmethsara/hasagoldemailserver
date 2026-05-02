const nodemailer = require('nodemailer');

async function testNamecheapSMTP() {
  console.log('🔧 Testing Namecheap SMTP Configurations');
  console.log('=====================================');
  
  // Common Namecheap SMTP configurations
  const configs = [
    {
      name: 'Namecheap Private Email (Standard)',
      host: 'mail.privateemail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    },
    {
      name: 'Namecheap Private Email (SSL)',
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    },
    {
      name: 'Namecheap Standard SMTP',
      host: 'smtp.namecheap.com',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    },
    {
      name: 'Localhost SMTP (Port 25)',
      host: 'localhost',
      port: 25,
      secure: false,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    }
  ];

  for (const config of configs) {
    console.log(`\n📡 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    
    try {
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      
      console.log(`✅ ${config.name} - Connection successful!`);
      
      // Try to send a test email
      const mailOptions = {
        from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
        to: 'no-reply@hasagold.store',
        subject: `✅ Test from ${config.name}`,
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px;">
              <h1 style="color: #000; margin: 0;">HASA GOLD STORE</h1>
              <h2 style="color: #000; margin: 10px 0;">Email System Test</h2>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>🎉 SUCCESS! Professional email system is working!</p>
              <p>✅ Configuration: ${config.name}</p>
              <p>✅ SMTP: ${config.host}:${config.port}</p>
              <p>✅ Ready for production use</p>
              <p><strong>Next step:</strong> Test registration on hasagold.store</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>&copy; 2024 HASA GOLD STORE - Professional Email System</p>
            </div>
          </div>
        `
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`📧 Test email sent! Message ID: ${result.messageId}`);
      console.log(`📬 Check your inbox at no-reply@hasagold.store`);
      
      // If successful, this is our working configuration
      console.log(`\n🎉 WORKING CONFIGURATION FOUND: ${config.name}`);
      console.log('=====================================');
      console.log('✅ Email system is ready for production!');
      console.log('📋 Ready to test user registration on hasagold.store');
      
      // Save the working configuration
      console.log('\n📝 Working Configuration:');
      console.log(JSON.stringify(config, null, 2));
      
      return config;
      
    } catch (error) {
      console.log(`❌ ${config.name} - Failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ All SMTP configurations failed');
  console.log('🔧 Next steps:');
  console.log('   1. Check if no-reply@hasagold.store exists in Namecheap');
  console.log('   2. Verify email password: @hasa1234G');
  console.log('   3. Check if SMTP is enabled for the email account');
  console.log('   4. Try creating the email account if it doesn\'t exist');
  
  console.log('\n💡 Alternative: Use Firebase Email System');
  console.log('   The current system has fallback to Firebase email');
  console.log('   Users can still verify accounts with Firebase emails');
  console.log('   Professional branding can be added in Firebase templates');
}

// Run the test
testNamecheapSMTP();
