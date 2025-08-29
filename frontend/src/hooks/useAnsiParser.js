// ANSI escape sequence parsing hook - placeholder for future implementation
import { useMemo } from 'react';

const useAnsiParser = () => {
  // Implementation will be added in subsequent tasks
  const parseAnsi = useMemo(() => {
    return (text) => {
      // Placeholder - will parse ANSI sequences
      return { segments: [{ text, color: 'white' }] };
    };
  }, []);

  return { parseAnsi };
};

export default useAnsiParser;