import { useState, useEffect } from 'react';

/**
 * Animated character card component with GIF playback
 * 
 * Props:
 * - character: Character object { id, name, images: [{url}], gifUrl? }
 * - onPlay: Play callback
 */
function AnimatedCharacterCard({ character, onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [isLoadingGif, setIsLoadingGif] = useState(false);

  // Use pre-generated GIF URL if available
  useEffect(() => {
    if (character.gifUrl) {
      setGifUrl(character.gifUrl);
    }
  }, [character.gifUrl]);

  const handlePlay = async () => {
    if (gifUrl) {
      // If GIF already exists, play it directly
      setIsPlaying(true);
      onPlay?.(character.id);
      return;
    }

    // If no GIF, generate it dynamically
    if (character.images && character.images.length >= 2) {
      setIsLoadingGif(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/generate_gif`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_urls: character.images.map(img => img.url),
            duration: 200, // 200ms per frame
            loop: 0, // Infinite loop
            return_base64: true // Return base64 to avoid file management
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setGifUrl(data.gif_url);
          setIsPlaying(true);
          onPlay?.(character.id);
        } else {
          console.error('Failed to generate GIF');
        }
      } catch (error) {
        console.error('Error generating GIF:', error);
      } finally {
        setIsLoadingGif(false);
      }
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  // Get first frame as preview image
  const previewImage = character.images?.[0]?.url || '';

  return (
    <div className="relative bg-cyber-dark-200 rounded-lg overflow-hidden neon-border-cyan group">
      {/* Preview image or GIF */}
      <div className="aspect-square relative">
        {isPlaying && gifUrl ? (
          <img
            src={gifUrl}
            alt={`${character.name} animation`}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoadingGif(false)}
          />
        ) : (
          <img
            src={previewImage}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Loading indicator */}
        {isLoadingGif && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-cyber-cyan animate-pulse">Generating animation...</div>
          </div>
        )}

        {/* Play/Pause button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={isLoadingGif}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-cyber-cyan text-cyber-dark-300 rounded-full p-4 hover:bg-cyber-pink disabled:opacity-50"
              aria-label="Play animation"
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-cyber-pink text-white rounded-full p-4 hover:bg-cyber-cyan"
              aria-label="Stop animation"
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Character info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-cyber-cyan mb-1">
          {character.name}
        </h3>
        {character.story && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {character.story.substring(0, 100)}...
          </p>
        )}
        <div className="mt-2 text-xs text-gray-500">
          {character.images?.length || 0} frames
        </div>
      </div>
    </div>
  );
}

export default AnimatedCharacterCard;

