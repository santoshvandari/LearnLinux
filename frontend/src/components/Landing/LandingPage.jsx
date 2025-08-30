import React, { useState, useEffect } from 'react';
import {
  ChevronRightIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlayIcon
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
      icon: <CommandLineIcon className="w-8 h-8" />,
      title: 'Authentic Terminal',
      description: 'Experience a real Linux terminal environment with actual command execution',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Safe Sandbox',
      description: 'Learn safely in an isolated environment without affecting your system',
      color: 'from-blue-400 to-cyan-600'
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: 'Interactive Learning',
      description: 'Master Linux commands through hands-on practice and immediate feedback',
      color: 'from-purple-400 to-pink-600'
    },
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: 'Command Reference',
      description: 'Built-in documentation and examples for every command you learn',
      color: 'from-yellow-400 to-orange-600'
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: 'Real-time Execution',
      description: 'See immediate results and understand how commands affect the system',
      color: 'from-red-400 to-rose-600'
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: 'Advanced Features',
      description: 'Support for pipes, redirections, and complex command combinations',
      color: 'from-indigo-400 to-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating code particles */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-xs font-mono animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          >
            {['ls -la', 'cd ~', 'pwd', 'mkdir', 'rm -rf', 'cp -r', 'mv', 'grep -r', 'find /', 'chmod 755', 'sudo', 'ps aux', 'top', 'htop', 'df -h'][Math.floor(Math.random() * 15)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-sm bg-black/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <CommandLineIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              LearnLinux
            </span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Hero Section */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl shadow-blue-500/25 animate-pulse">
                <CommandLineIcon className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className="animate-pulse text-green-400">|</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Master the command line with our interactive Linux terminal simulator.
              <br />
              <span className="text-green-400 font-semibold">Practice real commands in a safe, sandboxed environment.</span>
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100+</div>
                <div className="text-sm text-gray-400">Commands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">Safe</div>
                <div className="text-sm text-gray-400">Sandbox</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">Real</div>
                <div className="text-sm text-gray-400">Terminal</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onStartTerminal}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 rounded-xl hover:from-green-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                <span>Start Learning Now</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                <span>View Documentation</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-7xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} id="features">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-500`}></div>
                <div className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Terminal Preview */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-1 shadow-2xl shadow-black/50 max-w-2xl mx-auto">
              {/* Terminal Header */}
              <div className="bg-gray-800/80 rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400 font-mono">terminal — LearnLinux</div>
                <div className="w-12"></div>
              </div>
              {/* Terminal Content */}
              <div className="bg-black/90 rounded-b-xl p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-green-400 mr-2">user@learnlinux:~$</span>
                    <span className="text-white">whoami</span>
                  </div>
                  <div className="text-green-300">learner</div>
                  <div className="flex">
                    <span className="text-green-400 mr-2">user@learnlinux:~$</span>
                    <span className="text-white">ls -la</span>
                  </div>
                  <div className="text-blue-300">
                    drwxr-xr-x 3 learner learner  4096 Aug 30 10:15 .<br/>
                    drwxr-xr-x 3 root    root     4096 Aug 30 10:15 ..<br/>
                    -rw-r--r-- 1 learner learner   220 Aug 30 10:15 .bash_logout<br/>
                    -rw-r--r-- 1 learner learner  3771 Aug 30 10:15 .bashrc
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">user@learnlinux:~$</span>
                    <span className="animate-pulse bg-green-400 text-black w-2 h-4 inline-block">_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-500 text-sm">
          <div className="mb-2">
            Built with ❤️ for Linux enthusiasts
          </div>
          <div>
            Powered by React, Django, and WebSockets
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;