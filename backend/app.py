import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json
import uuid
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Gemini Vertex AI Client
try:
    gemini_client = genai.Client(
        vertexai=True,
        project=os.getenv("GCP_PROJECT"),
        location=os.getenv("GCP_LOCATION", "us-central1"),
    )
    GEMINI_MODEL = os.getenv("AETHER_MODEL", "gemini-2.0-flash")
    print(f"✅ Vertex AI Gemini initialized with model: {GEMINI_MODEL}")
except Exception as e:
    print(f"❌ Error initializing Vertex AI: {e}")
    gemini_client = None
    GEMINI_MODEL = None

# Initialize Firebase
FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase-key.json')
if os.path.exists(FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    db = None
    print("⚠️  Firebase credentials not found. Database features disabled.")

# In-memory user storage
users_db = {}

# Gemini Conversation System Prompt
SYSTEM_PROMPT = """You are a medical triage AI assistant for rural healthcare in India. Your role is to:
- Ask relevant follow-up questions to understand symptoms better
- Assess severity level (Emergency / Consult Soon / Home Care / Monitor)
- Provide clear next steps and recommendations
- Identify red flag symptoms requiring immediate care
- Give first-aid advice for minor issues
- Recommend appropriate medical specialist based on symptoms
- Be empathetic and use simple language suitable for rural India
- Suggest visiting nearest PHC (Primary Health Center) or hospital when needed

IMPORTANT: Never diagnose specific diseases, only suggest consulting appropriate medical professionals.

When you have enough information to assess severity, respond with a JSON object:
{
  "severity": "Emergency|Consult Soon|Home Care|Monitor",
  "questions": [],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "red_flags": ["critical symptom 1"],
  "first_aid": ["instruction 1"],
  "specialist_recommendation": "e.g., General Physician, Cardiologist, Pulmonologist, Neurologist, Gastroenterologist, ENT Specialist, etc.",
  "message": "empathetic message to user"
}

When you need more information, respond with JSON:
{
  "severity": "follow-up",
  "questions": ["follow-up question 1", "question 2"],
  "recommendations": [],
  "red_flags": [],
  "first_aid": [],
  "message": "response message"
}

Keep responses in simple Hindi/English mix when possible. Always be supportive and reassuring.
"""

def prepare_conversation_context(conversation_history):
    """Format conversation history for Gemini"""
    context = ""
    for msg in conversation_history:
        role = "Patient" if msg.get('type') == 'user' else "Assistant"
        context += f"{role}: {msg.get('content', '')}\n"
    return context

def parse_gemini_response(response_text):
    """Parse Gemini response and extract structured data"""
    try:
        # Try to extract JSON from the response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
    except Exception as parse_error:
        print(f"JSON parse error: {parse_error}")
        pass
    
    # Fallback: return as plain message
    return {
        "severity": "follow-up",
        "message": response_text,
        "questions": [],
        "recommendations": [],
        "red_flags": [],
        "first_aid": []
    }

def call_gemini_api(prompt: str) -> str:
    """Call Vertex AI Gemini API"""
    if not gemini_client or not GEMINI_MODEL:
        raise Exception("Gemini client not initialized")
    
    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config={"temperature": 0.2},
        )
        return response.text or ""
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'MedAssist backend is running'})

