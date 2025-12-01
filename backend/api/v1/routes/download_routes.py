"""
Download Routes
"""
from flask import Blueprint, send_file, abort
from core.services.character_service import CharacterService
from storage.zip_generator import ZipGenerator
from utils.validators import validate_character_id
from utils.logger import setup_logger
from utils.exceptions import NotFoundError

logger = setup_logger(__name__)

bp = Blueprint('download', __name__)
character_service = CharacterService()


@bp.route('/characters/<character_id>/download/images', methods=['GET'])
def download_images(character_id):
    """Download image set (ZIP)"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        if not character.images:
            abort(404, "No images available")
        
        # Generate ZIP
        zip_buffer = ZipGenerator.create_images_only_zip(character)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{character.name}_images.zip"
        )
    
    except Exception as e:
        logger.error(f"Failed to download images: {str(e)}")
        raise


@bp.route('/characters/<character_id>/download/gif', methods=['GET'])
def download_gif(character_id):
    """Download GIF"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        if not character.gif or not character.gif.get('path'):
            abort(404, "GIF not found")
        
        from pathlib import Path
        gif_path = Path(character.gif['path'])
        
        if not gif_path.exists():
            abort(404, "GIF file not found")
        
        return send_file(
            str(gif_path),
            mimetype='image/gif',
            as_attachment=True,
            download_name=f"{character.name}.gif"
        )
    
    except Exception as e:
        logger.error(f"Failed to download GIF: {str(e)}")
        raise


@bp.route('/characters/<character_id>/download/all', methods=['GET'])
def download_all(character_id):
    """Download complete package (images + GIF)"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        if not character.images:
            abort(404, "No images available")
        
        # Generate ZIP containing GIF
        zip_buffer = ZipGenerator.create_complete_zip(character)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{character.name}_complete.zip"
        )
    
    except Exception as e:
        logger.error(f"Failed to download all: {str(e)}")
        raise


@bp.route('/characters/<character_id>/download/export', methods=['GET'])
def export_character(character_id):
    """Export complete character package (images + GIF + all animation frames)"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        if not character.images:
            abort(404, "No images available")
        
        # Generate complete export package
        zip_buffer = ZipGenerator.create_complete_export_zip(character)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{character.name}_export.zip"
        )
    
    except Exception as e:
        logger.error(f"Failed to export character: {str(e)}")
        raise


@bp.route('/characters/<character_id>/images/<int:index>', methods=['GET'])
def download_single_image(character_id, index):
    """Download single image"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Find image with corresponding index
        image = next((img for img in character.images if img.get('index') == index), None)
        
        if not image or not image.get('path'):
            abort(404, f"Image with index {index} not found")
        
        from pathlib import Path
        img_path = Path(image['path'])
        
        if not img_path.exists():
            abort(404, "Image file not found")
        
        return send_file(
            str(img_path),
            mimetype='image/png',
            as_attachment=True,
            download_name=f"{character.name}_{image.get('angle', 'image')}_{index}.png"
        )
    
    except Exception as e:
        logger.error(f"Failed to download image: {str(e)}")
        raise


@bp.route('/characters/<character_id>/images/direction/<direction>', methods=['GET'])
def download_image_by_direction(character_id, direction):
    """Download image by direction"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id, include_paths=True)
        
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Find image by direction (check both direction and angle fields)
        image = next(
            (img for img in character.images 
             if img.get('direction') == direction or img.get('angle') == direction),
            None
        )
        
        if not image or not image.get('path'):
            abort(404, f"Image for direction {direction} not found")
        
        from pathlib import Path
        img_path = Path(image['path'])
        
        if not img_path.exists():
            abort(404, "Image file not found")
        
        return send_file(
            str(img_path),
            mimetype='image/png',
            as_attachment=True,
            download_name=f"{character.name}_{direction}.png"
        )
    
    except Exception as e:
        logger.error(f"Failed to download image by direction: {str(e)}")
        raise

