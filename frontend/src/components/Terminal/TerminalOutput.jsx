// Output display component
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

  const outputClasses = [
    'terminal-output',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={outputRef}
      className={outputClasses}
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
      
      {/* Render current input line */}
      <TerminalLine
        content={`$ ${currentLine}`}
        type="input"
        isCurrentLine={true}
        cursorPosition={cursorPosition + 2} // +2 for "$ " prefix
        showCursor={showCursor}
        onTextSelect={handleTextSelect}
      />
    </div>
  );
};

export default TerminalOutput;