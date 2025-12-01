"""
GIF Generation Service
"""
from database.repositories.character_repository import CharacterRepository
from storage.file_manager import FileManager
from utils.gif_generator import create_gif_from_frames
from utils.logger import setup_logger
from utils.exceptions import GenerationError
from config import config

logger = setup_logger(__name__)


class GifService:
    """GIF Generation Service"""
    
    def __init__(self):
        self.character_repo = CharacterRepository()
        self.file_manager = FileManager()
    
    def generate_gif(self, character_id: str, duration: int = None, loop: int = None) -> dict:
        """
        Generate GIF for character
        
        Args:
            character_id: Character ID
            duration: Duration per frame (milliseconds)
            loop: Number of loops
        
        Returns:
            GIF information dictionary
        """
        character = self.character_repo.get_by_id(character_id)
        if not character:
            raise GenerationError(f"Character not found: {character_id}")
        
        if not character.images:
            raise GenerationError("No images available for GIF generation")
        
        # Use configured default values
        duration = duration or config.DEFAULT_GIF_DURATION
        loop = loop if loop is not None else config.DEFAULT_GIF_LOOP
        
        try:
            # Get all image paths
            frame_paths = [img.get('path') for img in character.images if img.get('path')]
            
            if not frame_paths:
                raise GenerationError("No valid image paths found")
            
            # Create temporary GIF path
            from pathlib import Path
            temp_gif_path = Path(self.file_manager.temp_dir) / f"{character_id}_temp.gif"
            
            # Generate GIF
            logger.info(f"Generating GIF for character: {character_id}")
            gif_path = create_gif_from_frames(
                frame_paths,
                output_path=str(temp_gif_path),
                duration=duration,
                loop=loop,
                optimize=False  # Fixed: use False to prevent ghosting
            )
            
            # Read GIF data
            with open(gif_path, 'rb') as f:
                gif_data = f.read()
            
            # Save to final location
            file_path, url = self.file_manager.save_gif(gif_data, character_id)
            
            # Delete temporary file
            if temp_gif_path.exists():
                temp_gif_path.unlink()
            
            # Update character
            frame_count = len(frame_paths)
            self.character_repo.set_gif(character_id, url, file_path, duration, frame_count)
            
            logger.info(f"GIF generated successfully: {character_id}")
            
            return {
                'url': url,
                'path': file_path,
                'duration': duration,
                'frame_count': frame_count
            }
        
        except Exception as e:
            logger.error(f"Failed to generate GIF: {str(e)}")
            raise GenerationError(f"GIF generation failed: {str(e)}")

