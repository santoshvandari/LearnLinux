// Enhanced terminal line component with improved ANSI parsing
import React, { memo } from 'react';
import { parseAnsi, segmentsToReactStyles } from '../../utils/ansiParser';
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
      return <span style={{ height: '1.4em', display: 'inline-block' }}>&nbsp;</span>;
    }

    // For current input line, handle cursor positioning
    if (isCurrentLine) {
      const beforeCursor = content.slice(0, cursorPosition);
      const atCursor = content.slice(cursorPosition, cursorPosition + 1) || ' ';
      const afterCursor = content.slice(cursorPosition + 1);

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {beforeCursor && (
            <span style={{ color: '#00ff00', fontFamily: 'inherit' }}>
              {beforeCursor}
            </span>
          )}
          {showCursor ? (
            <TerminalCursor character={atCursor} />
          ) : (
            <span style={{ color: '#00ff00' }}>{atCursor}</span>
          )}
          {afterCursor && (
            <span style={{ color: '#00ff00', fontFamily: 'inherit' }}>
              {afterCursor}
            </span>
          )}
        </div>
      );
    }

    // For output lines, parse ANSI sequences and apply proper styling
    const segments = parseAnsi(content);
    
    if (segments.length === 0) {
      return <span style={{ height: '1.4em', display: 'inline-block' }}>&nbsp;</span>;
    }

    // Convert segments to React-compatible styles
    const styledSegments = segmentsToReactStyles(segments);
    
    return (
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}>
        {styledSegments.map((segment, index) => {
          // Handle special control sequences
          if (segment.controls?.clearScreen) {
            // This segment triggers a screen clear
            return null;
          }
          
          // Render text with proper styling
          const text = segment.text || '';
          
          return (
            <span 
              key={index}
              style={{
                ...segment.reactStyle,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit'
              }}
            >
              {text || '\u00A0'}
            </span>
          );
        })}
      </div>
    );
  };

  const getLineStyles = () => {
    const baseStyles = {
      minHeight: '1.4em',
      lineHeight: '1.4',
      fontFamily: 'JetBrains Mono, Fira Code, Courier New, Monaco, Menlo, Ubuntu Mono, monospace',
      fontSize: '14px',
      margin: 0,
      padding: 0,
      whiteSpace: 'pre-wrap',
      wordBreak: 'normal',
      overflowWrap: 'normal'
    };

    switch (type) {
      case 'prompt':
        return {
          ...baseStyles,
          color: '#00ff00',
          fontWeight: 'bold'
        };
      case 'input':
        return {
          ...baseStyles,
          color: '#ffffff'
        };
      case 'error':
        return {
          ...baseStyles,
          color: '#ff0000',
          fontWeight: 'bold'
        };
      case 'output':
      default:
        return {
          ...baseStyles,
          color: '#e5e5e5'
        };
    }
  };

  const handleMouseDown = (event) => {
    if (onTextSelect) {
      onTextSelect(event, content);
    }
  };

  return (
    <div 
      style={getLineStyles()}
      onMouseDown={handleMouseDown}
      data-line-type={type}
      className={className}
    >
      {renderContent()}
    </div>
  );
});

TerminalLine.displayName = 'TerminalLine';

export default TerminalLine;