/**
 * Animated Background Decoration Component
 * Adds floating pixel GIF decoration elements to the background
 */
import { useState, useEffect } from 'react';

// List of all available GIF files
// Note: Spaces and special characters in filenames are automatically handled by the browser
const ALL_GIFS = [
  '/gifs/80S Pixel Art GIF.gif',
  '/gifs/Pixel Art GIF.gif',
  '/gifs/pixel GIF by haydiroket (Mert Keskin).gif',
];

// Debug: Print all GIF paths
console.log('🎬 All available GIF files:', ALL_GIFS);

// Function to randomly shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Randomly select specified number of GIFs
function getRandomGifs(count, excludeGifs = []) {
  const available = ALL_GIFS.filter(gif => !excludeGifs.includes(gif));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, Math.min(count, available.length));
}

function AnimatedBackground({ gifFiles = [], randomCount = null }) {
  const [selectedGif, setSelectedGif] = useState(null);

  useEffect(() => {
    let gif = null;

    if (gifFiles.length > 0) {
      // If custom GIF list provided, use the first one
      gif = gifFiles[0];
    } else if (randomCount !== null) {
      // If count specified, only select 1 GIF (ignore count parameter, as we want full-screen background)
      const gifs = getRandomGifs(1);
      gif = gifs[0] || null;
    } else {
      // Default: randomly select one GIF
      const gifs = shuffleArray(ALL_GIFS);
      gif = gifs[0] || null;
    }

    console.log('🎬 AnimatedBackground: Selected background GIF:', gif);
    setSelectedGif(gif);
  }, [gifFiles, randomCount]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ 
        zIndex: 0,
        // GPU acceleration optimization
        transform: 'translateZ(0)',
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      {/* Background gradient layer (as fallback) */}
      <div 
        className="absolute inset-0 bg-cyber-gradient cyber-grid-bg"
        style={{
          // GPU acceleration optimization
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      
      {/* Full-screen background GIF */}
      {selectedGif && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            pointerEvents: 'none',
            // GPU acceleration optimization
            transform: 'translateZ(0)',
            willChange: 'transform',
            contain: 'layout style paint',
            // Optimize rendering performance
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        >
          <img
            src={selectedGif}
            alt="Background GIF"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.3,
              // GPU acceleration optimization
              transform: 'translateZ(0)',
              willChange: 'transform',
              // Optimize image rendering
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
            }}
            onLoad={(e) => {
              console.log(`✅ Background GIF loaded successfully: ${selectedGif}`);
            }}
            onError={(e) => {
              console.error(`❌ Background GIF failed to load: ${selectedGif}`, e);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AnimatedBackground;

