#!/bin/bash

# INTEGRO HEALTH FULLSCRIPT - LOCAL DEVELOPMENT STARTUP SCRIPT
# This script sets up and starts the local development environment

echo "🚀 Starting Integro Health Fullscript Backend Server..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
    echo ""
    echo "📝 Required configuration:"
    echo "   - FULLSCRIPT_CLIENT_SECRET (from Fullscript dashboard)"
    echo "   - SESSION_SECRET (generate a random string)"
    echo ""
    echo "🔧 Edit .env file and run this script again."
    exit 1
fi

# Check if required environment variables are set
if grep -q "your_client_secret_here" .env; then
    echo "❌ Please update FULLSCRIPT_CLIENT_SECRET in .env file"
    echo "   Get your client secret from: https://api-dashboard.fullscript.io/"
    exit 1
fi

if grep -q "your_local_session_secret_here" .env; then
    echo "❌ Please update SESSION_SECRET in .env file"
    echo "   Generate a random string for session security"
    exit 1
fi

echo "✅ Environment configuration looks good"

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the development server
echo "🚀 Starting development server..."
echo "   Server will run on: http://localhost:3000"
echo "   Health check: http://localhost:3000/health"
echo "   OAuth flow: http://localhost:3000/fs/oauth/authorize"
echo ""
echo "📝 Next steps:"
echo "   1. Test health check: curl http://localhost:3000/health"
echo "   2. Start OAuth flow: http://localhost:3000/fs/oauth/authorize"
echo "   3. Test session grant: curl http://localhost:3000/fs/session-grant"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev
