"""
Base Repository Class
Provides common CRUD operations
"""
from typing import Optional, List, Dict, Any
from mongoengine import Document, QuerySet
from bson import ObjectId


class BaseRepository:
    """Base Repository Class"""
    
    def __init__(self, model_class: type[Document]):
        self.model = model_class
    
    def get_by_id(self, id: str) -> Optional[Document]:
        """Get document by ID"""
        try:
            return self.model.objects(id=ObjectId(id)).first()
        except Exception:
            return None
    
    def get_all(self, limit: int = None, skip: int = 0, **filters) -> List[Document]:
        """Get all documents (supports filtering and pagination)"""
        query = self.model.objects(**filters)
        if skip:
            query = query.skip(skip)
        if limit:
            query = query.limit(limit)
        return list(query)
    
    def create(self, **data) -> Document:
        """Create new document"""
        return self.model(**data).save()
    
    def update(self, id: str, **data) -> Optional[Document]:
        """Update document"""
        doc = self.get_by_id(id)
        if doc:
            for key, value in data.items():
                setattr(doc, key, value)
            doc.save()
            return doc
        return None
    
    def delete(self, id: str) -> bool:
        """Delete document"""
        doc = self.get_by_id(id)
        if doc:
            doc.delete()
            return True
        return False
    
    def count(self, **filters) -> int:
        """Count documents"""
        return self.model.objects(**filters).count()
    
    def exists(self, id: str) -> bool:
        """Check if document exists"""
        return self.get_by_id(id) is not None

