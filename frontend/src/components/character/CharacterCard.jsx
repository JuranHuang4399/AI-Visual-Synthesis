import { useState } from 'react';

/**
 * Character Card Component
 * Used to display character cards on the Characters page
 * 
 * Props:
 * - character: Character object { id, name, images: [{url}], story }
 * - onClick: Click callback
 */
function CharacterCard({ character, onClick }) {
  const [imageError, setImageError] = useState(false);

  // Get first image as preview
  const previewImage = character.images?.[0]?.url || '';

  return (
    <div 
      className="relative bg-cyber-dark-200 rounded-lg overflow-hidden neon-border-cyan group cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    >
      {/* Preview image */}
      <div className="aspect-square relative">
        {previewImage && !imageError ? (
          <img
            src={previewImage}
            alt={character.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-cyber-dark-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyber-cyan font-semibold">
            Click to view details
          </div>
        </div>
      </div>

      {/* Character info */}
      <div className="p-2">
        <h3 className="text-sm font-bold text-cyber-cyan mb-1 truncate">
          {character.name}
        </h3>
        <div className="text-xs text-gray-500">
          {character.images?.length || 0} dirs
        </div>
      </div>
    </div>
  );
}

export default CharacterCard;

