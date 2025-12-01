"""
ZIP Generator Utility
Used to package character images and GIFs into ZIP files
"""
import zipfile
import io
from pathlib import Path
from typing import Optional
from utils.logger import setup_logger
from utils.exceptions import StorageError
from database.models.character_model import Character

logger = setup_logger(__name__)


class ZipGenerator:
    """ZIP Generator"""
    
    @staticmethod
    def create_images_zip(character: Character, include_gif: bool = False) -> io.BytesIO:
        """
        Create images ZIP package
        
        Args:
            character: Character object
            include_gif: Whether to include GIF
        
        Returns:
            BytesIO object (ZIP file stream)
        """
        zip_buffer = io.BytesIO()
        
        try:
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Add all images
                for img in character.images:
                    img_path = Path(img.get('path', ''))
                    if img_path.exists():
                        angle = img.get('angle', 'unknown')
                        index = img.get('index', 0)
                        # Path in ZIP
                        zip_path = f"images/{angle}_{index}.png"
                        zip_file.write(img_path, zip_path)
                        logger.debug(f"Added image to ZIP: {zip_path}")
                
                # Optional: add GIF
                if include_gif and character.gif:
                    gif_path = Path(character.gif.get('path', ''))
                    if gif_path.exists():
                        zip_path = f"animation/{character.name}.gif"
                        zip_file.write(gif_path, zip_path)
                        logger.debug(f"Added GIF to ZIP: {zip_path}")
            
            zip_buffer.seek(0)
            logger.info(f"Created ZIP for character: {character.id}")
            return zip_buffer
        
        except Exception as e:
            logger.error(f"Failed to create ZIP: {str(e)}")
            raise StorageError(f"Failed to create ZIP: {str(e)}")
    
    @staticmethod
    def create_complete_zip(character: Character) -> io.BytesIO:
        """
        Create complete package (images + GIF + story text file)
        
        Args:
            character: Character object
        
        Returns:
            BytesIO object (ZIP file stream)
        """
        zip_buffer = io.BytesIO()
        
        try:
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # 1. Add all images
                for img in character.images:
                    img_path = Path(img.get('path', ''))
                    if img_path.exists():
                        angle = img.get('angle', 'unknown')
                        index = img.get('index', 0)
                        # Path in ZIP
                        zip_path = f"images/{angle}_{index}.png"
                        zip_file.write(img_path, zip_path)
                        logger.debug(f"Added image to ZIP: {zip_path}")
                
                # 2. Add GIF (if exists)
                if character.gif:
                    gif_path = Path(character.gif.get('path', ''))
                    if gif_path.exists():
                        zip_path = f"animation/{character.name}.gif"
                        zip_file.write(gif_path, zip_path)
                        logger.debug(f"Added GIF to ZIP: {zip_path}")
                
                # 3. Add story text file (if exists)
                if character.story and character.story.get('content'):
                    story_content = character.story.get('content', '')
                    if story_content:
                        # Create story text file in memory
                        story_text = f"Character: {character.name}\n"
                        story_text += f"Description: {character.description or 'N/A'}\n"
                        story_text += f"\n{'='*50}\n"
                        story_text += f"Story:\n"
                        story_text += f"{'='*50}\n\n"
                        story_text += story_content
                        
                        # Add story as text file to ZIP
                        zip_path = f"story/{character.name}_story.txt"
                        zip_file.writestr(zip_path, story_text.encode('utf-8'))
                        logger.debug(f"Added story text file to ZIP: {zip_path}")
            
            zip_buffer.seek(0)
            logger.info(f"Created complete ZIP (with story) for character: {character.id}")
            return zip_buffer
        
        except Exception as e:
            logger.error(f"Failed to create complete ZIP: {str(e)}")
            raise StorageError(f"Failed to create complete ZIP: {str(e)}")
    
    @staticmethod
    def create_images_only_zip(character: Character) -> io.BytesIO:
        """Create images-only ZIP"""
        return ZipGenerator.create_images_zip(character, include_gif=False)
    
    @staticmethod
    def create_complete_export_zip(character: Character) -> io.BytesIO:
        """
        Create complete export package (images + GIF + all animation frames)
        
        Args:
            character: Character object
        
        Returns:
            BytesIO object (ZIP file stream)
        """
        zip_buffer = io.BytesIO()
        
        try:
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # 1. Add all static images
                for img in character.images:
                    img_path = Path(img.get('path', ''))
                    if img_path.exists():
                        direction = img.get('direction') or img.get('angle', 'unknown')
                        index = img.get('index', 0)
                        zip_path = f"idle/{direction}_{index}.png"
                        zip_file.write(img_path, zip_path)
                        logger.debug(f"Added idle image to ZIP: {zip_path}")
                
                # 2. Add GIF (if exists)
                if character.gif and character.gif.get('path'):
                    gif_path = Path(character.gif.get('path', ''))
                    if gif_path.exists():
                        zip_path = f"gif/{character.name}.gif"
                        zip_file.write(gif_path, zip_path)
                        logger.debug(f"Added GIF to ZIP: {zip_path}")
                
                # 3. Add all animation frames
                if character.animations:
                    for anim_type, directions in character.animations.items():
                        for direction, frames in directions.items():
                            if frames:
                                for frame in frames:
                                    frame_path = Path(frame.get('path', ''))
                                    if frame_path.exists():
                                        frame_index = frame.get('frame_index', 0)
                                        zip_path = f"animations/{anim_type}/{direction}/frame_{frame_index}.png"
                                        zip_file.write(frame_path, zip_path)
                                        logger.debug(f"Added animation frame to ZIP: {zip_path}")
                                
                                # If GIF exists, also add animation GIF
                                if frames and frames[0].get('gif_url'):
                                    # Try to extract path from gif_url
                                    gif_url = frames[0].get('gif_url', '')
                                    if '/static/' in gif_url or '/generated/' in gif_url:
                                        # Extract path from URL
                                        if '/static/' in gif_url:
                                            gif_relative_path = gif_url.split('/static/')[-1]
                                        else:
                                            gif_relative_path = gif_url.split('/generated/')[-1]
                                        
                                        from config import config
                                        gif_full_path = config.STORAGE_BASE_PATH / gif_relative_path
                                        if gif_full_path.exists():
                                            zip_path = f"animations/{anim_type}/{direction}/{anim_type}_{direction}.gif"
                                            zip_file.write(str(gif_full_path), zip_path)
                                            logger.debug(f"Added animation GIF to ZIP: {zip_path}")
            
            zip_buffer.seek(0)
            logger.info(f"Created complete export ZIP for character: {character.id}")
            return zip_buffer
        
        except Exception as e:
            logger.error(f"Failed to create complete export ZIP: {str(e)}")
            raise StorageError(f"Failed to create complete export ZIP: {str(e)}")

