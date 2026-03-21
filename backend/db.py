import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("mongodb+srv://60104837:12class34@cluster0.jn7slfy.mongodb.net/"))
db = client["DoctorAppointmentApp"]