import { useState } from "react";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Showcase from "../components/home/Showcase";
import Footer from "../components/home/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HomeNavBar from "../components/common/HomeNavBar";

function HomePage() {
  // 首页使用1个GIF作为全屏背景
  const [homeGifCount] = useState(1);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground randomCount={homeGifCount} />
      <div className="relative z-10">
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
