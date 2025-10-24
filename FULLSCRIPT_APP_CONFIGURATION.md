# FULLSCRIPT APP CONFIGURATION FOR PRODUCTION

**Project:** Integro Health Fullscript Integration  
**Date:** October 23, 2025  
**Status:** Production App Configuration  

---

## 🎯 FULLSCRIPT DASHBOARD SETUP

### **App Details**
- **App Name:** Integro Health Supplement Portal
- **Description:** Professional supplement shop integration for Integro Health patients
- **Website:** https://integrohealth.net
- **Contact Email:** [Your contact email]

### **OAuth Configuration**
- **Redirect URI:** `https://integrohealth.net/fs/oauth/callback`
- **Additional Redirect URIs:**
  - `https://www.integrohealth.net/fs/oauth/callback`
  - `https://huj.lpf.mybluehost.me/fs/oauth/callback` (staging)

### **Origin URIs (CORS Whitelist)**
- `https://integrohealth.net`
- `https://www.integrohealth.net`
- `https://huj.lpf.mybluehost.me` (staging)

### **Required Scopes**
- `Clinic:read` - Read clinic information
- `Clinic:write` - Update clinic settings
- `Patients:write` - Create and update patients
- `Patients:treatment_plan_history` - Access treatment plans

### **Webhook Configuration**
- **Webhook URL:** `https://your-backend-server.com/fs/webhooks`
- **Events to Subscribe:**
  - `order.placed` - When an order is placed
  - `order.updated` - When an order is updated
  - `patient.created` - When a new patient is created
  - `patient.updated` - When patient information is updated

---

## 🔧 BACKEND SERVER REQUIREMENTS

### **Server Specifications**
- **Node.js:** 16+ (LTS recommended)
- **Memory:** 512MB minimum, 1GB recommended
- **Storage:** 10GB minimum
- **Bandwidth:** 1TB/month minimum
- **SSL Certificate:** Required for production

### **Environment Variables**
```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Fullscript API Configuration
FULLSCRIPT_CLIENT_ID=eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE
FULLSCRIPT_CLIENT_SECRET=your_client_secret_here
FULLSCRIPT_REDIRECT_URI=https://integrohealth.net/fs/oauth/callback
FULLSCRIPT_BASE_URL=https://api.fullscript.com
FULLSCRIPT_ENV=us

# SSL Configuration
SSL_KEY_PATH=/path/to/ssl/private.key
SSL_CERT_PATH=/path/to/ssl/certificate.crt

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here
```

### **Required Endpoints**
- `GET /fs/oauth/authorize` - Start OAuth flow
- `GET /fs/oauth/callback` - Handle OAuth callback
- `GET /fs/session-grant` - Get session grant for embed
- `POST /fs/webhooks` - Handle Fullscript webhooks
- `GET /health` - Health check endpoint

---

## 🔐 SECURITY REQUIREMENTS

### **HTTPS Configuration**
- **SSL Certificate:** Valid SSL certificate required
- **TLS Version:** TLS 1.2 or higher
- **Cipher Suites:** Strong encryption only
- **HSTS:** HTTP Strict Transport Security enabled

### **Authentication & Authorization**
- **Session Management:** Secure session handling
- **Token Storage:** Encrypted token storage
- **Access Control:** Role-based access control
- **Audit Logging:** All API calls logged

### **Data Protection**
- **Encryption at Rest:** All data encrypted
- **Encryption in Transit:** HTTPS for all communications
- **Access Logs:** Comprehensive access logging
- **Backup Security:** Encrypted backups

---

## 📋 COMPLIANCE REQUIREMENTS

### **Business Associate Agreement (BAA)**
- **Contact:** privacy@fullscript.com
- **Required For:** Production use with PHI
- **Timeline:** 2-4 weeks for approval
- **Cost:** Included with Fullscript subscription

### **HIPAA Compliance**
- **Data Handling:** Fullscript handles all PHI
- **Access Controls:** Role-based access
- **Audit Trails:** Comprehensive logging
- **Incident Response:** Documented procedures

### **Hosting Requirements**
- **HIPAA-Compliant Hosting:** Required for backend
- **BAA with Hosting Provider:** Required
- **Security Controls:** Multi-factor authentication
- **Monitoring:** 24/7 security monitoring

---

## 🚀 DEPLOYMENT CHECKLIST

### **Pre-Deployment**
- [ ] Fullscript app created and configured
- [ ] OAuth redirect URIs set
- [ ] Origin URIs whitelisted
- [ ] Required scopes granted
- [ ] Webhook endpoints configured
- [ ] Backend server deployed
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] Health check endpoint working

### **Testing**
- [ ] OAuth flow tested in sandbox
- [ ] Session grant endpoint working
- [ ] Fullscript embed loads correctly
- [ ] Webhook endpoints receiving events
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified
- [ ] Error handling tested
- [ ] Security headers configured

### **Production Deployment**
- [ ] Production app approved by Fullscript
- [ ] BAA signed with Fullscript
- [ ] HIPAA-compliant hosting confirmed
- [ ] SSL certificates valid
- [ ] Monitoring and logging active
- [ ] Backup procedures in place
- [ ] Incident response plan ready

---

## 📞 FULLSCRIPT CONTACTS

### **Technical Support**
- **Email:** api-support@fullscript.com
- **Dashboard:** https://api-dashboard.fullscript.io/
- **Documentation:** https://fullscript.dev/docs

### **Compliance & Legal**
- **Email:** privacy@fullscript.com
- **BAA Requests:** Through dashboard or email
- **Legal Questions:** privacy@fullscript.com

### **Your App Details**
- **Client ID:** eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE
- **App Name:** Integro Health Supplement Portal
- **Contact:** [Your contact information]

---

## 🎯 SUBMISSION PACKAGE

### **Required Documents**
1. **App Configuration Screenshots**
2. **OAuth Flow Documentation**
3. **Security Implementation Details**
4. **HIPAA Compliance Statement**
5. **Hosting Provider BAA**
6. **Testing Results**
7. **User Experience Documentation**

### **Demo Environment**
- **Staging URL:** https://huj.lpf.mybluehost.me/integro-fullscript/
- **Backend URL:** [Your backend server URL]
- **Test Credentials:** [Sandbox test accounts]

### **Production Timeline**
- **Development:** 1-2 weeks
- **Testing:** 1 week
- **Fullscript Review:** 2-4 weeks
- **Production Deployment:** 1 week
- **Total Timeline:** 5-8 weeks

---

## ✅ SUCCESS CRITERIA

### **Technical Success**
- [ ] OAuth flow completes successfully
- [ ] Session grants generated correctly
- [ ] Fullscript embed loads in Divi
- [ ] Webhooks receive and process events
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Error handling works correctly

### **Compliance Success**
- [ ] BAA signed with Fullscript
- [ ] HIPAA-compliant hosting
- [ ] Security controls implemented
- [ ] Audit logging active
- [ ] Data encryption verified
- [ ] Access controls working

### **Business Success**
- [ ] Patients can browse supplements
- [ ] Orders process successfully
- [ ] Revenue tracked correctly
- [ ] User experience smooth
- [ ] Support documentation complete
- [ ] Monitoring and alerts active

---

*Configuration guide completed: October 23, 2025*  
*Ready for Fullscript app submission*  
*Production deployment timeline: 5-8 weeks*
