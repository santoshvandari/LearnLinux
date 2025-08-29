import React, { useState } from 'react'
import './App.css'
import LandingPage from './components/Landing/LandingPage'
import TerminalContainer from './components/Terminal/TerminalContainer'
import ErrorBoundary from './components/UI/ErrorBoundary'

function App() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleStartTerminal = () => {
    setShowTerminal(true);
    setIsMinimized(false);
  };

  const handleCloseTerminal = () => {
    setShowTerminal(false);
    setIsMinimized(false);
  };

  const handleMinimizeTerminal = () => {
    setIsMinimized(true);
  };

  const handleRestoreTerminal = () => {
    setIsMinimized(false);
  };

  const handleError = (error, errorInfo) => {
    // Log to external service if needed
    console.error('App Error:', error, errorInfo);
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <ErrorBoundary onError={handleError} showDetails={process.env.NODE_ENV === 'development'}>
        {!showTerminal ? (
          <LandingPage onStartTerminal={handleStartTerminal} />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 flex items-center justify-center">
            {!isMinimized ? (
              <TerminalContainer 
                onClose={handleCloseTerminal}
                onMinimize={handleMinimizeTerminal}
              />
            ) : (
              <div className="fixed bottom-4 left-4 z-50">
                <button
                  onClick={handleRestoreTerminal}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Terminal</span>
                </button>
              </div>
            )}
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export default App
