import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Showcase from "../components/home/Showcase";
import Footer from "../components/home/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid-bg">
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </div>
  );
}

export default HomePage;
