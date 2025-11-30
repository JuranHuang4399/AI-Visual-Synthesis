import { useState, useEffect } from 'react';
import AnimatedCharacterCard from '../components/gallery/AnimatedCharacterCard';
import AnimatedBackground from '../components/common/AnimatedBackground';
import BackButton from '../components/common/BackButton';

function GalleryPage() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Gallery page uses 1 GIF as fullscreen background
  const [galleryGifCount] = useState(1);

  // TODO: Fetch characters from API
  useEffect(() => {
    // Example: Fetch data from API
    const fetchCharacters = async () => {
      try {
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/characters`);
        // const data = await response.json();
        // setCharacters(data);
        
        // Temporary mock data
        setCharacters([
          {
            id: '1',
            name: 'Pixel Warrior',
            images: [
              { url: 'https://via.placeholder.com/256x256/ff006e/ffffff?text=Frame+1' },
              { url: 'https://via.placeholder.com/256x256/bd00ff/ffffff?text=Frame+2' },
              { url: 'https://via.placeholder.com/256x256/00d9ff/ffffff?text=Frame+3' },
              { url: 'https://via.placeholder.com/256x256/ffea00/000000?text=Frame+4' },
            ],
            story: 'A brave warrior from the pixel realm...'
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground randomCount={galleryGifCount} />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="title-neon text-center mb-8">Character Gallery</h1>
        
        {isLoading ? (
          <div className="text-center text-cyber-cyan">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg mb-2">No saved characters yet</p>
            <p className="text-sm">Go to the create page to generate your first character!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <AnimatedCharacterCard
                key={character.id}
                character={character}
                onPlay={(id) => console.log('Play character animation:', id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
