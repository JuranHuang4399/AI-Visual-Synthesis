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
    imageCount: 4, // Default to 4 images (1, 4, or 8)
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

      {/* Image Count Selection */}
      <div className="mb-4">
        <label className="block text-cyber-cyan font-semibold mb-2">
          Number of Directions <span className="text-cyber-pink">*</span>
        </label>
        <select
          name="imageCount"
          value={formData.imageCount}
          onChange={handleChange}
          className="input-cyber"
        >
          <option value={1}>1 Direction (Front View Only)</option>
          <option value={4}>4 Directions (North, East, South, West)</option>
          <option value={8}>8 Directions (All Directions)</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Select how many directional views to generate for your character
        </p>
      </div>

      {/* Submit Button */}
      <GenerateButton isLoading={isLoading} />
    </form>
  );
}

export default CharacterForm;
