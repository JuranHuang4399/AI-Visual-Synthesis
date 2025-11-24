import { useLocation, useNavigate } from "react-router-dom";
import ImageGrid from "../components/result/ImageGrid";
import StoryDisplay from "../components/result/StoryDisplay";
import ActionButtons from "../components/result/ActionButtons";
import WalkingPixelCharacter from "../components/common/WalkingPixelCharacter";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedData = location.state?.generatedData;

  // If no data, redirect to create page
  if (!generatedData) {
    navigate("/create");
    return null;
  }

  const handleDownloadAll = () => {
    console.log("Downloading all images...");
    alert("Download feature will be implemented with backend!");
  };

  const handleSaveToGallery = async () => {
    console.log("Saving to gallery...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Save feature will be implemented with backend!");
  };

  const handleCreateNew = () => {
    navigate("/create");
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
          Your Character is Ready!
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="card-cyber">
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
              <div className="pt-4 border-t border-cyber-cyan/30">
                <button
                  onClick={handleCreateNew}
                  className="btn-cyber-secondary w-full"
                >
                  Create Another Character
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;

