"""
Application Configuration File
Manages environment variables and constant configurations
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Project root directory
BASE_DIR = Path(__file__).parent


class Config:
    """Application Configuration Class"""
    
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    TESTING = os.getenv('TESTING', 'False').lower() == 'true'
    
    # MongoDB configuration
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    MONGODB_DB = os.getenv('MONGODB_DB', 'ai_visual_synthesis')
    
    # Storage configuration
    STORAGE_BASE_PATH = BASE_DIR / 'storage' / 'directories'
    IMAGES_DIR = 'generated/images'
    GIFS_DIR = 'generated/gifs'
    TEMP_DIR = 'temp'
    UPLOADS_DIR = 'uploads'
    
    # File service configuration
    STATIC_URL_PREFIX = '/static'
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    # API Keys
    PIXELLAB_API_KEY = os.getenv('PIXELLAB_KEY', '')
    META_LLAMA_TOKEN = os.getenv('HF_TOKEN', '')
    STABILITY_API_KEY = os.getenv('SDF_KEY', '')
    
    # Generation configuration
    DEFAULT_IMAGE_WIDTH = 64
    DEFAULT_IMAGE_LENGTH = 64
    DEFAULT_DETAIL = 'medium detail'
    DEFAULT_GIF_DURATION = 200  # milliseconds
    DEFAULT_GIF_LOOP = 0  # 0 means infinite loop
    
    # Logging configuration
    LOG_DIR = BASE_DIR / 'logs'
    LOG_FILE = LOG_DIR / 'app.log'
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # CORS configuration
    # Support multiple origins, separated by commas
    cors_origins_str = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000')
    CORS_ORIGINS = [origin.strip() for origin in cors_origins_str.split(',') if origin.strip()]
    
    @staticmethod
    def init_directories():
        """Initialize necessary directories"""
        directories = [
            Config.STORAGE_BASE_PATH / Config.IMAGES_DIR,
            Config.STORAGE_BASE_PATH / Config.GIFS_DIR,
            Config.STORAGE_BASE_PATH / Config.TEMP_DIR,
            Config.STORAGE_BASE_PATH / Config.UPLOADS_DIR,
            Config.LOG_DIR,
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)


# Create configuration instance
config = Config()

