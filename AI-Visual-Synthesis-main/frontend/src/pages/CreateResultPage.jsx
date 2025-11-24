import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterForm from "../components/create/CharacterForm";
import GeneratingLoader from "../components/result/GeneratingLoader";
import WalkingPixelCharacter from "../components/common/WalkingPixelCharacter";

function CreateResultPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

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

    // Mock data for testing
    const mockImages = [
      { url: "https://via.placeholder.com/256x256/ff006e/ffffff?text=Frame+1" },
      { url: "https://via.placeholder.com/256x256/bd00ff/ffffff?text=Frame+2" },
      { url: "https://via.placeholder.com/256x256/00d9ff/ffffff?text=Frame+3" },
      { url: "https://via.placeholder.com/256x256/ffea00/000000?text=Frame+4" },
    ];

    // Simulate API call
    setTimeout(() => {
      const generatedData = {
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
      };
      
      setIsGenerating(false);
      
      // Navigate to result page with generated data
      navigate("/result", { state: { generatedData } });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid-bg relative overflow-hidden">
      {/* Pixel Dinosaur Decorations - Covering entire screen */}
      {/* Top row */}
      <WalkingPixelCharacter startX={-10} startY="5%" speed={20} delay={0} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="8%" speed={18} delay={1} size="medium" direction="left" />
      <WalkingPixelCharacter startX={-10} startY="12%" speed={22} delay={2} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="15%" speed={19} delay={3} size="medium" direction="left" />
      
      {/* Middle-top row */}
      <WalkingPixelCharacter startX={-10} startY="25%" speed={21} delay={4} size="medium" direction="right" />
      <WalkingPixelCharacter startX={110} startY="28%" speed={17} delay={5} size="small" direction="left" />
      <WalkingPixelCharacter startX={-10} startY="32%" speed={23} delay={6} size="medium" direction="right" />
      <WalkingPixelCharacter startX={110} startY="35%" speed={20} delay={7} size="small" direction="left" />
      
      {/* Middle row */}
      <WalkingPixelCharacter startX={-10} startY="45%" speed={18} delay={8} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="48%" speed={24} delay={9} size="medium" direction="left" />
      <WalkingPixelCharacter startX={-10} startY="52%" speed={19} delay={10} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="55%" speed={21} delay={11} size="medium" direction="left" />
      
      {/* Middle-bottom row */}
      <WalkingPixelCharacter startX={-10} startY="65%" speed={22} delay={12} size="medium" direction="right" />
      <WalkingPixelCharacter startX={110} startY="68%" speed={16} delay={13} size="small" direction="left" />
      <WalkingPixelCharacter startX={-10} startY="72%" speed={20} delay={14} size="medium" direction="right" />
      <WalkingPixelCharacter startX={110} startY="75%" speed={23} delay={15} size="small" direction="left" />
      
      {/* Bottom row */}
      <WalkingPixelCharacter startX={-10} startY="85%" speed={19} delay={16} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="88%" speed={25} delay={17} size="medium" direction="left" />
      <WalkingPixelCharacter startX={-10} startY="92%" speed={18} delay={18} size="small" direction="right" />
      <WalkingPixelCharacter startX={110} startY="95%" speed={22} delay={19} size="medium" direction="left" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-glow-cyan">
          Create Your Character
        </h1>

        {/* Single Column Layout - Form Only */}
        <div className="max-w-2xl mx-auto">
          <div className="card-cyber">
            <h2 className="text-2xl font-bold mb-6 text-cyber-pink">
              Character Details
            </h2>
            
            {/* Generating State */}
            {isGenerating && (
              <div className="mb-6">
                <GeneratingLoader
                  message="AI is creating your character..."
                  subMessage="This may take 30-60 seconds"
                />
              </div>
            )}

            <CharacterForm onSubmit={handleGenerate} isLoading={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateResultPage;
