"""
Global Error Handling Middleware
"""
from flask import jsonify
from utils.exceptions import (
    AppException, ValidationError, NotFoundError, 
    GenerationError, StorageError, APIError
)
from utils.logger import setup_logger

logger = setup_logger(__name__)


def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": "Validation failed",
            "message": str(e)
        }), 400
    
    @app.errorhandler(NotFoundError)
    def handle_not_found_error(e):
        logger.warning(f"Not found: {str(e)}")
        return jsonify({
            "error": "Not found",
            "message": str(e)
        }), 404
    
    @app.errorhandler(GenerationError)
    def handle_generation_error(e):
        logger.error(f"Generation error: {str(e)}")
        return jsonify({
            "error": "Generation failed",
            "message": str(e)
        }), 500
    
    @app.errorhandler(StorageError)
    def handle_storage_error(e):
        logger.error(f"Storage error: {str(e)}")
        return jsonify({
            "error": "Storage operation failed",
            "message": str(e)
        }), 500
    
    @app.errorhandler(APIError)
    def handle_api_error(e):
        logger.error(f"API error: {str(e)}")
        return jsonify({
            "error": "External API error",
            "message": str(e)
        }), 502
    
    @app.errorhandler(AppException)
    def handle_app_exception(e):
        logger.error(f"Application error: {str(e)}")
        return jsonify({
            "error": "Application error",
            "message": str(e)
        }), 500
    
    @app.errorhandler(404)
    def handle_404(e):
        # Don't intercept 404 for static file paths, let Flask return default 404
        from flask import request
        if request.path.startswith('/static/'):
            # For static files, return default Flask 404 response
            return "File not found", 404
        return jsonify({
            "error": "Not found",
            "message": "The requested resource was not found"
        }), 404
    
    @app.errorhandler(500)
    def handle_500(e):
        logger.error(f"Internal server error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500

