import React from "react";
import {
  PlayIcon,
  ChevronRightIcon,
  CommandLineIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
const Header = () => {
  return (
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
        <a
          href="#features"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Features
        </a>
        <a
          href="#about"
          className="text-gray-300 hover:text-white transition-colors"
        >
          About
        </a>
        <Link
          to="/docs"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Documentation
        </Link>
      </div>
    </nav>
  );
};

export default Header;
