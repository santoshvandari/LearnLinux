import React from "react";
import {Link} from "react-router-dom";
import {
  PlayIcon,
  ChevronRightIcon,
  CommandLineIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
const HeroSection = ({isVisible, typedText, onStartTerminal}) => {
  return (
    <div
      className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
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
        <span className="text-green-400 font-semibold">
          Practice real commands in a safe, sandboxed environment.
        </span>
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
          className="group cursor-pointer relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-600 rounded-xl hover:from-green-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          <span>Start Learning Now</span>
          <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        <Link
          to="/docs"
          className="group cursor-pointer inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <BookOpenIcon className="w-5 h-5 mr-2" />
          <span>View Documentation</span>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
