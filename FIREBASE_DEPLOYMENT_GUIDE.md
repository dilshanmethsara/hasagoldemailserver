# Firebase Deployment Guide - Complete Email Integration

## Current Status ✅
- Email server created and working on Vercel
- Firebase functions created and ready
- Need to upgrade Firebase to Blaze plan to deploy functions

## Step 1: Upgrade Firebase to Blaze Plan

1. **Visit Firebase Console**:
   ```
   https://console.firebase.google.com/project/hasagoldstore/usage/details
   ```

2. **Upgrade to Blaze Plan**:
   - Click "Upgrade" button
   - Select Blaze (Pay-as-you-go) plan
   - Add billing information (required for functions)
   - **Cost**: Very minimal - only pay for actual usage

3. **Why Blaze Plan is Required**:
   - Cloud Functions need external API access
   - SMTP connections require outbound networking
   - Free (Spark) plan blocks external requests

## Step 2: Set Environment Variables

After upgrading, set the Gmail App Password:

```bash
firebase functions:config set smtp.pass="your-16-character-app-password"
```

## Step 3: Deploy Email Functions

```bash
# Deploy only functions
firebase deploy --only functions

# Or deploy everything
firebase deploy
```

## Step 4: Test the Integration

### Test Debug Endpoint:
```javascript
fetch('https://hasagoldstore.firebaseapp.com/api/debug')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Test Verification Email:
```javascript
fetch('https://hasagoldstore.firebaseapp.com/api/send-email', {
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
.then(data => console.log(data));
```

### Test Purchase Email:
```javascript
fetch('https://hasagoldstore.firebaseapp.com/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'purchase',
    to: 'dmcreatorstudio04@gmail.com',
    userName: 'Test User',
    orderDetails: {
      orderId: 'HASA-TEST-123',
      gameName: 'PUBG Mobile UC',
      amount: 25.00,
      currency: 'USD',
      status: 'completed'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Step 5: Integrate with Your Website

Replace Vercel URL with Firebase URL in your website:

```javascript
// OLD (Vercel)
const emailUrl = 'https://hasagold-email-server.vercel.app/api/send-email';

// NEW (Firebase)
const emailUrl = 'https://hasagoldstore.firebaseapp.com/api/send-email';
```

## Step 6: Auto-Email on User Registration

The Firebase function will automatically send verification emails when:
- New users register via Firebase Auth
- Users are created in Firebase Console
- Users are created via Admin SDK

## Complete Integration Example

```javascript
// Your website registration form
async function registerUser(email, password, displayName) {
  try {
    // 1. Create Firebase Auth user
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // 2. Update profile
    await user.updateProfile({ displayName });
    
    // 3. Save to Firestore (optional - function does this automatically)
    await firebase.firestore().collection('users').doc(user.uid).set({
      email,
      displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // 4. Verification email is sent automatically by Firebase function!
    
    console.log('✅ User registered! Check email for verification.');
    return true;
    
  } catch (error) {
    console.error('Registration failed:', error);
    return false;
  }
}
```

## Benefits of Firebase Integration

✅ **Same Domain** - Emails sent from your Firebase project
✅ **Auto-Triggered** - Verification emails sent automatically on registration
✅ **Free Tier** - First 125,000 invocations/month are free
✅ **Reliable** - Google's infrastructure
✅ **Secure** - Environment variables protect credentials

## Cost Estimate

**Blaze Plan Costs**:
- Functions: First 125,000 invocations/month FREE
- Outbound data: First 10 GB/month FREE
- **Your estimated cost**: $0-5/month depending on usage

## Troubleshooting

### If deployment fails:
1. Ensure Blaze plan is active
2. Check billing info is added
3. Verify environment variables are set

### If emails don't send:
1. Check Firebase Functions logs
2. Verify SMTP password is correct
3. Test with debug endpoint first

### If users don't receive emails:
1. Check spam folder
2. Verify email addresses are correct
3. Check Firebase console for function errors

## Next Steps

1. **Upgrade Firebase to Blaze plan** (required)
2. **Set Gmail App Password** as environment variable
3. **Deploy functions** with `firebase deploy --only functions`
4. **Test emails** with the provided code
5. **Update your website** to use Firebase URL

Once complete, your HASA GOLD STORE will have fully integrated email functionality running on Firebase!
