import React, { useState } from 'react';
import { XMarkIcon, MinusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import Terminal from './Terminal';

const TerminalContainer = ({ onClose, onMinimize }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleConnect = () => {
    console.log('Terminal connected');
  };

  const handleDisconnect = () => {
    console.log('Terminal disconnected');
  };

  return (
    <div className={`bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${
      isMaximized ? 'fixed inset-4 z-50' : 'w-full max-w-6xl mx-auto'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
              title="Close"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
              title="Minimize"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
              title="Maximize"
            />
          </div>
          <div className="text-gray-300 text-sm font-medium">
            Linux Terminal - Learn Mode
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMaximize}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className={`${isMaximized ? 'h-[calc(100vh-8rem)]' : 'h-96 md:h-[500px]'}`}>
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