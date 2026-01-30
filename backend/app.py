import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Firebase
FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase-key.json')
if os.path.exists(FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    db = None
    print("⚠️  Firebase credentials not found. Database features disabled.")

# Gemini Conversation System Prompt
SYSTEM_PROMPT = """You are a medical triage AI assistant for rural healthcare in India. Your role is to:
- Ask relevant follow-up questions to understand symptoms better
- Assess severity level (Emergency / Consult Soon / Home Care / Monitor)
- Provide clear next steps and recommendations
- Identify red flag symptoms requiring immediate care
- Give first-aid advice for minor issues
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
    except:
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

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'MedAssist backend is running'})

@app.route('/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    """Main endpoint for symptom analysis using Gemini"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        symptoms = data.get('symptoms')
        conversation_history = data.get('conversationHistory', [])
        
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400
        
        # Build conversation context
        conversation_context = prepare_conversation_context(conversation_history)
        
        # Create prompt for Gemini
        user_input = f"Patient symptom input: {symptoms}"
        
        # Use Gemini API for analysis
        model = genai.GenerativeModel('gemini-pro')
        
        full_conversation = conversation_context + f"Patient: {symptoms}\n\nAssistant: "
        
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\nConversation:\n{full_conversation}"
        )
        
        # Parse response
        result = parse_gemini_response(response.text)
        
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
    print(f"Gemini API: {'✓ Configured' if GEMINI_API_KEY else '✗ Not configured'}")
    print(f"Firebase: {'✓ Connected' if db else '✗ Not connected'}")
    app.run(debug=True, host='0.0.0.0', port=5000)
