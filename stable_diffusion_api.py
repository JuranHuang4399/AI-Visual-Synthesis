import os
import requests
from dotenv import load_dotenv

load_dotenv()
stable_diffusion_key = os.getenv('SDF_KEY')

def generate_image(prompt="random image", *, cfg_scale=7, negative_prompt="", filename="demo_generation.jpeg"):
    data = {
        "prompt": prompt,                       # User description of the image
        "cfg_scale" : cfg_scale,                # Strict level to follow user's prompt
        "negative_prompt" : negative_prompt,    # Elements excluded from the image

        "aspect_ratio": "1:1",                  # Output shape (e.g. "1:1", "16:9", "9:16", "3:2")
        "output_format": "jpeg",                # jpeg | png | webp
        "output_quality": 90,                   # 1–100, for jpeg/webp quality
        "style_preset": "photographic",         # e.g. "anime", "cinematic", "digital-art", "fantasy-art"
    }
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "authorization": f"Bearer {stable_diffusion_key}",         # Authorized with api key
            "accept": "image/*"                                        # Requesting images
        },
        files={"none" : ''},
        data=data,
    )

    if response.status_code == 200:                     # status code shows successful connection
        with open(filename, "wb") as f:
            f.write(response.content)
        return filename
    else:                                               # status code shows connection failure
        raise Exception(str(response.json()))