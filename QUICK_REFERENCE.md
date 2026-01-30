# 🚀 MedAssist - Quick Reference

Fast lookup guide for everything about MedAssist.

## ⚡ 30-Second Overview

MedAssist is an AI healthcare assistant for rural India. 
Users describe symptoms → Gemini AI analyzes → Recommends care level → Connects to doctors.
Built with React, Flask, Gemini, Firebase in 24 hours.

## 📍 Project Location

```
c:\Users\Admin\Desktop\MedAssist\
```

## 🔧 Quick Commands

### Start Development (Windows)
```bash
# Run this from MedAssist folder:
start-local.bat
```

### Start Development (Mac/Linux)
```bash
# Run this from MedAssist folder:
chmod +x start-local.sh
./start-local.sh
```

### Manual Start
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python app.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/pages/SymptomChecker.jsx` | Main chat interface |
| `backend/app.py` | All API endpoints |
| `frontend/.env.example` | Frontend config template |
| `backend/.env.example` | Backend config template |
| `README.md` | Full project docs |
| `SETUP.md` | Installation guide |
| `DEPLOYMENT.md` | Production deployment |
| `DEMO_SCENARIOS.md` | Testing & demo guide |

## 🔑 Environment Variables Needed

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### Backend (.env)
```
GEMINI_API_KEY=xxx
FIREBASE_CREDENTIALS_PATH=firebase-key.json
FLASK_ENV=development
```

## 🔐 API Credentials Required

1. **Google Gemini API Key**: https://aistudio.google.com/app/apikeys
2. **Firebase Credentials**: https://console.firebase.google.com
   - Create project
   - Enable Firestore
   - Download service account JSON
   - Save as `backend/firebase-key.json`

## 🎯 Core Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| Symptom Checker | React chat + Gemini | ✅ Done |
| Triage Assessment | Gemini API | ✅ Done |
| Medical History | Firebase Firestore | ✅ Done |
| Dashboard | React components | ✅ Done |
| Doctor Connect | Mock data ready | ✅ Done |

## 📊 Tech Stack Quick Ref

```
Frontend    Backend      Database    AI
━━━━━━━━    ━━━━━━━━     ━━━━━━━━    ━━
React       Flask        Firebase    Gemini
Vite        Python       Firestore   
Tailwind    Axios        Auth
```

## 🐛 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| "Module not found" | Run `npm install` (frontend) or `pip install -r requirements.txt` (backend) |
| "API key error" | Check `.env` file has correct key, restart server |
| "Port in use" | Change port in config or kill process using the port |
| "CORS error" | Ensure backend running, check API URL in .env.local |
| "Firebase error" | Verify firebase-key.json exists in backend/ |

## 🚀 Deployment Quick Links

- **Frontend Deploy**: Vercel (vercel.com)
- **Backend Deploy**: Render (render.com) 
- **Database**: Firebase Console
- **DNS**: Any registrar (optional)

## 📝 Testing Symptom Examples

```
Emergency:
"Severe chest pain and difficulty breathing"

Urgent:
"High fever, persistent cough for 3 days"

Moderate:
"Mild headache and body ache"

Monitor:
"Feeling tired, slightly elevated temperature"
```

## 🎤 30-Second Elevator Pitch

"MedAssist uses AI to provide instant health assessment in rural India. Users describe symptoms in their own words, our Gemini-powered system analyzes them, and recommends the right care level - whether that's home care, visiting a PHC, or emergency hospital. We're democratizing healthcare access for 900 million rural Indians who have limited options today."

## 📋 Pre-Demo Checklist

- [ ] Both servers running (Frontend + Backend)
- [ ] Browser console has no errors
- [ ] Test symptom analysis works
- [ ] Check API responds at localhost:5000/health
- [ ] Have demo credentials ready
- [ ] Know all features by heart
- [ ] Have backup screenshots

## 📱 Mobile Testing

Open in Chrome DevTools:
1. Press F12
2. Click device icon (top left)
3. Select "iPhone 12" or "Pixel 5"
4. Test responsiveness

## 💡 Pro Tips

1. **Speed**: Pre-warm requests for instant response
2. **Demo**: Have screenshot backups if demo fails
3. **Talking**: Practice 2-minute pitch beforehand
4. **Questions**: Prepare answers for "How do you make money?"
5. **Data**: Use realistic but not personally identifiable data

## 🎯 Success Criteria

✅ App loads without errors
✅ Symptom checker responds within 2 seconds
✅ Can save to medical history
✅ Can book doctor appointment
✅ Mobile looks good
✅ No console errors

## 📞 Getting Help

1. Check error message carefully
2. Review SETUP.md for installation issues
3. Check README.md for features
4. Look in DEMO_SCENARIOS.md for testing help
5. Review DEPLOYMENT.md for production issues

## 🏆 What Makes This Strong for Hackathon

✅ Solves real problem (healthcare access)
✅ Complete working prototype
✅ Production-ready code
✅ Easy deployment
✅ Scalable architecture
✅ Good documentation
✅ Impressive tech stack
✅ Clear social impact

## 🎓 Project Metrics

- **Build Time**: 24 hours ✓
- **Features**: 4 complete ✓
- **Code Quality**: Production-ready ✓
- **Documentation**: Comprehensive ✓
- **Deployment**: Cloud-ready ✓
- **User Experience**: Mobile-optimized ✓

## 📅 Submission Timeline

| Time | Task |
|------|------|
| Tonight | Final testing |
| Next Morning | Submit code + video |
| Submission | Include README, Setup guide, Demo |
| Presentation | 5 min demo + 5 min questions |

## 🎬 Demo Script (2 minutes)

```
0:00 - Show landing page
0:30 - Type "severe headache" 
1:00 - Show emergency response
1:30 - Jump to dashboard
2:00 - Conclude: "This saves lives in rural India"
```

## 🔗 Important Links

- **Project**: This folder
- **Frontend Code**: `frontend/src/`
- **Backend Code**: `backend/app.py`
- **Full Docs**: `README.md`
- **Setup Guide**: `SETUP.md`
- **Deployment**: `DEPLOYMENT.md`

## ✨ Final Checklist Before Submission

- [ ] Code committed to GitHub
- [ ] All secrets in .env (not in code)
- [ ] README has setup instructions
- [ ] Tested on fresh machine/browser
- [ ] No hardcoded API keys
- [ ] Production build works
- [ ] Screenshots for backup
- [ ] Video demo prepared
- [ ] Pitch practiced
- [ ] Team aligned on talking points

---

**You're ready!** 🚀 Go build something amazing! 🎉

Questions? Check the relevant markdown file (README, SETUP, DEPLOYMENT, DEMO_SCENARIOS).
