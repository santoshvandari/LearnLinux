// Enhanced terminal line component with improved text formatting and readability
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
  
  // Format content for better readability
  const formatContent = (text) => {
    if (!text) return text;
    
    // Handle long text with better word wrapping and spacing
    return text
      // Add proper spacing around punctuation for better readability
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
      // Add spacing after colons in structured text
      .replace(/([a-zA-Z]):\s*([A-Z])/g, '$1:\n  $2')
      // Handle bullet points and lists better
      .replace(/^\s*[-•]\s+/gm, '\n• ')
      // Handle numbered lists
      .replace(/^\s*(\d+\.)\s+/gm, '\n$1 ')
      // Improve spacing around headers or important sections
      .replace(/^([A-Z][A-Z\s]+):$/gm, '\n$1:\n')
      // Add breathing room around key sections
      .replace(/(Key Ingredients|How the|Stage \d+|Condition [AB])/g, '\n$1')
      // Clean up excessive newlines
      .replace(/\n{3,}/g, '\n\n');
  };

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
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' }}>
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

    // Format content for better readability
    const formattedContent = type === 'output' ? formatContent(content) : content;
    
    // For output lines, parse ANSI sequences and apply proper styling
    const segments = parseAnsi(formattedContent);
    
    if (segments.length === 0) {
      return <span style={{ height: '1.4em', display: 'inline-block' }}>&nbsp;</span>;
    }

    // Convert segments to React-compatible styles
    const styledSegments = segmentsToReactStyles(segments);
    
    return (
      <div style={{ 
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        lineHeight: '1.6'
      }}>
        {styledSegments.map((segment, index) => {
          // Handle special control sequences
          if (segment.controls?.clearScreen) {
            return null;
          }
          
          // Render text with proper styling and improved readability
          const text = segment.text || '';
          
          // Check if this is a header or important section
          const isHeader = /^[A-Z][A-Z\s]+:$|^Stage \d+:|^Condition [AB]:/.test(text);
          const isBulletPoint = /^•\s/.test(text);
          const isNumberedPoint = /^\d+\.\s/.test(text);
          
          return (
            <span 
              key={index}
              style={{
                ...segment.reactStyle,
                fontFamily: 'inherit',
                fontSize: isHeader ? '16px' : 'inherit',
                fontWeight: isHeader ? 'bold' : segment.reactStyle?.fontWeight || 'normal',
                color: isHeader ? '#00d4ff' : 
                       isBulletPoint || isNumberedPoint ? '#90ee90' : 
                       segment.reactStyle?.color || '#e5e5e5',
                lineHeight: 'inherit',
                marginLeft: (isBulletPoint || isNumberedPoint) ? '16px' : '0',
                display: isHeader ? 'block' : 'inline',
                marginTop: isHeader ? '12px' : '0',
                marginBottom: isHeader ? '8px' : '0'
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
      minHeight: '1.6em',
      lineHeight: '1.6',
      fontFamily: 'JetBrains Mono, Fira Code, Courier New, Monaco, Menlo, Ubuntu Mono, monospace',
      fontSize: '14px',
      margin: 0,
      padding: type === 'output' ? '2px 0' : 0,
      whiteSpace: 'pre-wrap',
      wordBreak: 'normal',
      overflowWrap: 'break-word'
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
          color: '#ffffff',
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          padding: '2px 4px',
          borderLeft: '2px solid #00ff00'
        };
      case 'error':
        return {
          ...baseStyles,
          color: '#ff6b6b',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          padding: '4px 8px',
          borderLeft: '3px solid #ff6b6b',
          borderRadius: '2px'
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

export default React.memo(TerminalLine, (prevProps, nextProps) => {
  // Only re-render if content, type, cursor position, or cursor visibility changes
  return (
    prevProps.content === nextProps.content &&
    prevProps.type === nextProps.type &&
    prevProps.isCurrentLine === nextProps.isCurrentLine &&
    prevProps.cursorPosition === nextProps.cursorPosition &&
    prevProps.showCursor === nextProps.showCursor &&
    prevProps.className === nextProps.className
  );
});