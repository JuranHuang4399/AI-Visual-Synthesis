"""
Character Model (Core Model)
Contains all character information: basic info, image set, GIF, story, etc.
"""
from mongoengine import Document, StringField, DateTimeField, ListField, ObjectIdField, DictField, FloatField, IntField
from datetime import datetime
from bson import ObjectId


class Character(Document):
    """Character Model"""
    
    # Basic information
    user_id = ObjectIdField(default=None, null=True)  # Optional, if user system is enabled
    name = StringField(required=True, max_length=100)
    description = StringField(max_length=500, default='')
    
    # Status: pending, generating, completed, failed
    status = StringField(
        required=True,
        default='pending',
        choices=['pending', 'generating', 'completed', 'failed']
    )
    
    # Input parameters (for regeneration)
    input_params = DictField(default=dict)
    
    # Metadata (for storing Character DNA, Master Reference Image, etc.)
    metadata = DictField(default=dict)
    # Format: {
    #   "character_dna": str,  # Fixed character DNA text
    #   "master_reference_path": str,  # Master Reference Image path
    #   "master_reference_direction": str  # Master Reference direction (usually south)
    # }
    
    # Generation results - image array (used directly by frontend)
    images = ListField(DictField(), default=list)
    # Format: [{"url": str, "path": str, "angle": str, "direction": str, "index": int}, ...]
    
    # Story content
    story = DictField(default=dict)
    # Format: {"content": str, "generated_at": datetime, "prompt": str}
    
    # GIF animation
    gif = DictField(default=dict)
    # Format: {"url": str, "path": str, "duration": int, "frame_count": int, "created_at": datetime}
    
    # Animation collection (walk, run, jump, attack, etc.)
    animations = DictField(default=dict)
    # Format: {
    #   "walk": {
    #     "south": [{"url": str, "path": str, "frame_index": int}, ...],
    #     "north": [...],
    #     ...
    #   },
    #   "run": {...},
    #   ...
    # }
    
    # Metadata
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    generation_time = FloatField(default=0.0)  # Generation time (seconds)
    view_count = IntField(default=0)  # View count
    
    meta = {
        'collection': 'characters',
        'indexes': [
            'user_id',
            'status',
            'created_at',
            ('user_id', 'created_at')  # Composite index
        ]
    }
    
    def add_image(self, url, path, angle, index):
        """Add image"""
        image_data = {
            'url': url,
            'path': path,
            'angle': angle,
            'index': index
        }
        # Check if image with same index already exists
        existing = next((img for img in self.images if img.get('index') == index), None)
        if existing:
            # Update existing image
            existing.update(image_data)
        else:
            self.images.append(image_data)
        self.updated_at = datetime.utcnow()
    
    def set_story(self, content, prompt=None):
        """Set story"""
        self.story = {
            'content': content,
            'generated_at': datetime.utcnow(),
            'prompt': prompt or ''
        }
        self.updated_at = datetime.utcnow()
    
    def set_gif(self, url, path, duration, frame_count):
        """Set GIF"""
        self.gif = {
            'url': url,
            'path': path,
            'duration': duration,
            'frame_count': frame_count,
            'created_at': datetime.utcnow()
        }
        self.updated_at = datetime.utcnow()
    
    def increment_view(self):
        """Increment view count"""
        self.view_count += 1
        self.save()
    
    def to_dict(self, include_paths=False):
        """
        Convert to dictionary (for frontend use)
        
        Args:
            include_paths: Whether to include local file paths (default False, only returns URLs)
        """
        result = {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'images': [
                {
                    'url': img.get('url'),
                    'angle': img.get('angle'),
                    'direction': img.get('direction'),
                    'index': img.get('index')
                }
                for img in self.images
            ],
            'story': self.story.get('content', '') if self.story else '',
            'gif': {
                'url': self.gif.get('url') if self.gif else None
            } if self.gif else None,
            'animations': self._format_animations_for_api() if self.animations else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'view_count': self.view_count
        }
        
        # If need to include paths (for backend internal use)
        if include_paths:
            result['images'] = self.images
            if self.gif:
                result['gif']['path'] = self.gif.get('path')
        
        return result
    
    def _format_animations_for_api(self):
        """
        Format animations data, ensure gif_url is included, and handle possible serialization issues
        """
        formatted = {}
        try:
            for anim_type, directions in self.animations.items():
                formatted[anim_type] = {}
                for direction, frames in directions.items():
                    if frames:
                        # Ensure each frame is a serializable dictionary
                        formatted_frames = []
                        for frame in frames:
                            if isinstance(frame, dict):
                                # Only keep serializable fields
                                formatted_frame = {
                                    'url': frame.get('url'),
                                    'frame_index': frame.get('frame_index'),
                                    'gif_url': frame.get('gif_url')
                                }
                                # If include_paths is True, also include path
                                formatted_frames.append(formatted_frame)
                            else:
                                # If not a dictionary, try to convert
                                formatted_frames.append(frame)
                        formatted[anim_type][direction] = formatted_frames
                    else:
                        formatted[anim_type][direction] = []
        except Exception as e:
            # If formatting fails, return empty dictionary
            logger = __import__('utils.logger', fromlist=['setup_logger']).setup_logger(__name__)
            logger.warning(f"Failed to format animations: {str(e)}")
            return {}
        return formatted
    
