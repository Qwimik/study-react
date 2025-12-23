#!/bin/bash

echo "Checking Node.js version..."
CURRENT_VERSION=$(node --version)
echo "Current version: $CURRENT_VERSION"

if [[ "$CURRENT_VERSION" != v24* ]]; then
    echo ""
    echo "⚠️  This project requires Node.js v24.11.0 or higher"
    echo ""

    if command -v nvm &> /dev/null; then
        echo "NVM detected. Switching to Node.js v24.11.0..."
        echo ""
        echo "Run the following commands:"
        echo "  source ~/.nvm/nvm.sh"
        echo "  nvm use 24.11.0"
        echo "  npm install"
        echo "  npm run dev"
    else
        echo "Please install Node.js v24.11.0 or higher"
        echo "Download from: https://nodejs.org/"
    fi
    exit 1
else
    echo "✅ Node.js version is compatible"
    echo ""
    echo "Installing dependencies..."
    npm install
    echo ""
    echo "Starting development server..."
    npm run dev
fi

