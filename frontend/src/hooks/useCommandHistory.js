// Command history functionality hook
import { useState, useCallback } from 'react';
import { MAX_HISTORY_SIZE } from '../utils/constants';

const useCommandHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [tempCommand, setTempCommand] = useState('');

  const addCommand = useCallback((command) => {
    if (!command || !command.trim()) {
      return;
    }

    const trimmedCommand = command.trim();
    
    setHistory(prevHistory => {
      // Don't add duplicate consecutive commands
      if (prevHistory.length > 0 && prevHistory[prevHistory.length - 1] === trimmedCommand) {
        return prevHistory;
      }

      const newHistory = [...prevHistory, trimmedCommand];
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }
      
      return newHistory;
    });

    // Reset navigation state
    setCurrentIndex(-1);
    setTempCommand('');
  }, []);

  const navigateUp = useCallback((currentCommand = '') => {
    setHistory(prevHistory => {
      if (prevHistory.length === 0) {
        return prevHistory;
      }

      setCurrentIndex(prevIndex => {
        let newIndex;
        
        if (prevIndex === -1) {
          // First time navigating up, save current command
          setTempCommand(currentCommand);
          newIndex = prevHistory.length - 1;
        } else {
          // Navigate further up in history
          newIndex = Math.max(0, prevIndex - 1);
        }

        return newIndex;
      });

      return prevHistory;
    });
  }, []);

  const navigateDown = useCallback(() => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === -1) {
        // Already at the bottom
        return prevIndex;
      }

      const newIndex = prevIndex + 1;
      
      if (newIndex >= history.length) {
        // Reached the bottom, reset to temp command
        setCurrentIndex(-1);
        return -1;
      }

      return newIndex;
    });
  }, [history.length]);

  const getCurrentCommand = useCallback(() => {
    if (currentIndex === -1) {
      return tempCommand;
    }
    
    return history[currentIndex] || '';
  }, [currentIndex, history, tempCommand]);

  const resetNavigation = useCallback(() => {
    setCurrentIndex(-1);
    setTempCommand('');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    setTempCommand('');
  }, []);

  const getHistoryItem = useCallback((index) => {
    if (index < 0 || index >= history.length) {
      return null;
    }
    return history[index];
  }, [history]);

  const isNavigating = currentIndex !== -1;

  return {
    history,
    currentIndex,
    addCommand,
    navigateUp,
    navigateDown,
    getCurrentCommand,
    resetNavigation,
    clearHistory,
    getHistoryItem,
    isNavigating,
    historyLength: history.length
  };
};

export default useCommandHistory;