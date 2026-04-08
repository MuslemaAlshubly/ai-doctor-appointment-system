#!/bin/bash

# Start Admin Dashboard Development Environment

echo ""
echo "============================================"
echo " AI Doctor Appointment System - Admin Dashboard"
echo "============================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"
echo "[OK] Python found: $(python3 --version)"
echo ""
echo "Starting Admin Dashboard Components..."
echo ""

# Install backend dependencies if needed
if [ ! -d "backend/__pycache__" ]; then
    echo "[INFO] Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing Node dependencies..."
    npm install
fi

echo ""
echo "============================================"
echo "Starting Backend Server (Flask)..."
echo "============================================"
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "============================================"
echo "Starting Frontend Server (React)..."
echo "============================================"
npm start &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo " Services Starting..."
echo "============================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Dashboard URL: http://localhost:3000"
echo ""
echo "Login Credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait
