#!/bin/bash
# MedAssist Quick Start Script for macOS/Linux

echo ""
echo "===================================="
echo "  MedAssist - Local Development"
echo "===================================="
echo ""

# Check if directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: backend or frontend directory not found!"
    echo "Please run this script from the MedAssist root directory."
    exit 1
fi

echo "Starting MedAssist..."
echo ""

# Start Backend
echo "[1/2] Starting Backend (Python Flask)..."
cd backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements if needed
if ! python -c "import flask" 2>/dev/null; then
    echo "Installing requirements..."
    pip install -r requirements.txt
fi

echo "Virtual environment activated"
echo ""
echo "✓ Backend starting on http://localhost:5000"
echo ""

# Start Flask in background
python app.py &
BACKEND_PID=$!

cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo "[2/2] Starting Frontend (React Vite)..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "✓ Frontend starting on http://localhost:3000"
echo ""
echo "===================================="
echo "  Setup Complete!"
echo "===================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Opening in browser..."

# Open in default browser
if command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open http://localhost:3000
elif command -v open >/dev/null 2>&1; then
    # macOS
    open http://localhost:3000
fi

# Start dev server (foreground)
npm run dev

# Kill backend process on exit
trap "kill $BACKEND_PID" EXIT
