// Terminal state management hook
import { useState, useCallback, useRef, useEffect } from 'react';
import { MAX_OUTPUT_LINES } from '../utils/constants';

const useTerminalState = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lineIdCounter = useRef(0);

  const generateLineId = () => {
    return `line-${lineIdCounter.current++}`;
  };

  const addOutput = useCallback((output, type = 'output') => {
    if (!output && output !== '') return;

    const newLine = {
      id: generateLineId(),
      content: output,
      type: type, // 'output', 'input', 'prompt', 'error'
      timestamp: new Date()
    };

    setLines(prevLines => {
      const updatedLines = [...prevLines, newLine];
      // Limit the number of lines to prevent memory issues
      if (updatedLines.length > MAX_OUTPUT_LINES) {
        return updatedLines.slice(-MAX_OUTPUT_LINES);
      }
      return updatedLines;
    });

    // Auto-scroll to bottom if user was already at bottom
    if (isAtBottom) {
      setTimeout(() => {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
      }, 0);
    }
  }, [isAtBottom]);

  const addPrompt = useCallback((prompt = 'user@terminal:~$ ') => {
    addOutput(prompt, 'prompt');
  }, [addOutput]);

  const clearScreen = useCallback(() => {
    setLines([]);
    setCurrentLine('');
    setCursorPosition(0);
    setScrollPosition(0);
    setIsAtBottom(true);
  }, []);

  const updateCurrentLine = useCallback((line) => {
    setCurrentLine(line);
    setCursorPosition(line.length);
  }, []);

  const insertAtCursor = useCallback((text) => {
    setCurrentLine(prevLine => {
      const before = prevLine.slice(0, cursorPosition);
      const after = prevLine.slice(cursorPosition);
      return before + text + after;
    });
    setCursorPosition(prev => prev + text.length);
  }, [cursorPosition]);

  const deleteAtCursor = useCallback((direction = 'backward') => {
    if (direction === 'backward' && cursorPosition > 0) {
      setCurrentLine(prevLine => {
        const before = prevLine.slice(0, cursorPosition - 1);
        const after = prevLine.slice(cursorPosition);
        return before + after;
      });
      setCursorPosition(prev => prev - 1);
    } else if (direction === 'forward' && cursorPosition < currentLine.length) {
      setCurrentLine(prevLine => {
        const before = prevLine.slice(0, cursorPosition);
        const after = prevLine.slice(cursorPosition + 1);
        return before + after;
      });
    }
  }, [cursorPosition, currentLine.length]);

  const moveCursor = useCallback((direction, amount = 1) => {
    setCursorPosition(prev => {
      let newPosition = prev;
      
      switch (direction) {
        case 'left':
          newPosition = Math.max(0, prev - amount);
          break;
        case 'right':
          newPosition = Math.min(currentLine.length, prev + amount);
          break;
        case 'home':
          newPosition = 0;
          break;
        case 'end':
          newPosition = currentLine.length;
          break;
        default:
          return prev;
      }
      
      return newPosition;
    });
  }, [currentLine.length]);

  const executeCommand = useCallback((command) => {
    if (command.trim()) {
      // Add the command to output as an input line
      addOutput(`$ ${command}`, 'input');
    }
    
    // Clear current line after execution
    setCurrentLine('');
    setCursorPosition(0);
    
    return command.trim();
  }, [addOutput]);

  // Handle scroll position tracking
  const handleScroll = useCallback((scrollTop, scrollHeight, clientHeight) => {
    setScrollPosition(scrollTop);
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsAtBottom(isNearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      setIsAtBottom(true);
    }
  }, []);

  // Auto-scroll when new content is added and user is at bottom
  useEffect(() => {
    if (isAtBottom && lines.length > 0) {
      scrollToBottom();
    }
  }, [lines.length, isAtBottom, scrollToBottom]);

  return {
    lines,
    currentLine,
    cursorPosition,
    scrollPosition,
    isAtBottom,
    addOutput,
    addPrompt,
    clearScreen,
    updateCurrentLine,
    insertAtCursor,
    deleteAtCursor,
    moveCursor,
    executeCommand,
    handleScroll,
    scrollToBottom
  };
};

export default useTerminalState;