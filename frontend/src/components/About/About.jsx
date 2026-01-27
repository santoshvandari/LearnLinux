import React from "react";

const About = ({isVisible}) => {
  return (
    <div
      id="about"
      className={`max-w-3xl mx-auto mb-24 text-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <h2 className="text-3xl font-bold mb-8 text-white">About LearnLinux</h2>
      <div className="text-gray-400 leading-relaxed text-lg space-y-6">
        <p>
          LearnLinux is an interactive platform designed to demystify the Linux
          command line. We believe that the best way to learn is by doing, which
          is why we've built a realistic terminal environment right in your
          browser.
        </p>
        <p>
          Whether you're preparing for a system administration interview,
          learning backend development, or just curious about how operating
          systems work, our safety-guaranteed sandbox allows you to experiment
          without fear.
        </p>
      </div>
    </div>
  );
};

export default About;
