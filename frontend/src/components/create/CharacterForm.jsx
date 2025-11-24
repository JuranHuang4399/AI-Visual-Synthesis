import { useState } from "react";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import GenerateButton from "./GenerateButton";

function CharacterForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    characterClass: "Warrior",
    personality: "",
    appearance: "",
    specialFeatures: "",
    imageCount: 4,
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
      <FormInput
        label="Character Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Shadow Knight"
        required
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
      <FormInput
        label="Personality Traits"
        name="personality"
        value={formData.personality}
        onChange={handleChange}
        placeholder="e.g., brave, wise, mysterious"
      />

      {/* Appearance */}
      <FormTextarea
        label="Appearance Description"
        name="appearance"
        value={formData.appearance}
        onChange={handleChange}
        placeholder="Describe hair color, eye color, outfit, etc."
        rows={2}
      />

      {/* Special Features */}
      <FormTextarea
        label="Special Features (Optional)"
        name="specialFeatures"
        value={formData.specialFeatures}
        onChange={handleChange}
        placeholder="Any special features: scars, tattoos, magical effects, etc."
        rows={2}
      />

      {/* Image Count */}
      <div className="mb-4">
        <label className="block text-cyber-cyan font-semibold mb-2">
          Number of Images (for animation)
        </label>
        <select
          name="imageCount"
          value={formData.imageCount}
          onChange={handleChange}
          className="input-cyber"
        >
          <option value="1">1 image</option>
          <option value="4">4 images (recommended)</option>
          <option value="8">8 images</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          More images = better animation (longer generation time)
        </p>
      </div>

      {/* Submit Button */}
      <GenerateButton isLoading={isLoading} />
    </form>
  );
}

export default CharacterForm;
