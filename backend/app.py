from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from functools import wraps
from db import db, admins, doctors, patients, appointments, settings, init_db
from bson.objectid import ObjectId
import bcrypt
import os
import google.generativeai as genai

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager(app)

# Initialize database
init_db()

# Helper functions
def serialize_document(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    """Verify password using bcrypt"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ==================== BASIC ROUTES ====================
@app.route('/')
def home():
    return jsonify({'message': 'AI Doctor Appointment System API'})

@app.route('/health')
def health():
    return jsonify({'status': 'OK'})

# ==================== AUTHENTICATION ROUTES ====================
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    admin = admins.find_one({'email': data['email']})
    
    if not admin or admin.get('password') != data.get('password'):
        # For demo purposes, we're doing simple string comparison
        # In production, use proper password hashing
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = create_access_token(identity=str(admin['_id']))
    
    return jsonify({
        'token': token,
        'adminName': admin.get('name', 'Admin'),
        'adminEmail': admin.get('email')
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Admin logout endpoint"""
    return jsonify({'message': 'Logged out successfully'}), 200

# ==================== PATIENT AUTHENTICATION ====================
@app.route('/api/patient/register', methods=['POST'])
def patient_register():
    """Patient registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name', 'phone']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if patient already exists
        if patients.find_one({'email': data['email']}):
            return jsonify({'message': 'Patient already exists'}), 409
        
        # Create new patient
        patient_data = {
            'email': data['email'],
            'password': data['password'],  # In production, hash this!
            'name': data['name'],
            'phone': data['phone'],
            'dateOfBirth': data.get('dateOfBirth', ''),
            'gender': data.get('gender', ''),
            'address': data.get('address', ''),
            'medicalHistory': data.get('medicalHistory', ''),
            'createdAt': datetime.now()
        }
        
        result = patients.insert_one(patient_data)
        
        return jsonify({
            'message': 'Patient registered successfully',
            'patientId': str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patient/login', methods=['POST'])
def patient_login():
    """Patient login endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        patient = patients.find_one({'email': data['email']})
        
        if not patient or patient.get('password') != data.get('password'):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        token = create_access_token(identity=str(patient['_id']))
        
        return jsonify({
            'token': token,
            'patientId': str(patient['_id']),
            'patientName': patient.get('name'),
            'patientEmail': patient.get('email')
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patient/me', methods=['GET'])
@jwt_required()
def get_current_patient():
    """Get current logged-in patient info"""
    try:
        patient_id = get_jwt_identity()
        patient = patients.find_one({'_id': ObjectId(patient_id)})
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify(serialize_document(patient)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== AI ROUTES ====================
@app.route('/api/ai/analyze-symptoms', methods=['POST'])
@jwt_required()
def analyze_symptoms():
    """Analyze patient symptoms using Google Gemini AI"""
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', '')
        duration = data.get('duration', '')
        severity = data.get('severity', 'moderate')
        
        if not symptoms:
            return jsonify({'error': 'Symptoms are required'}), 400
        
        # Configure Gemini AI
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your_gemini_api_key_here':
            # Return demo response if API key not configured
            return jsonify({
                'analysis': 'This is a demo analysis. To enable AI-powered symptom analysis, please configure your GEMINI_API_KEY in the .env file.\n\nBased on your description of ' + symptoms + ', we recommend consulting with a general practitioner or specialist.',
                'recommendedSpecialization': 'General Practice'
            }), 200
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt for Gemini
        prompt = f"""You are a medical advisor AI. A patient is describing their symptoms for a doctor consultation.

Patient Symptoms: {symptoms}
Duration: {duration if duration else 'Not specified'}
Severity: {severity}

Please provide:
1. A brief analysis of the symptoms
2. Possible medical conditions to consider
3. Which medical specialists might be helpful

Format your response clearly and remind them to consult a qualified doctor for proper diagnosis.

Also suggest which type of doctor specialization would be most appropriate (e.g., General Practice, Cardiology, Neurology, Orthopedics, Dermatology, ENT, Pediatrics, etc.)"""

        response = model.generate_content(prompt)
        analysis_text = response.text
        
        # Extract recommended specialization from the analysis
        recommended_spec = 'General Practice'
        
        # Try to identify specialization from response
        if 'Cardiology' in analysis_text or 'cardiologist' in analysis_text.lower():
            recommended_spec = 'Cardiology'
        elif 'Neurology' in analysis_text or 'neurologist' in analysis_text.lower():
            recommended_spec = 'Neurology'
        elif 'Orthopedic' in analysis_text or 'orthopedist' in analysis_text.lower():
            recommended_spec = 'Orthopedics'
        elif 'Dermatology' in analysis_text or 'dermatologist' in analysis_text.lower():
            recommended_spec = 'Dermatology'
        elif 'ENT' in analysis_text or 'otolaryngologist' in analysis_text.lower():
            recommended_spec = 'ENT'
        elif 'Pediatric' in analysis_text or 'pediatrician' in analysis_text.lower():
            recommended_spec = 'Pediatrics'
        elif 'Gastro' in analysis_text or 'gastroenterologist' in analysis_text.lower():
            recommended_spec = 'Gastroenterology'
        elif 'Pulmonology' in analysis_text or 'pulmonologist' in analysis_text.lower() or 'respiratory' in analysis_text.lower():
            recommended_spec = 'Pulmonology'
        
        return jsonify({
            'analysis': analysis_text,
            'recommendedSpecialization': recommended_spec
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== DOCTORS ROUTES ====================
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    """Get all doctors (public endpoint for patient portal)"""
    try:
        docs = list(doctors.find())
        return jsonify([serialize_document(doc) for doc in docs]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors/<doctor_id>', methods=['GET'])
@jwt_required()
def get_doctor(doctor_id):
    """Get specific doctor"""
    try:
        doc = doctors.find_one({'_id': ObjectId(doctor_id)})
        if not doc:
            return jsonify({'error': 'Doctor not found'}), 404
        return jsonify(serialize_document(doc)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    """Create new doctor"""
    try:
        data = request.get_json()
        
        doctor_data = {
            'name': data.get('name', ''),
            'email': data.get('email', ''),
            'phone': data.get('phone', ''),
            'specialization': data.get('specialization', ''),
            'licenseNumber': data.get('licenseNumber', ''),
            'yearsOfExperience': int(data.get('yearsOfExperience', 0)),
            'isActive': True,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = doctors.insert_one(doctor_data)
        doctor_data['_id'] = str(result.inserted_id)
        
        return jsonify(doctor_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors/<doctor_id>', methods=['PUT'])
@jwt_required()
def update_doctor(doctor_id):
    """Update doctor"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.now()
        
        result = doctors.update_one(
            {'_id': ObjectId(doctor_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Doctor not found'}), 404
        
        return jsonify({'message': 'Doctor updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctors/<doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    """Delete doctor"""
    try:
        result = doctors.delete_one({'_id': ObjectId(doctor_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Doctor not found'}), 404
        
        return jsonify({'message': 'Doctor deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== APPOINTMENTS ROUTES ====================
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get all appointments"""
    try:
        appts = list(appointments.find().sort('appointmentDate', -1))
        return jsonify([serialize_document(apt) for apt in appts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    """Get specific appointment"""
    try:
        apt = appointments.find_one({'_id': ObjectId(appointment_id)})
        if not apt:
            return jsonify({'error': 'Appointment not found'}), 404
        return jsonify(serialize_document(apt)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    """Create new appointment"""
    try:
        data = request.get_json()
        
        appointment_data = {
            'patientName': data.get('patientName', ''),
            'patientEmail': data.get('patientEmail', ''),
            'patientPhone': data.get('patientPhone', ''),
            'doctorName': data.get('doctorName', ''),
            'doctorId': data.get('doctorId', ''),
            'appointmentDate': datetime.fromisoformat(data.get('appointmentDate')),
            'reason': data.get('reason', ''),
            'status': 'pending',
            'notes': data.get('notes', ''),
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = appointments.insert_one(appointment_data)
        appointment_data['_id'] = str(result.inserted_id)
        appointment_data['appointmentDate'] = appointment_data['appointmentDate'].isoformat()
        
        return jsonify(appointment_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    """Update appointment"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.now()
        
        result = appointments.update_one(
            {'_id': ObjectId(appointment_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Appointment not found'}), 404
        
        return jsonify({'message': 'Appointment updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>/status', methods=['PATCH'])
@jwt_required()
def update_appointment_status(appointment_id):
    """Update appointment status"""
    try:
        data = request.get_json()
        
        result = appointments.update_one(
            {'_id': ObjectId(appointment_id)},
            {'$set': {'status': data.get('status'), 'updatedAt': datetime.now()}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Appointment not found'}), 404
        
        return jsonify({'message': 'Appointment status updated'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    """Delete appointment"""
    try:
        result = appointments.delete_one({'_id': ObjectId(appointment_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Appointment not found'}), 404
        
        return jsonify({'message': 'Appointment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== PATIENTS ROUTES ====================
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    """Get all patients"""
    try:
        pts = list(patients.find())
        return jsonify([serialize_document(pt) for pt in pts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    """Get specific patient"""
    try:
        pt = patients.find_one({'_id': ObjectId(patient_id)})
        if not pt:
            return jsonify({'error': 'Patient not found'}), 404
        return jsonify(serialize_document(pt)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['POST'])
@jwt_required()
def create_patient():
    """Create new patient"""
    try:
        data = request.get_json()
        
        patient_data = {
            'name': data.get('name', ''),
            'email': data.get('email', ''),
            'phone': data.get('phone', ''),
            'dateOfBirth': data.get('dateOfBirth', ''),
            'gender': data.get('gender', ''),
            'medicalHistory': data.get('medicalHistory', ''),
            'isActive': True,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = patients.insert_one(patient_data)
        patient_data['_id'] = str(result.inserted_id)
        
        return jsonify(patient_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    """Update patient"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.now()
        
        result = patients.update_one(
            {'_id': ObjectId(patient_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify({'message': 'Patient updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    """Delete patient"""
    try:
        result = patients.delete_one({'_id': ObjectId(patient_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify({'message': 'Patient deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== DASHBOARD ROUTES ====================
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        total_doctors = doctors.count_documents({})
        total_appointments = appointments.count_documents({})
        total_patients = patients.count_documents({})
        completed_appointments = appointments.count_documents({'status': 'completed'})
        
        return jsonify({
            'totalDoctors': total_doctors,
            'totalAppointments': total_appointments,
            'totalPatients': total_patients,
            'completedAppointments': completed_appointments
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/recent-appointments', methods=['GET'])
@jwt_required()
def get_recent_appointments():
    """Get recent appointments for dashboard"""
    try:
        recent = list(appointments.find().sort('createdAt', -1).limit(10))
        return jsonify([serialize_document(apt) for apt in recent]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== SETTINGS ROUTES ====================
@app.route('/api/settings', methods=['GET'])
@jwt_required()
def get_settings():
    """Get system settings"""
    try:
        sys_settings = settings.find_one({'_id': 'system_settings'})
        if not sys_settings:
            return jsonify({'error': 'Settings not found'}), 404
        
        # Remove the _id field from response
        sys_settings.pop('_id', None)
        return jsonify(sys_settings), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update system settings"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.now()
        
        result = settings.update_one(
            {'_id': 'system_settings'},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Settings not found'}), 404
        
        return jsonify({'message': 'Settings updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ERROR HANDLERS ====================
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
