# Learn Linux - Interactive Terminal Frontend

A modern, interactive web-based Linux terminal for learning command-line skills.

## Features

### Awesome UI Design
- **Landing Page**: Beautiful gradient background with animated particles and typing effects
- **Interactive Terminal**: Real terminal experience with proper ANSI color support
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Animations**: Smooth transitions and hover effects

### Terminal Features
- **Real-time Command Execution**: Execute actual Linux commands
- **ANSI Color Support**: Full support for terminal colors and formatting
- **Command History**: Navigate through previous commands with arrow keys
- **Text Selection**: Copy terminal output
- **Resizable Interface**: Minimize, maximize, and close terminal window
- **Connection Status**: Visual indicators for WebSocket connection

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local server URL

### How to Use

1. **Landing Page**: Click "Start Learning" to open the terminal
2. **Terminal Interface**: 
   - Type Linux commands and press Enter
   - Use arrow keys to navigate command history
   - Use Ctrl+C to interrupt running commands
   - Use Ctrl+L to clear the screen
   - Click window controls to minimize/maximize/close

### Technical Stack

- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **WebSocket**: Real-time communication with backend

### Project Structure

```
src/
├── components/
│   ├── Landing/
│   │   └── LandingPage.jsx      # Main landing page
│   ├── Terminal/
│   │   ├── Terminal.jsx         # Core terminal component
│   │   ├── TerminalContainer.jsx # Terminal window wrapper
│   │   ├── TerminalOutput.jsx   # Output display
│   │   ├── TerminalLine.jsx     # Individual line rendering
│   │   └── TerminalCursor.jsx   # Cursor component
│   ├── UI/
│   │   └── ErrorBoundary.jsx    # Error handling
│   └── Icons/
│       └── SimpleIcons.jsx      # Fallback icons
├── hooks/
│   ├── useWebSocket.js          # WebSocket connection
│   ├── useTerminalState.js      # Terminal state management
│   ├── useCommandHistory.js     # Command history
│   └── useKeyboardHandler.js    # Keyboard input handling
├── utils/
│   ├── ansiParser.js           # ANSI escape sequence parsing
│   ├── constants.js            # App constants
│   └── terminalUtils.js        # Terminal utilities
└── styles/
    └── terminal.css            # Terminal-specific styles
```

### Design Features

- **Gradient Backgrounds**: Beautiful color gradients
- **Particle Effects**: Animated background elements
- **Typing Animation**: Realistic typing effect on landing page
- **Glassmorphism**: Modern glass-like UI elements
- **Dark Theme**: Easy on the eyes terminal interface
- **Smooth Animations**: CSS transitions and transforms

### Customization

The UI is highly customizable through:
- **Tailwind CSS**: Modify colors, spacing, and layout
- **CSS Variables**: Easy theme customization
- **Component Props**: Configurable terminal behavior
- **ANSI Colors**: Full terminal color palette support