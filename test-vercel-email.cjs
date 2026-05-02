const https = require('https');

async function testVercelEmail() {
  console.log('🧪 Testing Vercel Email Function');
  console.log('==================================');
  
  try {
    const testData = {
      type: 'verification',
      to: 'dmcreatorstudio04@proton.me',
      userName: 'Test User',
      verificationLink: 'https://hasagold.store/auth?message=email_verified'
    };
    
    const data = JSON.stringify(testData);
    
    const options = {
      hostname: 'hasagoldemailserver.vercel.app',
      path: '/api/send-email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    console.log('📡 Sending test request to Vercel...');
    
    const req = https.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          console.log('✅ Response:', response);
          
          if (response.success) {
            console.log('🎉 Vercel email function is working!');
            console.log('📧 Check your ProtonMail for the test email');
          } else {
            console.log('❌ Email function returned error:', response.error);
          }
        } catch (e) {
          console.log('📄 Raw response:', body);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      console.log('💡 Make sure Vercel deployment is active');
    });
    
    req.write(data);
    req.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testVercelEmail();
