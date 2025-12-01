# AI Visual Synthesis Backend

## 项目架构

本项目采用分层架构设计，主要包含以下模块：

```
backend/
├── api/              # API层（路由、中间件）
├── core/             # 核心业务逻辑层
├── database/         # 数据库层（模型、Repository）
├── integrations/     # 第三方API集成层
├── storage/          # 存储管理（本地文件存储）
├── utils/            # 工具函数
└── app.py            # 应用入口
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的API密钥：

```env
# MongoDB配置
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=ai_visual_synthesis

# API Keys
PIXELLAB_KEY=your_pixellab_api_key
HF_TOKEN=your_huggingface_token
SDF_KEY=your_stability_ai_key

# Flask配置
SECRET_KEY=your-secret-key
DEBUG=True
```

### 3. 启动MongoDB

确保MongoDB服务正在运行：

```bash
# macOS (使用Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# 或使用Docker
docker run -d -p 27017:27017 mongo
```

### 4. 运行应用

```bash
python app.py
```

应用将在 `http://localhost:5000` 启动

## API端点

### 角色生成

- `POST /api/v1/characters/generate` - 创建角色（生成图片+故事）
- `GET /api/v1/characters` - 获取角色列表
- `GET /api/v1/characters/:id` - 获取单个角色详情
- `PUT /api/v1/characters/:id` - 更新角色信息
- `DELETE /api/v1/characters/:id` - 删除角色
- `GET /api/v1/characters/:id/status` - 获取生成状态

### 内容生成

- `POST /api/v1/characters/:id/generate-story` - 为角色生成故事
- `POST /api/v1/characters/:id/generate-gif` - 为角色生成GIF

### Gallery

- `GET /api/v1/gallery` - 获取所有角色（用于Gallery展示）
- `GET /api/v1/gallery/user/:user_id` - 获取用户的所有角色

### 下载

- `GET /api/v1/characters/:id/download/images` - 下载套图（ZIP）
- `GET /api/v1/characters/:id/download/gif` - 下载GIF
- `GET /api/v1/characters/:id/download/all` - 下载完整包（图片+GIF）
- `GET /api/v1/characters/:id/images/:index` - 下载单张图片

### 健康检查

- `GET /api/v1/health` - 健康检查
- `GET /api/v1/health/db` - 数据库连接检查

### 兼容性端点

- `POST /generate_gif` - 兼容旧版GIF生成API

## 数据模型

### Character（角色）

核心模型，包含角色的所有信息：

- 基础信息：name, description, status
- 输入参数：input_params（用于重新生成）
- 生成结果：images（图片数组）, story（故事）, gif（GIF动画）
- 元数据：created_at, updated_at, generation_time, view_count

### User（用户）

用户模型（可选，如果启用用户系统）：

- username, email
- character_ids（关联的角色ID列表）
- preferences（用户偏好）

## 文件存储

文件存储在 `storage/directories/` 目录下：

```
storage/directories/
├── generated/
│   ├── images/          # 图片存储
│   │   └── {character_id}/
│   │       ├── front_0.png
│   │       ├── back_1.png
│   │       └── ...
│   └── gifs/            # GIF存储
│       └── {character_id}.gif
└── temp/                # 临时文件
```

静态文件通过 `/static/` 路径访问。

## 开发指南

### 添加新的API端点

1. 在 `api/v1/routes/` 创建新的路由文件
2. 在 `app.py` 中注册Blueprint
3. 在对应的Service层实现业务逻辑

### 添加新的服务

1. 在 `core/services/` 创建服务类
2. 使用Repository访问数据库
3. 使用Client调用外部API

### 数据库迁移

使用MongoEngine的迁移工具或手动更新模型。

## 测试

```bash
# 运行测试（待实现）
pytest tests/
```

## 部署

### 生产环境配置

1. 设置 `DEBUG=False`
2. 配置强密码的 `SECRET_KEY`
3. 使用生产环境的MongoDB
4. 配置反向代理（Nginx）
5. 使用进程管理器（Gunicorn + Supervisor）

### 使用Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

## 故障排查

### MongoDB连接失败

- 检查MongoDB服务是否运行
- 验证 `MONGODB_URI` 配置
- 检查防火墙设置

### API调用失败

- 验证API密钥是否正确
- 检查网络连接
- 查看日志文件 `logs/app.log`

### 文件存储问题

- 检查 `storage/` 目录权限
- 确保有足够的磁盘空间
- 验证文件路径配置

## 许可证

[你的许可证]

