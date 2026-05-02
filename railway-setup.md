# Railway Setup for HASA GOLD STORE Email Server

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Verify email

## Step 2: Deploy Email Server
1. Click "Deploy from GitHub repo"
2. Connect your GitHub account
3. Select your game-top-up-hub-main repository
4. Railway will detect the Node.js app

## Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:
- PORT: 3001
- SMTP_HOST: mail.privateemail.com
- SMTP_PORT: 587
- SMTP_USER: no-reply@hasagold.store
- SMTP_PASS: @hasa1234G

## Step 4: Update Website URL
After deployment, Railway will give you a URL like:
https://your-email-server.up.railway.app

Update this in your code:
src/lib/customEmail.ts
src/lib/purchaseEmail.ts

Change: http://localhost:3002
To: https://your-email-server.up.railway.app

## Step 5: Test the System
1. Railway will deploy automatically
2. Test email verification on your website
3. Test purchase confirmation emails

## Benefits:
✅ 500 hours free per month
✅ Automatic deployment
✅ Custom domain support
✅ 24/7 uptime (within free tier)
✅ No server maintenance
