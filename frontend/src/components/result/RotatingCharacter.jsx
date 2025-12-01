import { useState, useEffect, useMemo } from 'react';

/**
 * Rotating Character Display Component
 * Automatically loops through 8 direction images to create rotation animation effect
 */
function RotatingCharacter({ images = [], autoPlay = true, interval = 500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Ensure images exist
  if (!images || images.length === 0) {
    return (
      <div className="w-32 h-32 bg-cyber-dark-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
        <span className="text-gray-500 text-xs">No image</span>
      </div>
    );
  }

  // Sort images by direction order (ensure clockwise rotation)
  const sortedImages = useMemo(() => {
    const directionOrder = ["north", "north-east", "east", "south-east", 
                           "south", "south-west", "west", "north-west"];
    return [...images].sort((a, b) => {
      const aIndex = directionOrder.indexOf(a.direction || a.angle || '');
      const bIndex = directionOrder.indexOf(b.direction || b.angle || '');
      return aIndex - bIndex;
    });
  }, [images]);

  // Preload all images to reduce stuttering
  useEffect(() => {
    sortedImages.forEach((img) => {
      if (img.url && !loadedImages.has(img.url)) {
        const imageLoader = new Image();
        imageLoader.src = img.url;
        imageLoader.onload = () => {
          setLoadedImages((prev) => new Set([...prev, img.url]));
        };
      }
    });
  }, [sortedImages, loadedImages]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || sortedImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, sortedImages.length, interval]);

  const currentImage = sortedImages[currentIndex];

  return (
    <div className="relative">
      {/* Rotating character display */}
      <div className="w-32 h-32 bg-cyber-dark-200 rounded-lg overflow-hidden neon-border-cyan relative">
        {currentImage?.url ? (
          <img 
            src={currentImage.url} 
            alt={`Character rotation ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-200 ease-in-out"
            style={{
              opacity: loadedImages.has(currentImage.url) ? 1 : 0.5,
            }}
            onLoad={() => {
              setLoadedImages((prev) => new Set([...prev, currentImage.url]));
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">Loading...</span>
          </div>
        )}
        
        {/* Play/pause button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-cyber-dark-200 hover:bg-cyber-dark-100 transition-colors"
            title={isPlaying ? 'Pause rotation' : 'Play rotation'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-cyber-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-cyber-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Direction indicator */}
      <div className="mt-2 text-center">
        <div className="text-xs text-cyber-cyan mb-1">
          {currentImage?.direction || currentImage?.angle || `Frame ${currentIndex + 1}`}
        </div>
        <div className="flex justify-center gap-1">
          {sortedImages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-cyber-cyan' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RotatingCharacter;

