import React, {useState, useEffect} from "react";

import About from "../About/About";
import Features from "../Features/Features";
import Header from "../Header/Header";
import TerminalPreview from "../TerminalPreview/TerminalPreview";
import Footer from "../Footer/Footer";
import HeroSection from "../HeroSection/HeroSection";

const LandingPage = ({onStartTerminal}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Learn Linux Commands Interactively";

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-green-500/30">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-green-900/10 via-transparent to-transparent opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Header />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Hero Section */}
          <HeroSection
            isVisible={isVisible}
            typedText={typedText}
            onStartTerminal={onStartTerminal}
          />

          <Features isVisible={isVisible} />

          <About isVisible={isVisible} />

          {/* Terminal Preview */}
          <TerminalPreview isVisible={isVisible} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
