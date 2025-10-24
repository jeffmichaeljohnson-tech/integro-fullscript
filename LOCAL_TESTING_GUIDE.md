# INTEGRO HEALTH FULLSCRIPT - LOCAL TESTING GUIDE

**Project:** Fullscript Embed Local Development  
**Date:** October 23, 2025  
**Status:** Ready for Local Testing  

---

## 🎯 LOCAL TESTING OVERVIEW

### **Why Local Testing is Perfect**
- ✅ **Fast development** - No hosting costs or delays
- ✅ **Easy debugging** - Direct access to logs and code
- ✅ **Sandbox environment** - Safe testing with Fullscript sandbox
- ✅ **Quick iteration** - Make changes and test immediately
- ✅ **No compliance requirements** - No BAA needed for development

### **What We'll Test**
1. **OAuth flow** - Authorization with Fullscript
2. **Session grants** - Token generation for embed
3. **Webhook endpoints** - Event handling
4. **Frontend integration** - Divi Code Module
5. **Complete user flow** - End-to-end testing

---

## 🚀 QUICK START (5 MINUTES)

### **Step 1: Start Backend Server**
```bash
cd backend
./start-local.sh
```

**Or manually:**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your values
npm run dev
```

### **Step 2: Configure Fullscript Sandbox**
1. **Login to:** https://api-dashboard.fullscript.io/
2. **Switch to Sandbox** environment
3. **Update your app** with these settings:
   - **Redirect URI:** `http://localhost:3000/fs/oauth/callback`
   - **Origin URI:** `http://localhost:3000`
   - **Scopes:** Clinic:read, Clinic:write, Patients:write, Patients:treatment_plan_history

### **Step 3: Test Backend Endpoints**
```bash
# Health check
curl http://localhost:3000/health

# OAuth flow (opens in browser)
open http://localhost:3000/fs/oauth/authorize
```

---

## ⚙️ CONFIGURATION SETUP

### **Backend Environment (.env)**
```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Fullscript API Configuration (SANDBOX)
FULLSCRIPT_CLIENT_ID=eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE
FULLSCRIPT_CLIENT_SECRET=your_sandbox_client_secret_here
FULLSCRIPT_REDIRECT_URI=http://localhost:3000/fs/oauth/callback
FULLSCRIPT_BASE_URL=https://api-snd.fullscript.com
FULLSCRIPT_ENV=us-snd

# Session Configuration
SESSION_SECRET=your_local_session_secret_here
```

### **Frontend Configuration**
Update `frontend/divi-fullscript-embed.html`:
```javascript
const CONFIG = {
    backendUrl: 'http://localhost:3000', // Local backend
    publicKey: 'eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE',
    env: 'us-snd' // Sandbox environment
};
```

---

## 🧪 TESTING CHECKLIST

### **Phase 1: Backend Testing**
- [ ] **Server starts** without errors
- [ ] **Health check** responds: `curl http://localhost:3000/health`
- [ ] **OAuth flow** works: `http://localhost:3000/fs/oauth/authorize`
- [ ] **Callback handling** works after authorization
- [ ] **Session grants** generated: `curl http://localhost:3000/fs/session-grant`
- [ ] **Webhook endpoints** respond: `curl -X POST http://localhost:3000/fs/webhooks`

### **Phase 2: Frontend Testing**
- [ ] **Divi Code Module** loads without errors
- [ ] **Fullscript.js** library loads correctly
- [ ] **OAuth flow** initiates from frontend
- [ ] **Session grant** retrieved successfully
- [ ] **Fullscript embed** renders in page
- [ ] **Products display** correctly
- [ ] **Mobile responsive** design works

### **Phase 3: Integration Testing**
- [ ] **Complete user flow** works end-to-end
- [ ] **Product browsing** functions correctly
- [ ] **Add to cart** works
- [ ] **Checkout process** completes
- [ ] **Webhook events** fire correctly
- [ ] **Error handling** works gracefully
- [ ] **Loading states** display properly

---

## 🔍 DEBUGGING GUIDE

### **Backend Debugging**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
tail -f logs/server.log

