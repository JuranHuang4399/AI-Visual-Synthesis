"""
Character Service
Handles character CRUD operations and business logic
"""
from typing import Optional, List, Dict
from database.repositories.character_repository import CharacterRepository
from database.models.character_model import Character
from storage.file_manager import FileManager
from utils.logger import setup_logger
from utils.exceptions import NotFoundError

logger = setup_logger(__name__)


class CharacterService:
    """Character Service"""
    
    def __init__(self):
        self.character_repo = CharacterRepository()
        self.file_manager = FileManager()
    
    def get_character(self, character_id: str, include_paths: bool = False) -> Optional[Character]:
        """Get character"""
        character = self.character_repo.get_by_id(character_id)
        if character:
            character.increment_view()
        return character
    
    def get_characters(self, user_id: str = None, limit: int = None, skip: int = 0, 
                      status: str = 'completed') -> List[Character]:
        """Get character list"""
        if user_id:
            return self.character_repo.get_by_user_id(user_id, limit=limit, skip=skip)
        else:
            return self.character_repo.get_completed(limit=limit, skip=skip)
    
    def update_character(self, character_id: str, data: Dict) -> Optional[Character]:
        """Update character information"""
        character = self.character_repo.get_by_id(character_id)
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Allowed update fields
        updatable_fields = ['name', 'description']
        for field in updatable_fields:
            if field in data:
                setattr(character, field, data[field])
        
        character.save()
        return character
    
    def delete_character(self, character_id: str) -> bool:
        """Delete character and its files"""
        character = self.character_repo.get_by_id(character_id)
        if not character:
            raise NotFoundError(f"Character not found: {character_id}")
        
        # Delete files
        self.file_manager.delete_character_files(character_id)
        
        # Delete database record
        self.character_repo.delete(character_id)
        
        logger.info(f"Deleted character: {character_id}")
        return True

