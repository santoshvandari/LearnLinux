// Individual terminal line component
import React, { memo } from 'react';
import { parseAnsi, ansiToCSS } from '../../utils/ansiParser';
import TerminalCursor from './TerminalCursor';

const TerminalLine = memo(({ 
  content = '', 
  type = 'output',
  isCurrentLine = false,
  cursorPosition = 0,
  showCursor = false,
  onTextSelect,
  className = ''
}) => {
  const renderContent = () => {
    if (!content && !isCurrentLine) {
      return <span>&nbsp;</span>; // Preserve line height for empty lines
    }

    // For current input line, handle cursor positioning
    if (isCurrentLine) {
      const beforeCursor = content.slice(0, cursorPosition);
      const atCursor = content.slice(cursorPosition, cursorPosition + 1) || ' ';
      const afterCursor = content.slice(cursorPosition + 1);

      return (
        <>
          {beforeCursor && <span>{beforeCursor}</span>}
          {showCursor ? (
            <TerminalCursor character={atCursor} />
          ) : (
            <span>{atCursor}</span>
          )}
          {afterCursor && <span>{afterCursor}</span>}
        </>
      );
    }

    // For output lines, preserve original formatting and parse ANSI sequences
    const { segments } = parseAnsi(content);
    
    if (segments.length === 0) {
      return <span>&nbsp;</span>;
    }

    return segments.map((segment, index) => {
      const cssClasses = ansiToCSS(segment);
      
      // Preserve whitespace and line breaks
      const text = segment.text || '';
      const preservedText = text
        .replace(/ /g, '\u00A0') // Convert spaces to non-breaking spaces
        .replace(/\t/g, '\u00A0\u00A0\u00A0\u00A0'); // Convert tabs to 4 non-breaking spaces
      
      return (
        <span 
          key={index}
          className={cssClasses}
          style={{
            color: segment.color ? undefined : 'inherit',
            backgroundColor: segment.backgroundColor ? undefined : 'inherit',
            whiteSpace: 'pre-wrap' // Preserve whitespace and allow wrapping
          }}
        >
          {preservedText || '\u00A0'}
        </span>
      );
    });
  };

  const getLineTypeClass = () => {
    switch (type) {
      case 'prompt':
        return 'terminal-prompt';
      case 'input':
        return 'terminal-input-line';
      case 'error':
        return 'terminal-error';
      case 'output':
      default:
        return 'terminal-output-line';
    }
  };

  const lineClasses = [
    'terminal-line',
    getLineTypeClass(),
    isCurrentLine && 'terminal-current-line',
    className
  ].filter(Boolean).join(' ');

  const handleMouseDown = (event) => {
    if (onTextSelect) {
      onTextSelect(event, content);
    }
  };

  return (
    <div 
      className={lineClasses}
      onMouseDown={handleMouseDown}
      data-line-type={type}
    >
      {renderContent()}
    </div>
  );
});

TerminalLine.displayName = 'TerminalLine';

export default TerminalLine;