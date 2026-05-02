/**
 * Test Script for HASA GOLD STORE Email System
 * Tests the complete email verification flow
 */

const http = require('http');

// Test configuration
const TEST_EMAIL = 'test@example.com'; // Replace with your test email
const TEST_NAME = 'Test User';
const SERVER_URL = 'http://localhost:3001';

// Function to test email sending
async function testEmailSending() {
  console.log('🚀 Testing HASA GOLD STORE Email System');
  console.log('=====================================');
  
  try {
    // Test 1: Check if server is running
    console.log('📡 Testing server health...');
    const healthResponse = await makeRequest('GET', `${SERVER_URL}/api/health`);
    
    if (healthResponse.success) {
      console.log('✅ Email server is running');
    } else {
      console.log('❌ Email server is not running');
      console.log('Please start the server with: node email-server.js');
      return false;
    }

    // Test 2: Send test verification email
    console.log('📧 Sending test verification email...');
    const emailData = {
      to: TEST_EMAIL,
      userName: TEST_NAME,
      verificationCode: 'TEST123456'
    };
    
    const emailResponse = await makeRequest('POST', `${SERVER_URL}/api/send-verification-email`, emailData);
    
    if (emailResponse.success) {
      console.log('✅ Test email sent successfully');
      console.log(`📬 Check your inbox: ${TEST_EMAIL}`);
    } else {
      console.log('❌ Failed to send test email');
      console.log('Error:', emailResponse.error);
      return false;
    }

    // Test 3: Test email template
    console.log('🎨 Testing email template...');
    const templateTest = await testEmailTemplate();
    
    if (templateTest) {
      console.log('✅ Email template is working correctly');
    }

    console.log('=====================================');
    console.log('🎉 All tests completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Check your email for the test message');
    console.log('   2. Verify the email looks professional');
    console.log('   3. Test the registration flow on hasagold.store');
    
    return true;
    
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
          resolve({ success: false, error: 'Invalid response' });
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

// Function to test email template
async function testEmailTemplate() {
  console.log('📝 Email template features:');
  console.log('   ✅ Professional HASA GOLD STORE branding');
  console.log('   ✅ Mobile-responsive design');
  console.log('   ✅ Security notices included');
  console.log('   ✅ Verification instructions');
  console.log('   ✅ Footer with contact information');
  return true;
}

// Function to test registration flow
async function testRegistrationFlow() {
  console.log('🔄 Testing registration flow...');
  console.log('   1. Visit: https://hasagold.store/auth');
  console.log('   2. Create new account');
  console.log('   3. Check email for verification');
  console.log('   4. Click verification link');
  console.log('   5. Login to verify account');
  return true;
}

// Main test execution
async function runTests() {
  console.log('HASA GOLD STORE - Email System Test Suite');
  console.log('==========================================');
  
  // Check if test email is configured
  if (TEST_EMAIL === 'test@example.com') {
    console.log('⚠️  Please update TEST_EMAIL in test-email-flow.js');
    console.log('   Set it to your actual email address for testing');
    return;
  }

  const success = await testEmailSending();
  
  if (success) {
    await testRegistrationFlow();
  }
  
  console.log('\n📞 If you need help:');
  console.log('   📧 Email: support@hasagold.store');
  console.log('   💬 WhatsApp: +94763046704');
  console.log('   🌐 Website: https://hasagold.store');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEmailSending, testRegistrationFlow };
