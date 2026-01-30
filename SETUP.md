# MedAssist - Complete Setup Guide

Follow this step-by-step guide to get MedAssist running locally for the hackathon.

## ⏱️ Expected Setup Time: 30 minutes

## Prerequisites Check

- [ ] Node.js 16+ installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Git installed
- [ ] Google account (for Gemini API)
- [ ] Internet connection (stable, for API calls)

## 🔑 Get API Keys

### 1. Google Gemini API Key

1. Visit: https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy the API key
5. **Keep it safe** - you'll need it soon

### 2. Firebase Project Setup

1. Go to: https://console.firebase.google.com
2. Click "Create Project"
   - Name: `medassist` (or your choice)
   - Accept terms and create
3. Once created:
   - Go to "Build" → "Firestore Database"
   - Click "Create Database"
   - Select "Start in test mode"
   - Choose region (closest to you)
4. Get credentials:
   - Go to "Project Settings" (gear icon)
   - Click "Service Accounts"
   - Click "Generate New Private Key"
   - Save the JSON file as `backend/firebase-key.json`

## 🚀 Setup Instructions

### Step 1: Clone Repository

```bash
cd Desktop
git clone https://github.com/your-repo/medassist.git
cd medassist
```

Or manually create the directory structure as provided.

### Step 2: Setup Backend

#### 2a. Create Virtual Environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal.

#### 2b. Install Dependencies

```bash
pip install -r requirements.txt
```

Wait for installation to complete (takes 2-3 minutes).

#### 2c. Create .env File

```bash
cp .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=paste_your_gemini_key_here
FIREBASE_CREDENTIALS_PATH=firebase-key.json
FLASK_ENV=development
FLASK_DEBUG=True
```

#### 2d. Place Firebase Credentials

Copy the `firebase-key.json` file you downloaded into the `backend/` folder.

#### 2e. Test Backend

```bash
python app.py
```

You should see:
```
🏥 MedAssist Backend Starting...
Gemini API: ✓ Configured
Firebase: ✓ Connected
Running on http://0.0.0.0:5000
```

If you see errors:
- Check `.env` file exists and has API key
- Verify `firebase-key.json` is in correct location
- Make sure Python 3.9+ is installed

**Keep this terminal open!** Open a new terminal for the frontend.

### Step 3: Setup Frontend

#### 3a. Open New Terminal

In a new terminal window/tab:

```bash
cd frontend
```

#### 3b. Install Dependencies

```bash
npm install
```

Wait for all packages to download (takes 1-2 minutes).

#### 3c. Create .env File

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key_from_project_settings
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Where to find these values:**
- Go to Firebase Project Settings
- Scroll to "Your apps" section
- If no app, click "Add app" and select "Web"
- Copy the `firebaseConfig` object

#### 3d. Run Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.0.0  ready in 200 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### Step 4: Test the App

1. Open browser: http://localhost:3000
2. Click "Check Symptoms Now"
3. Type a symptom: `I have a fever`
4. Hit Send
5. Watch the AI analyze your symptoms!

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Landing page loads without errors
- [ ] Can type in symptom checker
- [ ] Receives AI response
- [ ] No API errors in browser console
- [ ] Dashboard page accessible

## 🐛 Troubleshooting

### "Gemini API not responding"
- Check API key is correct in `.env`
- Verify API key is enabled: https://aistudio.google.com/app/apikeys
- Restart backend: `Ctrl+C` then `python app.py`

### "Firebase connection failed"
- Ensure `firebase-key.json` in backend/
- Check credentials are still valid
- Verify Firestore is created in Firebase console

### "Module not found" error
- For backend: Run `pip install -r requirements.txt` again
- For frontend: Run `npm install` again

### "Port already in use"
- Backend port 5000: `lsof -i :5000` (macOS/Linux) or check Task Manager (Windows)
- Frontend port 3000: Change in vite.config.js

### "CORS error"
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env.local`
- Restart both servers

## 📱 Testing User Flow

1. **Landing Page** ✓
   - See four feature cards
   - Click "Check Symptoms Now"

2. **Symptom Checker** ✓
   - Describe a symptom (e.g., "severe headache")
   - AI asks follow-up questions
   - Get severity assessment

3. **Dashboard** ✓
   - See four quick action buttons
   - Click on each to navigate
   - View health profile

4. **Medical History** ✓
   - Add personal information
   - Select chronic conditions
   - Add medications

5. **Doctor Connect** ✓
   - Search for doctors
   - Select doctor
   - Choose appointment time
   - Confirm booking

## 🎯 Demo Data for Testing

Test symptoms:
- "Fever and cough" → Should suggest infection
- "Chest pain" → Should flag as emergency
- "Mild headache" → Should suggest home care
- "Persistent fatigue" → Should suggest doctor visit

Test medications:
- Aspirin 75mg daily
- Metformin 500mg twice daily
- Lisinopril 10mg daily

## 📤 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Creates dist/ folder ready for Vercel
```

### Backend Deployment
1. Push to GitHub
2. Connect to Render.com or Railway.app
3. Set environment variables
4. Deploy!

## 🔒 Before Submitting (Security Checklist)

- [ ] Remove all API keys from code
- [ ] Use environment variables for sensitive data
- [ ] Add `.gitignore` (provided in repo)
- [ ] Don't commit `firebase-key.json`
- [ ] Don't commit `.env` files
- [ ] Test API rate limiting for production

## 📊 Performance Tips for Demo

- Pre-load some responses for instant demo
- Have conversation examples ready
- Take screenshots of each feature
- Record a demo video showing user flow

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Flask Guide](https://flask.palletsprojects.com)
- [Gemini API](https://ai.google.dev)
- [Firebase Web](https://firebase.google.com/docs/web)

## 💬 Need Help?

If stuck:
1. Check error message carefully
2. Search GitHub issues
3. Review troubleshooting section above
4. Check Firebase and API key limits

## 🎉 You're Ready!

Once everything is running:
- ✅ Write a great demo script
- ✅ Practice your pitch
- ✅ Prepare talking points
- ✅ Take screenshots for presentation

**Good luck with your hackathon submission!** 🏆

---

Last Updated: January 2026
MedAssist Team
