import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Showcase() {
  const [examples, setExamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/characters?status=completed&limit=3`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }

        const data = await response.json();
        const characters = data.characters || [];
        
        // Convert to display format, only take first 3
        const formattedCharacters = characters.slice(0, 3).map(char => ({
          id: char.id,
          name: char.name,
          image: char.images && char.images.length > 0 && char.images[0].url
            ? (char.images[0].url.startsWith('http') 
                ? char.images[0].url 
                : `${apiUrl}${char.images[0].url.startsWith('/') ? '' : '/'}${char.images[0].url}`)
            : null,
          description: char.story?.content || char.story || char.description || char.name,
        }));
        
        setExamples(formattedCharacters);
      } catch (error) {
        console.error('Failed to fetch example characters:', error);
        // If fetch fails, use empty array
        setExamples([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <section className="py-20 bg-cyber-dark-200">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-glow-pink">Example Characters</span>
        </h2>
        <p className="text-center text-gray-400 mb-12">
          See what others have created
        </p>

        {/* Examples Grid */}
        {isLoading ? (
          <div className="text-center text-cyber-cyan py-12">
            <div className="animate-pulse">Loading examples...</div>
          </div>
        ) : examples.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No example characters available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map((example) => (
              <div 
                key={example.id} 
                className="card-cyber group cursor-pointer"
                onClick={() => navigate(`/characters/${example.id}`)}
              >
                {/* Character Image */}
                <div className="relative overflow-hidden rounded-lg mb-4 flex justify-center">
                  {example.image ? (
                    <img
                      src={example.image}
                      alt={example.name}
                      className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110"
                      style={{
                        // GPU acceleration optimization
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-cyber-dark-200 flex items-center justify-center border-2 border-dashed border-gray-600">
                      <span className="text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-cyber-dark-300 to-transparent opacity-60"
                    style={{
                      pointerEvents: 'none',
                      transform: 'translateZ(0)',
                    }}
                  ></div>
                </div>

                {/* Character Info */}
                <h3 className="text-xl font-bold text-cyber-cyan mb-2">
                  {example.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">{example.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Showcase;
