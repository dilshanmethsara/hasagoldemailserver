# HASA GOLD STORE - Final Website Integration

## Working Email Server (24/7)
✅ **Vercel Email Server**: `https://hasagold-email-server.vercel.app/api/send-email`
✅ **Already Tested**: Working perfectly with dmcreatorstudio04@gmail.com
✅ **24/7 Running**: No Firebase Blaze plan needed
✅ **Free Hosting**: Vercel free tier

## Website Integration Code

### 1. User Registration with Custom Email
```javascript
// Add this to your registration form
async function registerUser(email, password, displayName) {
  try {
    // 1. Create Firebase Auth user
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // 2. Update profile
    await user.updateProfile({ displayName });
    
    // 3. Send custom verification email (Vercel server)
    const verificationLink = `https://hasagold.store/verify-email?token=${generateToken(user.uid)}&uid=${user.uid}`;
    
    const emailSent = await sendCustomVerificationEmail(email, displayName, verificationLink);
    
    if (emailSent) {
      console.log('✅ Registration successful! Check email for verification.');
    } else {
      console.log('⚠️ Registration successful but email failed.');
    }
    
    // 4. Save user to Firestore
    await firebase.firestore().collection('users').doc(user.uid).set({
      email: email,
      displayName: displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      emailVerified: false
    });
    
    return true;
    
  } catch (error) {
    console.error('Registration failed:', error);
    return false;
  }
}

// Custom email function
async function sendCustomVerificationEmail(email, displayName, verificationLink) {
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification',
        to: email,
        userName: displayName,
        verificationLink: verificationLink
      })
    });
    
    const result = await response.json();
    return result.success;
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

function generateToken(uid) {
  return btoa(`${uid}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
}
```

### 2. Purchase Confirmation Email
```javascript
// Add this to your payment success handler
async function handlePurchaseSuccess(paymentData, customerInfo, gameDetails) {
  try {
    // 1. Process payment (your existing logic)
    const orderData = await processPayment(paymentData);
    
    // 2. Send purchase confirmation email
    const emailSent = await sendPurchaseConfirmationEmail(customerInfo, gameDetails, orderData);
    
    if (emailSent) {
      console.log('✅ Purchase confirmation email sent');
    }
    
    // 3. Save order to database
    await saveOrderToDatabase(orderData);
    
    // 4. Show success to user
    showPurchaseSuccess(orderData);
    
  } catch (error) {
    console.error('Purchase processing error:', error);
    showErrorMessage('Purchase failed. Please contact support.');
  }
}

async function sendPurchaseConfirmationEmail(customerInfo, gameDetails, orderData) {
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'purchase',
        to: customerInfo.email,
        userName: customerInfo.name,
        orderDetails: {
          orderId: orderData.orderId,
          gameName: gameDetails.name,
          amount: gameDetails.price,
          currency: 'USD',
          status: 'completed',
          items: [{
            name: gameDetails.itemName,
            quantity: 1,
            price: gameDetails.price
          }]
        }
      })
    });
    
    const result = await response.json();
    return result.success;
    
  } catch (error) {
    console.error('Purchase email sending failed:', error);
    return false;
  }
}
```

### 3. Quick Test on Your Website
```html
<!-- Add this to your website for testing -->
<button onclick="testEmails()" style="background: #FFD700; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
  Test Verification Email
</button>

<button onclick="testPurchaseEmail()" style="background: #FFD700; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
  Test Purchase Email
</button>

<script>
function testEmails() {
  fetch('https://hasagold-email-server.vercel.app/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'verification',
      to: 'dmcreatorstudio04@gmail.com',
      userName: 'Test User',
      verificationLink: 'https://hasagold.store/verify?token=test123'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('✅ Verification email sent! Check dmcreatorstudio04@gmail.com');
    } else {
      alert('❌ Failed: ' + data.error);
    }
  });
}

function testPurchaseEmail() {
  fetch('https://hasagold-email-server.vercel.app/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'purchase',
      to: 'dmcreatorstudio04@gmail.com',
      userName: 'Test User',
      orderDetails: {
        orderId: 'HASA-TEST-' + Date.now(),
        gameName: 'PUBG Mobile UC',
        amount: 25.00,
        currency: 'USD',
        status: 'completed'
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('✅ Purchase email sent! Check dmcreatorstudio04@gmail.com');
    } else {
      alert('❌ Failed: ' + data.error);
    }
  });
}
</script>
```

## Integration Steps

### Step 1: Add Email Functions to Your Website
Copy the `sendCustomVerificationEmail` and `sendPurchaseConfirmationEmail` functions to your website's JavaScript.

### Step 2: Update Registration Form
Replace Firebase's default email sending with the custom function.

### Step 3: Update Payment Success Handler
Add purchase confirmation email sending to your payment flow.

### Step 4: Test with Real Emails
Use the test buttons to verify emails are working.

## Benefits

✅ **No Firebase Blaze Plan Needed** - Use free Vercel hosting
✅ **24/7 Email Server** - Always running, always available
✅ **Professional Branding** - HASA GOLD STORE themed emails
✅ **Easy Integration** - Simple fetch calls
✅ **Free Hosting** - Vercel free tier covers all usage

## Current Status

✅ **Email Server**: Running 24/7 on Vercel
✅ **Tested Successfully**: Emails sent to dmcreatorstudio04@gmail.com
✅ **Ready for Production**: Just integrate the code above
✅ **No Additional Costs**: Everything is free

## What You Get

- **Verification Emails**: Beautiful welcome emails for new users
- **Purchase Confirmations**: Professional order receipts
- **HASA GOLD STORE Branding**: Gold-themed professional design
- **Reliable Delivery**: Gmail SMTP with excellent deliverability

The email server is already working perfectly. Just add the integration code to your website and you're done!
