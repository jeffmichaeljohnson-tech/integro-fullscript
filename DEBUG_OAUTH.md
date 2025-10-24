# 🔍 OAUTH DEBUGGING GUIDE

**Issue:** OAuth token exchange still failing with 404 error  
**Status:** Need to verify Fullscript app configuration  

---

## 🚨 **CURRENT PROBLEM**

From terminal logs:
```
OAuth callback error: Error: Token exchange failed: 404 {"status":404,"error":"Not Found"}
```

**This means:**
- OAuth authorization works (redirects to Fullscript)
- User can authorize the app
- But token exchange fails with 404

---

## 🔍 **ROOT CAUSE ANALYSIS**

### **Possible Issues:**

#### **1. Fullscript App Configuration**
- ❓ **Client Secret** - Is it correct in `.env`?
- ❓ **Redirect URI** - Does it match in Fullscript dashboard?
- ❓ **App Status** - Is the app approved/active?
- ❓ **Environment** - Are we using the right sandbox?

#### **2. API Endpoint**
- ❓ **Token URL** - Is `/oauth/access_token` correct?
- ❓ **Base URL** - Is `https://api-us-snd.fullscript.io` correct?
- ❓ **Environment** - Should we use different environment?

#### **3. Request Format**
- ❓ **Content-Type** - Is `application/x-www-form-urlencoded` correct?
- ❓ **Parameters** - Are all required parameters included?

---

## 🧪 **DEBUGGING STEPS**

### **Step 1: Verify Fullscript App Settings**
**Action:** Check your Fullscript developer dashboard

1. **Login to Fullscript Developer Dashboard**
2. **Go to your app settings**
3. **Verify these settings:**

#### **OAuth Settings:**
- ✅ **Client ID:** `eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE`
- ❓ **Client Secret:** [Verify this matches your `.env` file]
- ❓ **Redirect URI:** `http://localhost:3001/fs/oauth/callback`
- ❓ **Origin URIs:** `http://localhost:3001`, `http://127.0.0.1:3001`

#### **App Status:**
- ❓ **App Status:** Active/Approved?
- ❓ **Environment:** Sandbox (us-snd)?
- ❓ **Scopes:** Clinic:read, Clinic:write, Patients:write, Patients:treatment_plan_history

### **Step 2: Test Token Exchange Manually**
**Action:** Test the token exchange with curl

```bash
# Test the token exchange endpoint directly
curl -X POST https://api-us-snd.fullscript.io/oauth/access_token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&client_id=eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE&client_secret=YOUR_SECRET&redirect_uri=http://localhost:3001/fs/oauth/callback&code=TEST_CODE"
```

### **Step 3: Check Fullscript Documentation**
**Action:** Verify the correct API endpoints

- ❓ **Token Endpoint:** `/oauth/access_token` vs `/oauth/token`
- ❓ **Base URL:** `https://api-us-snd.fullscript.io` vs `https://api-snd.fullscript.com`
- ❓ **Environment:** `us-snd` vs `us` vs `ca-snd`

---

## 🎯 **IMMEDIATE ACTION REQUIRED**

### **What You Need to Do:**

#### **1. Check Fullscript Dashboard (5 minutes)**
1. **Login to Fullscript Developer Dashboard**
2. **Go to your app settings**
3. **Verify Client Secret matches your `.env` file**
4. **Verify Redirect URI is exactly:** `http://localhost:3001/fs/oauth/callback`
5. **Verify Origin URIs include:** `http://localhost:3001`

#### **2. Update .env File (2 minutes)**
1. **Copy the correct Client Secret** from Fullscript dashboard
2. **Update `FULLSCRIPT_CLIENT_SECRET`** in `backend/.env`
3. **Restart the server**

#### **3. Test Again (2 minutes)**
1. **Open test page**
2. **Click "Test OAuth Flow"**
3. **Complete authorization**
4. **Check if it works**

---

## 🔧 **QUICK FIXES TO TRY**

### **Fix 1: Update Client Secret**
```bash
# Edit backend/.env file
FULLSCRIPT_CLIENT_SECRET=your_actual_secret_from_dashboard
```

### **Fix 2: Try Different Token Endpoint**
```javascript
// In server.js, try:
const tokenUrl = `${FULLSCRIPT_CONFIG.baseUrl}/oauth/token`;
// Instead of:
const tokenUrl = `${FULLSCRIPT_CONFIG.baseUrl}/oauth/access_token`;
```

### **Fix 3: Try Different Base URL**
```bash
# In backend/.env, try:
FULLSCRIPT_BASE_URL=https://api-snd.fullscript.com
# Instead of:
FULLSCRIPT_BASE_URL=https://api-us-snd.fullscript.io
```

---

## 📋 **TESTING CHECKLIST**

- [ ] **Fullscript app is active/approved**
- [ ] **Client Secret is correct**
- [ ] **Redirect URI matches exactly**
- [ ] **Origin URIs are configured**
- [ ] **Environment is correct (us-snd)**
- [ ] **Scopes are configured**
- [ ] **Server is restarted after .env changes**

---

## 🚀 **NEXT STEPS**

1. **Check Fullscript dashboard** - Verify all settings
2. **Update .env file** - Use correct Client Secret
3. **Restart server** - Apply changes
4. **Test OAuth flow** - Should work now
5. **Report results** - Let me know what happens

---

*Debug guide created: October 23, 2025*  
*Focus: OAuth token exchange 404 error*  
*Priority: Verify Fullscript app configuration*
