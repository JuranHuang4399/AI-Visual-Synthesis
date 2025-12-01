"""
Gallery Routes
"""
from flask import Blueprint, request, jsonify
from core.services.character_service import CharacterService
from utils.logger import setup_logger

logger = setup_logger(__name__)

bp = Blueprint('gallery', __name__)
character_service = CharacterService()


@bp.route('/gallery', methods=['GET'])
def get_gallery():
    """Get all Gallery characters (for frontend display)"""
    try:
        user_id = request.args.get('user_id')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        characters = character_service.get_characters(
            user_id=user_id,
            limit=limit,
            skip=skip,
            status='completed'
        )
        
        # Convert to format needed by frontend
        gallery_data = [char.to_dict() for char in characters]
        
        return jsonify({
            'characters': gallery_data,
            'total': len(gallery_data),
            'limit': limit,
            'skip': skip
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to get gallery: {str(e)}")
        raise


@bp.route('/gallery/user/<user_id>', methods=['GET'])
def get_user_gallery(user_id):
    """Get all characters for a user"""
    try:
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        characters = character_service.get_characters(
            user_id=user_id,
            limit=limit,
            skip=skip,
            status='completed'
        )
        
        return jsonify({
            'characters': [char.to_dict() for char in characters],
            'total': len(characters)
        }), 200
    
    except Exception as e:
        logger.error(f"Failed to get user gallery: {str(e)}")
        raise

