import base64
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from stable_diffusion_api import generate_image

app = Flask(__name__)
CORS(app)  # frontend can call backend


@app.route("/api/characters/generate", methods=["POST"])
def generate_character():
    """
    Receive form data from frontend (JSON).
    Generate multiple images based on imageCount (1, 4, or 8).
    Return story + base64 images.
    """
    try:
        data = request.get_json() or {}

        # Extract data from frontend
        name = data.get("name", "Unknown Character")
        character_class = data.get("characterClass", "Adventurer")
        personality = data.get("personality", "")
        appearance = data.get("appearance", "")
        special_features = data.get("specialFeatures", "")
        image_count = int(data.get("imageCount", 1))   # frontend is locked to 1/4/8

        #TODO: Current Base prompt based on the Form info from frontend
        prompt = f"""
        High-quality fantasy character portrait.

        Name: {name}
        Class: {character_class}
        Personality: {personality}
        Appearance: {appearance}
        Special Features: {special_features}

        Style: extremely detailed, concept art, dramatic lighting.
        """

        #TODO: If we need more requirenments on images
        #  Now -> Strict angle presets for 1 / 4 / 8
        if image_count == 1:
            angles = [
                "front view portrait"
            ]

        elif image_count == 4:
            angles = [
                "front view portrait",
                "back view portrait",
                "left side portrait",
                "right side portrait"
            ]

        elif image_count == 8:
            angles = [
                "front view portrait",
                "front-left 45 degree portrait",
                "left side portrait",
                "back-left 45 degree portrait",
                "back view portrait",
                "back-right 45 degree portrait",
                "right side portrait",
                "front-right 45 degree portrait"
            ]

        else:
            # Hard error — front-end should never reach here
            return jsonify({"error": f"Invalid imageCount: {image_count}. Must be 1, 4, or 8."}), 400

        image_results = []

        # Generate images for each angle
        for i, angle in enumerate(angles):
            angle_prompt = prompt + f"\nAngle: {angle}\n"

            filename = f"generated_{i}.jpeg"

            output_path = generate_image(
                prompt=angle_prompt,
                cfg_scale=10,
                negative_prompt="low quality, blurry, distorted",
                filename=filename,
            )

            # Convert to base64
            with open(output_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")

            image_results.append(f"data:image/jpeg;base64,{b64}")

        #TODO:Update the story prompts!
        story = (
            f"{name} is a {character_class} characterized by {personality}. "
            f"They appear as: {appearance}, with {special_features}."
        )

        return jsonify({
            "story": story,
            "images": image_results
        })

    except Exception as e:
        print("===ERROR OCCURRED===")
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(port=5000)