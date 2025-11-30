from flask import Flask, request, jsonify
from pixellab_api import generate_pixel_art
from meta_llama_api import story_generator

app = Flask(__name__)

@app.route("/generate", methods = ["POST"])
def generate_art():
    data = request.get_json()

    prompt = data.get("prompt")
    image_count = int(data.get("image_count"))

    # === 1/4/8 ANGLE PRESETS ====

    if image_count == 1:
        angles = ["front view portrait"]

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
        image_count = 1
        angles = ["front view portrait"]

    kwargs = {}

    if "image_width" in data:
        kwargs["image_width"] = data["image_width"]

    if "image_length" in data:
        kwargs["image_length"] = data["image_length"]

    if "detail" in data:
        kwargs["detail"] = data["detail"]

    if "direction" in data:
        kwargs["direction"] = data["direction"]

    if "no_background" in data:
        kwargs["no_background"] = data["no_background"]

    results = []

    for i, angle in enumerate(angles):
        pixel_prompt = f"{prompt}\nPixel Art Style\nAngle: {angle}"
        filename = f"pixel_output_{i}.png"

        output_path = generate_pixel_art(
            description=pixel_prompt,
            filename=filename,
            **kwargs
        )
        results.append(output_path)

    return jsonify({"files": results})

@app.route("/generate_story", methods=["POST"])
def generate_story():
    data = request.get_json()
    prompt = data.get("prompt", "")

    story = story_generator(prompt)

    return jsonify({"story": story})

if __name__ == "__main__":
    app.run(debug=True)