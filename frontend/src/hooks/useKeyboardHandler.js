// Keyboard input handling hook
import { useCallback } from 'react';

const useKeyboardHandler = ({ 
  onCommand, 
  onCursorMove, 
  onTextInput, 
  onHistoryUp, 
  onHistoryDown,
  onClearScreen,
  onInterrupt,
  onDelete,
  currentLine,
  hasSelection,
  onCopy
}) => {
  
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    // Handle special key combinations first
    if (isCtrlOrCmd) {
      switch (key) {
        case 'c':
          if (hasSelection && onCopy) {
            onCopy();
            event.preventDefault();
            return;
          } else if (onInterrupt) {
            onInterrupt();
            event.preventDefault();
            return;
          }
          break;
        case 'l':
          if (onClearScreen) {
            onClearScreen();
            event.preventDefault();
            return;
          }
          break;
        case 'v':
          // Paste will be handled by handlePaste
          return;
        default:
          break;
      }
    }

    // Handle navigation and editing keys
    switch (key) {
      case 'Enter':
        if (onCommand && currentLine !== undefined) {
          onCommand(currentLine);
        }
        event.preventDefault();
        break;

      case 'ArrowUp':
        if (onHistoryUp) {
          onHistoryUp(currentLine);
        }
        event.preventDefault();
        break;

      case 'ArrowDown':
        if (onHistoryDown) {
          onHistoryDown();
        }
        event.preventDefault();
        break;

      case 'ArrowLeft':
        if (onCursorMove) {
          onCursorMove('left');
        }
        event.preventDefault();
        break;

      case 'ArrowRight':
        if (onCursorMove) {
          onCursorMove('right');
        }
        event.preventDefault();
        break;

      case 'Home':
        if (onCursorMove) {
          onCursorMove('home');
        }
        event.preventDefault();
        break;

      case 'End':
        if (onCursorMove) {
          onCursorMove('end');
        }
        event.preventDefault();
        break;

      case 'Backspace':
        if (onDelete) {
          onDelete('backward');
        }
        event.preventDefault();
        break;

      case 'Delete':
        if (onDelete) {
          onDelete('forward');
        }
        event.preventDefault();
        break;

      case 'Tab':
        // Prevent tab from changing focus
        event.preventDefault();
        if (onTextInput) {
          onTextInput('  '); // Insert 2 spaces for tab
        }
        break;

      default:
        // Handle printable characters
        if (key.length === 1 && !isCtrlOrCmd) {
          if (onTextInput) {
            onTextInput(key);
          }
          event.preventDefault();
        }
        break;
    }
  }, [
    onCommand, 
    onCursorMove, 
    onTextInput, 
    onHistoryUp, 
    onHistoryDown,
    onClearScreen,
    onInterrupt,
    onDelete,
    currentLine,
    hasSelection,
    onCopy
  ]);

  const handleKeyPress = useCallback((event) => {
    // Most key handling is done in handleKeyDown
    // This is kept for compatibility but generally not used
    event.preventDefault();
  }, []);

  const handlePaste = useCallback(async (event) => {
    event.preventDefault();
    
    try {
      let pastedText = '';
      
      if (event.clipboardData) {
        // Standard paste event
        pastedText = event.clipboardData.getData('text/plain');
      } else if (navigator.clipboard) {
        // Modern clipboard API
        pastedText = await navigator.clipboard.readText();
      }

      if (pastedText && onTextInput) {
        // Clean the pasted text (remove line breaks, control characters)
        const cleanText = pastedText
          .replace(/[\r\n]/g, ' ')
          .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
        
        if (cleanText) {
          onTextInput(cleanText);
        }
      }
    } catch (error) {
      console.warn('Failed to read clipboard:', error);
    }
  }, [onTextInput]);

  const handleCopy = useCallback(async (text) => {
    if (!text) return false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  return {
    handleKeyDown,
    handleKeyPress,
    handlePaste,
    handleCopy
  };
};

export default useKeyboardHandler;