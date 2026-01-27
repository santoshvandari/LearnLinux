import React from "react";
import {
  PlayIcon,
  ChevronRightIcon,
  CommandLineIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
const TerminalPreview = ({isVisible}) => {
  return (
    <div
      className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-1 shadow-2xl shadow-black/50 max-w-2xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-800/80 rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-sm text-gray-400 font-mono">
            terminal — LearnLinux
          </div>
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
              drwxr-xr-x 3 learner learner 4096 Aug 30 10:15 .<br />
              drwxr-xr-x 3 root root 4096 Aug 30 10:15 ..
              <br />
              -rw-r--r-- 1 learner learner 220 Aug 30 10:15 .bash_logout
              <br />
              -rw-r--r-- 1 learner learner 3771 Aug 30 10:15 .bashrc
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">user@learnlinux:~$</span>
              <span className="animate-pulse bg-green-400 text-black w-2 h-4 inline-block">
                _
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPreview;
