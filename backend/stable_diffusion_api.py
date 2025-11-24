import os
import requests
from dotenv import load_dotenv

load_dotenv()
stable_diffusion_key = os.getenv('SDF_KEY')


def generate_image(
    prompt="random image",
    *,
    cfg_scale=7,
    negative_prompt="",
    filename="generated.jpeg",
):
    """调用 Stability AI 生成图像，保存到本地文件，返回文件名"""
    if not stable_diffusion_key:
        raise Exception("Missing SDF_KEY in .env")

    data = {
        "prompt": prompt,
        "cfg_scale": cfg_scale,
        "negative_prompt": negative_prompt,
        "aspect_ratio": "1:1",
        "output_format": "jpeg",
        "output_quality": 90,
        "style_preset": "photographic",
    }

    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        headers={
            "authorization": f"Bearer {stable_diffusion_key}",
            "accept": "image/*",
        },
        files={"none": ''},
        data=data,
    )

    if response.status_code == 200:
        with open(filename, "wb") as f:
            f.write(response.content)
        return filename
    else:
        raise Exception(str(response.json()))