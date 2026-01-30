# MedAssist

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vertex%20AI](https://img.shields.io/badge/Vertex%20AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/vertex-ai)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Lucide](https://img.shields.io/badge/Lucide-111827?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

AI-powered healthcare assistant for rural India. MedAssist provides symptom triage, medical history tracking, and doctor connections with a clean, professional UI built for low-bandwidth environments.

![MedAssist Banner](/assets/banner.png)

## Problem Statement

65% of India’s rural population lacks access to timely, quality healthcare. MedAssist bridges this gap by providing:
- Instant AI symptom assessment
- Medical history and medication tracking
- Doctor discovery and appointment booking
- Always-on access with simple, accessible UI

## Key Features

### Symptom Checker & Triage
- Natural language symptom input
- AI-driven severity assessment (Emergency / Consult Soon / Home Care / Monitor)
- Guided follow-up questions
- Red-flag detection and first-aid tips
- Specialist recommendations and PHC guidance

### Medical History Tracker
- Profile details (age, gender, location, conditions)
- Medication list management
- Visit history timeline
- Secure local + Firebase-backed storage

### Doctor Connect
- Search and browse available doctors
- Ratings, specialties, and experience
- Appointment booking with time slots
- Auto-generated consultation context

### Health Dashboard
- Unified access to all features
- Professional iconography and layout
- Reminders and quick actions

## Architecture

```
User → React UI → Flask API → Vertex AI Gemini
                   └─ Firebase (Auth + Firestore)
```

## Tech Stack

**Frontend**
- React 18 + Vite
- Custom CSS (no Tailwind)
- Lucide React icons
- Firebase client SDK

**Backend**
- Python 3.10+
- Flask + Flask-CORS
- Vertex AI Gemini (google.genai)
- Firebase Admin SDK

**Database**
- Firebase Firestore
- Firebase Authentication

**Deployment**
- Frontend: Vercel
- Backend: Render or Railway

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.10+
- Google Cloud project with Vertex AI enabled
- Firebase project and service account JSON

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
```

Set environment values in `.env.local`:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the UI:
```bash
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Set environment values in `.env`:
```
GCP_PROJECT=your_gcp_project_id
GCP_LOCATION=us-central1
AETHER_MODEL=gemini-2.0-flash
FIREBASE_CREDENTIALS_PATH=firebase-key.json
FLASK_ENV=development
FLASK_DEBUG=True
```

Run the API:
```bash
python app.py
```

## API Endpoints

### Symptom Analysis
```
POST /analyze-symptoms
{
  "userId": "user_123",
  "symptoms": "I have fever and headache",
  "conversationHistory": []
}
```

### Save Medical History
```
POST /medical-history/save
{
  "userId": "user_123",
  "data": {
    "type": "symptom_check",
    "result": {"...": "..."},
    "messages": ["..."]
  }
}
```

### Get Medical History
```
GET /medical-history/<user_id>
```

### Available Doctors
```
GET /doctors/available?location=Delhi
```

### Book Appointment
```
POST /appointment/book
{
  "userId": "user_123",
  "doctorId": 1,
  "timeSlot": "10:00 AM"
}
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
```

### Backend (Render/Railway)
```bash
cd backend
python app.py
```

## Troubleshooting

### Vertex AI not initializing
- Ensure `GCP_PROJECT` and `GCP_LOCATION` are set
- Confirm Vertex AI API is enabled on the Google Cloud project

### Firebase connection error
- Confirm `firebase-key.json` exists in backend/
- Validate service account permissions and Firestore enabled

### Frontend cannot reach backend
- Verify `VITE_API_URL` matches API host
- Check CORS is enabled in the Flask server

## Future Enhancements

- Multi-language support (Hindi, Tamil, Telugu, Gujarati)
- WhatsApp integration for rural users
- Video consultation streaming
- Prescription generation and tracking
- Offline support for low-connectivity areas

## Hackathon Submission

**Team:** MedAssist
**Project:** AI-Powered Rural Healthcare Bridge
**Impact:** Accessible healthcare for 900M+ rural Indians

## License

MIT License - See LICENSE file for details
