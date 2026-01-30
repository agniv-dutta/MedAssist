# MedAssist Backend

Flask REST API with Google Gemini AI integration for healthcare triage.

## 📁 Project Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
└── firebase-key.json  # Firebase credentials (not in repo)
```

## 🚀 Quick Start

### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Setup Environment
```bash
cp .env.example .env
```

Edit `.env` with:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `FIREBASE_CREDENTIALS_PATH`: Path to firebase-key.json

### Run Server
```bash
python app.py
```

Server runs on `http://localhost:5000`

## 🔑 Environment Variables

```
GEMINI_API_KEY=sk_test_xxx...
FIREBASE_CREDENTIALS_PATH=firebase-key.json
FLASK_ENV=development
FLASK_DEBUG=True
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Response: `{ "status": "ok" }`

### Analyze Symptoms
```
POST /analyze-symptoms
Content-Type: application/json

{
  "userId": "user_123",
  "symptoms": "I have a fever and cough",
  "conversationHistory": []
}
```

Response:
```json
{
  "severity": "Consult Soon",
  "questions": ["When did symptoms start?"],
  "recommendations": ["Visit nearest health center"],
  "red_flags": [],
  "first_aid": ["Rest and drink fluids"],
  "message": "Based on your symptoms..."
}
```

### Save Medical History
```
POST /medical-history/save
{
  "userId": "user_123",
  "data": {
    "type": "symptom_check",
    "result": {...},
    "messages": [...]
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

### Patient Summary
```
GET /patient-summary/<user_id>
```

## 🤖 Gemini AI Integration

The system uses Google Gemini API for:
- **Symptom Analysis**: Understanding patient symptoms
- **Severity Assessment**: Determining urgency level
- **Question Generation**: Creating relevant follow-ups
- **Patient Summary**: Generating doctor-ready summaries

### System Prompt Strategy

The AI is instructed to:
1. Ask clarifying questions
2. Assess severity (Emergency/Urgent/Moderate/Low)
3. Identify red flags
4. Provide first-aid advice
5. **Never diagnose** - only recommend professional consultation
6. Use simple, empathetic language
7. Be culturally sensitive to rural India

## 🗄️ Firebase Integration

### Collections Structure
```
users/
  {userId}/
    history/
      {docId}:
        - timestamp
        - type (symptom_check, medication, etc)
        - data
        - messages

conversations/
  {userId}:
    - latest_analysis
    - last_updated
    - symptoms_reported

appointments/
  {docId}:
    - user_id
    - doctor_id
    - time_slot
    - status
    - created_at
```

## 🔐 Security Considerations

- ✅ CORS enabled for frontend origin
- ✅ API key validated
- ✅ Firebase authentication required
- ✅ Rate limiting (implement in production)
- ✅ Input validation on all endpoints
- ✅ HIPAA-compliant data handling

### Production Security

```python
# In production, add:
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

## 🧪 Testing Endpoints

Using curl:
```bash
# Health check
curl http://localhost:5000/health

# Analyze symptoms
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "symptoms": "Persistent headache",
    "conversationHistory": []
  }'
```

Using Python:
```python
import requests

response = requests.post(
    'http://localhost:5000/analyze-symptoms',
    json={
        'userId': 'test_user',
        'symptoms': 'Chest pain',
        'conversationHistory': []
    }
)
print(response.json())
```

## 📊 Response Format

All successful responses follow this format:
```json
{
  "severity": "Emergency|Consult Soon|Home Care|Monitor",
  "questions": ["follow-up questions"],
  "recommendations": ["actionable recommendations"],
  "red_flags": ["critical symptoms"],
  "first_aid": ["immediate care instructions"],
  "message": "empathetic response to patient"
}
```

## 🐛 Debugging

Enable Flask debug mode:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

Check logs for:
- API request/response
- Gemini API calls
- Firebase errors
- Validation issues

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect GitHub to Render
3. Set environment variables in Render dashboard
4. Deploy with: `python app.py`

### Deploy to Railway

Similar process, just select Python as buildpack.

## 📈 Performance Optimization

- Cache Gemini responses for similar symptoms
- Implement pagination for history queries
- Use Firebase indexes for common queries
- Add CDN for static content

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com)
- [Google Gemini API](https://ai.google.dev)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🔄 Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-endpoint

# Make changes
# Test locally
python app.py

# Commit and push
git add .
git commit -m "Add new endpoint"
git push origin feature/new-endpoint

# Create Pull Request
```

---

Built with Flask & Google Gemini 🤖
