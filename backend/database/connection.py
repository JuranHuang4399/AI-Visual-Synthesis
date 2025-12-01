"""
MongoDB连接管理
"""
from mongoengine import connect, disconnect
from config import config
import logging

logger = logging.getLogger(__name__)


def init_db():
    """初始化数据库连接"""
    try:
        connect(
            db=config.MONGODB_DB,
            host=config.MONGODB_URI,
            alias='default'
        )
        logger.info(f"Connected to MongoDB: {config.MONGODB_DB}")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise


def close_db():
    """关闭数据库连接"""
    try:
        disconnect(alias='default')
        logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error disconnecting from MongoDB: {str(e)}")


def check_db_connection():
    """检查数据库连接状态"""
    try:
        from mongoengine import get_db
        db = get_db()
        # 执行简单查询测试连接
        db.command('ping')
        return True
    except Exception as e:
        logger.error(f"Database connection check failed: {str(e)}")
        return False

