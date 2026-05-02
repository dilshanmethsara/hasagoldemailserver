const nodemailer = require('nodemailer');

async function testFirebaseEmailWorkaround() {
  console.log('🔧 Testing Firebase Email Workaround');
  console.log('===================================');
  
  // Since Firebase email might not be working, let's create a manual verification system
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
    console.log('📡 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    console.log('📧 Creating manual verification system...');
    
    // Create a simple manual verification link
    const createManualVerificationLink = (email) => {
      const timestamp = Date.now();
      const token = Buffer.from(`${email}:${timestamp}`).toString('base64');
      return `https://hasagold.store/auth?manual_verify=${token}&email=${encodeURIComponent(email)}`;
    };
    
    console.log('✅ Manual verification system ready');
    console.log('📝 This will be used if Firebase email fails');
    
    return true;
    
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    return false;
  }
}

// Run the test
testFirebaseEmailWorkaround().then(success => {
  if (success) {
    console.log('\n🎯 Solution: Create manual verification system');
    console.log('📧 Use our working email server with manual verification');
    console.log('🔗 Generate verification links that work with our system');
  }
}).catch(console.error);
