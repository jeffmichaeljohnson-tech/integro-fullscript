# INTEGRO HEALTH FULLSCRIPT - LOCAL DEVELOPMENT SETUP

**Project:** Fullscript Embed Backend Server  
**Environment:** Local Development  
**Date:** October 23, 2025  

---

## 🚀 QUICK START (5 MINUTES)

### **Prerequisites**
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Configure Environment**
```bash
cp env.example .env
# Edit .env with your values (see Configuration section below)
```

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Test Server**
Open: http://localhost:3000/health

---

## ⚙️ CONFIGURATION

### **Environment Variables (.env)**
```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Fullscript API Configuration
FULLSCRIPT_CLIENT_ID=eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE
FULLSCRIPT_CLIENT_SECRET=your_client_secret_here
FULLSCRIPT_REDIRECT_URI=http://localhost:3000/fs/oauth/callback
FULLSCRIPT_BASE_URL=https://api-snd.fullscript.com
FULLSCRIPT_ENV=us-snd

# Session Configuration
SESSION_SECRET=your_local_session_secret_here
```

### **Fullscript Sandbox Setup**
1. **Login to:** https://api-dashboard.fullscript.io/
2. **Switch to Sandbox** environment
3. **Create/Update App** with these settings:
   - **Redirect URI:** `http://localhost:3000/fs/oauth/callback`
   - **Origin URI:** `http://localhost:3000`
   - **Scopes:** Clinic:read, Clinic:write, Patients:write, Patients:treatment_plan_history

---

## 🧪 TESTING ENDPOINTS

### **Health Check**
```bash
curl http://localhost:3000/health
```

### **OAuth Flow**
1. **Start OAuth:** http://localhost:3000/fs/oauth/authorize
2. **Complete authorization** in Fullscript sandbox
3. **Verify callback** redirects to success page

### **Session Grant**
```bash
# After completing OAuth flow
curl http://localhost:3000/fs/session-grant
```

### **Webhook Testing**
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/fs/webhooks \
  -H "Content-Type: application/json" \
  -d '{"event":"order.placed","data":{"id":"123"}}'
```

---

## 🔧 DEVELOPMENT COMMANDS

### **Start Development Server**
```bash
npm run dev
# Server runs on http://localhost:3000
# Auto-restart on file changes
```

### **Start Production Server**
```bash
npm start
# Server runs on http://localhost:3000
```

### **Run Tests**
```bash
npm test
# Run test suite
```

### **Lint Code**
```bash
npm run lint
# Check code quality
```

---

## 📁 PROJECT STRUCTURE

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example            # Environment template
├── .env                   # Your environment variables (create this)
├── README.md              # This file
└── logs/                  # Log files (created automatically)
```

---

## 🐛 TROUBLESHOOTING

### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### **Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **OAuth Flow Fails**
1. **Check redirect URI** in Fullscript dashboard
2. **Verify client ID and secret** in .env
3. **Ensure sandbox environment** is selected
4. **Check browser console** for errors

### **Session Grant Fails**
1. **Complete OAuth flow** first
2. **Check access token** in session
3. **Verify API permissions** in Fullscript
4. **Review server logs** for errors

---

## 🔍 DEBUGGING

### **Enable Debug Logging**
```bash
DEBUG=* npm run dev
```

### **View Server Logs**
```bash
# Logs are written to console and files
tail -f logs/server.log
```

### **Test with Postman**
1. **Import collection** from `postman/` folder
2. **Set environment variables**
3. **Run OAuth flow** tests
4. **Test session grants**

---

## 🚀 NEXT STEPS

### **After Local Testing**
1. **Test OAuth flow** - Complete authorization
2. **Test session grants** - Get embed tokens
3. **Test webhooks** - Verify event handling
4. **Test frontend integration** - Divi Code Module
5. **Plan production deployment**

### **Production Deployment**
1. **Choose hosting provider** (HIPAA-compliant)
2. **Deploy backend server**
3. **Configure production environment**
4. **Submit to Fullscript** for approval

---

## 📞 SUPPORT

### **Fullscript Support**
- **Email:** api-support@fullscript.com
- **Dashboard:** https://api-dashboard.fullscript.io/
- **Documentation:** https://fullscript.dev/docs

### **Local Development Issues**
- **Check this README** for common solutions
- **Review server logs** for error details
- **Test endpoints** individually
- **Verify environment** configuration

---

## ✅ SUCCESS CRITERIA

### **Local Development Working**
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] OAuth flow completes successfully
- [ ] Session grants generated
- [ ] Webhooks receive events
- [ ] No console errors
- [ ] All endpoints functional

### **Ready for Production**
- [ ] All tests passing
- [ ] Security controls implemented
- [ ] Error handling complete
- [ ] Documentation updated
- [ ] Production environment planned

---

*Local development setup completed: October 23, 2025*  
*Ready for testing and development*  
*Next step: Test OAuth flow*
