"""
基础Repository类
提供通用的CRUD操作
"""
from typing import Optional, List, Dict, Any
from mongoengine import Document, QuerySet
from bson import ObjectId


class BaseRepository:
    """基础Repository类"""
    
    def __init__(self, model_class: type[Document]):
        self.model = model_class
    
    def get_by_id(self, id: str) -> Optional[Document]:
        """根据ID获取文档"""
        try:
            return self.model.objects(id=ObjectId(id)).first()
        except Exception:
            return None
    
    def get_all(self, limit: int = None, skip: int = 0, **filters) -> List[Document]:
        """获取所有文档（支持筛选和分页）"""
        query = self.model.objects(**filters)
        if skip:
            query = query.skip(skip)
        if limit:
            query = query.limit(limit)
        return list(query)
    
    def create(self, **data) -> Document:
        """创建新文档"""
        return self.model(**data).save()
    
    def update(self, id: str, **data) -> Optional[Document]:
        """更新文档"""
        doc = self.get_by_id(id)
        if doc:
            for key, value in data.items():
                setattr(doc, key, value)
            doc.save()
            return doc
        return None
    
    def delete(self, id: str) -> bool:
        """删除文档"""
        doc = self.get_by_id(id)
        if doc:
            doc.delete()
            return True
        return False
    
    def count(self, **filters) -> int:
        """统计文档数量"""
        return self.model.objects(**filters).count()
    
    def exists(self, id: str) -> bool:
        """检查文档是否存在"""
        return self.get_by_id(id) is not None

