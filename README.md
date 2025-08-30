# LearnLinux - Interactive Terminal Learning Platform

A modern, secure web-based Linux terminal simulator designed for safe learning and experimentation. Students can practice Linux commands in isolated Docker containers without affecting the host system or other users.

## Core Concept

**Maximum Freedom + Perfect Isolation** - Users can execute almost any command, even destructive ones, within their own isolated sandbox environment. Each session runs in a separate Docker container that's destroyed after use.

## Features

### **Security & Isolation**
- **Docker Container Isolation**: Each user session runs in a separate, isolated container
- **Temporary Workspaces**: Fresh filesystem for each session, automatically destroyed
- **Resource Limits**: CPU, memory, and disk usage controls
- **Multi-User Safe**: Users cannot see or affect each other's sessions
- **Host Protection**: Complete isolation from the host system

### **Terminal Experience**
- **Real Linux Commands**: Execute actual bash commands and programs
- **Full Command Support**: Programming languages, text editors, system tools
- **ANSI Color Support**: Proper terminal colors and formatting
- **Command History**: Arrow key navigation through previous commands
- **Text Selection**: Copy terminal output with mouse selection
- **Keyboard Shortcuts**: Standard terminal shortcuts (Ctrl+C, Ctrl+L, etc.)

### **Learning Environment**
- **Comprehensive File Structure**: Realistic Linux directory layout
- **Sample Files**: Pre-configured examples and tutorials
- **Programming Ready**: Python, shell scripts, and development tools
- **Educational Content**: Built-in tutorials and command examples

## Tech Stack

### Backend
- **Django 5.2.5** - Web framework
- **Django Rest Framework 3.16.1** - REST API framework
- **Django Channels** - WebSocket support for real-time terminal
- **Python 3.11** - Runtime environment
- **Docker** - Containerization and isolation
- **PTY** - Pseudo-terminal for authentic shell experience

### Frontend  
- **React 19.1.1** - Modern UI framework with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first styling
- **WebSocket** - Real-time communication
- **Heroicons** - Beautiful SVG icons

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- Node.js

### 1. Clone Repository
```bash
git clone https://github.com/santoshvandari/LearnLinux.git
cd LearnLinux
```

### 2. Start Backend (Docker)
```bash
cd backend
docker-compose up --build
```

The backend will be available at `http://localhost:8000` or `http://127.0.0.1:8000`

### 3. Start Frontend (Development)
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` or `http://127.0.0.1:5173`

## Docker Deployment

### Backend Only (Production Ready)
```bash
cd backend

# Build the image
docker build -t learn-linux .

# Run with Docker Compose (recommended)
docker-compose up -d

# Or run directly
docker run -d \
  -p 8000:8000 \
  --name learn-linux \
  --security-opt no-new-privileges:true \
  --cap-drop ALL \
  --cap-add SETUID --cap-add SETGID --cap-add SYS_ADMIN \
  learn-linux
```

### Frontend Build for Production
```bash
cd frontend
npm run build
# Serve the dist/ folder with your web server
```

## How It Works

### Session Flow
1. **User connects** → Frontend generates unique session ID
2. **WebSocket established** → Real-time communication channel created
3. **Container spawned** → Isolated Docker environment with temporary workspace
4. **Commands executed** → PTY forwards commands to shell in container
5. **Session ends** → Container destroyed, all data cleaned up

### Security Architecture
```
User Input → Frontend Validation → WebSocket → Django Consumer 
    ↓
Docker Container (Isolated) → Shell Process → Command Execution
    ↓
Output → PTY → WebSocket → Frontend Display
```

### File Structure
```
LearnLinux/
├── backend/                    # Django backend
│   ├── core/                  # Django settings and configuration
│   ├── terminal/              # WebSocket consumer and terminal logic
│   ├── Dockerfile             # Container configuration
│   ├── docker-compose.yml     # Service orchestration
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── styles/           # CSS styling
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # This file
```

## Configuration

### Environment Variables
```bash
# Backend (.env)
DJANGO_DEVELOPMENT=False       # Set to True for development
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Frontend (.env)
VITE_BACKEND_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Security Settings
- **Container Limits**: 1GB RAM, 1 hour timeout, 50 processes max
- **Network**: Isolated container networking
- **Filesystem**: Temporary workspaces with automatic cleanup
- **Commands**: Flexible filtering with education-friendly permissions

## Educational Use Cases

### Perfect For:
- **Linux Command Learning**: Safe environment for beginners
- **System Administration Practice**: Try dangerous commands safely  
- **DevOps Learning**: Practice containerization and deployment

### Example Learning Scenarios:
```bash
# File system exploration
ls -la
cd Documents/
cat welcome.txt

# System monitoring
ps aux
top
free -m
df -h

# Text processing
grep "Linux" *.txt
awk '{print $1}' sample.log
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies for optimal learning experience
- Inspired by the need for safe Linux command practice environments
- Designed with security and education as top priorities

---

**⚠️ Note**: This is an educational platform. While designed with security best practices, always run in isolated environments for production deployments.
