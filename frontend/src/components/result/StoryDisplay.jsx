function StoryDisplay({ story, characterName }) {
  // Handle both string and object formats
  const storyContent = story?.content || story || '';
  
  if (!storyContent) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyber-purple mb-4">
        📖 {characterName}'s Story
      </h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {storyContent}
      </p>
    </div>
  );
}

export default StoryDisplay;
