"""
GIF Generator Utility
Uses Pillow (PIL) library to combine multiple frames into GIF animation
"""
import os
from PIL import Image
from typing import List, Optional
import io
import base64
from utils.logger import setup_logger

logger = setup_logger(__name__)


def create_gif_from_frames(
    frame_paths: List[str],
    output_path: Optional[str] = None,
    duration: int = 200,  # Duration per frame (milliseconds)
    loop: int = 0,  # 0 means infinite loop
    optimize: bool = True
) -> str:
    """
    Create GIF from multiple frame paths
    
    Args:
        frame_paths: List of image file paths
        output_path: Output GIF path (if None, returns base64)
        duration: Duration per frame (milliseconds)
        loop: Number of loops (0=infinite loop)
        optimize: Whether to optimize GIF size
    
    Returns:
        GIF file path or base64 string
    """
    if not frame_paths:
        raise ValueError("At least one frame required")
    
    # Load all frames
    frames = []
    for path in frame_paths:
        if os.path.exists(path):
            img = Image.open(path)
            # Convert to RGBA mode (supports transparency)
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            frames.append(img)
        else:
            raise FileNotFoundError(f"Frame file not found: {path}")
    
    if not frames:
        raise ValueError("No valid frames")
    
    # Ensure all frames have consistent size
    first_frame_size = frames[0].size
    frames = [frame.resize(first_frame_size, Image.Resampling.LANCZOS) 
              for frame in frames]
    
    # Fix ghosting issue:
    # 1. Disable optimize - optimize=True creates incremental frames (only saves changed parts), causing ghosting
    # 2. Ensure each frame is a complete RGBA image, don't convert to P mode
    # This way each frame completely replaces the previous frame, avoiding ghosting
    
    # Create GIF (directly use RGBA mode, Pillow will handle it)
    if output_path:
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:] if len(frames) > 1 else [],
            duration=duration,
            loop=loop,
            optimize=False,  # Disable optimize to avoid ghosting
            format='GIF'
        )
        logger.info(f"Created GIF: {output_path}")
        return output_path
    else:
        # Return base64 encoded GIF
        buffer = io.BytesIO()
        frames[0].save(
            buffer,
            save_all=True,
            append_images=frames[1:] if len(frames) > 1 else [],
            duration=duration,
            loop=loop,
            optimize=False,  # Disable optimize to avoid ghosting
            format='GIF'
        )
        buffer.seek(0)
        gif_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/gif;base64,{gif_base64}"


def create_gif_from_urls(
    image_urls: List[str],
    output_path: Optional[str] = None,
    duration: int = 200,
    loop: int = 0,
    optimize: bool = True
) -> str:
    """
    Create GIF from image URL list (need to download images first)
    
    Args:
        image_urls: List of image URLs
        output_path: Output GIF path
        duration: Duration per frame (milliseconds)
        loop: Number of loops
        optimize: Whether to optimize
    
    Returns:
        GIF file path or base64 string
    """
    import requests
    import tempfile
    
    temp_paths = []
    try:
        # Download all images to temporary files
        for i, url in enumerate(image_urls):
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            temp_file = tempfile.NamedTemporaryFile(
                delete=False, 
                suffix='.png'
            )
            temp_file.write(response.content)
            temp_file.close()
            temp_paths.append(temp_file.name)
        
        # Create GIF
        result = create_gif_from_frames(
            temp_paths,
            output_path,
            duration,
            loop,
            optimize
        )
        
        return result
    finally:
        # Clean up temporary files
        for path in temp_paths:
            try:
                os.unlink(path)
            except:
                pass

