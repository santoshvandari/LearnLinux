// Enhanced blinking cursor component
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
    }, 530); // Blink every 530ms for better visibility

    return () => clearInterval(interval);
  }, [blinking, visible]);

  if (!visible) {
    return <span style={{ width: '0.6em', display: 'inline-block' }}>&nbsp;</span>;
  }

  const cursorStyle = {
    backgroundColor: isVisible ? '#00ff00' : 'transparent',
    color: isVisible ? '#000000' : '#00ff00',
    width: '0.6em',
    height: '1.4em',
    display: 'inline-block',
    fontWeight: 'bold',
    textAlign: 'center',
    verticalAlign: 'top',
    lineHeight: '1.4',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: isVisible ? 'none' : '1px solid #00ff00',
    animation: blinking ? 'none' : undefined,
    transition: blinking ? 'none' : 'all 0.1s ease'
  };

  return (
    <span 
      style={cursorStyle}
      className={className}
    >
      {character}
    </span>
  );
};

export default TerminalCursor;