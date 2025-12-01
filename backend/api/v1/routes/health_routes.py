"""
Health Check Routes
"""
from flask import Blueprint, jsonify
from database.connection import check_db_connection
from utils.logger import setup_logger

logger = setup_logger(__name__)

bp = Blueprint('health', __name__)


@bp.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'service': 'AI Visual Synthesis API'
    }), 200


@bp.route('/health/db', methods=['GET'])
def health_db():
    """Database connection check"""
    db_status = check_db_connection()
    
    return jsonify({
        'status': 'ok' if db_status else 'error',
        'database': 'connected' if db_status else 'disconnected'
    }), 200 if db_status else 503

