"""
用户模型
"""
from mongoengine import Document, StringField, DateTimeField, ListField, ObjectIdField, DictField
from datetime import datetime
from bson import ObjectId


class User(Document):
    """用户模型"""
    
    username = StringField(max_length=50, unique=True, sparse=True)
    email = StringField(max_length=100, unique=True, sparse=True)
    
    # 关联的角色ID列表（便于快速查询）
    character_ids = ListField(ObjectIdField(), default=list)
    
    # 用户偏好设置
    preferences = DictField(default=dict)
    
    # 时间戳
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': [
            'username',
            'email',
            'character_ids'
        ]
    }
    
    def add_character(self, character_id):
        """添加角色ID"""
        if character_id not in self.character_ids:
            self.character_ids.append(character_id)
            self.updated_at = datetime.utcnow()
            self.save()
    
    def remove_character(self, character_id):
        """移除角色ID"""
        if character_id in self.character_ids:
            self.character_ids.remove(character_id)
            self.updated_at = datetime.utcnow()
            self.save()
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'character_ids': [str(cid) for cid in self.character_ids],
            'preferences': self.preferences,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

