// Enhanced ANSI escape sequence parser with improved text formatting
export function parseAnsi(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Clean up common terminal artifacts that cause display issues
  let cleanText = text
    // Remove bell character
    .replace(/\x07/g, '')
    // Remove backspace sequences that cause formatting issues
    .replace(/\x08+/g, '')
    // Remove terminal title sequences
    .replace(/\x1b\]0;[^\x07]*\x07/g, '')
    // Remove OSC (Operating System Command) sequences
    .replace(/\x1b\][\d;]*[^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    // Remove terminal control sequences like ]133;A\, ]133;B\, ]133;C\, ]133;D;
    .replace(/\]133;[A-Z];?[^\\]*\\/g, '')
    .replace(/\]133;[A-Z][^\\]*\\/g, '')
    // Remove file:// URLs sequences  
    .replace(/\]7;file:\/\/[^\\]*\\/g, '')
    // Remove [?2004h and [?2004l sequences (bracketed paste mode)
    .replace(/\[\?2004[hl]/g, '')
    // Clean up carriage return + newline combinations
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive newlines but preserve paragraph breaks
    .replace(/\n{4,}/g, '\n\n');
  
  const segments = [];
  let currentIndex = 0;
  let currentState = {
    color: null,
    backgroundColor: null,
    bold: false,
    italic: false,
    underline: false,
    dim: false,
    reverse: false,
    strikethrough: false
  };

  // Enhanced ANSI escape sequence regex
  const ansiRegex = /\x1b\[([\d;]*[a-zA-Z])/g;
  let match;

  while ((match = ansiRegex.exec(cleanText)) !== null) {
    // Add text before the escape sequence
    if (match.index > currentIndex) {
      const textContent = cleanText.slice(currentIndex, match.index);
      if (textContent) {
        segments.push({
          type: 'text',
          text: textContent,
          ansiState: { ...currentState }
        });
      }
    }

    // Process the escape sequence
    const sequence = match[1];
    processAnsiSequence(sequence, currentState);

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < cleanText.length) {
    const remainingText = cleanText.slice(currentIndex);
    if (remainingText) {
      segments.push({
        type: 'text',
        text: remainingText,
        ansiState: { ...currentState }
      });
    }
  }

  return segments.length > 0 ? segments : [{ type: 'text', text: cleanText, ansiState: { ...currentState } }];
}

function processAnsiSequence(sequence, state) {
  // Handle different ANSI escape sequences
  if (sequence === 'K') {
    // Clear line - ignore for our purposes
    return;
  }
  
  if (sequence === 'H' || sequence === 'f') {
    // Cursor positioning - ignore for our purposes
    return;
  }
  
  if (sequence === '2J') {
    // Clear screen - we'll handle this separately
    state.clearScreen = true;
    return;
  }

  // Handle SGR (Select Graphic Rendition) parameters
  const params = sequence.replace(/[^\d;]/g, '').split(';').map(p => parseInt(p) || 0);
  
  for (const param of params) {
    switch (param) {
      case 0: // Reset
        Object.assign(state, {
          color: null,
          backgroundColor: null,
          bold: false,
          italic: false,
          underline: false,
          dim: false,
          reverse: false,
          strikethrough: false
        });
        break;
      case 1: // Bold
        state.bold = true;
        break;
      case 2: // Dim
        state.dim = true;
        break;
      case 3: // Italic
        state.italic = true;
        break;
      case 4: // Underline
        state.underline = true;
        break;
      case 7: // Reverse
        state.reverse = true;
        break;
      case 9: // Strikethrough
        state.strikethrough = true;
        break;
      case 22: // Normal intensity (not bold/dim)
        state.bold = false;
        state.dim = false;
        break;
      case 23: // Not italic
        state.italic = false;
        break;
      case 24: // Not underlined
        state.underline = false;
        break;
      case 27: // Not reversed
        state.reverse = false;
        break;
      case 29: // Not strikethrough
        state.strikethrough = false;
        break;
      // Foreground colors (30-37, 90-97)
      case 30: state.color = '#000000'; break; // Black
      case 31: state.color = '#cd0000'; break; // Red
      case 32: state.color = '#00cd00'; break; // Green
      case 33: state.color = '#cdcd00'; break; // Yellow
      case 34: state.color = '#0000ee'; break; // Blue
      case 35: state.color = '#cd00cd'; break; // Magenta
      case 36: state.color = '#00cdcd'; break; // Cyan
      case 37: state.color = '#e5e5e5'; break; // White
      case 39: state.color = null; break; // Default
      // Bright foreground colors
      case 90: state.color = '#7f7f7f'; break; // Bright Black
      case 91: state.color = '#ff0000'; break; // Bright Red
      case 92: state.color = '#00ff00'; break; // Bright Green
      case 93: state.color = '#ffff00'; break; // Bright Yellow
      case 94: state.color = '#5c5cff'; break; // Bright Blue
      case 95: state.color = '#ff00ff'; break; // Bright Magenta
      case 96: state.color = '#00ffff'; break; // Bright Cyan
      case 97: state.color = '#ffffff'; break; // Bright White
      // Background colors (40-47, 100-107)
      case 40: state.backgroundColor = '#000000'; break;
      case 41: state.backgroundColor = '#cd0000'; break;
      case 42: state.backgroundColor = '#00cd00'; break;
      case 43: state.backgroundColor = '#cdcd00'; break;
      case 44: state.backgroundColor = '#0000ee'; break;
      case 45: state.backgroundColor = '#cd00cd'; break;
      case 46: state.backgroundColor = '#00cdcd'; break;
      case 47: state.backgroundColor = '#e5e5e5'; break;
      case 49: state.backgroundColor = null; break; // Default
      // Bright background colors
      case 100: state.backgroundColor = '#7f7f7f'; break;
      case 101: state.backgroundColor = '#ff0000'; break;
      case 102: state.backgroundColor = '#00ff00'; break;
      case 103: state.backgroundColor = '#ffff00'; break;
      case 104: state.backgroundColor = '#5c5cff'; break;
      case 105: state.backgroundColor = '#ff00ff'; break;
      case 106: state.backgroundColor = '#00ffff'; break;
      case 107: state.backgroundColor = '#ffffff'; break;
    }
  }
}

export function segmentsToReactStyles(segments) {
  return segments.map(segment => {
    const reactStyle = {};
    
    if (segment.ansiState) {
      if (segment.ansiState.color) {
        reactStyle.color = segment.ansiState.color;
      }
      
      if (segment.ansiState.backgroundColor) {
        reactStyle.backgroundColor = segment.ansiState.backgroundColor;
      }
      
      if (segment.ansiState.bold) {
        reactStyle.fontWeight = 'bold';
      }
      
      if (segment.ansiState.italic) {
        reactStyle.fontStyle = 'italic';
      }
      
      if (segment.ansiState.underline) {
        reactStyle.textDecoration = reactStyle.textDecoration ? 
          `${reactStyle.textDecoration} underline` : 'underline';
      }
      
      if (segment.ansiState.strikethrough) {
        reactStyle.textDecoration = reactStyle.textDecoration ? 
          `${reactStyle.textDecoration} line-through` : 'line-through';
      }
      
      if (segment.ansiState.dim) {
        reactStyle.opacity = 0.7;
      }
      
      if (segment.ansiState.reverse) {
        // Swap foreground and background colors
        const tempColor = reactStyle.color;
        reactStyle.color = reactStyle.backgroundColor || '#000000';
        reactStyle.backgroundColor = tempColor || '#ffffff';
      }
      
      // Handle special control flags
      if (segment.ansiState.clearScreen) {
        return {
          ...segment,
          reactStyle,
          controls: { clearScreen: true }
        };
      }
    }
    
    return {
      ...segment,
      reactStyle
    };
  });
}

// Utility function to strip ANSI escape sequences from text
export function stripAnsi(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Remove all ANSI escape sequences and terminal control codes
  return text
    // Remove ANSI escape sequences
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
    // Remove terminal title sequences
    .replace(/\x1b\]0;[^\x07]*\x07/g, '')
    // Remove OSC sequences
    .replace(/\x1b\][\d;]*[^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    // Remove terminal control sequences
    .replace(/\]133;[A-Z];?[^\\]*\\/g, '')
    .replace(/\]133;[A-Z][^\\]*\\/g, '')
    .replace(/\]7;file:\/\/[^\\]*\\/g, '')
    // Remove bracketed paste mode sequences
    .replace(/\[\?2004[hl]/g, '')
    // Remove bell and other control characters
    .replace(/[\x00-\x1f\x7f]/g, (char) => {
      // Keep newlines and tabs
      if (char === '\n' || char === '\t') return char;
      return '';
    })
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
