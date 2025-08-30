#!/bin/bash

# LearnLinux Setup Script
echo "Setting up LearnLinux environment..."

# Check if firejail is installed
if ! command -v firejail &> /dev/null; then
    echo "Installing firejail for secure sandboxing..."
    sudo apt-get update
    sudo apt-get install -y firejail
else
    echo "Firejail is already installed."
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setup complete!"
echo ""
echo "To run the application:"
echo "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Then visit http://localhost:5173 to access the terminal"
