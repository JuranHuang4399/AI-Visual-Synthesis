"""
角色Repository
"""
from typing import Optional, List
from .base_repository import BaseRepository
from database.models.character_model import Character
from bson import ObjectId
from datetime import datetime


class CharacterRepository(BaseRepository):
    """角色数据访问层"""
    
    def __init__(self):
        super().__init__(Character)
    
    def get_by_user_id(self, user_id: str, limit: int = None, skip: int = 0) -> List[Character]:
        """获取用户的所有角色"""
        filters = {'user_id': ObjectId(user_id)} if user_id else {}
        return self.get_all(limit=limit, skip=skip, **filters)
    
    def get_completed(self, limit: int = None, skip: int = 0) -> List[Character]:
        """获取所有已完成生成的角色（用于Gallery）"""
        return self.get_all(limit=limit, skip=skip, status='completed')
    
    def update_status(self, character_id: str, status: str) -> Optional[Character]:
        """更新角色状态"""
        valid_statuses = ['pending', 'generating', 'pending_save', 'completed', 'failed']
        if status not in valid_statuses:
            raise ValueError(f"Invalid status: {status}")
        return self.update(character_id, status=status)
    
    def add_image(self, character_id: str, url: str, path: str, angle: str, index: int) -> Optional[Character]:
        """添加图片到角色"""
        character = self.get_by_id(character_id)
        if character:
            character.add_image(url, path, angle, index)
            return character
        return None
    
    def set_story(self, character_id: str, content: str, prompt: str = None) -> Optional[Character]:
        """设置角色故事"""
        character = self.get_by_id(character_id)
        if character:
            character.set_story(content, prompt)
            return character
        return None
    
    def set_gif(self, character_id: str, url: str, path: str, duration: int, frame_count: int) -> Optional[Character]:
        """设置角色GIF"""
        character = self.get_by_id(character_id)
        if character:
            character.set_gif(url, path, duration, frame_count)
            return character
        return None

