"""
Generation Service
Orchestrates image generation, story generation, and animation generation workflows
"""
import time
import shutil
from pathlib import Path
from typing import Dict, List, Optional
from database.repositories.character_repository import CharacterRepository
from database.models.character_model import Character
from integrations.clients.pixellab_client import PixelLabClient
from integrations.clients.meta_llama_client import MetaLlamaClient
from storage.file_manager import FileManager
from utils.logger import setup_logger
from utils.exceptions import GenerationError
from utils.gif_generator import create_gif_from_frames
from config import config

logger = setup_logger(__name__)


class GenerationService:
    """Generation Service - Orchestrates character generation workflows"""
    
    def __init__(self):
        self.character_repo = CharacterRepository()
        self.pixellab_client = PixelLabClient()
        self.llama_client = MetaLlamaClient()
        self.file_manager = FileManager()
    
    def generate_character(self, form_data: Dict, user_id: str = None) -> Character:
        """
        Generate complete character (images + story)
        
        Args:
            form_data: Form data
            user_id: User ID (optional)
        
        Returns:
            Generated Character object
        """
        start_time = time.time()
        
        try:
            # 1. Create Character document (status: "generating")
            character = Character(
                user_id=user_id,
                name=form_data.get('name'),
                description=form_data.get('description', ''),
                status='generating',
                input_params=form_data
            )
            character.save()
            
            logger.info(f"Created character: {character.id}, starting generation...")
            
            # 2. Generate images (multiple angles)
            images = self._generate_images(character, form_data)
            
            # 3. Generate story (animations removed - no longer generated automatically)
            story = self._generate_story(character, form_data)
            
            # 5. Update status to 'pending_save' (not 'completed' - user must click save to gallery)
            character.status = 'pending_save'
            character.generation_time = time.time() - start_time
            character.save()
            
            logger.info(f"Character generation completed: {character.id}, time: {character.generation_time:.2f}s")
            
            return character
        
        except Exception as e:
            logger.error(f"Character generation failed: {str(e)}")
            # Update status to failed
            if 'character' in locals():
                character.status = 'failed'
                character.save()
            raise GenerationError(f"Character generation failed: {str(e)}")
    
    def _generate_images(self, character: Character, form_data: Dict) -> List[Dict]:
        """Generate multi-directional images using Rotate API"""
        # Get image count from form data (1, 4, or 8)
        image_count = int(form_data.get('imageCount', 4))
        
        # Define directions based on image count
        if image_count == 1:
            # Only generate south (front view)
            directions = ["south"]
        elif image_count == 4:
            # Generate 4 basic directions
            directions = ["north", "east", "south", "west"]
        elif image_count == 8:
            # Generate all 8 directions
            directions = ["north", "north-east", "east", "south-east", 
                         "south", "south-west", "west", "north-west"]
        else:
            # Default to 4 if invalid value
            logger.warning(f"Invalid imageCount: {image_count}, defaulting to 4")
            directions = ["north", "east", "south", "west"]
            image_count = 4
        
        logger.info(f"Generating {image_count} direction images: {directions}")
        
        # Generation parameters
        image_width = int(form_data.get('imageWidth', 64))
        image_length = int(form_data.get('imageLength', 64))
        detail = form_data.get('detail', 'medium detail')
        no_background = form_data.get('noBackground', True)  # Default transparent background
        
        images = []
        
        # Step 0: Extract and fix Character DNA (character identity)
        # This DNA will be used in all rotate and animation generation, never change
        character_dna = self._extract_character_dna(form_data, image_width)
        logger.info(f"Character DNA extracted: {character_dna[:100]}...")
        
        # Step 1: Generate base image (south direction) with retry mechanism
        max_retries = 3  # Increase retries to 3
        retry_count = 0
        base_image_bytes = None
        
        while retry_count <= max_retries and base_image_bytes is None:
            try:
                # Use fixed Character DNA to generate base image
                # Only add necessary direction info, don't change DNA
                pixel_prompt = f"{character_dna}, side view, facing south, 8-bit pixel art, no background"
                
                if retry_count > 0:
                    logger.info(f"Retrying base image generation (attempt {retry_count + 1}/{max_retries + 1})...")
                else:
                    logger.info(f"Generating base character image (south direction)...")
                    logger.info(f"Prompt: {pixel_prompt[:100]}...")
                
                start_time = time.time()
                base_image_bytes = self.pixellab_client.generate_pixel_art(
                    description=pixel_prompt,
                    image_width=image_width,
                    image_length=image_length,
                    detail=detail,
                    direction="south",
                    no_background=no_background
                )
                elapsed_time = time.time() - start_time
                logger.info(f"Base image generation completed in {elapsed_time:.2f} seconds")
                break
            except Exception as e:
                error_str = str(e)
                logger.warning(f"Base image generation attempt {retry_count + 1} failed: {error_str}")
                # Retry on timeout errors or connection errors
                if "timeout" in error_str.lower() or "Read timed out" in error_str or "Connection" in error_str:
                    retry_count += 1
                    if retry_count <= max_retries:
                        wait_time = 10 * retry_count  # Increase wait time: 10s, 20s, 30s
                        logger.warning(f"Base image generation timeout/connection error, waiting {wait_time}s before retry {retry_count}/{max_retries}")
                        time.sleep(wait_time)
                        continue
                    else:
                        logger.error(f"Base image generation failed after {max_retries + 1} attempts due to timeout/connection issues")
                        raise GenerationError(f"Base image generation failed after {max_retries + 1} attempts. The PixelLab API may be slow or experiencing issues. Please try again later.")
                else:
                    # For other errors, don't retry, just raise
                    logger.error(f"Base image generation failed with non-retryable error: {error_str}")
                    raise
        
        # Save base image
        if not base_image_bytes:
            raise GenerationError("Failed to generate base image after retries")
        
        base_file_path, base_url = self.file_manager.save_image(
            base_image_bytes,
            str(character.id),
            "south",
            0
        )
        
        # Add to character (as base_image)
        character.add_image(base_url, base_file_path, "south", 0)
        images.append({
            'url': base_url,
            'path': base_file_path,
            'angle': 'south',
            'direction': 'south',
            'index': 0
        })
        
        # Save Character DNA and Master Reference Image to character object
        # Master Reference Image is the south direction image, all animations are based on this
        if not hasattr(character, 'metadata') or character.metadata is None:
            character.metadata = {}
        character.metadata['character_dna'] = character_dna
        character.metadata['master_reference_path'] = base_file_path
        character.metadata['master_reference_direction'] = 'south'
        character.save()
        logger.info(f"Character DNA and Master Reference Image saved (south direction)")
        
        logger.info(f"Base image generated successfully")
        
        # Step 2: Generate other directions using Rotate API (if needed)
        # If only 1 image requested, skip rotation
        if image_count == 1:
            logger.info("Only 1 image requested, skipping rotation generation")
            return images
        
        image_size = {"width": image_width, "height": image_length}
        
        # Filter out south direction (already generated), generate other directions
        other_directions = [d for d in directions if d != "south"]
        rotation_index = 1
        
        for direction in other_directions:
            max_retries = 2
            retry_count = 0
            success = False
            
            while retry_count <= max_retries and not success:
                try:
                    if retry_count > 0:
                        logger.info(f"Retrying rotation to {direction} (attempt {retry_count + 1}/{max_retries + 1})")
                    else:
                        logger.info(f"Rotating image to direction {rotation_index}/{len(other_directions)}: {direction}")
                    
                    # Use rotate API to generate image for this direction
                    rotated_bytes = self.pixellab_client.rotate_image(
                        from_image_bytes=base_image_bytes,
                        from_direction="south",
                        to_direction=direction,
                        image_size=image_size,
                        from_view="side",
                        to_view="side",
                        image_guidance_scale=7.5  # Higher guidance scale for consistency
                    )
                    
                    # Save rotated image
                    file_path, url = self.file_manager.save_image(
                        rotated_bytes,
                        str(character.id),
                        direction,
                        rotation_index
                    )
                    
                    # Add to character
                    character.add_image(url, file_path, direction, rotation_index)
                    
                    images.append({
                        'url': url,
                        'path': file_path,
                        'angle': direction,
                        'direction': direction,
                        'index': rotation_index
                    })
                    
                    rotation_index += 1
                    success = True
                    
                except Exception as e:
                    retry_count += 1
                    if retry_count > max_retries:
                        logger.error(f"Failed to rotate image to {direction} after {max_retries + 1} attempts: {str(e)}")
                        # Continue generating other directions, but don't increment index
                        break
                    else:
                        # Wait before retry (exponential backoff)
                        wait_time = 2 ** retry_count
                        logger.warning(f"Rotation to {direction} failed, retrying in {wait_time}s...")
                        time.sleep(wait_time)
        
        character.save()
        
        if not images:
            raise GenerationError("Failed to generate any images")
        
        # Sort by clockwise rotation order (starting from north, clockwise)
        # This order ensures smooth rotation animation without jumps
        if image_count == 1:
            # Only one image, no sorting needed
            clockwise_order = ["south"]
        elif image_count == 4:
            clockwise_order = ["north", "east", "south", "west"]
        else:  # 8 directions
            clockwise_order = ["north", "north-east", "east", "south-east", 
                              "south", "south-west", "west", "north-west"]
        
        images.sort(key=lambda x: clockwise_order.index(x['direction']) if x['direction'] in clockwise_order else 999)
        
        # Verify all requested directions are generated
        generated_directions = {img['direction'] for img in images}
        expected_directions = set(directions)
        missing_directions = expected_directions - generated_directions
        
        if missing_directions:
            logger.warning(f"Missing directions: {missing_directions}. Generated: {len(images)}/{len(directions)} images")
        else:
            logger.info(f"Successfully generated all {len(images)} directions")
        
        # Animation generation removed - only generate directional rotate images
        
        return images
    
    def _generate_story(self, character: Character, form_data: Dict) -> str:
        """Generate story"""
        try:
            # Build story prompt
            story_prompt = f"Write a short backstory (about 100 words) for a character named {form_data.get('name')}"
            if form_data.get('characterClass'):
                story_prompt += f", who is a {form_data.get('characterClass')}"
            if form_data.get('personality'):
                story_prompt += f", with personality traits: {form_data.get('personality')}"
            if form_data.get('appearance'):
                story_prompt += f", and appearance: {form_data.get('appearance')}"
            
            logger.info("Generating story...")
            story_content = self.llama_client.generate_story(story_prompt)
            
            # Set story
            character.set_story(story_content, story_prompt)
            character.save()
            
            return story_content
        
        except Exception as e:
            logger.warning(f"Failed to generate story: {str(e)}")
            # Story generation failure does not affect overall process
            return ""
    
    def _generate_animation_frames(
        self,
        character_id: str,
        animation_type: str,
        direction: str,
        reference_image_path: str = None,  # Optional, if provided use reference image, otherwise prompt-only generation
        n_frames: int = 4,
        use_prompt_only: bool = True  # Whether to use prompt only (not use reference image)
    ) -> List[Dict]:
        """
        Generate animation frames
        
        If use_prompt_only=True, use pure prompts to generate independent descriptions for each frame (similar to generating directional images)
        If use_prompt_only=False, use reference image and animate_with_text API
        
        Args:
            character_id: Character ID
            animation_type: Animation type (walk, run, jump, attack)
            direction: Direction
            reference_image_path: Reference image path (idle image for this direction)
            n_frames: Number of frames
        
        Returns:
            Frame data list [{"url": str, "path": str, "frame_index": int}, ...]
        """
        from pathlib import Path
        
        try:
            # Get character information (for building description)
            character = self.character_repo.get_by_id(character_id)
            if not character:
                raise GenerationError(f"Character not found: {character_id}")
            
            # Extract Character DNA Prompt (consistent with initial generation)
            form_data = character.input_params
            
            # Prioritize using Master Reference Image (lock character consistency)
            # All actions use the same Master Reference Image (south direction standing pose)
            if not use_prompt_only:
                # Prioritize using Master Reference Image (from metadata)
                master_reference_path = None
                if character.metadata and character.metadata.get('master_reference_path'):
                    master_reference_path = character.metadata['master_reference_path']
                    logger.info(f"Using Master Reference Image from metadata: {master_reference_path}")
                else:
                    # If no saved Master Reference, use south direction image
                    south_image = next(
                        (img for img in character.images 
                         if img.get('direction') == 'south' or img.get('angle') == 'south'),
                        None
                    )
                    if south_image and south_image.get('path'):
                        master_reference_path = south_image.get('path')
                        logger.info(f"Using south direction image as Master Reference: {master_reference_path}")
                
                # If reference_image_path is provided, prioritize using it (backward compatibility)
                if reference_image_path:
                    from pathlib import Path
                    ref_path = Path(reference_image_path)
                    if ref_path.exists():
                        master_reference_path = reference_image_path
                        logger.info(f"Using provided reference image as Master Reference: {reference_image_path}")
                
                # If Master Reference Image found, use it to generate animation
                if master_reference_path:
                    from pathlib import Path
                    ref_path = Path(master_reference_path)
                    if ref_path.exists():
                        with open(ref_path, 'rb') as f:
                            reference_image_bytes = f.read()
                        
                        logger.info(f"Using Master Reference Image for {animation_type} - {direction} (locked consistency)")
                        return self._generate_frames_with_reference(
                            character_id, character, form_data, animation_type, direction, 
                            reference_image_bytes, n_frames
                        )
                    else:
                        logger.warning(f"Master Reference Image not found at path: {master_reference_path}")
                else:
                    logger.warning(f"Master Reference Image not found, falling back to prompt-only generation")
            
            # If use_prompt_only=True or reference image not found, use prompt-only generation
            logger.info(f"Using prompt-only generation for {animation_type} - {direction}")
            return self._generate_frames_with_prompts(
                character_id, character, form_data, animation_type, direction, n_frames
            )
        
        except Exception as e:
            logger.error(f"Failed to generate animation frames: {str(e)}")
            raise GenerationError(f"Failed to generate animation frames: {str(e)}")
    
    def _generate_frames_with_reference(
        self,
        character_id: str,
        character: Character,
        form_data: Dict,
        animation_type: str,
        direction: str,
        reference_image_bytes: bytes,
        n_frames: int = 4
    ) -> List[Dict]:
        """
        Generate animation frames using reference image (locked character consistency)
        
        Core strategy:
        1. Use fixed Character DNA (cannot change any word)
        2. Use Master Reference Image (south direction standing pose)
        3. Lock parameters: image_guidance_scale=2.2, init_image_strength=300
        4. Add action constraints to prevent AI from modifying character
        """
        # Get image size (fixed to 64x64)
        image_size = 64  # Fixed size for consistency
        
        # Get fixed Character DNA (from metadata or re-extract)
        character_dna = None
        if character.metadata and character.metadata.get('character_dna'):
            character_dna = character.metadata['character_dna']
            logger.info("Using saved Character DNA from metadata")
        else:
            # If no saved DNA, re-extract (should already exist)
            character_dna = self._extract_character_dna(form_data, image_size)
            logger.warning("Character DNA not found in metadata, re-extracted")
        
        # Direction mapping (for description)
        direction_map_prompt = {
            'north': 'up',
            'south': 'down',
            'east': 'right',
            'west': 'left',
            'north-east': 'front-right',
            'north-west': 'front-left',
            'south-east': 'back-right',
            'south-west': 'back-left'
        }
        facing_direction_prompt = direction_map_prompt.get(direction, direction)
        
        # Build description: Character DNA + action info + constraints
        # Key: Character DNA must remain completely unchanged, only add action and direction info
        action_description = f"{animation_type} animation, facing {facing_direction_prompt}"
        
        # Action constraints (prevent AI from modifying character)
        constraint_text = "Keep proportions, colors, silhouette, armor shape, hood shape, scarf length, and body size exactly the same as the reference. Do not change the character design. Character only, no effects, no particles, no motion lines, no extra elements, 8-bit pixel art, no background"
        
        # Combine full description: DNA + action + constraints
        # Note: Character DNA must be at the front, unchanged
        description = f"{character_dna}, {action_description}, {constraint_text}"
        
        logger.info(f"Generating {n_frames} frames for {animation_type} - {direction} using Master Reference Image with locked parameters")
        logger.debug(f"Description: {description[:150]}...")
        
        # Call animate_with_text API (locked parameters)
        max_retries = 3
        retry_count = 0
        frame_bytes_list = None
        
        while retry_count <= max_retries:
            try:
                # Use locked parameters to ensure consistency
                # image_guidance_scale=2.2 (in range 2.0~2.4, ensure consistency with reference)
                # init_image_strength=300 (fixed value, controls reference image influence)
                frame_bytes_list = self.pixellab_client.animate_with_text(
                    reference_image_bytes=reference_image_bytes,
                    description=description,
                    action=animation_type,
                    direction=direction,
                    image_size={"width": image_size, "height": image_size},  # Fixed 64x64
                    view="side",
                    n_frames=n_frames,
                    image_guidance_scale=2.2,  # Locked in range 2.0~2.4, ensure consistency with reference
                    init_image_strength=300.0  # Locked at 300, stable action transformation range
                )
                break
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "Rate limit" in error_str or "wait longer" in error_str:
                    retry_count += 1
                    if retry_count <= max_retries:
                        wait_time = 5 * retry_count
                        logger.warning(f"Rate limit hit, waiting {wait_time}s before retry {retry_count}/{max_retries}")
                        time.sleep(wait_time)
                        continue
                    else:
                        raise GenerationError(f"Rate limit exceeded. Please wait a few minutes and try again.")
                else:
                    raise
        
        # Save each frame
        frames = []
        for frame_index, frame_bytes in enumerate(frame_bytes_list):
            file_path, url = self.file_manager.save_animation_frame(
                frame_bytes,
                character_id,
                animation_type,
                direction,
                frame_index
            )
            
            frames.append({
                'url': url,
                'path': file_path,
                'frame_index': frame_index
            })
        
        # Sort frames by frame_index
        frames.sort(key=lambda f: f.get('frame_index', 0))
        
        # Generate GIF if multiple frames
        if len(frames) > 1:
            gif_url = self._generate_gif_from_frames(
                frames, character_id, animation_type, direction
            )
            if gif_url:
                for frame in frames:
                    frame['gif_url'] = gif_url
        
        logger.info(f"Successfully generated {len(frames)} frames using reference image for {animation_type} - {direction}")
        return frames
    
    def _generate_frames_with_prompts(
        self,
        character_id: str,
        character: Character,
        form_data: Dict,
        animation_type: str,
        direction: str,
        n_frames: int = 4
    ) -> List[Dict]:
        """
        Generate frames using pure prompts (similar to generating directional images)
        
        Define frame sequence description templates for each action type, then call generate_pixel_art API separately for each frame
        """
        # Get generation parameters
        image_width = int(form_data.get('imageWidth', 64))
        image_length = int(form_data.get('imageLength', 64))
        detail = form_data.get('detail', 'medium detail')
        no_background = form_data.get('noBackground', True)
        
        # Build Character DNA (base character description)
        dna_parts = []
        if form_data.get('characterClass'):
            dna_parts.append(form_data.get('characterClass'))
        elif form_data.get('name'):
            dna_parts.append(form_data.get('name'))
        
        if form_data.get('appearance'):
            appearance = form_data.get('appearance')
            if len(appearance) > 100:
                appearance = appearance[:100]
            dna_parts.append(appearance)
        
        character_dna = ", ".join(dna_parts) if dna_parts else "character"
        
        # Direction mapping
        direction_map_prompt = {
            'north': 'up',
            'south': 'down',
            'east': 'right',
            'west': 'left',
            'north-east': 'front-right',
            'north-west': 'front-left',
            'south-east': 'back-right',
            'south-west': 'back-left'
        }
        facing_direction = direction_map_prompt.get(direction, direction)
        
        # Define frame description templates for each action type (adjusted by direction)
        frame_descriptions = self._get_frame_descriptions(animation_type, direction, n_frames)
        
        # Generate image for each frame
        frames = []
        for frame_index in range(n_frames):
            frame_desc = frame_descriptions[frame_index] if frame_index < len(frame_descriptions) else f"frame {frame_index + 1}"
            
            # Build full prompt
            # Emphasize character only, no extra effects, particles, motion lines, etc.
            prompt_parts = [
                character_dna,
                f"{animation_type} animation",
                f"facing {facing_direction}",
                frame_desc,  # Frame-specific description
                "same character",
                "consistent character design",
                "identical appearance",
                "same color palette",
                "same proportions",
                "character only",
                "no effects",
                "no particles",
                "no motion lines",
                "no motion blur",
                "no trails",
                "no sparks",
                "no dust",
                "no smoke",
                "no extra elements",
                "no decorations",
                "no background objects",
                "8-bit pixel art style",
                "clean outline",
                "sharp edges",
                "no background" if no_background else "simple background",
                "transparent background" if no_background else ""
            ]
            
            # Filter empty strings and combine
            prompt_parts = [p for p in prompt_parts if p]
            full_prompt = ", ".join(prompt_parts)
            
            logger.info(f"Generating frame {frame_index + 1}/{n_frames} for {animation_type} - {direction}: {frame_desc}")
            
            # Call generate_pixel_art API to generate single frame
            max_retries = 3
            retry_count = 0
            frame_bytes = None
            
            while retry_count <= max_retries:
                try:
                    frame_bytes = self.pixellab_client.generate_pixel_art(
                        description=full_prompt,
                        image_width=image_width,
                        image_length=image_length,
                        detail=detail,
                        direction=direction,  # Use original direction value
                        no_background=no_background
                    )
                    break
                except Exception as e:
                    error_str = str(e)
                    if "429" in error_str or "Rate limit" in error_str or "wait longer" in error_str:
                        retry_count += 1
                        if retry_count <= max_retries:
                            wait_time = 5 * retry_count
                            logger.warning(f"Rate limit hit for frame {frame_index + 1}, waiting {wait_time}s before retry")
                            time.sleep(wait_time)
                            continue
                        else:
                            raise GenerationError(f"Rate limit exceeded for frame {frame_index + 1}")
                    else:
                        raise
            
            # Save frame
            file_path, url = self.file_manager.save_animation_frame(
                frame_bytes,
                character_id,
                animation_type,
                direction,
                frame_index
            )
            
            frames.append({
                'url': url,
                'path': file_path,
                'frame_index': frame_index
            })
        
        # Sort frames by frame_index
        frames.sort(key=lambda f: f.get('frame_index', 0))
        
        # Generate GIF if multiple frames
        if len(frames) > 1:
            gif_url = self._generate_gif_from_frames(
                frames, character_id, animation_type, direction
            )
            if gif_url:
                for frame in frames:
                    frame['gif_url'] = gif_url
        
        logger.info(f"Successfully generated {len(frames)} frames using prompts for {animation_type} - {direction}")
        return frames
    
    def _get_frame_descriptions(self, animation_type: str, direction: str, n_frames: int) -> List[str]:
        """
        Define frame description templates for each action type (adjusted by direction)
        
        Args:
            animation_type: Action type
            direction: Direction (used to determine left/right hand)
            n_frames: Number of frames
        
        Returns:
            List of frame descriptions, each describing the action state of that frame
        """
        # Determine attack hand based on direction (right hand when facing east/right, left hand when facing west/left)
        # For other directions, use primary hand (usually right hand)
        if direction in ['east', 'south-east', 'north-east']:
            attack_hand = 'right hand'
            opposite_hand = 'left hand'
        elif direction in ['west', 'south-west', 'north-west']:
            attack_hand = 'left hand'
            opposite_hand = 'right hand'
        else:  # north, south
            attack_hand = 'right hand'  # Default right hand
            opposite_hand = 'left hand'
        
        # Define frame description templates for each action type
        descriptions = {
            'walk': [
                'left foot forward, right foot back, arms swinging naturally, character body movement only',
                'both feet on ground, mid-stride, balanced pose, character body only',
                'right foot forward, left foot back, arms swinging opposite, character body movement only',
                'both feet on ground, mid-stride, balanced pose, character body only'
            ],
            'run': [
                'left foot forward, right foot extended back, arms pumping, character body movement only, no motion effects',
                'both feet off ground, mid-air, maximum stride, character body pose only, no motion lines',
                'right foot forward, left foot extended back, arms pumping, character body movement only, no motion effects',
                'both feet off ground, mid-air, maximum stride, character body pose only, no motion lines'
            ],
            'jump': [
                'crouching pose, preparing to jump, knees bent, arms down, character body only',
                'rising pose, feet leaving ground, arms up, character body ascending, no particles',
                'peak pose, maximum height, arms extended up, character body mid-air, no effects',
                'landing pose, feet touching ground, knees bent, arms down, character body only'
            ],
            'attack': [
                f'weapon in {attack_hand} raised high above head, arm extended upward, preparing to strike, character body only, no effects',
                f'weapon in {attack_hand} at mid-level, arm swinging forward, character body motion only, no motion lines',
                f'weapon in {attack_hand} below waist, arm extended downward, character body impact pose, no sparks or effects',
                f'weapon in {attack_hand} returning, arm pulling back, character body recovery pose, no effects'
            ],
            'idle': [
                'standing pose, neutral position, relaxed stance',
                'slight movement, breathing animation, subtle shift',
                'standing pose, neutral position, relaxed stance',
                'slight movement, breathing animation, subtle shift'
            ],
            'hit': [
                'normal pose, before impact',
                'recoil pose, body pushed back, arms up in defense',
                'staggered pose, off-balance, recovering',
                'returning to normal pose, recovering from hit'
            ],
            'death': [
                'normal pose, before falling',
                'falling backward, losing balance, arms flailing',
                'on ground, lying down, motionless',
                'final pose, completely still, death state'
            ]
        }
        
        # Get description template for this action type
        base_descriptions = descriptions.get(animation_type, [f'frame {i+1}' for i in range(n_frames)])
        
        # If requested frames exceed template, cycle through
        if n_frames > len(base_descriptions):
            result = base_descriptions.copy()
            for i in range(len(base_descriptions), n_frames):
                result.append(base_descriptions[i % len(base_descriptions)])
            return result
        
        # If requested frames are fewer than template, truncate
        return base_descriptions[:n_frames]
    
    def _generate_gif_from_frames(
        self,
        frames: List[Dict],
        character_id: str,
        animation_type: str,
        direction: str
    ) -> Optional[str]:
        """
        Generate GIF from animation frames
        
        Args:
            frames: List of frame dictionaries with 'path' key
            character_id: Character ID
            animation_type: Animation type (walk, run, etc.)
            direction: Direction
        
        Returns:
            GIF URL or None if generation failed
        """
        try:
            # Get frame paths
            frame_paths = [frame.get('path') for frame in frames if frame.get('path')]
            
            if len(frame_paths) < 2:
                logger.warning(f"Not enough frames to generate GIF: {len(frame_paths)}")
                return None
            
            # Create temporary GIF path
            from pathlib import Path
            temp_gif_path = Path(self.file_manager.temp_dir) / f"{character_id}_{animation_type}_{direction}_temp.gif"
            
            # Generate GIF
            logger.info(f"Generating GIF for {animation_type} - {direction} with {len(frame_paths)} frames")
            gif_path = create_gif_from_frames(
                frame_paths,
                output_path=str(temp_gif_path),
                duration=200,  # 200ms per frame
                loop=0,  # Infinite loop
                optimize=False  # Don't optimize to prevent ghosting
            )
            
            # Read GIF data
            with open(gif_path, 'rb') as f:
                gif_data = f.read()
            
            # Save to final location (use save_gif with a specific path structure)
            # Create animation GIF directory structure
            from pathlib import Path
            animation_gif_dir = self.file_manager.images_dir / character_id / animation_type / direction
            animation_gif_dir.mkdir(parents=True, exist_ok=True)
            
            gif_filename = f"{animation_type}_{direction}.gif"
            gif_path = animation_gif_dir / gif_filename
            
            # Write GIF file
            with open(gif_path, 'wb') as f:
                f.write(gif_data)
            
            # Generate URL
            url = f"{config.STATIC_URL_PREFIX}/generated/images/{character_id}/{animation_type}/{direction}/{gif_filename}"
            
            file_path = str(gif_path)
            
            # Delete temporary file
            if temp_gif_path.exists():
                temp_gif_path.unlink()
            
            logger.info(f"GIF generated successfully: {url}")
            return url
        
        except Exception as e:
            logger.error(f"Failed to generate GIF from frames: {str(e)}")
            return None
    
    def _get_master_reference_path(self, character: Character, images: List[Dict] = None) -> Optional[str]:
        """
        Get Master Reference Image path for character consistency
        
        Priority:
        1. Metadata master_reference_path
        2. South direction image from character.images
        3. South direction image from provided images list
        
        Args:
            character: Character object
            images: Optional list of image dicts (if already generated)
        
        Returns:
            Master reference image path or None
        """
        from pathlib import Path
        
        # Priority 1: Check metadata for saved master reference path
        if character.metadata and character.metadata.get('master_reference_path'):
            master_path = character.metadata['master_reference_path']
            master_path_obj = Path(master_path)
            if master_path_obj.exists():
                logger.info(f"Using Master Reference Image from metadata: {master_path}")
                return master_path
            else:
                logger.warning(f"Master Reference Image in metadata not found: {master_path}")
        
        # Priority 2: Find south direction image from character.images
        if character.images:
            south_image = next(
                (img for img in character.images 
                 if (img.get('direction') == 'south' or img.get('angle') == 'south')),
                None
            )
            if south_image and south_image.get('path'):
                path_obj = Path(south_image.get('path'))
                if path_obj.exists():
                    logger.info(f"Using south direction image as Master Reference: {south_image.get('path')}")
                    return south_image.get('path')
        
        # Priority 3: Find south direction image from provided images list
        if images:
            south_image = next(
                (img for img in images 
                 if (img.get('direction') == 'south' or img.get('angle') == 'south')),
                None
            )
            if south_image and south_image.get('path'):
                path_obj = Path(south_image.get('path'))
                if path_obj.exists():
                    logger.info(f"Using south direction image from images list as Master Reference: {south_image.get('path')}")
                    return south_image.get('path')
        
        logger.warning(f"Master Reference Image not found for character: {character.id}")
        return None
    
    def _extract_character_dna(self, form_data: Dict, image_size: int = 64) -> str:
        """
        Extract and fix Character DNA (character identity)
        
        This DNA will be used in all rotate and animation generation, never change any word
        Format: A masked pixel-art ninja with black hood, red scarf, slim body, small limbs, blue belt, consistent silhouette, compact proportions, retro pixel art 64x64
        
        Args:
            form_data: Form data
            image_size: Image size (default 64)
        
        Returns:
            Fixed Character DNA string
        """
        dna_parts = []
        
        # 1. Character type (core)
        if form_data.get('characterClass'):
            dna_parts.append(form_data.get('characterClass'))
        elif form_data.get('name'):
            dna_parts.append(form_data.get('name'))
        else:
            dna_parts.append("character")
        
        # 2. Appearance features (most important, maintain consistency)
        if form_data.get('appearance'):
            appearance = form_data.get('appearance')
            # If appearance is too long, only take first 100 characters to avoid long prompt
            if len(appearance) > 100:
                appearance = appearance[:100]
            dna_parts.append(appearance)
        
        # 3. Special features (if any)
        if form_data.get('specialFeatures'):
            special = form_data.get('specialFeatures')
            if len(special) > 80:
                special = special[:80]
            dna_parts.append(special)
        
        # 4. Body features (extracted from appearance or use defaults)
        # These are key features for maintaining character consistency
        body_features = []
        appearance_text = form_data.get('appearance', '').lower()
        
        # Extract body feature keywords
        if 'slim' in appearance_text or 'thin' in appearance_text:
            body_features.append("slim body")
        elif 'fat' in appearance_text or 'heavy' in appearance_text:
            body_features.append("heavy body")
        else:
            body_features.append("normal body")
        
        if 'small' in appearance_text or 'tiny' in appearance_text:
            body_features.append("small limbs")
        elif 'large' in appearance_text or 'big' in appearance_text:
            body_features.append("large limbs")
        
        # 5. Combine Character DNA
        # Format: character type, appearance features, body features, fixed style description
        character_dna = ", ".join(dna_parts)
        if body_features:
            character_dna += ", " + ", ".join(body_features)
        
        # 6. Add fixed style description (ensure consistency)
        character_dna += f", consistent silhouette, compact proportions, retro pixel art {image_size}x{image_size}"
        
        logger.debug(f"Extracted Character DNA: {character_dna[:150]}...")
        return character_dna
    
    def _generate_selected_animations(
        self,
        character: Character,
        form_data: Dict,
        selected_animations: List[str],
        selected_directions: Dict[str, List[str]]
    ):
        """
        Generate user-selected animations
        
        Args:
            character: Character object
            form_data: Form data
            selected_animations: List of selected action types, e.g., ["attack", "walk"]
            selected_directions: Dictionary of directions for each action type, e.g., {"attack": ["east", "south"], "walk": ["east"]}
        """
        try:
            # Initialize animations field
            if not hasattr(character, 'animations') or not character.animations:
                character.animations = {}
            
            # Generate animations for each selected action type
            for animation_type in selected_animations:
                if animation_type not in ['walk', 'run', 'jump', 'attack']:
                    logger.warning(f"Invalid animation type: {animation_type}, skipping")
                    continue
                
                # Get direction list for this action type
                directions = selected_directions.get(animation_type, [])
                if not directions:
                    logger.warning(f"No directions selected for {animation_type}, skipping")
                    continue
                
                # Initialize animation type
                if animation_type not in character.animations:
                    character.animations[animation_type] = {
                        'south': [],
                        'north': [],
                        'north-east': [],
                        'east': [],
                        'south-east': [],
                        'south-west': [],
                        'west': [],
                        'north-west': []
                    }
                
                logger.info(f"Generating {animation_type} animation for directions: {', '.join(directions)}")
                
                # Generate animation frames for each direction
                # All directions use the same Master Reference Image (south direction)
                master_reference_path = self._get_master_reference_path(character)
                
                if master_reference_path:
                    logger.info(f"Using Master Reference Image for all directions: {master_reference_path}")
                else:
                    logger.warning(f"Master Reference Image not found, skipping {animation_type}")
                    continue
                
                for direction in directions:
                    try:
                        logger.info(f"Generating {animation_type} animation for {direction} direction using Master Reference...")
                        
                        frames = self._generate_animation_frames(
                            character_id=str(character.id),
                            animation_type=animation_type,
                            direction=direction,
                            reference_image_path=master_reference_path,
                            n_frames=4,
                            use_prompt_only=False  # Use reference image method (locked consistency)
                        )
                        
                        # Save animation frames
                        character.animations[animation_type][direction] = frames
                        character.save()
                        
                        logger.info(f"Successfully generated {len(frames)} frames for {animation_type} - {direction}")
                        
                    except Exception as e:
                        logger.error(f"Failed to generate {animation_type} animation for {direction}: {str(e)}")
                        # Continue generating other directions, don't interrupt flow
                        continue
                
                logger.info(f"Completed generating {animation_type} animation")
            
            logger.info(f"Successfully generated all selected animations")
            
        except Exception as e:
            logger.error(f"Failed to generate selected animations: {str(e)}")
            # Animation generation failure doesn't affect character generation
            raise

