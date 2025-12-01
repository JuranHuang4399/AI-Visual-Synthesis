import { useState } from "react";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Showcase from "../components/home/Showcase";
import Footer from "../components/home/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HomeNavBar from "../components/common/HomeNavBar";

function HomePage() {
  // Homepage uses 1 GIF as full-screen background
  const [homeGifCount] = useState(1);

  return (
    <div 
      className="min-h-screen relative"
      style={{
        // Optimize scroll performance
        transform: 'translateZ(0)',
        willChange: 'scroll-position',
      }}
    >
      <AnimatedBackground randomCount={homeGifCount} />
      <div 
        className="relative z-10"
        style={{
          // GPU acceleration optimization
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <HomeNavBar />
        <Hero />
        <Features />
        <Showcase />
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