@app.route('/api/signup', methods=['POST'])
def signup():
    """User signup endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        age = data.get('age')
        gender = data.get('gender')
        
        if not email or not password or not name:
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        for user in users_db.values():
            if user['email'] == email:
                return jsonify({'message': 'Email already registered'}), 409
        
        # Create new user
        user_id = str(uuid.uuid4())
        users_db[user_id] = {
            'userId': user_id,
            'name': name,
            'email': email,
            'password': password,  # In production, hash this!
            'age': age,
            'gender': gender,
            'chronicConditions': [],
            'medicalHistory': [],
            'createdAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'userId': user_id,
            'profile': {
                'name': name,
                'age': age,
                'gender': gender,
                'location': None,
                'chronicConditions': []
            }
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password required'}), 400
        
        # Find user by email and password
        for user_id, user in users_db.items():
            if user['email'] == email and user['password'] == password:
                return jsonify({
                    'userId': user_id,
                    'profile': {
                        'name': user['name'],
                        'age': user['age'],
                        'gender': user['gender'],
                        'location': None,
                        'chronicConditions': user.get('chronicConditions', [])
                    }
                }), 200
        
        return jsonify({'message': 'Invalid email or password'}), 401
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_api():
    """Analyze symptoms endpoint for symptom checker"""
    try:
        if not gemini_client:
            return jsonify({
                'status': 'error',
                'message': 'Gemini API not initialized'
            }), 500
        
        data = request.get_json()
        user_id = data.get('user_id')
        symptoms = data.get('symptoms')
        
        if not symptoms:
            return jsonify({
                'status': 'error',
                'message': 'No symptoms provided'
            }), 400
        
        # Create prompt for Gemini with system context
        prompt = f"{SYSTEM_PROMPT}\n\nPatient symptoms:\n{symptoms}\n\nProvide your assessment:"
        
        # Call Vertex AI Gemini
        response_text = call_gemini_api(prompt)
        
        # Parse response
        result = parse_gemini_response(response_text)
        
        # Ensure we have specialist_recommendation
        if not result.get('specialist_recommendation'):
            result['specialist_recommendation'] = 'General Physician'
        
        return jsonify({
            'status': 'success',
            'analysis': result
        })
    
    except Exception as e:
        print(f"Error in analyze_api: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/medical-history', methods=['POST'])
def save_medical_history_api():
    """Save medical history"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id or user_id not in users_db:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Save to in-memory storage
        if 'medicalHistory' not in users_db[user_id]:
            users_db[user_id]['medicalHistory'] = []
        
        users_db[user_id]['medicalHistory'].append({
            'timestamp': datetime.now().isoformat(),
            'type': data.get('type', 'symptom_check'),
            'result': data.get('result'),
            'messages': data.get('messages', [])
        })
        
        return jsonify({
            'status': 'success',
            'message': 'History saved'
        })
    
    except Exception as e:
        print(f"Error saving history: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    """Main endpoint for symptom analysis using Gemini"""
    try:
        if not gemini_client:
            return jsonify({'error': 'Gemini API not initialized'}), 500
        
        data = request.get_json()
        user_id = data.get('userId')
        symptoms = data.get('symptoms')
        conversation_history = data.get('conversationHistory', [])
        
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400
        
        # Build conversation context
        conversation_context = prepare_conversation_context(conversation_history)
        
        # Create prompt for Gemini
        full_prompt = f"{SYSTEM_PROMPT}\n\nConversation:\n{conversation_context}Patient: {symptoms}\n\nAssistant: "
        
        # Call Vertex AI Gemini API
        response_text = call_gemini_api(full_prompt)
        
        # Parse response
        result = parse_gemini_response(response_text)
        
        # Save to Firebase if available
        if db and user_id:
            try:
                db.collection('conversations').document(user_id).set({
                    'latest_analysis': result,
                    'last_updated': datetime.now(),
                    'symptoms_reported': symptoms
                }, merge=True)
            except Exception as e:
                print(f"Firebase save error: {e}")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error analyzing symptoms: {str(e)}")
        return jsonify({'error': str(e), 'message': 'Error processing your request'}), 500

@app.route('/medical-history/save', methods=['POST'])
def save_medical_history():
    """Save medical history to Firebase"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        history_data = data.get('data')
        
        if not db or not user_id:
            return jsonify({'success': False, 'message': 'Firebase not available'}), 400
        
        db.collection('users').document(user_id).collection('history').add({
            'timestamp': datetime.now(),
            'type': history_data.get('type'),
            'data': history_data.get('data'),
            'messages': history_data.get('messages', [])
        })
        
        return jsonify({'success': True, 'message': 'History saved'})
    
    except Exception as e:
        print(f"Error saving history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/medical-history/<user_id>', methods=['GET'])
def get_medical_history(user_id):
    """Fetch medical history for a user"""
    try:
        if not db:
            return jsonify({'history': [], 'message': 'Firebase not available'}), 200
        
        docs = db.collection('users').document(user_id).collection('history').order_by(
            'timestamp', direction=firestore.Query.DESCENDING
        ).limit(10).stream()
        
        history = []
        for doc in docs:
            history.append({
                'id': doc.id,
                'timestamp': doc.get('timestamp').isoformat() if doc.get('timestamp') else None,
                'type': doc.get('type'),
                'data': doc.get('data')
            })
        
        return jsonify({'history': history, 'success': True})
    
    except Exception as e:
        print(f"Error fetching history: {str(e)}")
        return jsonify({'history': [], 'success': False, 'error': str(e)})

@app.route('/doctors/available', methods=['GET'])
def get_available_doctors():
    """Get list of available doctors (mock data for demo)"""
    try:
        location = request.args.get('location', '')
        
        # Mock doctor data - in production, query real database
        doctors = [
            {
                'id': 1,
                'name': 'Dr. Raj Kumar',
                'specialty': 'General Physician',
                'location': location or 'Local PHC',
                'rating': 4.5,
                'experience': '10 years',
                'available': True
            },
            {
                'id': 2,
                'name': 'Dr. Priya Singh',
                'specialty': 'Pediatrician',
                'location': location or 'District Hospital',
                'rating': 4.8,
                'experience': '8 years',
                'available': True
            },
            {
                'id': 3,
                'name': 'Dr. Amit Patel',
                'specialty': 'Cardiologist',
                'location': location or 'Medical College',
                'rating': 4.6,
                'experience': '12 years',
                'available': True
            }
        ]
        
        return jsonify({'doctors': doctors, 'success': True})
    
    except Exception as e:
        print(f"Error fetching doctors: {str(e)}")
        return jsonify({'doctors': [], 'error': str(e)}), 500

@app.route('/appointment/book', methods=['POST'])
def book_appointment():
    """Book an appointment with a doctor"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        doctor_id = data.get('doctorId')
        time_slot = data.get('timeSlot')
        
        if not all([user_id, doctor_id, time_slot]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Save appointment to Firebase if available
        if db:
            db.collection('appointments').add({
                'user_id': user_id,
                'doctor_id': doctor_id,
                'time_slot': time_slot,
                'status': 'confirmed',
                'created_at': datetime.now()
            })
        
        return jsonify({
            'success': True,
            'message': 'Appointment booked successfully',
            'appointment_id': f'APT{user_id}{doctor_id}{time_slot}'
        })
    
    except Exception as e:
        print(f"Error booking appointment: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/patient-summary/<user_id>', methods=['GET'])
def get_patient_summary(user_id):
    """Get AI-generated patient summary for doctor consultation"""
    try:
        if not db:
            return jsonify({'summary': 'Patient information not available'}), 200
        
        # Fetch recent history
        docs = db.collection('users').document(user_id).collection('history').order_by(
            'timestamp', direction=firestore.Query.DESCENDING
        ).limit(5).stream()
        
        history_text = ""
        for doc in docs:
            history_text += f"- {doc.get('type')}: {str(doc.get('data'))}\n"
        
        # Use Gemini to generate summary
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""Based on the following patient history, create a concise medical summary for a doctor:

{history_text}

Keep it brief, medical, and actionable for consultation."""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'summary': response.text,
            'success': True
        })
    
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return jsonify({'summary': 'Could not generate summary', 'error': str(e)})

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("🏥 MedAssist Backend Starting...")
    print(f"Vertex AI Gemini: {'✓ Configured' if gemini_client else '✗ Not configured'}")
    print(f"Firebase: {'✓ Connected' if db else '✗ Not connected'}")
    app.run(debug=True, host='0.0.0.0', port=5000)
