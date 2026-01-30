# MedAssist - Deployment Guide

Complete instructions for deploying MedAssist to production.

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │
│   React + Vite  │
└────────┬────────┘
         │ API calls
         ▼
┌─────────────────┐
│   Backend       │
│   (Render)      │
│   Flask + Python│
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│   Firebase          │
│   Firestore + Auth  │
└─────────────────────┘
```

## 📋 Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] No console errors in frontend
- [ ] Backend endpoints responding correctly
- [ ] Environment variables configured
- [ ] Firebase project active and quota available
- [ ] Gemini API quota sufficient
- [ ] GitHub repository created and pushed
- [ ] No secrets in code

## 🖥️ Deploy Backend to Render

### 1. Prepare Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Create Render Account

Visit: https://render.com
- Sign up with GitHub
- Authorize access to your repositories

### 3. Create New Web Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: `medassist-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: Starter (Free tier ok for hackathon)

### 4. Add Environment Variables

In Render dashboard → Environment:

```
GEMINI_API_KEY=your_key_here
FIREBASE_CREDENTIALS_PATH=firebase-key.json
FLASK_ENV=production
```

### 5. Deploy Firebase Credentials

Since `.env` can't contain JSON, use a workaround:

Option A: Store as Render environment variable (for small projects)
```
FIREBASE_CONFIG={"type":"service_account",...}
```

Then in Python:
```python
import json
import os
config_json = os.getenv('FIREBASE_CONFIG')
cred_dict = json.loads(config_json)
cred = credentials.Certificate(cred_dict)
```

Option B: Upload via Render file system (recommended)
1. Use Render's "Files" feature
2. Upload firebase-key.json
3. Reference in code

### 6. Deploy

Click "Deploy" and wait for build to complete.

Backend URL will be: `https://medassist-api.onrender.com`

## 🌐 Deploy Frontend to Vercel

### 1. Prepare Repository

Make sure backend URL is set in `.env`:
```
VITE_API_URL=https://medassist-api.onrender.com
```

Commit and push:
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### 2. Create Vercel Account

Visit: https://vercel.com
- Sign up with GitHub
- Authorize access

### 3. Import Project

1. Click "Add New" → "Project"
2. Select GitHub repository
3. Vercel auto-detects as Vite project

### 4. Configure

- **Project Name**: `medassist`
- **Framework**: Vite
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://medassist-api.onrender.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 6. Deploy

Click "Deploy" and wait for build.

Frontend URL will be: `https://medassist.vercel.app`

## 🔗 Update API URLs

After deployment, update all references:

### Backend configuration
If frontend URL changes:
```python
# app.py
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://medassist.vercel.app"]
    }
})
```

### Test Deployment

1. Visit frontend URL
2. Try checking symptoms
3. Check browser console for errors
4. Verify data saves to Firebase

## 📊 Production Monitoring

### Enable Logging

**Backend (Render):**
- Check Logs tab
- Monitor for errors and performance
- Set up alerts for failures

**Frontend (Vercel):**
- Use Sentry or similar for error tracking
- Monitor bundle size
- Track performance metrics

## 🔐 Production Security

### Add Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/analyze-symptoms', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_symptoms():
    # ...
```

### Enable HTTPS

Both Vercel and Render provide free SSL/TLS.

### API Key Security

**Never** commit API keys:
```bash
# Good
export GEMINI_API_KEY=xxx
python app.py

# Bad
GEMINI_API_KEY=xxx python app.py  # visible in history
```

### Data Protection

- Enable Firebase security rules
- Require authentication for data access
- Use HIPAA-compliant practices
- Regular backups

## 💰 Cost Estimate (Monthly)

- **Vercel Frontend**: Free tier
- **Render Backend**: $7/month (hobby tier) or free
- **Firebase**: Free tier (up to 50K reads/day)
- **Google Gemini API**: Free tier (60 requests/min) or ~$0.005-0.01 per 1K tokens

**Total**: ~$7-15/month or free for hackathon

## 🚨 Troubleshooting Deployment

### Build Fails
```bash
# Check logs on Vercel/Render
# Common issues:
- Missing dependencies (add to requirements.txt or package.json)
- Wrong Node/Python version
- Incorrect build command
```

### API Not Responding
- Check backend logs on Render
- Verify environment variables set
- Check API key quota
- Test endpoint with curl

### Data Not Saving
- Verify Firebase credentials
- Check Firestore rules allow writes
- Monitor Firebase quota

### CORS Errors
```
Access to XMLHttpRequest blocked

Solutions:
1. Check backend CORS configuration
2. Verify frontend URL in CORS settings
3. Ensure API URL correct in .env
```

## 📈 Performance Optimization

### Frontend
```bash
# Analyze bundle
npm run build
npm run preview

# Check with Lighthouse
```

### Backend
```python
# Cache common responses
from functools import lru_cache

@lru_cache(maxsize=128)
def get_doctors(location):
    # ...
```

## 🎯 Post-Deployment

### Monitor Usage
- Check API logs
- Track user sessions
- Monitor Firebase quota

### Gather Feedback
- Add feedback form
- Monitor error rates
- Track user behavior

### Plan Updates
- Bug fixes
- Feature requests
- Performance improvements

## 📚 Useful Links

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Deployment](https://firebase.google.com/docs)
- [Flask Production](https://flask.palletsprojects.com/en/latest/deploying/)

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Firebase credentials uploaded
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] User can complete full flow
- [ ] No console errors
- [ ] Page loads in <3 seconds
- [ ] Mobile responsive working
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] DNS configured (optional)
- [ ] Domain connected (optional)

## 🎉 You're Live!

Once all checks pass, your app is live!

**Share these URLs:**
- Frontend: https://medassist.vercel.app
- API Documentation: https://medassist-api.onrender.com/health

---

Deployed with ❤️ for the hackathon! 🏆
