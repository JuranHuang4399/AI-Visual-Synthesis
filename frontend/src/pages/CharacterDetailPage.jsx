import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import BackButton from '../components/common/BackButton';
import RotatingCharacter from '../components/result/RotatingCharacter';
import StoryDisplay from '../components/result/StoryDisplay';

function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/v1/characters/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch character');
        }

        const data = await response.json();
        
        // Convert image URLs to full URLs (with safety check)
        const imagesWithFullUrls = (data.images || []).map(img => ({
          ...img,
          url: img.url && img.url.startsWith('http') 
            ? img.url 
            : `${apiUrl}${img.url && img.url.startsWith('/') ? '' : '/'}${img.url || ''}`
        }));
        
        setCharacter({
          ...data,
          images: imagesWithFullUrls
        });
      } catch (error) {
        console.error('Failed to fetch character:', error);
        setIsLoading(false);
        // Don't navigate away immediately, let user see the error
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCharacter();
    }
  }, [id, navigate]);

  const handleDeleteCharacter = async () => {
    if (!character || !character.name) {
      alert('Character data not available');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete "${character.name}"? This action cannot be undone and will delete all images.`)) {
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/characters/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete character');
      }

      alert('Character deleted successfully!');
      navigate('/characters');
    } catch (error) {
      console.error('Failed to delete character:', error);
      alert(`Failed to delete character: ${error.message}`);
    }
  };

  const handleDownload = async (type) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let url;
      
      switch(type) {
        case 'images':
          url = `${apiUrl}/api/v1/characters/${id}/download/images`;
          break;
        case 'gif':
          url = `${apiUrl}/api/v1/characters/${id}/download/gif`;
          break;
        case 'all':
          url = `${apiUrl}/api/v1/characters/${id}/download/all`;
          break;
        case 'export':
          url = `${apiUrl}/api/v1/characters/${id}/download/export`;
          break;
        default:
          return;
      }
      
      // Create temporary link for download
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download:', error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  const handleDownloadDirection = async (direction) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = `${apiUrl}/api/v1/characters/${id}/images/direction/${direction}`;
      
      // Create temporary link for download
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download direction:', error);
      alert(`Failed to download ${direction} direction: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    // Re-fetch character data
    const fetchCharacter = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/v1/characters/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch character');
        }

        const data = await response.json();
        
        // Convert image URLs to full URLs (with safety check)
        const imagesWithFullUrls = (data.images || []).map(img => ({
          ...img,
          url: img.url && img.url.startsWith('http') 
            ? img.url 
            : `${apiUrl}${img.url && img.url.startsWith('/') ? '' : '/'}${img.url || ''}`
        }));
        
        setCharacter({
          ...data,
          images: imagesWithFullUrls
        });
        
        alert('Character data refreshed!');
      } catch (error) {
        console.error('Failed to refresh character:', error);
        alert('Failed to refresh character data');
      }
    };
    
    fetchCharacter();
  };

  if (isLoading) {
    return (
      <PageLayout backgroundGifCount={1}>
        <div className="text-center text-cyber-cyan">
          <div className="animate-pulse">Loading character...</div>
        </div>
      </PageLayout>
    );
  }

  if (!character) {
    return (
      <PageLayout backgroundGifCount={1} showBackButton={true}>
        <div className="text-center text-cyber-cyan py-20">
          <p className="text-lg mb-2">Character not found</p>
          <p className="text-sm text-gray-400">The character you're looking for doesn't exist or has been deleted.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout backgroundGifCount={1}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
          <BackButton />
          <div className="flex gap-2 flex-wrap">
            {/* Download Menu */}
            <div className="relative group">
              <button className="btn-cyber-secondary">📥 Download</button>
              <div className="absolute right-0 mt-2 w-48 bg-cyber-dark-200 border border-cyber-cyan rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  <button 
                    onClick={() => handleDownload('images')}
                    className="w-full text-left px-4 py-2 text-sm text-cyber-cyan hover:bg-cyber-dark-100"
                  >
                    📷 Download Images
                  </button>
                  {character.gif && (
                    <button 
                      onClick={() => handleDownload('gif')}
                      className="w-full text-left px-4 py-2 text-sm text-cyber-cyan hover:bg-cyber-dark-100"
                    >
                      🎬 Download GIF
                    </button>
                  )}
                  <button 
                    onClick={() => handleDownload('all')}
                    className="w-full text-left px-4 py-2 text-sm text-cyber-cyan hover:bg-cyber-dark-100"
                  >
                    📦 Download All
                  </button>
                </div>
              </div>
            </div>
            
            {/* Export */}
            <button 
              onClick={() => handleDownload('export')}
              className="btn-cyber-secondary"
              title="Export complete package (images + story)"
            >
              📤 Export
            </button>
            
            {/* Refresh */}
            <button 
              onClick={handleRefresh}
              className="btn-cyber-secondary"
              title="Refresh character data"
            >
              🔄 Refresh
            </button>
            
            {/* Delete Character */}
            <button 
              onClick={handleDeleteCharacter}
              className="btn-cyber-secondary text-red-400 hover:text-red-500 hover:bg-red-500/10"
              title="Delete character"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Character Info Section */}
        <div className="card-cyber mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sprite Preview */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Sprite Preview</h3>
              {character.images && character.images.length > 0 ? (
                <RotatingCharacter 
                  images={character.images}
                  autoPlay={true}
                  interval={500}
                />
              ) : (
                <div className="w-32 h-32 bg-cyber-dark-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}
              
              {/* Direction Frames Grid - Dynamic layout based on image count */}
              {character.images && character.images.length > 0 && (
                <div className="mt-6 w-full">
                  <h4 className="text-md font-semibold text-cyber-cyan mb-3 text-center">Direction Frames</h4>
                  {/* Dynamic grid: 4 images = 2x2, 8 images = 2x4 */}
                  <div className={`grid ${character.images.length === 4 ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                    {/* Define all possible directions (8 directions) */}
                    {['north', 'north-east', 'east', 'south-east',
                      'south', 'south-west', 'west', 'north-west'].map((direction) => {
                      const image = (character.images || []).find(
                        img => img.direction === direction || img.angle === direction
                      );
                      
                      // Only render if image exists (for 4-image characters, only show the 4 that exist)
                      if (!image && character.images.length === 4) {
                        // For 4-image characters, only show north, east, south, west
                        if (!['north', 'east', 'south', 'west'].includes(direction)) {
                          return null;
                        }
                      }
                      
                      return (
                        <div 
                          key={direction}
                          className="relative aspect-square bg-cyber-dark-200 rounded-lg border border-cyber-cyan/30 overflow-hidden group hover:border-cyber-cyan transition-all"
                        >
                          {image ? (
                            <>
                              <img
                                src={image.url}
                                alt={direction}
                                className="w-full h-full object-cover"
                              />
                              {/* Download button overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={() => handleDownloadDirection(direction)}
                                  className="px-3 py-1 bg-cyber-cyan hover:bg-cyber-pink text-white text-xs rounded transition-colors"
                                  title={`Download ${direction} direction`}
                                >
                                  ⬇️ Download
                                </button>
                              </div>
                              {/* Direction label */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-cyber-cyan text-center py-1 px-2 truncate">
                                {direction}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs">N/A</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Character Details */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-cyber-cyan mb-2">
                  {character.name}
                  <button className="ml-2 text-cyber-pink hover:text-cyber-cyan">
                    ✏️
                  </button>
                </h2>
                <p className="text-gray-400">{character.description || character.name}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <span className="px-3 py-1 bg-cyber-dark-100 rounded text-cyber-cyan">
                  64x64px
                </span>
                <span className="px-3 py-1 bg-cyber-dark-100 rounded text-cyber-cyan">
                  4 directions
                </span>
                <span className="px-3 py-1 bg-cyber-dark-100 rounded text-cyber-cyan">
                  low top-down view
                </span>
              </div>

              {/* Story Section - Inside the same card */}
              {character.story && (
                <div className="mt-6 pt-6 border-t border-cyber-cyan/30">
                  <StoryDisplay
                    story={character.story}
                    characterName={character.name}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
    </PageLayout>
  );
}

export default CharacterDetailPage;

