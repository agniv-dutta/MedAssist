# MedAssist API - Testing Guide

Complete guide to testing all MedAssist backend API endpoints.

## 📡 API Base URL

**Development**: `http://localhost:5000`
**Production**: `https://medassist-api.onrender.com` (after deployment)

## ✅ Health Check

Verify backend is running:

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "MedAssist backend is running"
}
```

---

## 🩺 POST /analyze-symptoms

**Purpose**: Analyze patient symptoms using Gemini AI

**Request:**
```bash
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "symptoms": "I have a fever and cough",
    "conversationHistory": []
  }'
```

**Request Body:**
```json
{
  "userId": "string",           // User identifier
  "symptoms": "string",         // Symptom description
  "conversationHistory": []     // Previous messages array
}
```

**Response:**
```json
{
  "severity": "Consult Soon",
  "message": "Based on your symptoms...",
  "questions": [
    "When did the symptoms start?",
    "Do you have difficulty breathing?"
  ],
  "recommendations": [
    "Visit nearest health center for examination",
    "Stay hydrated and rest well"
  ],
  "red_flags": [],
  "first_aid": [
    "Take rest for 2-3 days",
    "Drink water frequently"
  ]
}
```

**Test Cases:**

### Case 1: Emergency Symptoms
```bash
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "symptoms": "Chest pain, difficulty breathing, left arm pain",
    "conversationHistory": []
  }'
```

Expected: Severity = "Emergency"

### Case 2: Urgent Symptoms
```bash
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_002",
    "symptoms": "High fever (39C) for 3 days, persistent cough, body ache",
    "conversationHistory": []
  }'
```

Expected: Severity = "Consult Soon"

### Case 3: Moderate Symptoms
```bash
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_003",
    "symptoms": "Mild headache and body ache",
    "conversationHistory": []
  }'
```

Expected: Severity = "Home Care"

---

## 📋 POST /medical-history/save

**Purpose**: Save patient medical history to Firebase

**Request:**
```bash
curl -X POST http://localhost:5000/medical-history/save \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "data": {
      "type": "symptom_check",
      "result": {
        "severity": "Consult Soon",
        "message": "Visit health center"
      },
      "messages": [
        {"type": "user", "content": "I have fever"},
        {"type": "bot", "content": "When did it start?"}
      ]
    }
  }'
```

**Request Body:**
```json
{
  "userId": "string",
  "data": {
    "type": "string",          // "symptom_check", "medication", etc
    "result": {},              // Analysis result
    "messages": [],            // Conversation history
    "timestamp": "ISO string"  // Optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "History saved"
}
```

---

## 📖 GET /medical-history/{user_id}

**Purpose**: Retrieve user's medical history

**Request:**
```bash
curl http://localhost:5000/medical-history/user_12345
```

**Response:**
```json
{
  "history": [
    {
      "id": "doc_id_1",
      "timestamp": "2026-01-30T10:30:00Z",
      "type": "symptom_check",
      "data": {
        "severity": "Consult Soon",
        "symptoms": "Fever and cough"
      }
    },
    {
      "id": "doc_id_2",
      "timestamp": "2026-01-29T14:15:00Z",
      "type": "medication",
      "data": {
        "medication": "Aspirin 75mg",
        "dosage": "Daily"
      }
    }
  ],
  "success": true
}
```

**Test:**
```bash
curl http://localhost:5000/medical-history/user_001
```

---

## 👨‍⚕️ GET /doctors/available

**Purpose**: Get list of available doctors

**Request:**
```bash
curl "http://localhost:5000/doctors/available?location=Delhi"
```

**Query Parameters:**
- `location` (optional): City/district name

**Response:**
```json
{
  "doctors": [
    {
      "id": 1,
      "name": "Dr. Raj Kumar",
      "specialty": "General Physician",
      "location": "Delhi",
      "rating": 4.5,
      "experience": "10 years",
      "available": true
    },
    {
      "id": 2,
      "name": "Dr. Priya Singh",
      "specialty": "Pediatrician",
      "location": "Delhi",
      "rating": 4.8,
      "experience": "8 years",
      "available": true
    }
  ],
  "success": true
}
```

**Test:**
```bash
# Search in Delhi
curl "http://localhost:5000/doctors/available?location=Delhi"

# Search in Mumbai
curl "http://localhost:5000/doctors/available?location=Mumbai"

# Get all doctors
curl "http://localhost:5000/doctors/available"
```

---

## 📅 POST /appointment/book

**Purpose**: Book an appointment with a doctor

**Request:**
```bash
curl -X POST http://localhost:5000/appointment/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "doctorId": 1,
    "timeSlot": "10:00 AM"
  }'
```

**Request Body:**
```json
{
  "userId": "string",        // User identifier
  "doctorId": "number",      // Doctor ID from doctors list
  "timeSlot": "string"       // Time like "10:00 AM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment_id": "APT123456789ABC"
}
```

**Test:**
```bash
curl -X POST http://localhost:5000/appointment/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "doctorId": 1,
    "timeSlot": "10:00 AM"
  }'
