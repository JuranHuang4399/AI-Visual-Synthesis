"""
GIF生成中间件
使用Pillow (PIL) 库将多个frame合并成GIF动画
"""
import os
from PIL import Image
from typing import List, Optional
import io
import base64

def create_gif_from_frames(
    frame_paths: List[str],
    output_path: Optional[str] = None,
    duration: int = 200,  # 每帧持续时间（毫秒）
    loop: int = 0,  # 0表示无限循环
    optimize: bool = True
) -> str:
    """
    从多个frame路径创建GIF
    
    Args:
        frame_paths: 图片文件路径列表
        output_path: 输出GIF路径（如果为None，则返回base64）
        duration: 每帧持续时间（毫秒）
        loop: 循环次数（0=无限循环）
        optimize: 是否优化GIF大小
    
    Returns:
        GIF文件路径或base64字符串
    """
    if not frame_paths:
        raise ValueError("至少需要一个frame")
    
    # 加载所有frame
    frames = []
    for path in frame_paths:
        if os.path.exists(path):
            img = Image.open(path)
            # 转换为RGBA模式（支持透明度）
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            frames.append(img)
        else:
            raise FileNotFoundError(f"Frame文件不存在: {path}")
    
    if not frames:
        raise ValueError("没有有效的frame")
    
    # 确保所有frame尺寸一致
    first_frame_size = frames[0].size
    frames = [frame.resize(first_frame_size, Image.Resampling.LANCZOS) 
              for frame in frames]
    
    # 创建GIF
    if output_path:
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=duration,
            loop=loop,
            optimize=optimize,
            format='GIF'
        )
        return output_path
    else:
        # 返回base64编码的GIF
        buffer = io.BytesIO()
        frames[0].save(
            buffer,
            save_all=True,
            append_images=frames[1:],
            duration=duration,
            loop=loop,
            optimize=optimize,
            format='GIF'
        )
        buffer.seek(0)
        gif_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/gif;base64,{gif_base64}"


def create_gif_from_urls(
    image_urls: List[str],
    output_path: Optional[str] = None,
    duration: int = 200,
    loop: int = 0,
    optimize: bool = True
) -> str:
    """
    从图片URL列表创建GIF（需要先下载图片）
    
    Args:
        image_urls: 图片URL列表
        output_path: 输出GIF路径
        duration: 每帧持续时间（毫秒）
        loop: 循环次数
        optimize: 是否优化
    
    Returns:
        GIF文件路径或base64字符串
    """
    import requests
    import tempfile
    
    temp_paths = []
    try:
        # 下载所有图片到临时文件
        for i, url in enumerate(image_urls):
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            temp_file = tempfile.NamedTemporaryFile(
                delete=False, 
                suffix='.png'
            )
            temp_file.write(response.content)
            temp_file.close()
            temp_paths.append(temp_file.name)
        
        # 创建GIF
        result = create_gif_from_frames(
            temp_paths,
            output_path,
            duration,
            loop,
            optimize
        )
        
        return result
    finally:
        # 清理临时文件
        for path in temp_paths:
            try:
                os.unlink(path)
            except:
                pass

