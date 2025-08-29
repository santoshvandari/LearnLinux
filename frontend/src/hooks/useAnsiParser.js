// ANSI escape sequence parsing hook
import { useMemo, useCallback } from 'react';
import { 
  parseAnsi, 
  stripAnsi, 
  ansiToCSS, 
  hasAnsiSequences,
  parseCursorAnsi,
  parseClearAnsi
} from '../utils/ansiParser';

const useAnsiParser = () => {
  // Memoized parser function for performance
  const parseText = useMemo(() => {
    return (text) => {
      if (!text || typeof text !== 'string') {
        return { segments: [] };
      }
      
      return parseAnsi(text);
    };
  }, []);

  // Strip ANSI sequences from text
  const stripAnsiSequences = useCallback((text) => {
    return stripAnsi(text);
  }, []);

  // Convert style object to CSS classes
  const styleToCSS = useCallback((style) => {
    return ansiToCSS(style);
  }, []);

  // Check if text contains ANSI sequences
  const containsAnsi = useCallback((text) => {
    return hasAnsiSequences(text);
  }, []);

  // Parse cursor control sequences
  const parseCursorCommands = useCallback((text) => {
    return parseCursorAnsi(text);
  }, []);

  // Parse clear screen sequences
  const parseClearCommands = useCallback((text) => {
    return parseClearAnsi(text);
  }, []);

  // Process complete terminal output with all ANSI sequences
  const processTerminalOutput = useCallback((text) => {
    if (!text || typeof text !== 'string') {
      return {
        segments: [],
        cursorCommands: [],
        clearCommands: [],
        cleanText: ''
      };
    }

    // First parse cursor and clear commands
    const cursorResult = parseCursorCommands(text);
    const clearResult = parseClearCommands(cursorResult.text);
    
    // Then parse color and formatting
    const colorResult = parseText(clearResult.text);

    return {
      segments: colorResult.segments,
      cursorCommands: cursorResult.commands,
      clearCommands: clearResult.commands,
      cleanText: stripAnsiSequences(text)
    };
  }, [parseText, parseCursorCommands, parseClearCommands, stripAnsiSequences]);

  return {
    parseAnsi: parseText,
    stripAnsi: stripAnsiSequences,
    ansiToCSS: styleToCSS,
    hasAnsiSequences: containsAnsi,
    parseCursorAnsi: parseCursorCommands,
    parseClearAnsi: parseClearCommands,
    processTerminalOutput
  };
};

export default useAnsiParser;