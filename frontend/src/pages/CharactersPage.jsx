import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCard from '../components/character/CharacterCard';
import PageLayout from '../components/common/PageLayout';

function CharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch characters from API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/v1/characters?status=completed`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }

        const data = await response.json();
        
        // Convert image URLs to full URLs (with safety check)
        const charactersWithFullUrls = (data.characters || []).map(char => ({
          ...char,
          images: (char.images || []).map(img => ({
            ...img,
            url: img.url && img.url.startsWith('http') 
              ? img.url 
              : `${apiUrl}${img.url && img.url.startsWith('/') ? '' : '/'}${img.url || ''}`
          }))
        }));
        
        setCharacters(charactersWithFullUrls);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
        setCharacters([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleCharacterClick = (characterId) => {
    navigate(`/characters/${characterId}`);
  };

  return (
    <PageLayout backgroundGifCount={1} showBackButton={true}>
      <h1 className="title-neon text-center mb-8">Characters</h1>
      
      {isLoading ? (
        <div className="text-center text-cyber-cyan">
          <div className="animate-pulse">Loading characters...</div>
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg mb-2">No saved characters yet</p>
          <p className="text-sm">Go to the create page to generate your first character!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => handleCharacterClick(character.id)}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default CharactersPage;

