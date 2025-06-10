#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting SysManager CODEX Dev Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Set script's actual directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "[*] Starting backend (http://localhost:3000)..."
cd "$SCRIPT_DIR/backend" || { echo "❌ backend directory not found."; exit 1; }
npm run dev &

echo "[*] Starting frontend (http://localhost:5173)..."
cd "$SCRIPT_DIR/frontend" || { echo "❌ frontend directory not found."; exit 1; }
npm run dev
