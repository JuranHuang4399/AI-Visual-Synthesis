import { useState } from "react";
import CharacterForm from "../components/create/CharacterForm";
import GeneratingLoader from "../components/result/GeneratingLoader";
import ImageGrid from "../components/result/ImageGrid";
import StoryDisplay from "../components/result/StoryDisplay";
import ActionButtons from "../components/result/ActionButtons";
import AnimatedBackground from "../components/common/AnimatedBackground";
import BackButton from "../components/common/BackButton";

function CreateResultPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  // 创建页面使用1个GIF作为全屏背景
  const [createGifCount] = useState(1);

  // Mock data for testing
  const mockImages = [
    { url: "https://via.placeholder.com/256x256/ff006e/ffffff?text=Frame+1" },
    { url: "https://via.placeholder.com/256x256/bd00ff/ffffff?text=Frame+2" },
    { url: "https://via.placeholder.com/256x256/00d9ff/ffffff?text=Frame+3" },
    { url: "https://via.placeholder.com/256x256/ffea00/000000?text=Frame+4" },
  ];

  const handleGenerate = async (formData) => {
    console.log("Generating character with data:", formData);
    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setGeneratedData({
        name: formData.name,
        images: mockImages,
        story: `${formData.name} was born in the mystical realm of ${
          formData.characterClass
        }s. 
        Known for being ${
          formData.personality
        }, this legendary hero has faced countless battles. 
        Their appearance is striking: ${formData.appearance}. 
        ${
          formData.specialFeatures
            ? `What makes them truly unique: ${formData.specialFeatures}.`
            : ""
        }
        
        Through determination and skill, ${
          formData.name
        } has become a legend among heroes.`,
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownloadAll = () => {
    console.log("Downloading all images...");
    alert("Download feature will be implemented with backend!");
  };

  const handleSaveToGallery = async () => {
    console.log("Saving to gallery...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Save feature will be implemented with backend!");
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground randomCount={createGifCount} />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
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
                <ImageGrid images={generatedData.images} />
                <StoryDisplay
                  story={generatedData.story}
                  characterName={generatedData.name}
                />
                <ActionButtons
                  onDownloadAll={handleDownloadAll}
                  onSaveToGallery={handleSaveToGallery}
                />
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
      </div>
    </div>
  );
}

export default CreateResultPage;
