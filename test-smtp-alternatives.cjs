const nodemailer = require('nodemailer');

async function testMultipleSMTPConfigs() {
  console.log('🔧 Testing Multiple SMTP Configurations');
  console.log('=====================================');
  
  const configs = [
    {
      name: 'Namecheap SMTP (TLS)',
      host: 'mail.hasagold.store',
      port: 587,
      secure: false,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    },
    {
      name: 'Namecheap SMTP (SSL)',
      host: 'mail.hasagold.store',
      port: 465,
      secure: true,
      auth: {
        user: 'no-reply@hasagold.store',
        pass: '@hasa1234G'
      }
    },
    {
      name: 'Alternative Namecheap Server',
      host: 'smtp.hasagold.store',
      port: 587,
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
        subject: `Test from ${config.name}`,
        html: `<p>✅ Success! This email was sent using ${config.name}</p>`
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`📧 Test email sent! Message ID: ${result.messageId}`);
      
      // If successful, this is our working configuration
      console.log(`\n🎉 WORKING CONFIGURATION FOUND: ${config.name}`);
      console.log('=====================================');
      console.log('✅ Email system is ready for production!');
      console.log('📋 Ready to test user registration on hasagold.store');
      return config;
      
    } catch (error) {
      console.log(`❌ ${config.name} - Failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ All SMTP configurations failed');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Check if no-reply@hasagold.store exists in Namecheap');
  console.log('   2. Verify email password is correct');
  console.log('   3. Check if SMTP is enabled for the email account');
  console.log('   4. Try different SMTP server names');
  console.log('   5. Check firewall/antivirus blocking port 587/465');
  
  console.log('\n📞 Next steps:');
  console.log('   1. Login to Namecheap email panel');
  console.log('   2. Verify no-reply@hasagold.store exists');
  console.log('   3. Check SMTP settings in Namecheap');
  console.log('   4. Try again with correct settings');
}

// Run the test
testMultipleSMTPConfigs();
