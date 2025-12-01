/**
 * Pixel Dinosaur Background Component
 * Adds colorful pixel dinosaurs walking in the login page background
 */
import { useState, useEffect } from 'react';

// Dinosaur color configuration (colorful)
const DINOSAUR_COLORS = [
  { body: '#ff006e', eye: '#ffffff', belly: '#ff4da6' }, // Pink
  { body: '#00d9ff', eye: '#ffffff', belly: '#4de6ff' }, // Cyan
  { body: '#bd00ff', eye: '#ffffff', belly: '#d24dff' }, // Purple
  { body: '#ffea00', eye: '#000000', belly: '#fff44f' }, // Yellow
  { body: '#00ff88', eye: '#ffffff', belly: '#4dffaa' }, // Green
  { body: '#ff8800', eye: '#ffffff', belly: '#ffaa4d' }, // Orange
  { body: '#8800ff', eye: '#ffffff', belly: '#aa4dff' }, // Deep purple
  { body: '#00ffea', eye: '#000000', belly: '#4dfff4' }, // Cyan-green
];

// Generate random position and speed
function generateDinosaurProps(index, total) {
  const colors = DINOSAUR_COLORS[index % DINOSAUR_COLORS.length];
  // Distribute across 5 horizontal lanes
  const lane = index % 5;
  // Use 50% as center starting point, animation handles full-screen movement
  const startX = 50; // Screen center, animation moves from outside left to outside right
  const duration = 10 + (index % 3) * 3; // 10-16 seconds to complete one cycle
  const delay = (index * 0.8) % 5; // Stagger start times
  
  return {
    colors,
    top: `${10 + lane * 18}%`, // Distribute at different heights (10%, 28%, 46%, 64%, 82%)
    duration: `${duration}s`,
    delay: `${delay}s`,
    startX,
  };
}

// Pixel dinosaur SVG component
function PixelDinosaur({ colors }) {
  return (
    <div className="pixel-dinosaur-walk">
      <svg
        width="40"
        height="40"
        viewBox="0 0 32 32"
        style={{ display: 'block', imageRendering: 'pixelated' }}
        preserveAspectRatio="none"
      >
        {/* Body (main torso) */}
        <rect x="8" y="12" width="16" height="12" fill={colors.body} />
        {/* Belly (light color) */}
        <rect x="10" y="14" width="12" height="8" fill={colors.belly} />
        {/* Head */}
        <rect x="4" y="8" width="12" height="10" fill={colors.body} />
        {/* Eyes */}
        <rect x="6" y="10" width="3" height="3" fill={colors.eye} />
        <rect x="10" y="10" width="3" height="3" fill={colors.eye} />
        {/* Mouth */}
        <rect x="4" y="16" width="4" height="2" fill={colors.body} />
        {/* Front leg (left) */}
        <rect x="6" y="24" width="4" height="6" fill={colors.body} />
        {/* Front leg (right) */}
        <rect x="10" y="24" width="4" height="6" fill={colors.body} />
        {/* Back leg (left) */}
        <rect x="18" y="24" width="4" height="6" fill={colors.body} />
        {/* Back leg (right) */}
        <rect x="22" y="24" width="4" height="6" fill={colors.body} />
        {/* Tail */}
        <rect x="24" y="14" width="4" height="4" fill={colors.body} />
        <rect x="26" y="10" width="2" height="4" fill={colors.body} />
        {/* Back decoration (optional) */}
        <rect x="10" y="10" width="2" height="2" fill={colors.belly} />
      </svg>
    </div>
  );
}

function PixelDinosaurBackground() {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    // Create 12 dinosaurs (colorful)
    const count = 12;
    const dinoList = Array.from({ length: count }, (_, index) => {
      const props = generateDinosaurProps(index, count);
      return {
        id: `dino-${index}`,
        ...props,
      };
    });
    setDinosaurs(dinoList);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-cyber-gradient cyber-grid-bg" />
      
      {/* Pixel dinosaurs */}
      {dinosaurs.map((dino) => (
        <div
          key={dino.id}
          style={{
            position: 'absolute',
            top: dino.top,
            left: `${dino.startX}%`,
            animation: `dinosaurWalk ${dino.duration} linear infinite`,
            animationDelay: dino.delay,
            filter: `drop-shadow(0 0 6px ${dino.colors.body}80) drop-shadow(0 0 2px rgba(0, 217, 255, 0.4))`,
            opacity: 0.8,
            zIndex: 1,
          }}
        >
          <PixelDinosaur colors={dino.colors} />
        </div>
      ))}
    </div>
  );
}

export default PixelDinosaurBackground;

