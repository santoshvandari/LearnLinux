// Terminal constants and configuration

// WebSocket configuration
export const WEBSOCKET_URL = 'ws://localhost:8000/ws/terminal/';
export const RECONNECT_INTERVAL = 3000; // 3 seconds
export const MAX_RECONNECT_ATTEMPTS = 5;

// Terminal configuration
export const DEFAULT_TERMINAL_WIDTH = 80;
export const DEFAULT_TERMINAL_HEIGHT = 24;
export const MAX_HISTORY_SIZE = 1000;
export const MAX_OUTPUT_LINES = 10000;

// Terminal colors (ANSI color codes)
export const TERMINAL_COLORS = {
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  yellow: '#ffff00',
  blue: '#0000ff',
  magenta: '#ff00ff',
  cyan: '#00ffff',
  white: '#ffffff',
  brightBlack: '#808080',
  brightRed: '#ff8080',
  brightGreen: '#80ff80',
  brightYellow: '#ffff80',
  brightBlue: '#8080ff',
  brightMagenta: '#ff80ff',
  brightCyan: '#80ffff',
  brightWhite: '#ffffff'
};

// Terminal theme
export const TERMINAL_THEME = {
  backgroundColor: '#000000',
  foregroundColor: '#00ff00',
  cursorColor: '#00ff00',
  selectionColor: '#ffffff33'
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  INTERRUPT: 'Ctrl+C',
  CLEAR_SCREEN: 'Ctrl+L',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  HISTORY_UP: 'ArrowUp',
  HISTORY_DOWN: 'ArrowDown',
  CURSOR_LEFT: 'ArrowLeft',
  CURSOR_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End'
};

// Message types for WebSocket communication
export const MESSAGE_TYPES = {
  INPUT: 'input',
  OUTPUT: 'output',
  ECHO: 'echo',
  ERROR: 'error'
};