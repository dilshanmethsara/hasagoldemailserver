# Custom Email Setup for HASA GOLD STORE

## Overview
This guide explains how to configure Firebase Authentication to use your custom Namecheap email server (no-reply@hasagold.store) for sending verification emails.

## Prerequisites
- Namecheap hosting account
- Email account: no-reply@hasagold.store
- Firebase project access

## Step 1: Get Namecheap SMTP Credentials

1. Log into your Namecheap account
2. Go to "Dashboard" → "Email" → "Manage Email"
3. Select your domain (hasagold.store)
4. Find the email account: no-reply@hasagold.store
5. Click "Configure" or "Settings"
6. Note down the SMTP settings:
   - **SMTP Server**: mail.hasagold.store (or your specific Namecheap server)
   - **Port**: 587 (TLS) or 465 (SSL)
   - **Username**: no-reply@hasagold.store
   - **Password**: [Your email password]

## Step 2: Configure Firebase Authentication

### Option A: Firebase Console (Recommended for now)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: hasagoldstore
3. Navigate to "Authentication" → "Templates" → "Email address verification"
4. Customize the email template:
   - **From name**: HASA GOLD STORE
   - **From email**: no-reply@hasagold.store
   - **Reply-to**: support@hasagold.store (or your support email)
   - Customize the email content with your branding

### Option B: Custom SMTP (Advanced)

1. In Firebase Console, go to "Authentication" → "Settings"
2. Under "Email templates", you can configure custom SMTP
3. Enter your Namecheap SMTP credentials:
   - **SMTP server**: mail.hasagold.store
   - **SMTP port**: 587
   - **SMTP username**: no-reply@hasagold.store
   - **SMTP password**: [Your password]
   - **Enable SSL/TLS**: Yes

## Step 3: Test Email Configuration

1. Create a test account on hasagold.store
2. Check if verification email arrives
3. Verify the email content and branding
4. Test the resend functionality

## Current Implementation

The code has been updated with:
- ✅ Enhanced email verification settings
- ✅ Custom redirect URLs
- ✅ Better user messaging
- ✅ Resend functionality improvements
- ✅ Email template service (ready for custom SMTP)

## Next Steps

1. **Configure Firebase Console** with your Namecheap SMTP settings
2. **Test the email flow** with a new account
3. **Monitor email delivery** and spam folder issues
4. **Set up email analytics** if needed

## Troubleshooting

### Emails not arriving:
- Check spam/junk folders
- Verify SMTP credentials
- Ensure DNS records are correct
- Check Firebase email quotas

### SMTP connection issues:
- Verify port settings (587 for TLS, 465 for SSL)
- Check firewall settings
- Confirm email password is correct

### Branding issues:
- Update email templates in Firebase Console
- Test different email clients
- Verify HTML email rendering

## Security Notes

- Never commit SMTP credentials to code
- Use environment variables for sensitive data
- Regularly rotate email passwords
- Monitor email usage for abuse

## Contact Support

For issues with:
- **Namecheap email**: Contact Namecheap support
- **Firebase Authentication**: Check Firebase documentation
- **Application issues**: Review application logs
