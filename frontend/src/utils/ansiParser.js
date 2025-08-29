// ANSI escape sequence utilities

// ANSI escape sequence regex patterns
const ANSI_ESCAPE_REGEX = /\x1b\[[0-9;]*[a-zA-Z]/g;
const ANSI_COLOR_REGEX = /\x1b\[([0-9;]*)m/g;
const ANSI_CURSOR_REGEX = /\x1b\[([0-9;]*)[HfABCD]/g;
const ANSI_CLEAR_REGEX = /\x1b\[([0-9]*)J/g;

// ANSI color code mappings
const ANSI_COLORS = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'white',
  90: 'bright-black',
  91: 'bright-red',
  92: 'bright-green',
  93: 'bright-yellow',
  94: 'bright-blue',
  95: 'bright-magenta',
  96: 'bright-cyan',
  97: 'bright-white'
};

const ANSI_BG_COLORS = {
  40: 'black',
  41: 'red',
  42: 'green',
  43: 'yellow',
  44: 'blue',
  45: 'magenta',
  46: 'cyan',
  47: 'white',
  100: 'bright-black',
  101: 'bright-red',
  102: 'bright-green',
  103: 'bright-yellow',
  104: 'bright-blue',
  105: 'bright-magenta',
  106: 'bright-cyan',
  107: 'bright-white'
};

// ANSI formatting codes
const ANSI_FORMATS = {
  1: 'bold',
  2: 'dim',
  3: 'italic',
  4: 'underline',
  7: 'reverse',
  9: 'strikethrough'
};

/**
 * Parse ANSI escape sequences in terminal output
 * @param {string} text - Text containing ANSI escape sequences
 * @returns {Object} Parsed segments with formatting information
 */
export const parseAnsi = (text) => {
  if (!text || typeof text !== 'string') {
    return { segments: [] };
  }

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

  // Find all ANSI escape sequences
  const matches = [...text.matchAll(ANSI_COLOR_REGEX)];
  
  for (const match of matches) {
    const beforeText = text.slice(currentIndex, match.index);
    
    // Add text segment before the ANSI code if it exists
    if (beforeText) {
      segments.push({
        text: beforeText,
        ...currentStyle
      });
    }

    // Parse the ANSI code
    const codes = match[1].split(';').map(code => parseInt(code, 10) || 0);
    currentStyle = parseAnsiCodes(codes, currentStyle);
    
    currentIndex = match.index + match[0].length;
  }

  // Add remaining text after last ANSI code
  const remainingText = text.slice(currentIndex);
  if (remainingText) {
    segments.push({
      text: remainingText,
      ...currentStyle
    });
  }

  // If no ANSI codes found, return the entire text as one segment
  if (segments.length === 0) {
    segments.push({
      text: text,
      ...currentStyle
    });
  }

  return { segments };
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
        Object.keys(newStyle).forEach(key => {
          if (typeof newStyle[key] === 'boolean') {
            newStyle[key] = false;
          } else {
            newStyle[key] = null;
          }
        });
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
      
      case 22: // Normal intensity (not bold or dim)
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
 * Convert ANSI style object to CSS classes
 * @param {Object} style - Style object from parseAnsi
 * @returns {string} Space-separated CSS class names
 */
export const ansiToCSS = (style) => {
  if (!style || typeof style !== 'object') {
    return '';
  }

  const classes = [];

  // Add color classes
  if (style.color) {
    classes.push(`ansi-${style.color}`);
  }
  
  if (style.backgroundColor) {
    classes.push(`ansi-bg-${style.backgroundColor}`);
  }

  // Add formatting classes
  if (style.bold) classes.push('ansi-bold');
  if (style.dim) classes.push('ansi-dim');
  if (style.italic) classes.push('ansi-italic');
  if (style.underline) classes.push('ansi-underline');
  if (style.reverse) classes.push('ansi-reverse');
  if (style.strikethrough) classes.push('ansi-strikethrough');

  return classes.join(' ');
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

/**
 * Parse cursor positioning ANSI sequences
 * @param {string} text - Text containing cursor ANSI sequences
 * @returns {Object} Cursor commands and remaining text
 */
export const parseCursorAnsi = (text) => {
  if (!text || typeof text !== 'string') {
    return { commands: [], text: text };
  }

  const commands = [];
  let cleanText = text;

  // Handle cursor positioning
  const cursorMatches = [...text.matchAll(ANSI_CURSOR_REGEX)];
  for (const match of cursorMatches) {
    const params = match[1].split(';').map(p => parseInt(p, 10) || 1);
    const command = match[0].slice(-1); // Last character is the command
    
    switch (command) {
      case 'H':
      case 'f': // Cursor position
        commands.push({
          type: 'cursor_position',
          row: params[0] || 1,
          col: params[1] || 1
        });
        break;
      case 'A': // Cursor up
        commands.push({
          type: 'cursor_up',
          count: params[0] || 1
        });
        break;
      case 'B': // Cursor down
        commands.push({
          type: 'cursor_down',
          count: params[0] || 1
        });
        break;
      case 'C': // Cursor forward
        commands.push({
          type: 'cursor_forward',
          count: params[0] || 1
        });
        break;
      case 'D': // Cursor backward
        commands.push({
          type: 'cursor_backward',
          count: params[0] || 1
        });
        break;
    }
  }

  // Remove cursor sequences from text
  cleanText = cleanText.replace(ANSI_CURSOR_REGEX, '');

  return { commands, text: cleanText };
};

/**
 * Parse clear screen ANSI sequences
 * @param {string} text - Text containing clear ANSI sequences
 * @returns {Object} Clear commands and remaining text
 */
export const parseClearAnsi = (text) => {
  if (!text || typeof text !== 'string') {
    return { commands: [], text: text };
  }

  const commands = [];
  let cleanText = text;

  // Handle clear sequences
  const clearMatches = [...text.matchAll(ANSI_CLEAR_REGEX)];
  for (const match of clearMatches) {
    const param = parseInt(match[1], 10) || 0;
    
    switch (param) {
      case 0: // Clear from cursor to end of screen
        commands.push({ type: 'clear_to_end' });
        break;
      case 1: // Clear from cursor to beginning of screen
        commands.push({ type: 'clear_to_beginning' });
        break;
      case 2: // Clear entire screen
        commands.push({ type: 'clear_screen' });
        break;
      case 3: // Clear entire screen and scrollback
        commands.push({ type: 'clear_all' });
        break;
    }
  }

  // Remove clear sequences from text
  cleanText = cleanText.replace(ANSI_CLEAR_REGEX, '');

  return { commands, text: cleanText };
};