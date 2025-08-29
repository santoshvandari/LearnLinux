import React, { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  TerminalIcon, 
  CodeBracketIcon, 
  CommandLineIcon 
} from '@heroicons/react/24/outline';

const LandingPage = ({ onStartTerminal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Learn Linux Commands Interactively';

  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <TerminalIcon className="w-8 h-8" />,
      title: 'Real Terminal Experience',
      description: 'Practice with an authentic Linux terminal environment'
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: 'Interactive Learning',
      description: 'Learn by doing with hands-on command execution'
    },
    {
      icon: <CommandLineIcon className="w-8 h-8" />,
      title: 'Command Mastery',
      description: 'Master essential Linux commands and workflows'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Matrix-like code rain effect */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'grep', 'find', 'chmod'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-2xl">
              <TerminalIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master the command line with our interactive Linux terminal. 
            Practice real commands in a safe, guided environment.
          </p>
        </div>

        {/* Features */}
        <div className={`grid md:grid-cols-3 gap-8 mb-12 max-w-4xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-green-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={onStartTerminal}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 rounded-full hover:from-green-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            <span className="mr-2">Start Learning</span>
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>

        {/* Terminal preview */}
        <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 max-w-md">
            <div className="flex items-center mb-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-sm text-gray-400">terminal</div>
            </div>
            <div className="font-mono text-sm">
              <div className="text-green-400">$ whoami</div>
              <div className="text-white">learner</div>
              <div className="text-green-400">$ pwd</div>
              <div className="text-white">/home/learner</div>
              <div className="text-green-400 animate-pulse">$ _</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;