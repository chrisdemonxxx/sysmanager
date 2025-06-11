# CODEX - SysManager

## 🧱 Tech Stack
- Backend: Node.js (Express)
- Frontend: React + Tailwind + Vite

## ✨ Features
- JWT authentication with role-based access
- Register/login with JWT stored on frontend
- Task scheduler API with cron syntax
- System and task logs with filtering
- Real-time system stats via WebSocket

## 🚀 Setup

```bash
chmod +x install.sh run_dev.sh
./install.sh
```

Copy `env.template` to `.env` and adjust ports or secrets as needed.

## ▶️ Run Dev Servers

```bash
./run_dev.sh
```

Frontend → http://localhost:5173  
Backend → http://localhost:3000
