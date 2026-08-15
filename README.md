# Muanyan Portfolio

马佳祺的个人作品集与技术博客，展示深度学习、强化学习项目与学习笔记。支持中英文双语切换。

🔗 **在线访问**：https://muanyan-mjq.github.io/muanyan-portfolio/

## 项目概览

### 博客文章

| 文章 | 日期 | 分类 | 阅读 |
|------|------|------|------|
| [AGI 之后：从「会什么」到「你是谁」](/blog/agi-era-thoughts) | 2026-07-31 | AGI | 15 分钟 |
| [让 Obsidian 自己运转：Codex 自动化工作流搭建实录](/blog/codex-obsidian-workflow) | 2026-08-07 | 独立开发 | 25 分钟 |
| [给 AI 热点装一个「特别关心」：Windows 弹窗实战](/blog/aihot-interest-radar) | 2026-08-07 | 独立开发 | 20 分钟 |
| [VAE 学习笔记（一）：从直觉到实现](/blog/vae-1-introduction) | 2026-06-02 | 学习笔记 | 20 分钟 |
| [VAE 学习笔记（二）：彩色图像与优化](/blog/vae-2-color) | 2026-07-24 | 学习笔记 | 25 分钟 |
| [我把 AI 装进了 QQ 和微信：Hermes Agent 全平台部署记](/blog/hermes-agent-qq-wechat) | 2026-07-18 | 独立开发 | 25 分钟 |
| [Claude Code 配置 MCP 服务器：像 USB 一样给 AI 接上外设](/blog/claude-code-mcp-setup) | 2026-07-16 | 独立开发 | 8 分钟 |
| [一行命令，让 Claude Code 终端「活」起来](/blog/claude-code-statusline) | 2026-06-29 | 独立开发 | 15 分钟 |

> 另有 1 篇草稿未发布：《VAE 学习笔记（三）：条件生成 CVAE》

### 项目空间

| 页面 | 说明 | 标签 |
|------|------|------|
| [DeepSeek Monitor Windows](/projects/deepseek-monitor) | Windows 桌面 API 用量监控器，7 套主题色，系统托盘驻留。可点击架构管线、主题画廊、fork 链致谢卡片 | Tauri 2 · React · Rust |
| [随心耶 Flowdiary](/projects/flowdiary) | 萨摩耶主题日记 App，含 12 区块叙事产品介绍页 | Flutter · 独立开发 |
| [VAE 项目集](/projects/vae) · [VAE 彩色化](/projects/vae-color) · [VAE 灰度版](/projects/vae-gray) | VAE 系列项目页 | PyTorch · 深度学习 |
| [项目总览](/projects) | 项目卡片展示，欢迎页入场动画 | |

### 专栏 & 工具

| 页面 | 说明 |
|------|------|
| [研究笔记](/research) | 论文阅读、技术调研记录 |
| [AI 问答](/qa) · [VAE 专题](/qa/vae) | 30 条 VAE 问答，支持全文搜索，从直觉到数学推导全覆盖 |
| [学习时间线](/timeline) | 按时间排列的学习历程 |

### 个人主页

| 页面 | 说明 |
|------|------|
| [首页](/) | 头像 hover 水波动画、环绕标签淡入、技能条渐变、奖项时间线 + 灯箱 |
| [关于我](/about) | 教育背景、技术栈、联系方式 |
| [联系方式](/contact) | 表单联系 |

## 技术栈

- **框架**：Next.js 16 (App Router + Turbopack)
- **样式**：Tailwind CSS 4
- **语言**：TypeScript
- **内容**：MDX（博客文章）、KaTeX（数学公式）、Shiki（代码高亮）
- **部署**：GitHub Pages（静态导出 + GitHub Actions 自动部署）

## 页面结构

```
├── /                  首页（个人介绍、教育经历、获奖、技能、项目、联系方式）
├── /blog              博客空间（欢迎页 → 文章列表，标签筛选）
│   └── /blog/[slug]   文章详情（侧栏目录 + scroll spy + 代码复制）
├── /projects          项目空间（欢迎页 → 项目卡片）
│   ├── /projects/deepseek-monitor  DeepSeek Monitor（模拟仪表盘、架构管线、主题画廊、fork 链致谢卡片）
│   └── /projects/flowdiary  随心耶产品介绍页（12 区块叙事，图片去底融合）
├── /research          研究笔记
├── /qa               AI 问答记录
│   └── /qa/vae       VAE 专题问答（30 条，支持搜索）
├── /timeline          学习时间线
├── /about             关于我
└── /contact           联系方式
```

## 特性

### 欢迎页面
- 浮动背景技术词汇，网格分布 + 随机偏移
- 打字机效果逐字显示标题
- 胶囊按钮 hover 渐变翻转 + 箭头滑动动画
- sessionStorage 持久化进入状态

### 中英文双语
- 全站点中英文切换（导航栏、标题、描述、标签全部翻译）
- 语言选择持久化到 localStorage
- 博客目录随语言切换即时更新

### 博客系统
- 纸张效果文章区域，阴影 + 边框，默认 110% 缩放阅读体验
- h2 底部靛蓝横线装饰，h3 左侧紫色竖线装饰
- KaTeX 数学公式渲染
- Shiki 代码高亮跟随明暗主题，长代码支持折叠展开
- 可折叠卡片（grid-template-rows 丝滑动画），常见问题二级分类折叠
- 侧栏目录：scroll spy 实时高亮 + 点击即切 + 目录项自动滚动到可见区域
- 目录随语言切换 useLayoutEffect 零延迟更新
- 文章封面支持自定义图片和渐变背景

### 首页
- 头像 hover 水波环展开 + 环绕标签淡入动画
- 5 个项目卡片，含 DeepSeek Monitor 桌面应用入口
- 技能条渐变动画，延迟依次加载
- 奖项时间线布局 + 灯箱查看照片

### 项目详情页
- **DeepSeek Monitor**：模拟仪表盘 Hero 区域（余额卡片 + 模型用量行 + 7 日堆叠柱状图）
- **架构管线**：Windows → Tauri 2 → React+TS → Rust+API → DeepSeek API，每层点击展开技术卡片，DeepSeek API 展开端点说明
- **主题画廊**：7 套主题色卡切换联动背景，点击展开按钮左右滑入截图网格，懒加载图片
- **Fork 链致谢**：三张独立卡片展示上游仓库链（Joyi-code → 当前项目 → JayHome137），每张含 GitHub 图标、描述、外链
- **亮/暗模式适配**：所有卡片、文字、边框支持系统明暗主题

## 本地开发

```bash
npm install
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 生产构建到 out/
```

## 部署

推送到 `main` 分支，GitHub Actions 自动构建并部署到 GitHub Pages。
