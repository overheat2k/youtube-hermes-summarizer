# YouTube Summarizer 🎬📝

一键总结 YouTube 视频的 Chrome 扩展。本地获取字幕，直接调用 AI 接口分析，无需 Hermes Agent。

## 架构

```
你点击「总结」
   ↓
Chrome 扩展 ──POST────▶ 本地字幕服务器 (:8643)
                            │ ① 获取字幕
                            │ ② 显示「字幕获取完成 (193K chars)」
                            │ ③ 发送到 AI 接口分析
                            ▼
                         OpenRouter / DeepSeek / OpenAI
                            │
                            ▼
                        返回结构化总结
                            │
                            ▼
                        右侧浮动面板展示 (Markdown 渲染)
```

**所有操作都在本地完成**——字幕服务器运行在你的 Mac 上，字幕内容和 API 密钥不会离开你的电脑。

## 功能

- ✅ YouTube 视频页面自动注入「总结」按钮
- ✅ 本地获取字幕（快、省 token）
- ✅ 两步流程：先显示字幕大小，再 AI 分析
- ✅ 结构化总结（核心要点、时间戳、关键观点）
- ✅ 右侧浮动面板（可拖拽、可缩放、可复制）
- ✅ Markdown 渲染（标题、列表、粗体、代码）
- ✅ 深色模式自适应
- ✅ 多机支持（每台 Mac 各跑各的服务）

## 快速安装

### 前提条件

- Python 3.10+
- Chrome 浏览器

### 一键安装

```bash
# 克隆仓库
git clone https://github.com/overheat2k/youtube-summarizer.git
cd youtube-summarizer

# 运行安装脚本
chmod +x setup.sh
./setup.sh
```

安装脚本会：
1. 安装 Python 依赖 (`youtube-transcript-api`, `certifi`)
2. 启动字幕服务器（端口 8643，通过 launchd 开机自启）

### 加载 Chrome 扩展

```
chrome://extensions → 开发者模式 → 加载已解压的扩展程序 → 选择 extension/ 目录
```

### 扩展配置

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| Base URL | AI 接口地址 | `https://api.deepseek.com/v1` |
| API Key | 你的 AI 密钥 | — |
| 模型 | 模型名称 | `deepseek-v4-flash` |

点击「测试连接」验证配置是否生效（会同时检查本地服务器和 AI 接口）。

## 使用

1. 打开任意 YouTube 视频
2. 点击视频下方紫色的 **「总结」** 按钮
3. 看到提示「正在获取字幕...」→「字幕获取完成，正在分析...」
4. 右侧弹出详细总结面板

## 多机部署

每台机器各自运行一套：

```bash
git clone https://github.com/overheat2k/youtube-summarizer.git
cd youtube-summarizer
./setup.sh
```

然后 chrome://extensions 加载扩展即可。各机器配置独立。

## 项目结构

```
youtube-summarizer/
├── README.md
├── setup.sh                     # 一键安装脚本
├── transcript_server.py         # 字幕+总结服务器 (Python, :8643)
├── com.hermes.youtube-transcript-server.plist  # macOS 开机自启配置
├── .gitignore
└── extension/
    ├── manifest.json            # Chrome 扩展清单 (MV3)
    ├── content.js               # YouTube 页面注入 + 面板渲染
    ├── background.js            # 后台 Service Worker
    ├── icons/                   # 扩展图标
    └── popup/
        ├── popup.html           # 设置弹窗
        └── popup.js             # 设置逻辑
```

## 技术细节

- **Manifest V3** — 最新 Chrome 扩展规范
- **字幕服务器** — 纯 Python http.server，端口 8643，launchd 自启
- **字幕获取** — `youtube-transcript-api`，支持多语言（zh-Hans / zh / en / 自动）
- **AI 接口** — OpenAI 兼容协议，可接 DeepSeek / OpenRouter / OpenAI / 任意
- **Markdown 渲染** — 内置轻量渲染器（标题、列表、粗体、代码块、引用）
- **浮动面板** — 可拖拽移动、右下角缩放、一键复制

## 与 Hermes Agent 的关系

> 本项目**不需要** Hermes Agent。早期版本依赖 Hermes API Server，
> 现已改为独立的 Python 服务器直接调用 AI 接口。
> Hermes 用户仍然可以同时使用，互不冲突。

## 许可证

MIT
