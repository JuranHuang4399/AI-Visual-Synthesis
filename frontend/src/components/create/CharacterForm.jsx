import { useState } from "react";
import FormField from "./FormField";
import GenerateButton from "./GenerateButton";

function CharacterForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    characterClass: "Warrior",
    personality: "",
    appearance: "",
    specialFeatures: "",
    // Animation selection
    selectedAnimations: [], // Selected action type array, e.g., ["attack", "walk"]
    selectedDirections: {}, // Directions for each action type, e.g., { "attack": ["east", "south"], "walk": ["east"] }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Character Name */}
      <FormField
        label="Character Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Shadow Knight"
        required
        type="text"
      />

      {/* Character Class */}
      <div className="mb-4">
        <label className="block text-cyber-cyan font-semibold mb-2">
          Character Class <span className="text-cyber-pink">*</span>
        </label>
        <select
          name="characterClass"
          value={formData.characterClass}
          onChange={handleChange}
          className="input-cyber"
        >
          <option value="Warrior">Warrior</option>
          <option value="Mage">Mage</option>
          <option value="Rogue">Rogue</option>
          <option value="Archer">Archer</option>
          <option value="Paladin">Paladin</option>
        </select>
      </div>

      {/* Personality */}
      <FormField
        label="Personality Traits"
        name="personality"
        value={formData.personality}
        onChange={handleChange}
        placeholder="e.g., brave, wise, mysterious"
        type="text"
      />

      {/* Appearance */}
      <FormField
        label="Appearance Description"
        name="appearance"
        value={formData.appearance}
        onChange={handleChange}
        placeholder="Describe hair color, eye color, outfit, etc."
        type="textarea"
        rows={4}
      />

      {/* Special Features */}
      <FormField
        label="Special Features (Optional)"
        name="specialFeatures"
        value={formData.specialFeatures}
        onChange={handleChange}
        placeholder="Any special features: scars, tattoos, magical effects, etc."
        type="textarea"
        rows={3}
      />

      {/* Animation Selection */}
      <div className="mb-4">
        <label className="block text-cyber-cyan font-semibold mb-2">
          Select Animations (Beta)
        </label>
        <p className="text-sm text-gray-400 mb-3">
          Choose animation types and directions to generate during character creation
        </p>
        
        {/* Animation Types */}
        <div className="mb-4">
          <label className="block text-sm text-cyber-cyan mb-2">Animation Types:</label>
          <div className="flex flex-wrap gap-2">
            {['attack', 'walk', 'run', 'jump'].map((animType) => (
              <label key={animType} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.selectedAnimations.includes(animType)}
                  onChange={(e) => {
                    const newAnimations = e.target.checked
                      ? [...formData.selectedAnimations, animType]
                      : formData.selectedAnimations.filter(a => a !== animType);
                    const newDirections = { ...formData.selectedDirections };
                    if (!e.target.checked) {
                      delete newDirections[animType];
                    }
                    setFormData({
                      ...formData,
                      selectedAnimations: newAnimations,
                      selectedDirections: newDirections
                    });
                  }}
                  className="w-4 h-4 text-cyber-cyan bg-cyber-dark-200 border-cyber-cyan rounded focus:ring-cyber-cyan"
                />
                <span className="text-cyber-cyan capitalize">{animType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Directions for each selected animation */}
        {formData.selectedAnimations.length > 0 && (
          <div className="space-y-3">
            {formData.selectedAnimations.map((animType) => (
              <div key={animType} className="bg-cyber-dark-200 p-3 rounded">
                <label className="block text-sm text-cyber-cyan mb-2 capitalize">
                  {animType} Directions:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'].map((dir) => (
                    <label key={dir} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.selectedDirections[animType] || []).includes(dir)}
                        onChange={(e) => {
                          const currentDirs = formData.selectedDirections[animType] || [];
                          const newDirs = e.target.checked
                            ? [...currentDirs, dir]
                            : currentDirs.filter(d => d !== dir);
                          setFormData({
                            ...formData,
                            selectedDirections: {
                              ...formData.selectedDirections,
                              [animType]: newDirs
                            }
                          });
                        }}
                        className="w-4 h-4 text-cyber-cyan bg-cyber-dark-200 border-cyber-cyan rounded focus:ring-cyber-cyan"
                      />
                      <span className="text-xs text-gray-400">{dir}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <GenerateButton isLoading={isLoading} />
    </form>
  );
}

export default CharacterForm;
