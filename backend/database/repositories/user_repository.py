"""
用户Repository
"""
from typing import Optional, List
from .base_repository import BaseRepository
from database.models.user_model import User
from bson import ObjectId


class UserRepository(BaseRepository):
    """用户数据访问层"""
    
    def __init__(self):
        super().__init__(User)
    
    def get_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return User.objects(username=username).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        return User.objects(email=email).first()
    
    def get_user_characters(self, user_id: str, limit: int = None, skip: int = 0) -> List[str]:
        """获取用户的所有角色ID列表"""
        user = self.get_by_id(user_id)
        if user:
            character_ids = user.character_ids[skip:]
            if limit:
                character_ids = character_ids[:limit]
            return [str(cid) for cid in character_ids]
        return []

