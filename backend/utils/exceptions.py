"""
自定义异常类
"""


class AppException(Exception):
    """应用基础异常"""
    pass


class ValidationError(AppException):
    """验证错误"""
    pass


class NotFoundError(AppException):
    """资源未找到"""
    pass


class GenerationError(AppException):
    """生成错误"""
    pass


class StorageError(AppException):
    """存储错误"""
    pass


class APIError(AppException):
    """API调用错误"""
    pass

