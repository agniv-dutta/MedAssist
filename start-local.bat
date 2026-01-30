@echo off
REM MedAssist Quick Start Script for Windows

echo.
echo ====================================
echo   MedAssist - Local Development
echo ====================================
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo Error: backend directory not found!
    echo Please run this script from the MedAssist root directory.
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo Error: frontend directory not found!
    echo Please run this script from the MedAssist root directory.
    pause
    exit /b 1
)

echo Starting MedAssist...
echo.

REM Start Backend
echo [1/2] Starting Backend (Python Flask)...
cd backend

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv and start
call venv\Scripts\activate.bat
echo Virtual environment activated

REM Check if requirements installed
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing requirements...
    pip install -r requirements.txt
)

echo.
echo ✓ Backend starting on http://localhost:5000
echo.
REM Start Flask in new window
start cmd /k "cd %cd% && venv\Scripts\activate.bat && python app.py"

cd ..

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start Frontend
echo [2/2] Starting Frontend (React Vite)...
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo.
echo ✓ Frontend starting on http://localhost:3000
echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Enter to open in browser...
pause

REM Open in browser
start http://localhost:3000

REM Start dev server
call npm run dev

pause
