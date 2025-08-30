import React, { useState } from 'react';
import { 
  XMarkIcon, 
  MinusIcon, 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline';
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
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 ${
      isMaximized ? 'fixed inset-4 z-50' : 'w-full max-w-7xl mx-auto'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 px-6 py-4 flex items-center justify-between border-b border-gray-600/50">
        {/* Left side - Window controls and title */}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors shadow-sm hover:shadow-red-500/25"
              title="Close Terminal"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors shadow-sm hover:shadow-yellow-500/25"
              title="Minimize Terminal"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors shadow-sm hover:shadow-green-500/25"
              title={isMaximized ? "Restore" : "Maximize"}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-gray-200 text-lg font-semibold">
              LearnLinux Terminal
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              isConnected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMaximize}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title={isMaximized ? "Restore Window" : "Maximize Window"}
          >
            {isMaximized ? (
              <ArrowsPointingInIcon className="w-4 h-4" />
            ) : (
              <ArrowsPointingOutIcon className="w-4 h-4" />
            )}
          </button>
          
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="New Tab"
          >
            <Squares2X2Icon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-600/50 mx-2"></div>
          
          <button
            onClick={onMinimize}
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all duration-200"
            title="Minimize Terminal"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Close Terminal"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className={`bg-black/95 ${isMaximized ? 'h-[calc(100vh-10rem)]' : 'h-96 md:h-[600px]'}`}>
        {/* Terminal Info Bar */}
        <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/30 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-400">
            <span>Session: learning-session</span>
            <span>•</span>
            <span>Shell: /bin/bash</span>
            <span>•</span>
            <span>User: learner</span>
          </div>
          <div className="text-xs text-gray-500">
            Press Ctrl+L to clear screen • Ctrl+C to interrupt
          </div>
        </div>

        {/* Terminal Content */}
        <Terminal 
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          className="h-full"
        />
      </div>

      {/* Terminal Footer */}
      <div className="bg-gray-800/50 px-4 py-2 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>•</span>
          <span>UTF-8</span>
          <span>•</span>
          <span>Linux Sandbox</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Secure Environment</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TerminalContainer;