import { useState } from "react";
import CharacterForm from "../components/create/CharacterForm";
import GeneratingLoader from "../components/result/GeneratingLoader";
import ImageGrid from "../components/result/ImageGrid";
import StoryDisplay from "../components/result/StoryDisplay";
import ActionButtons from "../components/result/ActionButtons";
import RotatingCharacter from "../components/result/RotatingCharacter";
import PageLayout from "../components/common/PageLayout";

function CreateResultPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [lastFormData, setLastFormData] = useState(null); // Save last form data for regenerate

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    setLastFormData(formData); // Save form data

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/characters/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          characterClass: formData.characterClass,
          personality: formData.personality,
          appearance: formData.appearance,
          specialFeatures: formData.specialFeatures,
          imageCount: formData.imageCount || 4, // 1, 4, or 8
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Generation failed with status ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || errorData.error || 'Failed to generate character');
      }

      const data = await response.json();
      
      // Convert image URLs to full URLs (if API returns relative paths) (with safety check)
      const images = (data.images || []).map(img => ({
        ...img,
        url: img.url && img.url.startsWith('http') 
          ? img.url 
          : `${apiUrl}${img.url && img.url.startsWith('/') ? '' : '/'}${img.url || ''}`
      }));

      setGeneratedData({
        id: data.id,
        name: data.name,
        baseImage: data.baseImage || images[0], // Base image (for rotate character display)
        images: images,
        story: data.story?.content || data.story || '',
      });
    } catch (error) {
      console.error('Failed to generate character:', error);
      
      // More detailed error information
      let errorMessage = 'Generation failed';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please ensure the backend server is running (http://localhost:5000)';
      } else if (error.message) {
        errorMessage = `Generation failed: ${error.message}`;
      } else {
        errorMessage = `Generation failed: ${error.toString()}`;
      }
      
      alert(errorMessage);
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAll = () => {
    console.log("Downloading all images...");
    alert("Download feature will be implemented with backend!");
  };

  const handleSaveToGallery = async () => {
    if (!generatedData || !generatedData.id) {
      alert("No character to save. Please generate a character first.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/characters/${generatedData.id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If response is not JSON, use status text
          throw new Error(`Save failed with status ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || errorData.error || `Failed to save character (${response.status})`);
      }

      const data = await response.json().catch(() => ({}));
      alert(`Character "${generatedData.name}" saved to gallery successfully!`);
      
      // Optional: Navigate to gallery page
      // window.location.href = '/gallery';
      
    } catch (error) {
      console.error('Failed to save character:', error);
      
      // More detailed error information
      let errorMessage = 'Save failed';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please ensure the backend server is running (http://localhost:5000)';
      } else if (error.message) {
        errorMessage = `Save failed: ${error.message}`;
      } else {
        errorMessage = `Save failed: ${error.toString()}`;
      }
      
      alert(errorMessage);
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  };

  return (
    <PageLayout backgroundGifCount={1} showBackButton={true}>
      <h1 className="text-4xl font-bold text-center mb-8 text-glow-cyan">
        Create Your Character
      </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Create Form */}
          <div className="card-cyber">
            <h2 className="text-2xl font-bold mb-6 text-cyber-pink">
              Character Details
            </h2>
            <CharacterForm onSubmit={handleGenerate} isLoading={isGenerating} />
          </div>

          {/* Right: Result Display */}
          <div className="card-cyber">
            <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">
              Generated Result
            </h2>

            {/* Generating State */}
            {isGenerating && (
              <GeneratingLoader
                message="AI is creating your character..."
                subMessage="This may take 30-60 seconds"
              />
            )}

            {/* Generated Result */}
            {!isGenerating && generatedData && (
              <div className="space-y-6">
                {/* 1. Rotate Character display (automatic rotation animation) */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-cyber-cyan">Rotate Character</h3>
                  <div className="flex justify-center">
                    <RotatingCharacter 
                      images={generatedData.images || []}
                      autoPlay={true}
                      interval={500} // Switch image every 500ms (slower rotation speed)
                    />
                  </div>
                </div>

                {/* 2. Direction Frames Grid - Dynamic based on image count */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-cyber-cyan">
                    {generatedData.images?.length === 1 ? '1 Direction' : 
                     generatedData.images?.length === 4 ? '4 Directions' : 
                     generatedData.images?.length === 8 ? '8 Directions' : 
                     `${generatedData.images?.length || 0} Directions`}
                  </h3>
                  <div className={`grid ${generatedData.images?.length === 1 ? 'grid-cols-1' : 
                                         generatedData.images?.length === 4 ? 'grid-cols-2' : 
                                         generatedData.images?.length === 8 ? 'grid-cols-4' : 
                                         'grid-cols-2'} gap-2`}>
                    {generatedData.images && generatedData.images.length > 0 ? (
                      generatedData.images.map((image, index) => (
                        <div 
                          key={index}
                          className="aspect-square bg-cyber-dark-200 rounded-lg overflow-hidden neon-border-cyan"
                        >
                          <img 
                            src={image.url || ''} 
                            alt={`Direction ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      // Display placeholder slots based on expected count
                      Array.from({ length: generatedData.images?.length || 4 }).map((_, index) => (
                        <div 
                          key={index}
                          className="aspect-square bg-cyber-dark-200 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center"
                        >
                          <span className="text-gray-500 text-xs">Empty</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Story */}
                <StoryDisplay
                  story={generatedData.story}
                  characterName={generatedData.name}
                />

                {/* 4. Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => lastFormData && handleGenerate(lastFormData)}
                    disabled={!lastFormData}
                    className={`flex-1 btn-cyber-secondary ${
                      !lastFormData ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleSaveToGallery}
                    className="flex-1 btn-cyber-primary"
                  >
                    Save Character
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isGenerating && !generatedData && (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Fill the form and generate your character</p>
              </div>
            )}
          </div>
        </div>
    </PageLayout>
  );
}

export default CreateResultPage;
