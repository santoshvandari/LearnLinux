// Enhanced output display component with better styling and optimized scrolling
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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
  const lastLinesLength = useRef(lines.length);

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
    }, 200); // Increased delay to prevent premature auto-scroll

    // Only call onScroll if it's provided
    if (onScroll) {
      onScroll(scrollTop, scrollHeight, clientHeight);
    }
  }, [onScroll]);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current && !isUserScrollingRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  // Only auto-scroll when new lines are actually added
  useEffect(() => {
    if (lines.length > lastLinesLength.current) {
      lastLinesLength.current = lines.length;
      scrollToBottom();
    }
  }, [lines.length, scrollToBottom]);

  // Handle text selection across multiple lines
  const handleTextSelect = useCallback((event, content) => {
    if (onTextSelect) {
      onTextSelect(event, content);
    }
  }, [onTextSelect]);

  // Memoize rendered lines to prevent unnecessary re-renders
  const renderedLines = useMemo(() => {
    return lines.map((line) => (
      <TerminalLine
        key={line.id}
        content={line.content}
        type={line.type}
        onTextSelect={handleTextSelect}
      />
    ));
  }, [lines, handleTextSelect]);

  // Memoize current line to prevent unnecessary re-renders
  const currentLineComponent = useMemo(() => (
    <TerminalLine
      content={`$ ${currentLine}`}
      type="input"
      isCurrentLine={true}
      cursorPosition={cursorPosition + 2} // +2 for "$ " prefix
      showCursor={showCursor}
      onTextSelect={handleTextSelect}
    />
  ), [currentLine, cursorPosition, showCursor, handleTextSelect]);

  const outputStyles = {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '16px',
    backgroundColor: '#000000',
    color: '#e5e5e5',
    fontFamily: 'JetBrains Mono, Fira Code, Courier New, Monaco, Menlo, Ubuntu Mono, monospace',
    fontSize: '14px',
    lineHeight: '1.4',
    scrollbarWidth: 'thin',
    scrollbarColor: '#333 #000',
    scrollBehavior: 'smooth'
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
        {/* Render all output lines with memoization */}
        {renderedLines}
        
        {/* Render current input line */}
        {currentLineComponent}
      </div>
    </>
  );
};

export default React.memo(TerminalOutput);