@echo off
REM Start Admin Dashboard Development Environment

REM Colors for console output
color 0A

echo.
echo ============================================
echo  AI Doctor Appointment System - Admin Dashboard
echo ============================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

echo [OK] Python found: 
python --version

echo.
echo Starting Admin Dashboard Components...
echo.

REM Install backend dependencies if needed
if not exist "backend\__pycache__" (
    echo [INFO] Installing Python dependencies...
    pip install -r requirements.txt
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing Node dependencies...
    call npm install
)

echo.
echo ============================================
echo Starting Backend Server (Flask)...
echo ============================================
start "Backend Server" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak

echo.
echo ============================================
echo Starting Frontend Server (React)...
echo ============================================
start "Frontend Server" cmd /k "npm start"

echo.
echo ============================================
echo  Services Starting...
echo ============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Dashboard URL: http://localhost:3000
echo.
echo Login Credentials:
echo   Email: admin@example.com
echo   Password: admin123
echo.
echo Press Ctrl+C in either window to stop the service
echo.
pause
