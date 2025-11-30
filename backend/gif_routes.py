"""
GIF生成API路由
"""
from flask import Blueprint, request, jsonify, send_file
from gif_generator import create_gif_from_frames, create_gif_from_urls
import os
import tempfile

gif_bp = Blueprint('gif', __name__)

@gif_bp.route('/generate_gif', methods=['POST'])
def generate_gif():
    """
    生成GIF动画
    
    Request Body:
    {
        "frame_paths": ["path1.png", "path2.png", ...],  # 本地文件路径
        "image_urls": ["url1", "url2", ...],  # 或图片URL列表
        "duration": 200,  # 可选，每帧持续时间（毫秒）
        "loop": 0,  # 可选，循环次数（0=无限）
        "return_base64": false  # 可选，是否返回base64
    }
    
    Response:
    {
        "gif_url": "path/to/gif"  # 或 "data:image/gif;base64,..."
    }
    """
    data = request.get_json()
    
    # 获取参数
    frame_paths = data.get('frame_paths', [])
    image_urls = data.get('image_urls', [])
    duration = data.get('duration', 200)
    loop = data.get('loop', 0)
    return_base64 = data.get('return_base64', False)
    
    try:
        if image_urls:
            # 从URL创建GIF
            if return_base64:
                gif_data = create_gif_from_urls(
                    image_urls,
                    output_path=None,
                    duration=duration,
                    loop=loop
                )
                return jsonify({"gif_url": gif_data})
            else:
                # 保存到临时文件
                temp_file = tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix='.gif'
                )
                temp_file.close()
                
                create_gif_from_urls(
                    image_urls,
                    output_path=temp_file.name,
                    duration=duration,
                    loop=loop
                )
                return jsonify({"gif_url": temp_file.name})
        
        elif frame_paths:
            # 从本地路径创建GIF
            if return_base64:
                gif_data = create_gif_from_frames(
                    frame_paths,
                    output_path=None,
                    duration=duration,
                    loop=loop
                )
                return jsonify({"gif_url": gif_data})
            else:
                # 保存到临时文件
                temp_file = tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix='.gif'
                )
                temp_file.close()
                
                create_gif_from_frames(
                    frame_paths,
                    output_path=temp_file.name,
                    duration=duration,
                    loop=loop
                )
                return jsonify({"gif_url": temp_file.name})
        else:
            return jsonify({"error": "需要提供frame_paths或image_urls"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@gif_bp.route('/gif/<path:gif_path>', methods=['GET'])
def serve_gif(gif_path):
    """
    提供GIF文件服务
    """
    if os.path.exists(gif_path):
        return send_file(gif_path, mimetype='image/gif')
    else:
        return jsonify({"error": "GIF文件不存在"}), 404

