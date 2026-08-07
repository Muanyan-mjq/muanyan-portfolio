<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 博客写作规范（Blog Writing Guide）

写任何博客文章前，先读 `src/app/blog/` 下已有文章（尤其是 `claude-code-mcp-setup`、`claude-code-statusline`、`hermes-agent-qq-wechat`、`vae-1-introduction`），保持风格一致。

## 文风

- 技术博客视角，不是日记：开头用「普遍问题 / 场景」引入（"想象一个场景…"），再引出"所以我要解决它"，避免个人生活叙述（"从大一开始用""搬着搬着就懒了"这类不要写）
- 第一人称但聚焦工程决策："我用了 X，因为…"，给理由，不只给做法
- 多用直觉类比：MCP = AI 的 USB 接口；Hermes = 开源自部署版 Coze/Dify；重参数化 = 调收音机
- 关键术语加粗 + `<code>` 标记；复杂概念先直觉后深入
- 用真实数据说话（耗时、错误率、文件数等），诚实记录踩过的坑
- 结尾"这篇文章是怎么写的"：说明用 AI 撰写、内容来自真实实践

## 结构（技术教程类）

1. 开头：问题/场景钩子 + 一句话点出解法
2. 概念铺垫：这是什么、为什么这么搭
3. 环境准备 / 前置知识（配合 prerequisites 字段）
4. 分步实现：每步 = 说明 → 代码块 → 验证方法
5. 实战案例 / 实际效果（真实数据或截图）
6. 踩坑记录（真实经历）
7. FAQ（折叠卡片，可分类）
8. 总结 + 下一步 + 相关资源卡片

## 排版布局（Signature 组件）

- **深入理解 / 逐行解析卡片**：`<div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">` 内放标题 + 多段文字，用于"额外深度"，与正文区分
- **代码块**：`CodeBlock`（短代码）；`ExpandableCode`（长代码，点击展开）
- **折叠问答**：`CollapsibleCard`，FAQ 用；复杂 FAQ 可分类嵌套
- **图片**：`<figure>` + `<figcaption>`，说明用 "▲ " 前缀，路径用 `${BASE_PATH}/...`
- **提示框**：amber 背景的 `<div>`（"卡住了把报错复制给 AI" 这类）
- **列表**：`className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]"`
- **数学**：`MathBlock` / `InlineMath`

## 双语

- 每篇必须完整 zh + en 两套内容（`content` 对象），标题/描述/正文全都要
- 英文版保持同样的结构和深度，不缩写

## 提交前检查

- `npx tsc --noEmit` 通过
- `npx next build` 通过（注意：构建需要联网下载 Google 字体，网络不通会报 Geist 字体错误，重试即可）
- 新文章记得在 `src/lib/blog-data.ts` 注册（slug/双语标题/描述/日期/标签/分类/封面/阅读时长/published）
- 封面图与现有文章统一：16:9，`isLargeCover` 列表里加新 slug
