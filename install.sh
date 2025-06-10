#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 SysManager CODEX Install Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Determine the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Go to project root
cd "$PROJECT_ROOT" || exit 1

echo "🔍 Checking for Node.js and npm..."

if ! command -v node >/dev/null 2>&1; then
    echo "⚠️ Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js is installed: $(node -v)"
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm not found after installing Node.js. Exiting."
    exit 1
else
    echo "✅ npm is installed: $(npm -v)"
fi

echo "📦 Installing backend dependencies..."
if [ -d "$PROJECT_ROOT/backend" ]; then
    cd "$PROJECT_ROOT/backend" || exit 1
    npm install
else
    echo "❌ backend directory not found."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
if [ -d "$PROJECT_ROOT/frontend" ]; then
    cd "$PROJECT_ROOT/frontend" || exit 1
    npm install
else
    echo "❌ frontend directory not found."
    exit 1
fi

# Optional: Permissions
chmod +x "$PROJECT_ROOT/run_dev.sh"

echo "✅ CODEX setup complete!"
echo "➡️ To start development: ./run_dev.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
