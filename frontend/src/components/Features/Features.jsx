import {
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

import React from "react";
const features = [
  {
    icon: <CommandLineIcon className="w-8 h-8" />,
    title: "Authentic Terminal",
    description:
      "Experience a real Linux terminal environment with actual command execution",
    color: "text-green-400",
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    title: "Safe Sandbox",
    description:
      "Learn safely in an isolated environment without affecting your system",
    color: "text-blue-400",
  },
  {
    icon: <AcademicCapIcon className="w-8 h-8" />,
    title: "Interactive Learning",
    description:
      "Master Linux commands through hands-on practice and immediate feedback",
    color: "text-purple-400",
  },
  {
    icon: <BookOpenIcon className="w-8 h-8" />,
    title: "Command Reference",
    description:
      "Built-in documentation and examples for every command you learn",
    color: "text-yellow-400",
  },
  {
    icon: <CpuChipIcon className="w-8 h-8" />,
    title: "Real-time Execution",
    description:
      "See immediate results and understand how commands affect the system",
    color: "text-red-400",
  },
  {
    icon: <CodeBracketIcon className="w-8 h-8" />,
    title: "Advanced Features",
    description:
      "Support for pipes, redirections, and complex command combinations",
    color: "text-indigo-400",
  },
];

const Features = ({isVisible}) => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-white" id="features">
        Features
      </h2>
      <div
        id="features"
        className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 max-w-7xl transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="group p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className={`${feature.color} mb-4 inline-block`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Features;
