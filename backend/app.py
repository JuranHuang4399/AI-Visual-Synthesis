from backend.stable_diffusion_api import generate_image

"""
Main Parameter:
  prompt (str): Text description for the image

Other Parameters (must be passed as keyword arguments):  
  cfg_scale (int, optional): Controls prompt adherence (default 7)
  negative_prompt (str, optional): Elements to avoid (default empty)
  filename (str, optional): Output file name (default 'demo_generation.jpeg')
"""

# Dummy prompt and parameters until user input function is completed
generate_image("castle in the sky", cfg_scale=10, negative_prompt="Dark sky")