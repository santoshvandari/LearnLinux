// Enhanced output display component with better styling
import React, { useRef, useEffect, useCallback } from 'react';
import TerminalLine from './TerminalLine';

const TerminalOutput = ({ 
  lines = [],
  currentLine = '',
  cursorPosition = 0,
  showCursor = true,
  onScroll,
  onTextSelect,
  className = ''
}) => {
  const outputRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback((event) => {
    const element = event.target;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // Mark that user is manually scrolling
    isUserScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Reset user scrolling flag after a delay
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 150);

    if (onScroll) {
      onScroll(scrollTop, scrollHeight, clientHeight);
    }
  }, [onScroll]);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current && !isUserScrollingRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    scrollToBottom();
  }, [lines.length, scrollToBottom]);

  // Handle text selection across multiple lines
  const handleTextSelect = useCallback((event, content) => {
    if (onTextSelect) {
      onTextSelect(event, content);
    }
  }, [onTextSelect]);

  const outputStyles = {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#000000',
    color: '#e5e5e5',
    fontFamily: 'JetBrains Mono, Fira Code, Courier New, Monaco, Menlo, Ubuntu Mono, monospace',
    fontSize: '14px',
    lineHeight: '1.4',
    scrollbarWidth: 'thin',
    scrollbarColor: '#333 #000'
  };

  // Custom scrollbar styles for webkit browsers
  const scrollbarStyles = `
    .terminal-output-container::-webkit-scrollbar {
      width: 8px;
    }
    .terminal-output-container::-webkit-scrollbar-track {
      background: #000;
    }
    .terminal-output-container::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
    }
    .terminal-output-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div 
        ref={outputRef}
        className={`terminal-output-container ${className}`}
        style={outputStyles}
        onScroll={handleScroll}
      >
        {/* Render all output lines */}
        {lines.map((line) => (
          <TerminalLine
            key={line.id}
            content={line.content}
            type={line.type}
            onTextSelect={handleTextSelect}
          />
        ))}
        
        {/* Render current input line with proper prompt */}
        <TerminalLine
          content={`$ ${currentLine}`}
          type="input"
          isCurrentLine={true}
          cursorPosition={cursorPosition + 2} // +2 for "$ " prefix
          showCursor={showCursor}
          onTextSelect={handleTextSelect}
        />
      </div>
    </>
  );
};

export default TerminalOutput;