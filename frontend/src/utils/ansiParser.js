// Advanced ANSI escape sequence utilities for terminal emulation

// ANSI escape sequence regex patterns
const ANSI_ESCAPE_REGEX = /\x1b\[[0-9;]*[a-zA-Z]/g;
const ANSI_COLOR_REGEX = /\x1b\[([0-9;]*)m/g;
const ANSI_CURSOR_REGEX = /\x1b\[([0-9;]*)[HfABCD]/g;
const ANSI_CLEAR_REGEX = /\x1b\[([0-9]*)J/g;

// Enhanced ANSI color code mappings with hex values
const ANSI_COLORS = {
  30: '#000000', // black
  31: '#cd0000', // red
  32: '#00cd00', // green
  33: '#cdcd00', // yellow
  34: '#0000ee', // blue
  35: '#cd00cd', // magenta
  36: '#00cdcd', // cyan
  37: '#e5e5e5', // white
  90: '#7f7f7f', // bright black (gray)
  91: '#ff0000', // bright red
  92: '#00ff00', // bright green
  93: '#ffff00', // bright yellow
  94: '#5c5cff', // bright blue
  95: '#ff00ff', // bright magenta
  96: '#00ffff', // bright cyan
  97: '#ffffff'  // bright white
};

const ANSI_BG_COLORS = {
  40: '#000000', 41: '#cd0000', 42: '#00cd00', 43: '#cdcd00',
  44: '#0000ee', 45: '#cd00cd', 46: '#00cdcd', 47: '#e5e5e5',
  100: '#7f7f7f', 101: '#ff0000', 102: '#00ff00', 103: '#ffff00',
  104: '#5c5cff', 105: '#ff00ff', 106: '#00ffff', 107: '#ffffff'
};

/**
 * Parse ANSI escape sequences in terminal output with enhanced styling support
 * @param {string} text - Text containing ANSI escape sequences
 * @returns {Array} Array of text segments with styling information
 */
export const parseAnsi = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // First, handle control sequences that might clear screen or move cursor
  const controlResult = parseControlSequences(text);
  text = controlResult.text;

  const segments = [];
  let currentIndex = 0;
  let currentStyle = {
    color: null,
    backgroundColor: null,
    bold: false,
    dim: false,
    italic: false,
    underline: false,
    reverse: false,
    strikethrough: false
  };

  // Find all ANSI color/format sequences
  const matches = [...text.matchAll(ANSI_COLOR_REGEX)];
  
  if (matches.length === 0) {
    // No ANSI sequences found, return plain text
    return [{
      text: cleanText(text),
      style: { ...currentStyle },
      controls: controlResult.controls
    }];
  }

  for (const match of matches) {
    const beforeText = text.slice(currentIndex, match.index);
    
    // Add text segment before the ANSI code if it exists
    if (beforeText) {
      segments.push({
        text: cleanText(beforeText),
        style: { ...currentStyle }
      });
    }

    // Parse the ANSI code and update current style
    const codes = match[1].split(';').map(code => parseInt(code, 10) || 0);
    currentStyle = parseAnsiCodes(codes, currentStyle);
    
    currentIndex = match.index + match[0].length;
  }

  // Add remaining text after last ANSI code
  const remainingText = text.slice(currentIndex);
  if (remainingText) {
    segments.push({
      text: cleanText(remainingText),
      style: { ...currentStyle }
    });
  }

  // Add control information to first segment
  if (segments.length > 0) {
    segments[0].controls = controlResult.controls;
  }

  return segments;
};

/**
 * Parse individual ANSI codes and update style
 * @param {number[]} codes - Array of ANSI codes
 * @param {Object} currentStyle - Current style state
 * @returns {Object} Updated style state
 */
function parseAnsiCodes(codes, currentStyle) {
  const newStyle = { ...currentStyle };

  for (const code of codes) {
    switch (code) {
      case 0: // Reset all
        newStyle.color = null;
        newStyle.backgroundColor = null;
        newStyle.bold = false;
        newStyle.dim = false;
        newStyle.italic = false;
        newStyle.underline = false;
        newStyle.reverse = false;
        newStyle.strikethrough = false;
        break;
      
      case 1: // Bold
        newStyle.bold = true;
        break;
      
      case 2: // Dim
        newStyle.dim = true;
        break;
      
      case 3: // Italic
        newStyle.italic = true;
        break;
      
      case 4: // Underline
        newStyle.underline = true;
        break;
      
      case 7: // Reverse
        newStyle.reverse = true;
        break;
      
      case 9: // Strikethrough
        newStyle.strikethrough = true;
        break;
      
      case 21:
      case 22: // Normal intensity
        newStyle.bold = false;
        newStyle.dim = false;
        break;
      
      case 23: // Not italic
        newStyle.italic = false;
        break;
      
      case 24: // Not underlined
        newStyle.underline = false;
        break;
      
      case 27: // Not reversed
        newStyle.reverse = false;
        break;
      
      case 29: // Not strikethrough
        newStyle.strikethrough = false;
        break;
      
      case 39: // Default foreground color
        newStyle.color = null;
        break;
      
      case 49: // Default background color
        newStyle.backgroundColor = null;
        break;
      
      default:
        // Handle color codes
        if (ANSI_COLORS[code]) {
          newStyle.color = ANSI_COLORS[code];
        } else if (ANSI_BG_COLORS[code]) {
          newStyle.backgroundColor = ANSI_BG_COLORS[code];
        }
        break;
    }
  }

  return newStyle;
}

/**
 * Clean text by removing control characters and normalizing whitespace
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  return text
    // Remove any remaining ANSI sequences
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
    // Remove other control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Convert carriage returns
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Convert tabs to spaces
    .replace(/\t/g, '    ');
}

/**
 * Parse terminal control sequences (clear screen, cursor movement, etc.)
 * @param {string} text - Text with control sequences
 * @returns {Object} Control information and cleaned text
 */
function parseControlSequences(text) {
  const controls = {
    clearScreen: false,
    moveCursor: null,
    bell: false
  };
  
  let cleanedText = text;
  
  // Clear screen sequences
  if (/\x1b\[2J|\x1b\[H\x1b\[2J/.test(text)) {
    controls.clearScreen = true;
    cleanedText = cleanedText.replace(/\x1b\[2J|\x1b\[H\x1b\[2J/g, '');
  }
  
  // Cursor home
  if (/\x1b\[H/.test(text)) {
    controls.moveCursor = { row: 1, col: 1 };
    cleanedText = cleanedText.replace(/\x1b\[H/g, '');
  }
  
  // Bell character
  if (/\x07/.test(text)) {
    controls.bell = true;
    cleanedText = cleanedText.replace(/\x07/g, '');
  }
  
  return { controls, text: cleanedText };
}

/**
 * Convert parsed segments to React inline styles
 * @param {Array} segments - Parsed segments from parseAnsi
 * @returns {Array} Segments with React-compatible inline styles
 */
export const segmentsToReactStyles = (segments) => {
  return segments.map(segment => ({
    ...segment,
    reactStyle: {
      color: segment.style.color || '#00ff00',
      backgroundColor: segment.style.backgroundColor || 'transparent',
      fontWeight: segment.style.bold ? 'bold' : 'normal',
      fontStyle: segment.style.italic ? 'italic' : 'normal',
      textDecoration: [
        segment.style.underline ? 'underline' : '',
        segment.style.strikethrough ? 'line-through' : ''
      ].filter(Boolean).join(' ') || 'none',
      opacity: segment.style.dim ? 0.7 : 1,
      filter: segment.style.reverse ? 'invert(1)' : 'none'
    }
  }));
};

/**
 * Strip ANSI escape sequences from text
 * @param {string} text - Text containing ANSI escape sequences
 * @returns {string} Text with ANSI sequences removed
 */
export const stripAnsi = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text.replace(ANSI_ESCAPE_REGEX, '');
};

/**
 * Check if text contains ANSI escape sequences
 * @param {string} text - Text to check
 * @returns {boolean} True if text contains ANSI sequences
 */
export const hasAnsiSequences = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return ANSI_ESCAPE_REGEX.test(text);
};