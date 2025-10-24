# Railway Deployment Guide - Integro Health Fullscript Integration

**Project:** Fullscript Backend Server  
**Platform:** Railway  
**Status:** Ready for Deployment  

---

## 🚀 Quick Deployment Steps

### 1. Railway Dashboard Configuration

1. **Go to your Railway project dashboard**
2. **Navigate to Variables tab**
3. **Add the following environment variables:**

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Fullscript API Configuration
FULLSCRIPT_CLIENT_ID=eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE
FULLSCRIPT_CLIENT_SECRET=your_actual_client_secret_here
FULLSCRIPT_REDIRECT_URI=https://your-app-name.railway.app/fs/oauth/callback
FULLSCRIPT_BASE_URL=https://api.fullscript.com
FULLSCRIPT_ENV=us

# Session Configuration
SESSION_SECRET=your_secure_random_session_secret_here

# CORS Configuration
CORS_ORIGINS=https://integrohealth.net,https://www.integrohealth.net,https://huj.lpf.mybluehost.me

# Logging
LOG_LEVEL=info
```

### 2. Update Fullscript Dashboard

1. **Go to:** https://api-dashboard.fullscript.io/
2. **Update your app settings:**
   - **Redirect URI:** `https://your-app-name.railway.app/fs/oauth/callback`
   - **Origin URI:** `https://your-app-name.railway.app`
   - **Environment:** Production (US)

### 3. Deploy

1. **Railway will auto-deploy** when you push to GitHub
2. **Check deployment logs** in Railway dashboard
3. **Test the health endpoint:** `https://your-app-name.railway.app/health`

---

## 🔧 Configuration Details

### Environment Variables Required

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Server port (Railway sets this) |
| `FULLSCRIPT_CLIENT_ID` | `eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE` | Your Fullscript Client ID |
| `FULLSCRIPT_CLIENT_SECRET` | `your_secret` | Your Fullscript Client Secret |
| `FULLSCRIPT_REDIRECT_URI` | `https://your-app.railway.app/fs/oauth/callback` | OAuth callback URL |
| `SESSION_SECRET` | `random_string` | Session encryption key |

### Railway-Specific Features

- **Auto HTTPS:** Railway provides SSL certificates automatically
- **Environment Variables:** Set in Railway dashboard
- **Health Checks:** Automatic health monitoring
- **Logs:** Available in Railway dashboard
- **Custom Domains:** Can be configured later

---

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-name.railway.app/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T...",
  "version": "1.0.0"
}
```

### 2. OAuth Flow Test
1. **Visit:** `https://your-app-name.railway.app/fs/oauth/authorize`
2. **Complete Fullscript authorization**
3. **Verify redirect to success page**

### 3. Session Grant Test
```bash
curl https://your-app-name.railway.app/fs/session-grant
```
**Expected:** Session grant token or 401 if not authenticated

---

## 🔄 Updating Frontend Code

After deployment, update your frontend code with the Railway URL:

### In `frontend/divi-fullscript-embed.html`:
```javascript
const CONFIG = {
    backendUrl: 'https://your-app-name.railway.app', // Update this
    publicKey: 'eNRmRfsOR7S85ZDMnJXOJvT9EgbOUQA7t9GpvVUI4LE',
    env: 'us' // Production environment
};
```

### In WordPress Implementation:
Update the backend URL in your WordPress code to point to your Railway deployment.

---

## 🐛 Troubleshooting

### Problem: "Origin not allowed" Error
**Solution:** Add your Railway domain to CORS_ORIGINS environment variable

### Problem: OAuth Callback Fails
**Solution:** 
1. Verify FULLSCRIPT_REDIRECT_URI matches Railway URL
2. Update Fullscript dashboard with correct callback URL

### Problem: Session Not Persisting
**Solution:**
1. Check SESSION_SECRET is set
2. Verify cookie settings in browser
3. Check Railway logs for errors

### Problem: Health Check Fails
**Solution:**
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Check if server is starting properly

---

## 📊 Monitoring

### Railway Dashboard
- **Deployments:** View deployment history
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, network usage
- **Variables:** Environment variable management

### Health Monitoring
- **Endpoint:** `/health`
- **Expected:** 200 status with JSON response
- **Frequency:** Railway checks automatically

---

## 🚀 Production Checklist

### Before Go-Live
- [ ] All environment variables set
- [ ] Fullscript dashboard updated
- [ ] Health check responding
- [ ] OAuth flow working
- [ ] Session grants working
- [ ] Frontend updated with Railway URL
- [ ] Custom domain configured (optional)

### After Go-Live
- [ ] Monitor Railway logs
- [ ] Test with real patients
- [ ] Verify all functionality
- [ ] Set up monitoring alerts
- [ ] Document any issues

---

## 🔗 Useful Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Fullscript Dashboard:** https://api-dashboard.fullscript.io/
- **Your Repository:** https://github.com/jeffmichaeljohnson-tech/integro-fullscript

---

*Railway deployment guide created: January 27, 2025*  
*Ready for production deployment*  
*Next step: Configure environment variables*
