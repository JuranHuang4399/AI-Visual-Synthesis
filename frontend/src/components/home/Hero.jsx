import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="py-20 text-center">
      {/* Main title with neon effect */}
      <h1 className="title-neon mb-6">🎮 AI STORY CREATOR</h1>

      {/* Subtitle */}
      <p className="subtitle-neon mb-4">
        Generate Pixel Art Characters with AI
      </p>

      {/* Description */}
      <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
        Create unique pixel art characters and backstories powered by Stable
        Diffusion and GPT-4. Transform your ideas into animated game sprites.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/create">
          <button className="btn-cyber-primary">Start Creating</button>
        </Link>

        <Link to="/gallery">
          <button className="btn-cyber-secondary">View Gallery</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
