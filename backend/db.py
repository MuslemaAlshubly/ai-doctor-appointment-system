import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["DoctorAppointmentApp"]

# Collections
admins = db["admins"]
doctors = db["doctors"]
patients = db["patients"]
appointments = db["appointments"]
settings = db["settings"]

# Initialize admin user if not exists
def init_admin():
    admin = admins.find_one({"email": "admin@example.com"})
    if not admin:
        admins.insert_one({
            "email": "admin@example.com",
            "password": "admin123",  # In production, this should be hashed
            "name": "System Administrator",
            "createdAt": datetime.now()
        })

# Initialize system settings if not exists
def init_settings():
    setting = settings.find_one({"_id": "system_settings"})
    if not setting:
        settings.insert_one({
            "_id": "system_settings",
            "clinicName": "AI Doctor Appointment System",
            "clinicEmail": "info@clinic.com",
            "clinicPhone": "+1-800-000-0000",
            "timezone": "UTC",
            "appointmentDuration": 30,
            "enableNotifications": True,
            "maintenanceMode": False,
            "createdAt": datetime.now()
        })

# Initialize demo patient if not exists
def init_patient():
    patient = patients.find_one({"email": "patient@example.com"})
    if not patient:
        patients.insert_one({
            "email": "patient@example.com",
            "password": "patient123",
            "name": "John Doe",
            "phone": "+1-555-0123",
            "dateOfBirth": "1990-01-15",
            "gender": "Male",
            "address": "123 Main Street, City, Country",
            "medicalHistory": "No known allergies",
            "createdAt": datetime.now()
        })

# Initialize database
def init_db():
    init_admin()
    init_settings()
    init_patient()
