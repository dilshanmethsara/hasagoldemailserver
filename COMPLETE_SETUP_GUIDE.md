# 🚀 HASA GOLD STORE - Complete Professional Email Setup Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Email Server Setup](#email-server-setup)
3. [Namecheap Configuration](#namecheap-configuration)
4. [Testing & Deployment](#testing--deployment)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### **Step 1: Install Dependencies**
```bash
cd c:\Users\TechWiz\Documents\game-top-up-hub-main
npm install nodemailer express cors
```

### **Step 2: Configure Email Server**
Edit `email-server.js`:
```javascript
auth: {
  user: 'no-reply@hasagold.store',
  pass: 'YOUR_NAMECHEAP_EMAIL_PASSWORD' // Replace this
}
```

### **Step 3: Start Email Server**
```bash
node email-server.js
```

### **Step 4: Test Registration**
1. Go to https://hasagold.store
2. Create a new account
3. Check your email for professional verification

---

## 📧 Email Server Setup

### **Files Created:**
- ✅ `email-server.js` - Main email server
- ✅ `src/lib/customEmail.ts` - Frontend email service
- ✅ `package-email-server.json` - Dependencies

### **Server Features:**
- 🎨 Professional HTML email templates
- 🔒 Secure SMTP connection
- 📱 Mobile-responsive design
- 🛡️ Fallback to Firebase email
- 📊 Health monitoring endpoint

### **API Endpoints:**
- `POST /api/send-verification-email` - Send verification
- `GET /api/health` - Server health check

---

## 🔧 Namecheap Configuration

### **Get SMTP Credentials:**
1. **Login**: [Namecheap Dashboard](https://www.namecheap.com)
2. **Navigate**: Dashboard → Email → Manage Email
3. **Select Domain**: hasagold.store
4. **Find Email**: no-reply@hasagold.store
5. **Click**: "Configure" → "SMTP Settings"

### **SMTP Settings:**
```
Server: mail.hasagold.store
Port: 587 (TLS)
Username: no-reply@hasagold.store
Password: [Your Namecheap password]
```

### **DNS Records (if needed):**
```
MX: mail.hasagold.store (Priority: 10)
SPF: v=spf1 include:spf.namecheap.com ~all
DKIM: [Setup via Namecheap panel]
```

---

## 🧪 Testing & Deployment

### **Test Email Server:**
```bash
# Test server connection
curl http://localhost:3001/api/health

# Test email sending
curl -X POST http://localhost:3001/api/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","userName":"Test User"}'
```

### **Test Registration Flow:**
1. **Visit**: https://hasagold.store/auth
2. **Create**: New account with real email
3. **Check**: Inbox for verification email
4. **Verify**: Click verification link
5. **Login**: Confirm account access

### **Production Deployment:**
```bash
# Build frontend
npm run build
firebase deploy

# Start email server (production)
NODE_ENV=production node email-server.js
```

---

## 📊 Monitoring & Maintenance

### **Server Monitoring:**
```bash
# Check server logs
tail -f email-server.log

# Monitor email delivery
grep "Email sent to" email-server.log

# Check for errors
grep "Error sending email" email-server.log
```

### **Performance Metrics:**
- 📧 Email delivery rate
- ⏱️ Response time
- 🔥 Server uptime
- 📈 Daily email volume

### **Maintenance Tasks:**
- **Weekly**: Check email deliverability
- **Monthly**: Update SMTP password
- **Quarterly**: Review email templates
- **Annually**: Renew SSL certificates

---

## 🛠️ Troubleshooting

### **Common Issues:**

#### **Emails Not Sending:**
```bash
# Check SMTP credentials
node -e "console.log(require('./email-server.js'))"

# Test SMTP connection
telnet mail.hasagold.store 587
```

#### **Authentication Errors:**
- ✅ Verify email password
- ✅ Check SMTP username format
- ✅ Confirm port settings (587 vs 465)

#### **Spam Filter Issues:**
- 📋 Check SPF/DKIM records
- 📋 Verify sender reputation
- 📋 Review email content

#### **Server Connection Issues:**
```bash
# Check if server is running
netstat -an | findstr :3001

# Test API endpoint
curl http://localhost:3001/api/health
```

### **Error Codes:**
- `535` - Authentication failed
- `550` - Relay not permitted
- `553` - Sender not verified

---

## 📱 Email Template Features

### **Professional Design:**
- 🎨 Golden HASA GOLD STORE branding
- 📱 Mobile-responsive layout
- 🔒 Security notices
- ⏰ Expiration warnings
- 🎮 Gaming-themed elements

### **Template Sections:**
- **Header**: Logo and branding
- **Content**: Verification instructions
- **Security**: Safety notices
- **Footer**: Links and contact info

---

## 🔐 Security Best Practices

### **SMTP Security:**
- 🔒 Use TLS/SSL encryption
- 🔐 Strong password requirements
- 🚫 Rate limiting enabled
- 📝 Activity logging

### **Email Security:**
- ✅ DKIM signatures
- ✅ SPF records
- ✅ DMARC policy
- ✅ Anti-spam compliance

---

## 📞 Support & Contact

### **Technical Support:**
- 📧 Email: support@hasagold.store
- 💬 WhatsApp: +94763046704
- 🌐 Website: https://hasagold.store

### **Documentation:**
- 📖 Firebase Auth Guide
- 📖 Namecheap Email Help
- 📖 SMTP Protocol Reference

---

## ✅ Success Checklist

### **Setup Complete:**
- [ ] Email server installed and running
- [ ] SMTP credentials configured
- [ ] Professional email templates active
- [ ] Registration flow tested
- [ ] Email delivery confirmed
- [ ] Monitoring enabled

### **Production Ready:**
- [ ] Server deployed to production
- [ ] SSL certificates configured
- [ ] Backup systems in place
- [ ] Error monitoring active
- [ ] Performance optimized

---

## 🎉 You're All Set!

Your HASA GOLD STORE now has:
- ✅ Professional email verification
- ✅ Custom branding with no-reply@hasagold.store
- ✅ Beautiful HTML email templates
- ✅ Reliable Namecheap SMTP delivery
- ✅ Fallback protection to Firebase
- ✅ Mobile-responsive design
- ✅ Security features included

**Next Steps:**
1. Start your email server
2. Test the registration flow
3. Monitor email delivery
4. Enjoy your professional email system!

---

*Last Updated: 2024*
*Version: 1.0.0*
*Support: HASA GOLD STORE Team*
