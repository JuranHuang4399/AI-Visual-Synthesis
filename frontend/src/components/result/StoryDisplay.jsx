function StoryDisplay({ story, characterName }) {
  if (!story) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyber-purple mb-4">
        📖 {characterName}'s Story
      </h3>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {story}
      </p>
    </div>
  );
}

export default StoryDisplay;
