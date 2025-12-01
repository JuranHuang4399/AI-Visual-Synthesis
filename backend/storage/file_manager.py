"""
File Manager
Handles file operations: save, delete, query, etc.
"""
import os
from pathlib import Path
from typing import Optional, List
from config import config
from utils.logger import setup_logger
from utils.exceptions import StorageError

logger = setup_logger(__name__)


class FileManager:
    """File Manager"""
    
    def __init__(self):
        self.base_path = config.STORAGE_BASE_PATH
        self.images_dir = self.base_path / config.IMAGES_DIR
        self.gifs_dir = self.base_path / config.GIFS_DIR
        self.temp_dir = self.base_path / config.TEMP_DIR
        
        # Ensure directories exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Ensure all necessary directories exist"""
        for directory in [self.images_dir, self.gifs_dir, self.temp_dir]:
            directory.mkdir(parents=True, exist_ok=True)
    
    def save_image(self, image_data: bytes, character_id: str, angle: str, index: int, 
                   extension: str = 'png') -> tuple[str, str]:
        """
        Save image
        
        Args:
            image_data: Image binary data
            character_id: Character ID
            angle: Angle (front, back, left, etc.)
            index: Index
            extension: File extension
        
        Returns:
            (file path, URL) tuple
        """
        try:
            # Create character directory
            character_dir = self.images_dir / character_id
            character_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate filename
            filename = f"{angle}_{index}.{extension}"
            file_path = character_dir / filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(image_data)
            
            # Generate URL (relative path, frontend will automatically add API base URL)
            url = f"{config.STATIC_URL_PREFIX}/{config.IMAGES_DIR}/{character_id}/{filename}"
            
            logger.info(f"Saved image: {file_path}")
            return str(file_path), url
        
        except Exception as e:
            logger.error(f"Failed to save image: {str(e)}")
            raise StorageError(f"Failed to save image: {str(e)}")
    
    def save_gif(self, gif_data: bytes, character_id: str) -> tuple[str, str]:
        """
        Save GIF
        
        Args:
            gif_data: GIF binary data
            character_id: Character ID
        
        Returns:
            (file path, URL) tuple
        """
        try:
            # Generate filename
            filename = f"{character_id}.gif"
            file_path = self.gifs_dir / filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(gif_data)
            
            # Generate URL
            url = f"{config.STATIC_URL_PREFIX}/{config.GIFS_DIR}/{filename}"
            
            logger.info(f"Saved GIF: {file_path}")
            return str(file_path), url
        
        except Exception as e:
            logger.error(f"Failed to save GIF: {str(e)}")
            raise StorageError(f"Failed to save GIF: {str(e)}")
    
    def get_image_path(self, character_id: str, angle: str, index: int, 
                      extension: str = 'png') -> Optional[Path]:
        """Get image path"""
        filename = f"{angle}_{index}.{extension}"
        file_path = self.images_dir / character_id / filename
        return file_path if file_path.exists() else None
    
    def get_gif_path(self, character_id: str) -> Optional[Path]:
        """Get GIF path"""
        filename = f"{character_id}.gif"
        file_path = self.gifs_dir / filename
        return file_path if file_path.exists() else None
    
    def get_character_images(self, character_id: str) -> List[Path]:
        """Get all image paths for a character"""
        character_dir = self.images_dir / character_id
        if not character_dir.exists():
            return []
        
        return sorted([f for f in character_dir.iterdir() if f.is_file()])
    
    def delete_character_files(self, character_id: str) -> bool:
        """
        Delete all files for a character
        
        Args:
            character_id: Character ID
        
        Returns:
            Whether deletion was successful
        """
        try:
            # Delete image directory
            character_dir = self.images_dir / character_id
            if character_dir.exists():
                import shutil
                shutil.rmtree(character_dir)
            
            # Delete GIF
            gif_path = self.get_gif_path(character_id)
            if gif_path and gif_path.exists():
                gif_path.unlink()
            
            logger.info(f"Deleted files for character: {character_id}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to delete character files: {str(e)}")
            return False
    
    def save_animation_frame(
        self,
        frame_data: bytes,
        character_id: str,
        animation_type: str,
        direction: str,
        frame_index: int,
        extension: str = 'png'
    ) -> tuple[str, str]:
        """
        Save animation frame
        
        Args:
            frame_data: Frame binary data
            character_id: Character ID
            animation_type: Animation type (walk, run, jump, attack)
            direction: Direction (north, south, etc.)
            frame_index: Frame index
            extension: File extension
        
        Returns:
            (file path, URL) tuple
        """
        try:
            # Create animation directory structure: images/{character_id}/{animation_type}/{direction}/
            animation_dir = self.images_dir / character_id / animation_type / direction
            animation_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate filename
            filename = f"frame_{frame_index}.{extension}"
            file_path = animation_dir / filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(frame_data)
            
            # Generate URL
            url = f"{config.STATIC_URL_PREFIX}/{config.IMAGES_DIR}/{character_id}/{animation_type}/{direction}/{filename}"
            
            logger.info(f"Saved animation frame: {file_path}")
            return str(file_path), url
        
        except Exception as e:
            logger.error(f"Failed to save animation frame: {str(e)}")
            raise StorageError(f"Failed to save animation frame: {str(e)}")
    
    def cleanup_temp_files(self, max_age_hours: int = 24):
        """Clean up temporary files"""
        import time
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        try:
            for file_path in self.temp_dir.iterdir():
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        logger.info(f"Cleaned up temp file: {file_path}")
        except Exception as e:
            logger.error(f"Failed to cleanup temp files: {str(e)}")

