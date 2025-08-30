// Main terminal component
import React, { useEffect, useRef, useState, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import useTerminalState from '../../hooks/useTerminalState';
import useCommandHistory from '../../hooks/useCommandHistory';
import useKeyboardHandler from '../../hooks/useKeyboardHandler';
import TerminalOutput from './TerminalOutput';
import { WEBSOCKET_URL } from '../../utils/constants';

const Terminal = ({ 
  width = 80, 
  height = 24, 
  className = '',
  onConnect,
  onDisconnect 
}) => {
  const terminalRef = useRef(null);
  const [sessionId] = useState(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated session ID:', id);
    return id;
  });
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const lastProcessedMessageRef = useRef(null);

  // Initialize hooks
  const { connectionStatus, sendMessage, lastMessage, reconnect } = useWebSocket(WEBSOCKET_URL, sessionId);
  
  const {
    lines,
    currentLine,
    cursorPosition,
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
  } = useTerminalState();

  const {
    addCommand,
    navigateUp,
    navigateDown,
    getCurrentCommand,
    resetNavigation
  } = useCommandHistory();

  // Handle WebSocket messages with deduplication
  useEffect(() => {
    if (lastMessage && lastMessage !== lastProcessedMessageRef.current) {
      console.log('Processing new message:', lastMessage);
      lastProcessedMessageRef.current = lastMessage;
      
      if (lastMessage.type === 'output' && lastMessage.data) {
        // Process formatted output from backend
        const output = lastMessage.data;
        if (output && output.trim()) {
          // Apply additional client-side filtering for better readability
          const cleanOutput = output
            // Remove remaining artifacts that might have slipped through
            .replace(/\{"input":"[^"]*"\}/g, '')
            // Remove prompt artifacts
            .replace(/\$\s*$/gm, '')
            // Clean up excessive whitespace
            .replace(/\n{3,}/g, '\n\n')
            .trim();
            
          if (cleanOutput) {
            console.log('Adding output to terminal:', cleanOutput);
            addOutput(cleanOutput, 'output');
          }
        }
      } else if (lastMessage.output) {
        // Legacy format support
        const cleanOutput = lastMessage.output
          .replace(/\{"input":"[^"]*"\}/g, '')
          .trim();
        if (cleanOutput) {
          console.log('Adding legacy output to terminal:', cleanOutput);
          addOutput(cleanOutput, 'output');
        }
      } else if (lastMessage.error || lastMessage.type === 'error') {
        const errorMsg = lastMessage.error || lastMessage.data || 'Unknown error';
        console.log('Adding error to terminal:', errorMsg);
        addOutput(`Error: ${errorMsg}`, 'error');
      }
    }
  }, [lastMessage, addOutput]);

  // Handle connection status changes
  useEffect(() => {
    console.log('Connection status changed to:', connectionStatus);
    if (connectionStatus === 'connected') {
      if (onConnect) onConnect();
    } else if (connectionStatus === 'disconnected') {
      addOutput('Connection lost. Please refresh to reconnect.', 'error');
      if (onDisconnect) onDisconnect();
    } else if (connectionStatus === 'error') {
      addOutput('Connection error - check your network and try refreshing the page', 'error');
    }
  }, [connectionStatus, addOutput, onConnect, onDisconnect]);

  // Command execution handler
  const handleCommand = useCallback((command) => {
    if (command.trim()) {
      console.log('Executing command:', command);
      addCommand(command);
      // Send command in the format expected by the backend
      const success = sendMessage(command);
      if (!success) {
        console.warn('Failed to send command, WebSocket not connected');
        addOutput('Error: Terminal not connected. Please refresh the page.', 'error');
      }
    }
    resetNavigation();
    updateCurrentLine('');
  }, [addCommand, sendMessage, resetNavigation, updateCurrentLine, addOutput]);

  // History navigation handlers
  const handleHistoryUp = useCallback((currentCmd) => {
    navigateUp(currentCmd);
    const historyCommand = getCurrentCommand();
    updateCurrentLine(historyCommand);
  }, [navigateUp, getCurrentCommand, updateCurrentLine]);

  const handleHistoryDown = useCallback(() => {
    navigateDown();
    const historyCommand = getCurrentCommand();
    updateCurrentLine(historyCommand);
  }, [navigateDown, getCurrentCommand, updateCurrentLine]);

  // Text input handler
  const handleTextInput = useCallback((text) => {
    insertAtCursor(text);
    resetNavigation();
  }, [insertAtCursor, resetNavigation]);

  // Cursor movement handler
  const handleCursorMove = useCallback((direction) => {
    moveCursor(direction);
  }, [moveCursor]);

  // Delete handler
  const handleDelete = useCallback((direction) => {
    deleteAtCursor(direction);
    resetNavigation();
  }, [deleteAtCursor, resetNavigation]);

  // Clear screen handler
  const handleClearScreen = useCallback(() => {
    clearScreen();
    addPrompt();
  }, [clearScreen, addPrompt]);

  // Interrupt handler (Ctrl+C)
  const handleInterrupt = useCallback(() => {
    sendMessage('\x03'); // Send interrupt signal
    updateCurrentLine('');
    resetNavigation();
  }, [sendMessage, updateCurrentLine, resetNavigation]);

  // Copy handler
  const handleCopy = useCallback(() => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText).catch(err => {
        console.warn('Failed to copy to clipboard:', err);
      });
    }
  }, [selectedText]);

  // Text selection handler
  const handleTextSelect = useCallback((event, content) => {
    // Basic text selection - can be enhanced later
    const selection = window.getSelection();
    if (selection.toString()) {
      setSelectedText(selection.toString());
      setHasSelection(true);
    } else {
      setSelectedText('');
      setHasSelection(false);
    }
  }, []);

  // Initialize keyboard handler
  const { handleKeyDown, handleKeyPress, handlePaste } = useKeyboardHandler({
    onCommand: handleCommand,
    onCursorMove: handleCursorMove,
    onTextInput: handleTextInput,
    onHistoryUp: handleHistoryUp,
    onHistoryDown: handleHistoryDown,
    onClearScreen: handleClearScreen,
    onInterrupt: handleInterrupt,
    onDelete: handleDelete,
    currentLine,
    hasSelection,
    onCopy: handleCopy
  });

  // Focus terminal on mount and click
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  const handleTerminalClick = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  // Connection status indicator
  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'connection-status connected';
      case 'connecting':
        return 'connection-status connecting';
      case 'error':
        return 'connection-status error';
      default:
        return 'connection-status disconnected';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  const terminalClasses = [
    'terminal-container',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={terminalRef}
      className={terminalClasses}
      onClick={handleTerminalClick}
      onKeyDown={handleKeyDown}
      onKeyPress={handleKeyPress}
      onPaste={handlePaste}
      tabIndex={0}
      style={{
        width: width ? `${width}ch` : '100%',
        height: height ? `${height * 1.2}em` : '100vh'
      }}
    >
      {/* Connection status indicator */}
      <div className={getConnectionStatusClass()}>
        {getConnectionStatusText()}
        {connectionStatus === 'error' && (
          <button 
            onClick={reconnect}
            className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
          >
            Retry
          </button>
        )}
      </div>

      {/* Terminal output */}
      <TerminalOutput
        lines={lines}
        currentLine={currentLine}
        cursorPosition={cursorPosition}
        showCursor={connectionStatus === 'connected'}
        onScroll={handleScroll}
        onTextSelect={handleTextSelect}
      />
    </div>
  );
};

export default Terminal;