# Test individual endpoints
curl http://localhost:3000/health
curl http://localhost:3000/fs/oauth/authorize
```

### **Frontend Debugging**
1. **Open browser console** (F12)
2. **Check for JavaScript errors**
3. **Verify network requests** to backend
4. **Test OAuth flow** step by step
5. **Check Fullscript embed** loading

### **Common Issues & Solutions**

#### **OAuth Flow Fails**
- **Check redirect URI** in Fullscript dashboard
- **Verify client ID and secret** in .env
- **Ensure sandbox environment** is selected
- **Check browser console** for errors

#### **Session Grant Fails**
- **Complete OAuth flow** first
- **Check access token** in session
- **Verify API permissions** in Fullscript
- **Review server logs** for errors

#### **Fullscript Embed Doesn't Load**
- **Check public key** configuration
- **Verify environment** setting (us-snd)
- **Review browser console** errors
- **Test session grant** endpoint

---

## 📱 MOBILE TESTING

### **Local Mobile Testing**
1. **Find your computer's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Update backend URL** in frontend:
   ```javascript
   backendUrl: 'http://YOUR_IP_ADDRESS:3000'
   ```

3. **Test on mobile device:**
   - Open browser on phone
   - Navigate to your local server
   - Test OAuth flow and embed

### **Mobile-Specific Testing**
- [ ] **Touch interactions** work correctly
- [ ] **Responsive design** adapts to screen size
- [ ] **OAuth flow** works on mobile browsers
- [ ] **Fullscript embed** displays properly
- [ ] **Checkout process** works on mobile

---

## 🎯 SUCCESS CRITERIA

### **Local Development Working**
- [ ] **Backend server** runs without errors
- [ ] **OAuth flow** completes successfully
- [ ] **Session grants** generated correctly
- [ ] **Webhooks** receive and process events
- [ ] **Frontend embed** loads and functions
- [ ] **Complete user flow** works end-to-end
- [ ] **Mobile responsive** design works
- [ ] **Error handling** works gracefully

### **Ready for Production Planning**
- [ ] **All endpoints** tested and working
- [ ] **Security controls** implemented
- [ ] **Error handling** complete
- [ ] **Documentation** updated
- [ ] **Production hosting** planned
- [ ] **Fullscript submission** prepared

---

## 🚀 NEXT STEPS AFTER LOCAL TESTING

### **Once Local Testing is Complete**
1. **Document any issues** found during testing
2. **Plan production hosting** (HIPAA-compliant provider)
3. **Prepare Fullscript submission** package
4. **Request BAA** from Fullscript
5. **Plan production deployment** timeline

### **Production Deployment**
1. **Choose hosting provider** (AWS, Google Cloud, Azure)
2. **Deploy backend server** to production
3. **Configure production environment**
4. **Submit to Fullscript** for approval
5. **Deploy frontend** to WordPress

---

## 📞 SUPPORT RESOURCES

### **Fullscript Support**
- **Email:** api-support@fullscript.com
- **Dashboard:** https://api-dashboard.fullscript.io/
- **Documentation:** https://fullscript.dev/docs
- **Sandbox:** Use sandbox environment for testing

### **Local Development Support**
- **Backend logs:** Check console output and log files
- **Browser console:** F12 for JavaScript errors
- **Network tab:** Check API requests and responses
- **This guide:** Common issues and solutions

---

## ✅ YOU'RE READY TO START!

### **Your Local Testing Setup**
- ✅ **Backend server** ready to deploy
- ✅ **Frontend embed** ready to test
- ✅ **Configuration guides** complete
- ✅ **Testing checklist** prepared
- ✅ **Debugging guide** available

### **Estimated Timeline**
- **Setup:** 30 minutes
- **Backend testing:** 1 hour
- **Frontend testing:** 1 hour
- **Integration testing:** 2 hours
- **Total:** 4-5 hours

**Ready to start local testing?** Run `./start-local.sh` in the backend directory and let's get testing!

---

*Local testing guide completed: October 23, 2025*  
*Ready for local development and testing*  
*Next step: Start backend server*
