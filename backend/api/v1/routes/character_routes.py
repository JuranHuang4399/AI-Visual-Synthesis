"""
Character Routes
"""
from flask import Blueprint, request, jsonify
from core.services.character_service import CharacterService
from core.services.generation_service import GenerationService
from utils.validators import validate_character_form, validate_character_id
from utils.logger import setup_logger

logger = setup_logger(__name__)

bp = Blueprint('characters', __name__)
character_service = CharacterService()
generation_service = GenerationService()


@bp.route('/characters/generate', methods=['POST'])
def generate_character():
    """Create character (generate images + story)"""
    try:
        data = request.get_json()
        
        # Validate input
        validated_data = validate_character_form(data)
        
        # Generate character
        character = generation_service.generate_character(validated_data)
        
        # Return result
        return jsonify(character.to_dict()), 201
    
    except Exception as e:
        logger.error(f"Failed to generate character: {str(e)}")
        raise


@bp.route('/characters', methods=['GET'])
def get_characters():
    """Get character list"""
    try:
        user_id = request.args.get('user_id')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        status = request.args.get('status', 'completed')
        
        characters = character_service.get_characters(
            user_id=user_id,
            limit=limit,
            skip=skip,
            status=status
        )
        
        return jsonify({
            'characters': [char.to_dict() for char in characters],
            'total': len(characters)
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to get characters: {str(e)}")
        raise


@bp.route('/characters/<character_id>', methods=['GET'])
def get_character(character_id):
    """Get single character details"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id)
        
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        return jsonify(character.to_dict()), 200
    
    except Exception as e:
        logger.error(f"Failed to get character: {str(e)}")
        raise


@bp.route('/characters/<character_id>', methods=['PUT'])
def update_character(character_id):
    """Update character information"""
    try:
        validate_character_id(character_id)
        data = request.get_json()
        
        character = character_service.update_character(character_id, data)
        
        return jsonify(character.to_dict()), 200
    
    except Exception as e:
        logger.error(f"Failed to update character: {str(e)}")
        raise


@bp.route('/characters/<character_id>', methods=['DELETE'])
def delete_character(character_id):
    """Delete character"""
    try:
        validate_character_id(character_id)
        character_service.delete_character(character_id)
        
        return jsonify({'message': 'Character deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Failed to delete character: {str(e)}")
        raise


@bp.route('/characters/<character_id>/generate-story', methods=['POST'])
def generate_story(character_id):
    """Generate story for character"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id)
        
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Use character's input parameters to generate story
        story = generation_service._generate_story(character, character.input_params)
        
        return jsonify({
            'story': story,
            'character_id': character_id
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to generate story: {str(e)}")
        raise


@bp.route('/characters/<character_id>/generate-gif', methods=['POST'])
def generate_gif(character_id):
    """Generate GIF for character"""
    try:
        from core.services.gif_service import GifService
        
        validate_character_id(character_id)
        data = request.get_json() or {}
        
        duration = data.get('duration')
        loop = data.get('loop')
        
        gif_service = GifService()
        gif_info = gif_service.generate_gif(character_id, duration, loop)
        
        return jsonify(gif_info), 200
    
    except Exception as e:
        logger.error(f"Failed to generate GIF: {str(e)}")
        raise


@bp.route('/characters/<character_id>/status', methods=['GET'])
def get_character_status(character_id):
    """Get character generation status"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id)
        
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        return jsonify({
            'id': str(character.id),
            'status': character.status,
            'progress': _calculate_progress(character)
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to get character status: {str(e)}")
        raise


@bp.route('/characters/<character_id>/save', methods=['POST'])
def save_character(character_id):
    """Save character to gallery (confirm save)"""
    try:
        validate_character_id(character_id)
        character = character_service.get_character(character_id)
        
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Only allow saving if generation is completed or pending_save
        if character.status not in ['completed', 'pending_save']:
            return jsonify({
                'error': 'Character generation is not completed yet',
                'status': character.status
            }), 400
        
        # If status is pending_save, change to completed
        if character.status == 'pending_save':
            character.status = 'completed'
            character.save()
            logger.info(f"Character {character_id} status changed from pending_save to completed")
        
        logger.info(f"Character {character_id} saved to gallery by user (status is completed)")
        
        try:
            # Try to convert to dict, return simplified version if fails
            character_dict = character.to_dict()
        except Exception as e:
            logger.warning(f"Failed to convert character to dict: {str(e)}, returning simplified version")
            # Return simplified version
            character_dict = {
                'id': str(character.id),
                'name': character.name,
                'description': character.description,
                'status': character.status,
                'images': [{'url': img.get('url'), 'direction': img.get('direction')} for img in character.images[:8]],
                'story': character.story.get('content', '') if character.story else '',
                'animations': {}  # Simplified version doesn't include animations
            }
        
        return jsonify({
            'message': 'Character saved to gallery successfully',
            'character_id': character_id,
            'character': character_dict
        }), 200
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        logger.error(f"Failed to save character: {str(e)}\n{error_trace}")
        
        # Return detailed error information to frontend
        return jsonify({
            'error': 'Failed to save character',
            'message': str(e),
            'details': error_trace if logger.level <= 10 else None  # Only return detailed trace in DEBUG mode
        }), 500


def _calculate_progress(character):
    """Calculate generation progress"""
    if character.status == 'completed':
        return 1.0
    elif character.status == 'failed':
        return 0.0
    elif character.status == 'generating':
        # Estimate progress based on number of generated images
        total_images = character.input_params.get('imageCount', 4)
        generated_images = len(character.images)
        return min(generated_images / total_images, 0.9)  # Maximum 90% until completed
    else:
        return 0.0


@bp.route('/characters/<character_id>/animations', methods=['POST'])
def add_animation(character_id):
    """Add new animation to character"""
    try:
        validate_character_id(character_id)
        data = request.get_json()
        animation_type = data.get('animation_type')
        
        if not animation_type:
            from utils.exceptions import ValidationError
            raise ValidationError("animation_type is required")
        
        if animation_type not in ['walk', 'run', 'jump', 'attack']:
            from utils.exceptions import ValidationError
            raise ValidationError("Invalid animation_type. Must be one of: walk, run, jump, attack")
        
        character = character_service.get_character(character_id)
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Initialize animation data structure (if not exists)
        if not hasattr(character, 'animations') or character.animations is None:
            character.animations = {}
        
        # If animation already exists, return existing data
        if animation_type in character.animations:
            return jsonify({
                'message': f'Animation {animation_type} already exists',
                'animation': character.animations[animation_type]
            }), 200
        
        # Create new animation (default generate south direction animation)
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
        
        character.save()
        
        # Auto-generate south direction animation (default direction)
        try:
            from core.services.generation_service import GenerationService
            generation_service = GenerationService()
            
            # Get south direction idle image as reference
            south_idle = next((img for img in character.images if img.get('direction') == 'south'), None)
            if south_idle:
                logger.info(f"Auto-generating south direction for {animation_type}")
                frames = generation_service._generate_animation_frames(
                    character_id=character_id,
                    animation_type=animation_type,
                    direction='south',
                    reference_image_path=south_idle.get('path'),
                    n_frames=4
                )
                character.animations[animation_type]['south'] = frames
                character.save()
        except Exception as e:
            logger.warning(f"Failed to auto-generate south direction: {str(e)}")
            # Continue, don't block animation creation
        
        logger.info(f"Added animation {animation_type} to character {character_id}")
        
        return jsonify({
            'message': f'Animation {animation_type} added successfully',
            'animation': character.animations[animation_type]
        }), 201
    
    except Exception as e:
        logger.error(f"Failed to add animation: {str(e)}")
        raise


@bp.route('/characters/<character_id>/animations/<animation_type>/directions/<direction>/generate', methods=['POST'])
def generate_animation_direction(character_id, animation_type, direction):
    """Generate frames for specific animation and direction"""
    try:
        validate_character_id(character_id)
        
        # Validate direction
        valid_directions = ['north', 'north-east', 'east', 'south-east', 
                           'south', 'south-west', 'west', 'north-west']
        if direction not in valid_directions:
            from utils.exceptions import ValidationError
            raise ValidationError(f"Invalid direction. Must be one of: {', '.join(valid_directions)}")
        
        character = character_service.get_character(character_id)
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Check if animation exists
        if not hasattr(character, 'animations') or not character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character has no animations. Please add an animation first.")
        
        if animation_type not in character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Animation {animation_type} not found. Please add it first.")
        
        # Call generation service to generate animation frames
        from core.services.generation_service import GenerationService
        generation_service = GenerationService()
        
        # Get idle image for this direction as reference
        # Try to find by direction field, if not found try angle field
        idle_image = next((img for img in character.images if img.get('direction') == direction), None)
        if not idle_image:
            # Try to find by angle field (compatible with old data)
            idle_image = next((img for img in character.images if img.get('angle') == direction), None)
        
        if not idle_image:
            logger.error(f"Available images: {[img.get('direction') or img.get('angle') for img in character.images]}")
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Idle image for direction {direction} not found. Available directions: {[img.get('direction') or img.get('angle') for img in character.images]}")
        
        # Generate animation frames (using prompt-only generation, similar to generating directional images)
        frames = generation_service._generate_animation_frames(
            character_id=character_id,
            animation_type=animation_type,
            direction=direction,
            reference_image_path=None,  # Don't use reference image, use prompt-only
            n_frames=4,  # Default 4 frames
            use_prompt_only=True  # Use prompt-only generation, define independent description for each frame
        )
        
        # Update character's animation data
        if direction not in character.animations[animation_type]:
            character.animations[animation_type][direction] = []
        
        # Ensure frames are sorted by frame_index to avoid GIF frame order confusion
        sorted_frames = sorted(frames, key=lambda f: f.get('frame_index', 0))
        character.animations[animation_type][direction] = sorted_frames
        character.save()
        
        logger.info(f"Generated {len(sorted_frames)} frames for {animation_type} - {direction}")
        
        # Convert URLs to full URLs, and ensure GIF URLs are also converted
        api_url = request.host_url.rstrip('/')
        frames_with_full_urls = []
        for frame in sorted_frames:
            frame_dict = {
                **frame,
                'url': frame['url'] if frame['url'].startswith('http') else f"{api_url}{frame['url']}"
            }
            # Convert GIF URL
            if frame.get('gif_url'):
                gif_url = frame['gif_url']
                if not gif_url.startswith('http'):
                    gif_url = f"{api_url}{gif_url if gif_url.startswith('/') else '/' + gif_url}"
                frame_dict['gif_url'] = gif_url
            frames_with_full_urls.append(frame_dict)
        
        # Generate GIF (if multiple frames)
        gif_url = None
        if len(frames) > 1:
            try:
                from utils.gif_generator import create_gif_from_frames
                from pathlib import Path
                from storage.file_manager import FileManager
                
                file_manager = FileManager()
                # Sort by frame_index to ensure correct GIF frame order
                sorted_frames = sorted(frames, key=lambda f: f.get('frame_index', 0))
                frame_paths = [frame['path'] for frame in sorted_frames if frame.get('path')]
                
                if frame_paths:
                    # Create temporary GIF path
                    temp_gif_path = file_manager.temp_dir / f"{character_id}_{animation_type}_{direction}_temp.gif"
                    
                    # Generate GIF
                    gif_path = create_gif_from_frames(
                        frame_paths,
                        output_path=str(temp_gif_path),
                        duration=200,  # 200ms per frame
                        loop=0,  # Infinite loop
                        optimize=False  # Fixed: use False to prevent ghosting
                    )
                    
                    # Save GIF to final location
                    gif_filename = f"{character_id}_{animation_type}_{direction}.gif"
                    gif_storage_path = file_manager.images_dir / character_id / animation_type / direction / gif_filename
                    gif_storage_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Move temporary file to final location
                    import shutil
                    shutil.move(gif_path, str(gif_storage_path))
                    
                    # Generate URL
                    api_url = request.host_url.rstrip('/')
                    gif_url = f"{api_url}/static/generated/images/{character_id}/{animation_type}/{direction}/{gif_filename}"
                    
                    logger.info(f"Generated GIF for {animation_type} - {direction}: {gif_url}")
            except Exception as gif_error:
                logger.warning(f"Failed to generate GIF for {animation_type} - {direction}: {str(gif_error)}")
                # GIF generation failure doesn't affect frame return
        
        return jsonify({
            'message': f'Successfully generated {len(frames)} frames',
            'frames': frames_with_full_urls,
            'gif_url': gif_url  # Add GIF URL
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to generate animation direction: {str(e)}")
        raise


@bp.route('/characters/<character_id>/animations/<animation_type>', methods=['DELETE'])
def delete_animation(character_id, animation_type):
    """Delete character animation"""
    try:
        validate_character_id(character_id)
        
        if animation_type not in ['walk', 'run', 'jump', 'attack']:
            from utils.exceptions import ValidationError
            raise ValidationError("Invalid animation_type. Must be one of: walk, run, jump, attack")
        
        character = character_service.get_character(character_id)
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Check if animation exists
        if not hasattr(character, 'animations') or not character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character has no animations")
        
        if animation_type not in character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Animation {animation_type} not found")
        
        # Delete animation files
        from storage.file_manager import FileManager
        file_manager = FileManager()
        
        # Delete all direction frame files for this animation type
        animation_data = character.animations[animation_type]
        for direction, frames in animation_data.items():
            if frames:
                for frame in frames:
                    if frame.get('path'):
                        frame_path = Path(frame['path'])
                        if frame_path.exists():
                            try:
                                frame_path.unlink()
                                logger.info(f"Deleted animation frame: {frame_path}")
                            except Exception as e:
                                logger.warning(f"Failed to delete frame {frame_path}: {str(e)}")
        
        # Delete animation directory (if exists)
        animation_dir = file_manager.images_dir / character_id / animation_type
        if animation_dir.exists():
            try:
                import shutil
                shutil.rmtree(animation_dir)
                logger.info(f"Deleted animation directory: {animation_dir}")
            except Exception as e:
                logger.warning(f"Failed to delete animation directory {animation_dir}: {str(e)}")
        
        # Delete animation from database
        del character.animations[animation_type]
        character.save()
        
        logger.info(f"Deleted animation {animation_type} from character {character_id}")
        
        return jsonify({
            'message': f'Animation {animation_type} deleted successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to delete animation: {str(e)}")
        raise


@bp.route('/characters/<character_id>/animations/<animation_type>/directions/<direction>', methods=['DELETE'])
def delete_animation_direction(character_id, animation_type, direction):
    """Delete specific direction of an animation"""
    try:
        validate_character_id(character_id)
        
        # Validate direction
        valid_directions = ['north', 'north-east', 'east', 'south-east', 
                           'south', 'south-west', 'west', 'north-west']
        if direction not in valid_directions:
            from utils.exceptions import ValidationError
            raise ValidationError(f"Invalid direction. Must be one of: {', '.join(valid_directions)}")
        
        character = character_service.get_character(character_id)
        if not character:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Check if animation exists
        if not hasattr(character, 'animations') or not character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Character has no animations")
        
        if animation_type not in character.animations:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Animation {animation_type} not found")
        
        if direction not in character.animations[animation_type]:
            from utils.exceptions import NotFoundError
            raise NotFoundError(f"Direction {direction} not found in animation {animation_type}")
        
        # Delete frame files for this direction
        frames = character.animations[animation_type][direction]
        if frames:
            from pathlib import Path
            for frame in frames:
                if frame.get('path'):
                    frame_path = Path(frame['path'])
                    if frame_path.exists():
                        try:
                            frame_path.unlink()
                            logger.info(f"Deleted animation frame: {frame_path}")
                        except Exception as e:
                            logger.warning(f"Failed to delete frame {frame_path}: {str(e)}")
        
        # Delete direction from database
        character.animations[animation_type][direction] = []
        character.save()
        
        logger.info(f"Deleted direction {direction} from animation {animation_type}")
        
        return jsonify({
            'message': f'Direction {direction} deleted successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to delete animation direction: {str(e)}")
        raise

