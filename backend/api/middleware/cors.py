"""
CORS Configuration
"""
from flask_cors import CORS
from config import config
from utils.logger import setup_logger

logger = setup_logger(__name__)


def setup_cors(app):
    """Setup CORS"""
    # Allow all origins (development environment), should restrict in production
    allowed_origins = config.CORS_ORIGINS if config.CORS_ORIGINS else ['*']
    
    logger.info(f"CORS configured with origins: {allowed_origins}")
    
    CORS(
        app, 
        origins=allowed_origins, 
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    )

