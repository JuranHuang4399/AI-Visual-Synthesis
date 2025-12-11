"""
PixelLab API Client
"""
import base64
import requests
from typing import Optional
from config import config
from utils.logger import setup_logger
from utils.exceptions import APIError

logger = setup_logger(__name__)


class PixelLabClient:
    """PixelLab API Client"""
    
    def __init__(self):
        self.api_key = config.PIXELLAB_API_KEY
        self.base_url = "https://api.pixellab.ai/v1/generate-image-pixflux"
        
        if not self.api_key:
            logger.warning("PixelLab API key not configured")
    
    def generate_pixel_art(
        self,
        description: str,
        image_width: int = 128,
        image_length: int = 128,
        detail: str = "medium detail",
        direction: Optional[str] = None,
        no_background: bool = False
    ) -> bytes:
        """
        Generate pixel art image
        
        Args:
            description: Image description
            image_width: Image width
            image_length: Image length
            detail: Detail level
            direction: Direction (optional)
            no_background: Whether to have no background
        
        Returns:
            Image binary data
        
        Raises:
            APIError: API call failed
        """
        if not self.api_key:
            raise APIError("PixelLab API key not configured")
        
        data = {
            "description": description,
            "image_size": {"width": image_width, "height": image_length},
            "detail": detail,
            "direction": direction,
            "no_background": no_background,
        }
        
        try:
            logger.info(f"Sending request to PixelLab API: {self.base_url}")
            logger.debug(f"Request data: image_size={data.get('image_size')}, detail={data.get('detail')}, direction={data.get('direction')}")
            
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=180  # Increase timeout to 180 seconds (3 minutes), generation may take longer
            )
            
            logger.info(f"Received response from PixelLab API: status={response.status_code}")
            
            if response.status_code == 200:
                try:
                    resp_json = response.json()
                    if "image" in resp_json and "base64" in resp_json["image"]:
                        base64_img = resp_json["image"]["base64"]
                        img_bytes = base64.b64decode(base64_img)
                        logger.info(f"Successfully generated pixel art: {description[:50]}... (size: {len(img_bytes)} bytes)")
                        return img_bytes
                    else:
                        logger.error(f"Unexpected response format: {resp_json}")
                        raise APIError(f"PixelLab API returned unexpected format: missing 'image.base64' field")
                except ValueError as e:
                    # JSON parsing error
                    logger.error(f"Failed to parse JSON response: {str(e)}")
                    logger.error(f"Response content (first 500 chars): {response.text[:500] if response.text else 'Empty response'}")
                    logger.error(f"Response status code: {response.status_code}")
                    raise APIError(f"PixelLab API returned invalid JSON: {str(e)}. Response: {response.text[:200] if response.text else 'Empty'}")
            else:
                # Non-200 status code
                try:
                    error_msg = response.json() if response.content else response.text
                except ValueError:
                    error_msg = response.text[:500] if response.text else f"HTTP {response.status_code}"
                logger.error(f"PixelLab API error (status {response.status_code}): {error_msg}")
                logger.error(f"Request data: image_size={data.get('image_size')}, detail={data.get('detail')}")
                raise APIError(f"PixelLab API error (status {response.status_code}): {error_msg}")
        
        except requests.exceptions.Timeout as e:
            logger.error(f"PixelLab API request timeout: {str(e)}")
            logger.error(f"Request took longer than 180 seconds. This may indicate API is slow or overloaded.")
            raise APIError(f"PixelLab API request timeout: The request took longer than 180 seconds. The API may be slow or overloaded. Please try again later.")
        except requests.exceptions.RequestException as e:
            logger.error(f"PixelLab API request failed: {str(e)}")
            logger.error(f"Request exception type: {type(e).__name__}")
            raise APIError(f"PixelLab API request failed: {str(e)}")
    
    def rotate_image(
        self,
        from_image_bytes: bytes,
        from_direction: str = "south",
        to_direction: str = "north",
        image_size: dict = None,
        from_view: str = "side",
        to_view: str = "side",
        image_guidance_scale: float = 3.0
    ) -> bytes:
        """
        Rotate character image to specified direction
        
        Args:
            from_image_bytes: Source image binary data
            from_direction: Source direction (north, north-east, east, south-east, south, south-west, west, north-west)
            to_direction: Target direction
            image_size: Image size {"width": int, "height": int}
            from_view: Source view (side, low top-down, high top-down)
            to_view: Target view
            image_guidance_scale: Image guidance scale (1-20)
        
        Returns:
            Rotated image binary data
        
        Raises:
            APIError: API call failed
        """
        if not self.api_key:
            raise APIError("PixelLab API key not configured")
        
        # Convert image bytes to base64
        image_base64 = base64.b64encode(from_image_bytes).decode('utf-8')
        
        # Build request data
        data = {
            "from_image": {
                "type": "base64",
                "base64": image_base64
            },
            "from_direction": from_direction,
            "to_direction": to_direction,
            "from_view": from_view,
            "to_view": to_view,
            "image_guidance_scale": image_guidance_scale
        }
        
        if image_size:
            data["image_size"] = image_size
        
        try:
            response = requests.post(
                "https://api.pixellab.ai/v1/rotate",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=120  # Increase timeout to 120 seconds, rotation may take longer
            )
            
            if response.status_code == 200:
                try:
                    resp_json = response.json()
                    base64_img = resp_json["image"]["base64"]
                    img_bytes = base64.b64decode(base64_img)
                    logger.info(f"Successfully rotated image from {from_direction} to {to_direction}")
                    return img_bytes
                except (KeyError, ValueError) as e:
                    logger.error(f"Failed to parse response JSON: {str(e)}")
                    logger.error(f"Response content: {response.text[:500]}")
                    raise APIError(f"Failed to parse rotate API response: {str(e)}")
            else:
                # Try to parse error response
                error_msg = "Unknown error"
                try:
                    if response.content:
                        error_json = response.json()
                        error_msg = error_json
                    else:
                        error_msg = response.text or f"HTTP {response.status_code}"
                except (ValueError, AttributeError):
                    # If not JSON, use text content
                    error_msg = response.text[:500] if response.text else f"HTTP {response.status_code}"
                
                logger.error(f"PixelLab Rotate API error (status {response.status_code}): {error_msg}")
                logger.error(f"Request data: from_direction={from_direction}, to_direction={to_direction}")
                raise APIError(f"PixelLab Rotate API error (status {response.status_code}): {error_msg}")
        
        except requests.exceptions.Timeout:
            logger.error(f"PixelLab Rotate API timeout: from {from_direction} to {to_direction}")
            raise APIError(f"PixelLab Rotate API timeout: Request took longer than 60 seconds")
        except requests.exceptions.RequestException as e:
            logger.error(f"PixelLab Rotate API request failed: {str(e)}")
            logger.error(f"Request details: from_direction={from_direction}, to_direction={to_direction}")
            raise APIError(f"PixelLab Rotate API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in rotate_image: {str(e)}", exc_info=True)
            raise APIError(f"Unexpected error in rotate_image: {str(e)}")
    
    def animate_with_text(
        self,
        reference_image_bytes: bytes,
        description: str,
        action: str,
        direction: str,
        image_size: dict = None,
        view: str = "side",
        n_frames: int = 4,
        image_guidance_scale: float = 5.0,
        init_image_strength: float = 300.0
    ) -> list:
        """
        Generate animation frames using text description
        
        Args:
            reference_image_bytes: Reference image binary data (idle image for this direction)
            description: Character description
            action: Action type (walk, run, jump, attack)
            direction: Direction (north, north-east, east, etc.)
            image_size: Image size {"width": int, "height": int}
            view: View (side, low top-down, high top-down)
            n_frames: Number of animation frames (2-20, default 4, model always generates 4 frames)
            image_guidance_scale: Reference image guidance scale (1-20, default 5.0, higher = closer to reference)
            init_image_strength: Initial image strength (1-999, default 300.0, controls initial image influence)
        
        Returns:
            List of animation frame binary data [bytes, bytes, ...]
        
        Raises:
            APIError: API call failed
        """
        if not self.api_key:
            raise APIError("PixelLab API key not configured")
        
        # Convert reference image bytes to base64
        reference_base64 = base64.b64encode(reference_image_bytes).decode('utf-8')
        
        # Build request data
        data = {
            "reference_image": {
                "type": "base64",
                "base64": reference_base64
            },
            "description": description,
            "action": action,
            "direction": direction,
            "view": view,
            "n_frames": n_frames,
            "image_guidance_scale": image_guidance_scale,  # Control reference image consistency (1-20)
            "init_image_strength": init_image_strength  # Control initial image influence strength (1-999)
        }
        
        if image_size:
            data["image_size"] = image_size
        
        try:
            response = requests.post(
                "https://api.pixellab.ai/v1/animate-with-text",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=120  # Animation generation may take longer
            )
            
            if response.status_code == 200:
                try:
                    resp_json = response.json()
                    # Return format: {"images": [{"base64": "..."}, ...]}
                    if "images" in resp_json:
                        frames = []
                        for img_data in resp_json["images"]:
                            if isinstance(img_data, dict) and "base64" in img_data:
                                img_bytes = base64.b64decode(img_data["base64"])
                                frames.append(img_bytes)
                            elif isinstance(img_data, str):
                                # If directly a base64 string
                                img_bytes = base64.b64decode(img_data)
                                frames.append(img_bytes)
                        logger.info(f"Successfully generated {len(frames)} animation frames for {action} - {direction}")
                        return frames
                    else:
                        raise APIError(f"Unexpected response format: {resp_json}")
                except (KeyError, ValueError) as e:
                    logger.error(f"Failed to parse animation response: {str(e)}")
                    logger.error(f"Response content: {response.text[:500]}")
                    raise APIError(f"Failed to parse animation API response: {str(e)}")
            elif response.status_code == 503:
                error_msg = response.json().get("error", "Model is loading") if response.content else "Model is loading"
                logger.warning(f"Model is loading: {error_msg}")
                raise APIError(f"Model is currently loading. Please try again in a few moments.")
            elif response.status_code == 429:
                # Rate limit exceeded
                error_msg = response.json().get("detail", "Rate limit exceeded") if response.content else "Rate limit exceeded"
                logger.warning(f"Rate limit exceeded: {error_msg}")
                raise APIError(f"Rate limit exceeded. Please wait a moment and try again. {error_msg}")
            else:
                error_msg = "Unknown error"
                try:
                    if response.content:
                        error_json = response.json()
                        error_msg = error_json
                    else:
                        error_msg = response.text or f"HTTP {response.status_code}"
                except (ValueError, AttributeError):
                    error_msg = response.text[:500] if response.text else f"HTTP {response.status_code}"
                
                logger.error(f"PixelLab Animate API error (status {response.status_code}): {error_msg}")
                raise APIError(f"PixelLab Animate API error (status {response.status_code}): {error_msg}")
        
        except requests.exceptions.Timeout:
            logger.error(f"PixelLab Animate API timeout: {action} - {direction}")
            raise APIError(f"PixelLab Animate API timeout: Request took longer than 120 seconds")
        except requests.exceptions.RequestException as e:
            logger.error(f"PixelLab Animate API request failed: {str(e)}")
            raise APIError(f"PixelLab Animate API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in animate_with_text: {str(e)}", exc_info=True)
            raise APIError(f"Unexpected error in animate_with_text: {str(e)}")
    
    def animate_with_skeleton(
        self,
        reference_image_bytes: bytes,
        direction: str,
        image_size: dict = None,
        view: str = "side",
        skeleton_keypoints: list = None,
        guidance_scale: float = 6.0,
        init_image_strength: float = 350.0,
        inpainting_images: list = None,
        mask_images: list = None
    ) -> list:
        """
        Generate animation frames using skeleton keypoints (more precise control)
        
        Args:
            reference_image_bytes: Reference image binary data
            direction: Direction (north, north-east, east, etc.)
            image_size: Image size {"width": int, "height": int}
            view: View (side, low top-down, high top-down)
            skeleton_keypoints: Skeleton keypoints list (optional, uses default if None)
            guidance_scale: Guidance scale (1-20, default 6.0)
            init_image_strength: Initial image strength (1-999, default 350.0)
            inpainting_images: Existing animation frames for inpainting (optional)
            mask_images: Mask image list (optional)
        
        Returns:
            List of animation frame binary data [bytes, bytes, ...]
        
        Raises:
            APIError: API call failed
        """
        if not self.api_key:
            raise APIError("PixelLab API key not configured")
        
        # Convert reference image bytes to base64
        reference_base64 = base64.b64encode(reference_image_bytes).decode('utf-8')
        
        # Build request data
        data = {
            "reference_image": {
                "type": "base64",
                "base64": reference_base64
            },
            "direction": direction,
            "view": view,
            "guidance_scale": guidance_scale,
            "init_image_strength": init_image_strength
        }
        
        if image_size:
            data["image_size"] = image_size
        
        if skeleton_keypoints:
            data["skeleton_keypoints"] = skeleton_keypoints
        
        if inpainting_images:
            data["inpainting_images"] = inpainting_images
        
        if mask_images:
            data["mask_images"] = mask_images
        
        try:
            response = requests.post(
                "https://api.pixellab.ai/v1/animate-with-skeleton",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=data,
                timeout=120
            )
            
            if response.status_code == 200:
                try:
                    resp_json = response.json()
                    if "images" in resp_json:
                        frames = []
                        for img_data in resp_json["images"]:
                            if isinstance(img_data, dict) and "base64" in img_data:
                                img_bytes = base64.b64decode(img_data["base64"])
                                frames.append(img_bytes)
                            elif isinstance(img_data, str):
                                img_bytes = base64.b64decode(img_data)
                                frames.append(img_bytes)
                        logger.info(f"Successfully generated {len(frames)} animation frames using skeleton for {direction}")
                        return frames
                    else:
                        raise APIError(f"Unexpected response format: {resp_json}")
                except (KeyError, ValueError) as e:
                    logger.error(f"Failed to parse skeleton animation response: {str(e)}")
                    logger.error(f"Response content: {response.text[:500]}")
                    raise APIError(f"Failed to parse skeleton animation API response: {str(e)}")
            else:
                error_msg = "Unknown error"
                try:
                    if response.content:
                        error_json = response.json()
                        error_msg = error_json
                    else:
                        error_msg = response.text or f"HTTP {response.status_code}"
                except (ValueError, AttributeError):
                    error_msg = response.text[:500] if response.text else f"HTTP {response.status_code}"
                
                logger.error(f"PixelLab Skeleton Animation API error (status {response.status_code}): {error_msg}")
                raise APIError(f"PixelLab Skeleton Animation API error (status {response.status_code}): {error_msg}")
        
        except requests.exceptions.Timeout:
            logger.error(f"PixelLab Skeleton Animation API timeout: {direction}")
            raise APIError(f"PixelLab Skeleton Animation API timeout: Request took longer than 120 seconds")
        except requests.exceptions.RequestException as e:
            logger.error(f"PixelLab Skeleton Animation API request failed: {str(e)}")
            raise APIError(f"PixelLab Skeleton Animation API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in animate_with_skeleton: {str(e)}", exc_info=True)
            raise APIError(f"Unexpected error in animate_with_skeleton: {str(e)}")