```

---

## 👁️ GET /patient-summary/{user_id}

**Purpose**: Generate AI summary for doctor consultation

**Request:**
```bash
curl http://localhost:5000/patient-summary/user_12345
```

**Response:**
```json
{
  "summary": "45-year-old patient with history of diabetes and hypertension. Recent symptom check indicated fever and cough lasting 3 days. Last consultation 2 weeks ago for medication refill. Patient compliant with medications. Recommending immediate PHC visit for respiratory assessment.",
  "success": true
}
```

**Test:**
```bash
curl http://localhost:5000/patient-summary/user_001
```

---

## 🧪 Testing with Python

Install requests library:
```bash
pip install requests
```

**Test script:**
```python
import requests
import json

BASE_URL = "http://localhost:5000"

# 1. Health check
response = requests.get(f"{BASE_URL}/health")
print("Health:", response.json())

# 2. Analyze symptoms
payload = {
    "userId": "test_user",
    "symptoms": "Fever and cough",
    "conversationHistory": []
}
response = requests.post(f"{BASE_URL}/analyze-symptoms", json=payload)
print("Analysis:", response.json())

# 3. Get doctors
response = requests.get(f"{BASE_URL}/doctors/available?location=Delhi")
print("Doctors:", response.json())

# 4. Book appointment
booking = {
    "userId": "test_user",
    "doctorId": 1,
    "timeSlot": "10:00 AM"
}
response = requests.post(f"{BASE_URL}/appointment/book", json=booking)
print("Booking:", response.json())
```

---

## 🧪 Testing with Postman

1. **Import Collection**:
   - Open Postman
   - Create new collection: "MedAssist"

2. **Add Requests**:

### Request 1: Health Check
- Method: GET
- URL: `{{base_url}}/health`
- Send → Check response

### Request 2: Analyze Symptoms
- Method: POST
- URL: `{{base_url}}/analyze-symptoms`
- Headers: `Content-Type: application/json`
- Body (raw):
```json
{
  "userId": "user_test",
  "symptoms": "I have a high fever",
  "conversationHistory": []
}
```
- Send → Verify severity

### Request 3: Get Doctors
- Method: GET
- URL: `{{base_url}}/doctors/available?location=Delhi`
- Send → Check doctor list

### Request 4: Book Appointment
- Method: POST
- URL: `{{base_url}}/appointment/book`
- Headers: `Content-Type: application/json`
- Body (raw):
```json
{
  "userId": "user_test",
  "doctorId": 1,
  "timeSlot": "10:00 AM"
}
```

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Symptom analysis works |
| 400 | Bad request | Missing required fields |
| 404 | Not found | Invalid endpoint |
| 500 | Server error | API key missing |

---

## 🔍 Debugging API Issues

### Check Backend Logs
```bash
# Look for these in terminal running Flask:
[2026-01-30 10:30:00] POST /analyze-symptoms - 200 OK
[2026-01-30 10:31:00] GET /doctors/available - 200 OK
```

### Common Errors

**"GEMINI_API_KEY not found"**
```
Solution: Check .env file in backend/ folder
```

**"Firebase connection failed"**
```
Solution: Verify firebase-key.json exists
```

**"404 Not Found"**
```
Solution: Check endpoint path is correct
```

**"500 Internal Server Error"**
```
Solution: Check backend logs for details
```

---

## 🎯 Full Integration Test

Run all endpoints in sequence:

```bash
#!/bin/bash
BASE_URL="http://localhost:5000"

echo "1. Health Check..."
curl $BASE_URL/health

echo -e "\n2. Analyze Symptoms..."
curl -X POST $BASE_URL/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","symptoms":"fever","conversationHistory":[]}'

echo -e "\n3. Get Doctors..."
curl "$BASE_URL/doctors/available?location=Delhi"

echo -e "\n4. Book Appointment..."
curl -X POST $BASE_URL/appointment/book \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","doctorId":1,"timeSlot":"10:00 AM"}'

echo -e "\n✓ All endpoints tested!"
```

---

## 📈 Performance Testing

Measure API response times:

```bash
# Time a single request
time curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","symptoms":"fever","conversationHistory":[]}'

# Expected: < 1 second
```

---

## 🔒 Security Testing

### CORS Test
```bash
curl -i http://localhost:5000 \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

Should return:
```
Access-Control-Allow-Origin: http://localhost:3000
```

---

## ✅ Pre-Demo API Verification

Run this checklist:

```bash
# 1. Backend running?
curl http://localhost:5000/health

# 2. Can analyze symptoms?
curl -X POST http://localhost:5000/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo","symptoms":"headache","conversationHistory":[]}'

# 3. Can get doctors?
curl "http://localhost:5000/doctors/available?location=Delhi"

# 4. Can book appointment?
curl -X POST http://localhost:5000/appointment/book \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo","doctorId":1,"timeSlot":"10:00 AM"}'
```

All should return valid JSON responses.

---

**Happy Testing!** 🧪✨
