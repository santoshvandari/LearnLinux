// Terminal helper functions

/**
 * Generate unique session ID for WebSocket connection
 */
export const generateSessionId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomPart}`;
};

/**
 * Format terminal prompt
 */
export const formatPrompt = (user = 'user', hostname = 'localhost', path = '~') => {
  return `${user}@${hostname}:${path}$ `;
};

/**
 * Validate command input
 */
export const validateCommand = (command) => {
  if (!command || typeof command !== 'string') {
    return false;
  }
  
  // Check length limits
  if (command.length === 0 || command.length > 10000) {
    return false;
  }
  
  // Allow most characters but prevent some dangerous patterns
  // This is basic validation - the backend should do proper security checks
  const dangerousPatterns = [
    /\x00/g, // Null bytes
    /[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g // Other control characters except \t, \n, \r
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Sanitize user input for display
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove or replace dangerous characters
  return input
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars except \t, \n, \r
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n');
};

/**
 * Calculate terminal dimensions based on container size
 */
export const calculateTerminalDimensions = (containerWidth, containerHeight, fontSize = 14) => {
  // Approximate character dimensions for monospace fonts
  const charWidth = fontSize * 0.6; // Rough estimate
  const lineHeight = fontSize * 1.2;
  
  const cols = Math.floor(containerWidth / charWidth);
  const rows = Math.floor(containerHeight / lineHeight);
  
  return {
    cols: Math.max(20, cols), // Minimum 20 columns
    rows: Math.max(5, rows)   // Minimum 5 rows
  };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format timestamp for terminal display
 */
export const formatTimestamp = (date = new Date()) => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Check if terminal is focused
 */
export const isTerminalFocused = () => {
  const activeElement = document.activeElement;
  return activeElement && (
    activeElement.classList.contains('terminal-container') ||
    activeElement.closest('.terminal-container')
  );
};

/**
 * Scroll element to bottom
 */
export const scrollToBottom = (element) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

/**
 * Check if element is scrolled to bottom
 */
export const isScrolledToBottom = (element, threshold = 10) => {
  if (!element) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollTop + clientHeight >= scrollHeight - threshold;
};