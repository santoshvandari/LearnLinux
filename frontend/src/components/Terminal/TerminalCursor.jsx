// Blinking cursor component
import React, { useState, useEffect } from 'react';

const TerminalCursor = ({ 
  visible = true, 
  blinking = true, 
  character = ' ',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!blinking || !visible) {
      setIsVisible(visible);
      return;
    }

    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(interval);
  }, [blinking, visible]);

  if (!visible) {
    return null;
  }

  const cursorClasses = [
    'terminal-cursor',
    !blinking && 'solid',
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={cursorClasses}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: blinking ? 'none' : 'opacity 0.1s ease'
      }}
    >
      {character}
    </span>
  );
};

export default TerminalCursor;