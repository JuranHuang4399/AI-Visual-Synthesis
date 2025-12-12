"""
应用启动脚本
"""

import os
from app import create_app

if __name__ == "__main__":
    app = create_app()

    # Render 会提供 PORT 环境变量；本地跑时默认 5000
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
