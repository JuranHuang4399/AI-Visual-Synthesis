"""
Input Validation Utilities
"""
from utils.exceptions import ValidationError


def validate_character_form(data: dict) -> dict:
    """
    Validate character creation form data
    
    Args:
        data: Form data
    
    Returns:
        Validated data
    
    Raises:
        ValidationError: Validation failed
    """
    required_fields = ['name']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"Missing required field: {field}")
    
    # Validate name
    name = data.get('name', '').strip()
    if not name or len(name) > 100:
        raise ValidationError("Name must be between 1 and 100 characters")
    
    # Validate optional fields
    if 'imageWidth' in data:
        try:
            width = int(data['imageWidth'])
            if width < 64 or width > 512:
                raise ValidationError("imageWidth must be between 64 and 512")
        except (ValueError, TypeError):
            raise ValidationError("imageWidth must be a valid integer")
    
    if 'imageLength' in data:
        try:
            length = int(data['imageLength'])
            if length < 64 or length > 512:
                raise ValidationError("imageLength must be between 64 and 512")
        except (ValueError, TypeError):
            raise ValidationError("imageLength must be a valid integer")
    
    return data


def validate_character_id(character_id: str) -> str:
    """Validate character ID format"""
    if not character_id:
        raise ValidationError("Character ID is required")
    
    try:
        from bson import ObjectId
        ObjectId(character_id)
    except Exception:
        raise ValidationError("Invalid character ID format")
    
    return character_id

