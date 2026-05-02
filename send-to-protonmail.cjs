const nodemailer = require('nodemailer');

async function sendTestToProtonMail() {
  console.log('📧 Sending Test Email to ProtonMail');
  console.log('=====================================');
  
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'no-reply@hasagold.store',
      pass: '@hasa1234G'
    }
  });

  try {
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    console.log('📧 Sending test email to dmcreatorstudio04@proton.me...');
    
    const mailOptions = {
      from: '"HASA GOLD STORE" <no-reply@hasagold.store>',
      to: 'dmcreatorstudio04@proton.me',
      subject: '🧪 HASA GOLD STORE - Email Delivery Test',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: #000; margin: 0;">HASA GOLD STORE</h1>
            <h2 style="color: #000; margin: 10px 0;">Email Delivery Test</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>🎯 SUCCESS! This email was sent from our professional email system</p>
            <p>✅ SMTP Server: mail.privateemail.com:587</p>
            <p>✅ From: no-reply@hasagold.store</p>
            <p>✅ To: dmcreatorstudio04@proton.me</p>
            <p>📅 Sent: ${new Date().toLocaleString()}</p>
            <p><strong>If you received this, the email system is working perfectly!</strong></p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">🎉 What This Means:</h3>
              <ul style="color: #2e7d32;">
                <li>✅ Professional email server is working</li>
                <li>✅ Namecheap SMTP delivery is successful</li>
                <li>✅ ProtonMail delivery is confirmed</li>
                <li>✅ Email templates are rendering correctly</li>
                <li>✅ HASA GOLD STORE branding is active</li>
              </ul>
            </div>
            
            <p><strong>Next Step:</strong> Test user registration on https://hasagold.store</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 HASA GOLD STORE - Professional Email System</p>
            <p>📞 Support: +94763046704 | 🌐 https://hasagold.store</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log('📧 Check your ProtonMail inbox AND spam folder');
    console.log('⏰ Email should arrive within 1-5 minutes');
    
    console.log('\n🔍 Where to check in ProtonMail:');
    console.log('   1. Main inbox');
    console.log('   2. Spam folder');
    console.log('   3. All Mail folder');
    console.log('   4. Check filters/rules');
    
    console.log('\n📞 If you don\'t receive it:');
    console.log('   📧 Email: support@hasagold.store');
    console.log('   💬 WhatsApp: +94763046704');
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check SMTP credentials');
    console.log('   2. Verify Namecheap email account');
    console.log('   3. Check internet connection');
    return false;
  }
}

// Send the test email
sendTestToProtonMail().then(success => {
  if (success) {
    console.log('\n🎊 Test email sent! Check your ProtonMail now!');
  }
}).catch(console.error);
