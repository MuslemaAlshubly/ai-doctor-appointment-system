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

# Initialize database
def init_db():
    init_admin()
    init_settings()
