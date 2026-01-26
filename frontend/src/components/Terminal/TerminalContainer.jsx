import React, { useState } from 'react';
import Terminal from './Terminal';

const TerminalContainer = ({ onClose, onMinimize }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleConnect = () => {
    setIsConnected(true);
    console.log('Terminal connected');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    console.log('Terminal disconnected');
  };

  return (
    <div className={`bg-gray-900 rounded-lg shadow-2xl border border-gray-800 overflow-hidden transition-all duration-300 ${
      isMaximized ? 'fixed inset-0 z-50 rounded-none border-0' : 'w-full max-w-5xl mx-auto'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        {/* Left side - Window controls */}
        <div className="flex items-center space-x-2 w-20">
          <button
            onClick={onClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          />
          <button
            onClick={onMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          />
        </div>
        
        {/* Center - Title */}
        <div className="flex-1 text-center">
          <span className="text-gray-400 text-sm font-medium font-mono">
            user@learnlinux:~
          </span>
        </div>
        
        {/* Right side - Spacer/Status */}
        <div className="w-20 flex justify-end">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
      </div>

      {/* Terminal Body */}
      <div className={`bg-black ${isMaximized ? 'h-[calc(100vh-2.75rem)]' : 'h-[500px]'}`}>
        <Terminal 
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TerminalContainer;