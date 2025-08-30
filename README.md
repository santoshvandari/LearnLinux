# LearnLinux - Interactive Terminal Learning Environment

![LearnLinux](https://img.shields.io/badge/LearnLinux-v2.0-green)
![React](https://img.shields.io/badge/React-18+-blue)
![Django](https://img.shields.io/badge/Django-5.2+-green)
![WebSocket](https://img.shields.io/badge/WebSocket-Supported-orange)

A modern, interactive web-based Linux terminal simulator designed for learning Linux commands in a safe, sandboxed environment.

## ✨ Features

### 🎨 Modern UI
- **Beautiful Landing Page**: Animated gradients, floating command particles, and smooth transitions
- **Professional Terminal Interface**: Modern terminal window with authentic macOS-style controls
- **Real-time ANSI Support**: Full color support with proper ANSI escape sequence parsing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🔒 Security
- **Sandboxed Environment**: Uses Firejail for secure command execution
- **Isolated Workspace**: Each session gets its own temporary workspace
- **No Network Access**: Terminal sessions are network-isolated for security
- **Fallback Mode**: Graceful fallback when sandboxing is unavailable

### 💻 Terminal Features
- **Real Terminal Emulation**: Authentic Linux terminal experience
- **ANSI Color Support**: Full color terminal with proper escape sequence handling
- **Command History**: Navigate through command history with arrow keys
- **Tab Completion**: (Coming soon)
- **Multi-session Support**: Each browser tab gets its own terminal session

### 🚀 Technical Features
- **WebSocket Communication**: Real-time bidirectional communication
- **Advanced ANSI Parser**: Handles complex terminal output with colors and formatting
- **Optimized Performance**: Efficient terminal output handling and memory management
- **Error Handling**: Graceful error handling and connection recovery

## 🛠 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Linux environment (recommended)
- Firejail (optional, for enhanced security)

### Quick Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/santoshvandari/LearnLinux.git
   cd LearnLinux
   ```

2. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Install Firejail (Optional but Recommended)
```bash
# Ubuntu/Debian
sudo apt-get install firejail

# CentOS/RHEL
sudo yum install firejail

# Arch Linux
sudo pacman -S firejail
```

## 🚀 Usage

### Starting the Application

1. **Start the Backend:**
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open in Browser:**
   Visit `http://localhost:5173` in your web browser.

### Using the Terminal

1. **Click "Start Learning Now"** on the landing page
2. **Type Linux commands** in the terminal (e.g., `ls`, `pwd`, `whoami`)
3. **Explore the sandbox** - try creating files and directories
4. **Use command history** with up/down arrow keys
5. **Clear screen** with `Ctrl+L` or `clear` command

### Available Commands
The terminal supports standard Linux commands including:
- File operations: `ls`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`
- Navigation: `cd`, `pwd`
- System info: `whoami`, `id`, `uname`
- Text processing: `grep`, `sort`, `uniq`, `wc`
- And many more standard Unix utilities!

## 🏗 Architecture

### Frontend (React + Vite)
- **Landing Page**: Modern, animated introduction page
- **Terminal Container**: Professional terminal window interface
- **Terminal Engine**: Real-time WebSocket-based terminal emulation
- **ANSI Parser**: Advanced parsing of terminal escape sequences
- **State Management**: Efficient terminal state and history management

### Backend (Django + Channels)
- **WebSocket Consumer**: Handles real-time terminal communication
- **Sandbox Manager**: Manages isolated terminal sessions
- **Security Layer**: Implements sandboxing with Firejail
- **Session Management**: Handles multiple concurrent terminal sessions

## 🎨 UI/UX Improvements

### Landing Page
- **Animated Background**: Beautiful gradient backgrounds with floating particles
- **Typing Animation**: Animated title with typewriter effect
- **Feature Grid**: Modern feature showcase with hover effects
- **Terminal Preview**: Interactive terminal preview window
- **Responsive Layout**: Optimized for all device sizes

### Terminal Interface
- **Authentic Design**: macOS-style terminal window with traffic light controls
- **Status Indicators**: Connection status, session info, and environment details
- **Enhanced Typography**: JetBrains Mono font for optimal code readability
- **Color Scheme**: Professional dark theme with proper ANSI colors
- **Smooth Animations**: Subtle transitions and hover effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Terminal not connecting:**
- Check that both backend and frontend are running
- Verify WebSocket URL in constants.js
- Check browser console for errors

**Commands not working:**
- Ensure Firejail is installed and configured
- Check backend logs for error messages
- Verify workspace permissions

**ANSI colors not displaying:**
- Check terminal CSS is loaded properly
- Verify ANSI parser is working correctly
- Test with simple color commands like `ls --color=always`

## 🚀 Future Enhancements

- [ ] Tab completion support
- [ ] File upload/download functionality
- [ ] Terminal themes and customization
- [ ] Multi-pane terminal support
- [ ] Integration with learning modules
- [ ] Command documentation and hints
- [ ] Progress tracking and achievements

---

**Made with ❤️ for Linux enthusiasts and learners everywhere**