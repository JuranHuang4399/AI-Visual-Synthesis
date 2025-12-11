"""
Flask Application Main Entry Point
"""
from flask import Flask
from config import config
from database.connection import init_db
from api.middleware.error_handler import register_error_handlers
from api.middleware.cors import setup_cors
from api.v1.routes.character_routes import bp as character_bp
from api.v1.routes.gallery_routes import bp as gallery_bp
from api.v1.routes.download_routes import bp as download_bp
from api.v1.routes.health_routes import bp as health_bp
from utils.logger import setup_logger
from pathlib import Path

logger = setup_logger(__name__)


def create_app():
    """Create Flask application"""
    # Disable Flask default static file route, use custom route
    app = Flask(__name__, static_folder=None, static_url_path=None)
    app.config.from_object(config)
    
    # Initialize directories
    config.init_directories()
    
    # Initialize database
    try:
        init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        # Continue running in development environment, should fail in production
    
    # Setup CORS
    setup_cors(app)
    
    # Static file service (must register before error handlers to avoid 404 interception)
    from flask import send_file, abort
    # Ensure storage_path is a Path object
    if isinstance(config.STORAGE_BASE_PATH, Path):
        storage_path = config.STORAGE_BASE_PATH
    else:
        storage_path = Path(config.STORAGE_BASE_PATH)
    storage_path = storage_path.resolve()  # Resolve to absolute path
    
    logger.info(f"Static file service initialized. Storage path: {storage_path}")
    logger.info(f"Static URL prefix: {config.STATIC_URL_PREFIX}")
    
    @app.route('/static/<path:filepath>')
    def serve_static(filepath):
        """Serve static files"""
        try:
            # Build full file path
            full_path = storage_path / filepath
            full_path = full_path.resolve()
            
            # Security check: ensure path is within storage directory (prevent path traversal attacks)
            try:
                full_path.relative_to(storage_path)
            except ValueError:
                logger.warning(f"Path traversal attempt: {filepath} -> {full_path}")
                abort(403)
            
            # Check if file exists
            if not full_path.exists():
                logger.warning(f"File not found: {filepath} (resolved: {full_path})")
                logger.warning(f"Storage path exists: {storage_path.exists()}")
                abort(404)
            
            if not full_path.is_file():
                logger.warning(f"Path is not a file: {filepath} (resolved: {full_path})")
                abort(404)
            
            # Return file
            return send_file(str(full_path))
        except Exception as e:
            logger.error(f"Failed to serve static file {filepath}: {str(e)}", exc_info=True)
            abort(404)
    
    # Register error handlers (after static file route)
    register_error_handlers(app)
    
    # Register API routes
    app.register_blueprint(character_bp, url_prefix='/api/v1')
    app.register_blueprint(gallery_bp, url_prefix='/api/v1')
    app.register_blueprint(download_bp, url_prefix='/api/v1')
    app.register_blueprint(health_bp, url_prefix='/api/v1')
    
    # Legacy API compatibility (optional, for smooth migration)
    @app.route('/generate_gif', methods=['POST'])
    def legacy_generate_gif():
        """Legacy GIF generation API compatibility"""
        from flask import request, jsonify
        from utils.gif_generator import create_gif_from_urls
        
        data = request.get_json()
        image_urls = data.get('image_urls', [])
        duration = data.get('duration', 200)
        loop = data.get('loop', 0)
        return_base64 = data.get('return_base64', False)
        
        try:
            if return_base64:
                gif_data = create_gif_from_urls(image_urls, output_path=None, duration=duration, loop=loop)
                return jsonify({"gif_url": gif_data})
            else:
                import tempfile
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.gif')
                temp_file.close()
                create_gif_from_urls(image_urls, output_path=temp_file.name, duration=duration, loop=loop)
                return jsonify({"gif_url": temp_file.name})
        except Exception as e:
            logger.error(f"Legacy GIF generation failed: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    logger.info("Flask application created successfully")
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=config.DEBUG, host='0.0.0.0', port=5000)
