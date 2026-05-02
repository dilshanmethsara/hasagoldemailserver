const http = require('http');

async function testManualServer() {
  console.log('🧪 Testing Manual Verification Server');
  console.log('====================================');
  
  try {
    // Test health endpoint
    console.log('📡 Testing server health...');
    const healthResponse = await makeRequest('GET', 'http://localhost:3002/api/health');
    
    if (healthResponse.status && healthResponse.status.includes('Running')) {
      console.log('✅ Manual verification server is running');
      console.log(`📧 SMTP: ${healthResponse.smtp}`);
    } else {
      console.log('❌ Manual verification server is not responding');
      return false;
    }

    // Test sending verification email
    console.log('📧 Sending test verification email...');
    const emailData = {
      to: 'dmcreatorstudio04@proton.me',
      userName: 'Test User'
    };
    
    const emailResponse = await makeRequest('POST', 'http://localhost:3002/api/send-manual-verification', emailData);
    
    if (emailResponse.success) {
      console.log('✅ Manual verification email sent successfully!');
      console.log(`📬 Message ID: ${emailResponse.messageId}`);
      console.log(`🔗 Verification link: ${emailResponse.verificationLink}`);
      console.log('📧 Check your ProtonMail for the verification email');
      
      console.log('\n🎯 What to test:');
      console.log('   1. Check ProtonMail inbox for HASA GOLD STORE email');
      console.log('   2. Click the verification link in the email');
      console.log('   3. Should redirect to auth page with success message');
      console.log('   4. Try logging in with the test credentials');
      
      return true;
    } else {
      console.log('❌ Failed to send manual verification email');
      console.log('Error:', emailResponse.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Function to make HTTP requests
function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          resolve({ success: false, error: 'Invalid response', body: body });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run the test
testManualServer().then(success => {
  if (success) {
    console.log('\n🎊 Manual verification system is working!');
    console.log('📧 Check your ProtonMail now for the verification email!');
  } else {
    console.log('\n❌ Manual verification test failed');
  }
}).catch(console.error);
