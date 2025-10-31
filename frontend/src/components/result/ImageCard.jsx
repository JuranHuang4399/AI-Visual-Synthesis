import { useState } from 'react';

function ImageCard({ image, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative aspect-square bg-cyber-dark-200 rounded-lg overflow-hidden group cursor-pointer neon-border-cyan"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={image.url} 
        alt={`Frame ${index + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <span className="text-white text-lg font-bold mb-2">
            Frame {index + 1}
          </span>
          <button className="px-3 py-1 bg-cyber-cyan text-cyber-dark-300 rounded-md text-sm font-semibold hover:bg-cyber-pink transition-colors">
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageCard;
