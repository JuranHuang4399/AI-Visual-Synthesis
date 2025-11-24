from flask import Flask, request, jsonify
from stable_diffusion_api import generate_image, generate_pixel_art

app = Flask(__name__)

@app.route("/generate", methods = ["POST"])
def generate():
    data = request.get_json()
    style = data.get("style", "normal")
    prompt = data.get("prompt")
    negative_prompt = data.get("negative_prompt", "")
    cfg_scale = data.get("cfg_scale", 7)

    if style == "pixel":
        filename = generate_pixel_art(
            description=prompt,
            image_width=128,
            image_length=128,
            detail="medium detail",
            direction="south",
            no_background=False,
            filename="output_pixel.png"
        )
    else:
        filename = generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            cfg_scale=cfg_scale,
            filename="output.jpeg"
        )

    return jsonify({"file": filename})

if __name__ == "__main__":
    app.run(debug=True)