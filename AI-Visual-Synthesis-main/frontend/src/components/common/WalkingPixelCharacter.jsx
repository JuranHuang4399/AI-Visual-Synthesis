import { useEffect, useRef } from "react";

function WalkingPixelCharacter({ 
  startX = 0, 
  startY = "50%", 
  speed = 15, 
  delay = 0,
  size = "medium",
  direction = "right" 
}) {
  const characterRef = useRef(null);

  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;

    // Set initial position
    character.style.left = `${startX}%`;
    character.style.top = startY;
    character.style.animationDelay = `${delay}s`;
    character.style.animationDuration = `${speed}s`;
    
    // Set direction class
    if (direction === "left") {
      character.classList.add("walk-left");
    } else {
      character.classList.add("walk-right");
    }
  }, [startX, startY, speed, delay, direction]);

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-28 h-28",
  };

  // Pixel size based on character size
  const pixelSize = size === "small" ? 2 : size === "medium" ? 3 : 4;

  return (
    <div
      ref={characterRef}
      className={`walking-pixel-character ${sizeClasses[size]} absolute pointer-events-none`}
      style={{
        opacity: 0.7,
        imageRendering: "pixelated",
        filter: "drop-shadow(0 0 3px rgba(255, 0, 110, 0.5))",
      }}
    >
      <svg
        viewBox="0 0 20 20"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "crisp-edges" }}
      >
        {/* Pixel dinosaur - Green T-Rex style */}
        <g className="pixel-character">
          {/* Head */}
          <rect x="4" y="2" width="6" height="5" fill="#4CAF50" />
          <rect x="3" y="3" width="1" height="3" fill="#4CAF50" />
          <rect x="10" y="3" width="1" height="3" fill="#4CAF50" />
          
          {/* Eye */}
          <rect x="6" y="3" width="2" height="2" fill="#FFFFFF" />
          <rect x="7" y="4" width="1" height="1" fill="#000000" />
          
          {/* Mouth */}
          <rect x="9" y="5" width="2" height="1" fill="#000000" />
          
          {/* Body */}
          <rect x="5" y="7" width="5" height="6" fill="#4CAF50" />
          <rect x="4" y="8" width="1" height="4" fill="#4CAF50" />
          <rect x="10" y="8" width="1" height="4" fill="#4CAF50" />
          
          {/* Belly - lighter green */}
          <rect x="6" y="9" width="3" height="3" fill="#66BB6A" />
          
          {/* Front leg (walking - up) */}
          <rect x="6" y="13" width="2" height="4" fill="#4CAF50" className="pixel-leg-left" />
          <rect x="5" y="15" width="1" height="2" fill="#4CAF50" className="pixel-leg-left" />
          <rect x="7" y="17" width="1" height="1" fill="#000000" className="pixel-leg-left" />
          
          {/* Back leg (walking - down) */}
          <rect x="8" y="14" width="2" height="4" fill="#4CAF50" className="pixel-leg-right" />
          <rect x="10" y="16" width="1" height="2" fill="#4CAF50" className="pixel-leg-right" />
          <rect x="9" y="18" width="1" height="1" fill="#000000" className="pixel-leg-right" />
          
          {/* Tail */}
          <rect x="2" y="9" width="3" height="2" fill="#4CAF50" />
          <rect x="1" y="10" width="1" height="1" fill="#4CAF50" />
          <rect x="2" y="11" width="2" height="1" fill="#4CAF50" />
          
          {/* Spikes on back */}
          <rect x="9" y="6" width="1" height="2" fill="#66BB6A" />
          <rect x="10" y="7" width="1" height="1" fill="#66BB6A" />
        </g>
      </svg>
    </div>
  );
}

export default WalkingPixelCharacter;

