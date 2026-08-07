export interface BlogPost {
  slug: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  date: string;           // YYYY-MM-DD
  updated?: string;       // 最后更新日期
  tags: string[];
  category: "learning" | "project" | "algorithm" | "reading" | "indie";
  categoryColor?: string;   // 覆盖分类默认颜色（Tailwind gradient）
  categoryLabel?: { zh: string; en: string };  // 覆盖分类显示文字
  series?: {
    name: { zh: string; en: string };
    order: number;        // 第几篇
    total: number;        // 共几篇
  };
  cover: {
    gradient: string;     // Tailwind gradient classes
    icon: string;         // emoji (fallback when no image)
    image?: string;       // 图片路径，优先于 icon
  };
  readingTime: number;    // 分钟
  prerequisites?: { zh: string; en: string }[];
  featured?: boolean;
  published: boolean;
}

export const categories = {
  learning: { zh: "学习笔记", en: "Learning Notes", color: "from-indigo-500 to-purple-500" },
  project: { zh: "项目记录", en: "Project Logs", color: "from-emerald-500 to-teal-500" },
  algorithm: { zh: "算法", en: "Algorithms", color: "from-orange-500 to-red-500" },
  reading: { zh: "论文阅读", en: "Paper Reading", color: "from-pink-500 to-rose-500" },
  indie: { zh: "灵感产物", en: "Inspired Work", color: "from-[#D87756] to-[#C06843]" },
} as const;

// VAE 系列
const vaeSeries = {
  name: { zh: "VAE 学习系列", en: "VAE Learning Series" },
  total: 3,
};

export const blogPosts: BlogPost[] = [
  {
    slug: "agi-era-thoughts",
    title: { zh: "AGI 之后：从「会什么」到「你是谁」", en: "After AGI: From Capability to Identity" },
    description: {
      zh: "一场横跨 Codex 与 Claude Code 的三方深夜对话。从「能力匮乏」到「愿望匮乏」，从守住三样东西到一个从未想过的角度——当一切都能被生成，价值从「会什么」彻底转移到「你是谁」。",
      en: "A three-way late-night dialogue with Codex and Claude Code. From capability scarcity to desire scarcity, from what must be held onto to a new perspective — when everything is generatable, value shifts entirely from capability to identity.",
    },
    date: "2026-07-31",
    tags: ["AGI"],
    category: "indie",
    categoryLabel: { zh: "AGI", en: "AGI" },
    categoryColor: "from-[#0a0612] via-[#1a1030] to-[#0d0820]",
    cover: { gradient: "from-[#0a0612] via-[#1a1030] to-[#0d0820]", icon: "🌌", image: "/agi-era-cover.png" },
    readingTime: 15,
    published: true,
  },
  {
    slug: "vae-1-introduction",
    title: { zh: "VAE 学习笔记（一）：从直觉到实现", en: "VAE Notes (1): From Intuition to Implementation" },
    description: {
      zh: "从零开始理解变分自编码器：什么是编码器和解码器？什么是潜在空间？如何用 KL 散度约束分布？本文用直觉、数学和代码三种方式讲解 VAE 的核心原理。",
      en: "Understanding VAE from scratch: What are encoders and decoders? What is latent space? How does KL divergence constrain the distribution? This article explains VAE core principles through intuition, math, and code.",
    },
    date: "2026-06-02",
    tags: ["VAE", "深度学习", "PyTorch", "生成模型"],
    category: "learning",
    series: { ...vaeSeries, order: 1 },
    cover: { gradient: "from-indigo-500 via-purple-500 to-pink-500", icon: "🧬", image: "/vae-images/vae-icon.png" },
    readingTime: 20,
    prerequisites: [
      { zh: "了解 Python 基础语法", en: "Basic Python syntax" },
      { zh: "了解 PyTorch 的 nn.Module 用法", en: "Familiar with PyTorch nn.Module" },
      { zh: "了解卷积神经网络的基本概念", en: "Basic understanding of CNNs" },
    ],
    featured: true,
    published: true,
  },
  {
    slug: "vae-2-color",
    title: { zh: "VAE 学习笔记（二）：彩色图像与优化", en: "VAE Notes (2): Color Images & Optimization" },
    description: {
      zh: "在基础 VAE 上扩展到彩色图像生成，实验不同的网络结构和损失函数组合，分析重建质量的提升方法。",
      en: "Extending basic VAE to color image generation, experimenting with different architectures and loss functions to improve reconstruction quality.",
    },
    date: "2026-07-24",
    updated: "2026-07-24",
    tags: ["VAE", "深度学习", "PyTorch", "图像生成"],
    category: "learning",
    series: { ...vaeSeries, order: 2 },
    cover: { gradient: "from-indigo-500 via-purple-500 to-pink-500", icon: "🧬", image: "/vae-images/vae-icon.png" },
    readingTime: 25,
    prerequisites: [
      { zh: "已阅读 VAE 学习笔记（一），理解编码器/解码器/重参数化/ELBO", en: "Have read VAE Notes (1), understanding encoder/decoder/reparameterization/ELBO" },
      { zh: "了解 PyTorch 的 Dataset 和 DataLoader", en: "Familiar with PyTorch Dataset and DataLoader" },
    ],
    published: true,
  },
  {
    slug: "vae-3-cvae",
    title: { zh: "VAE 学习笔记（三）：条件生成 CVAE", en: "VAE Notes (3): Conditional Generation with CVAE" },
    description: {
      zh: "在 VAE 基础上加入条件信息，实现指定类别的图像生成。理解条件变分自编码器的原理和实现。",
      en: "Adding conditional information to VAE for class-specific image generation. Understanding the principles and implementation of CVAE.",
    },
    date: "2026-07-01",
    tags: ["CVAE", "深度学习", "条件生成"],
    category: "learning",
    series: { ...vaeSeries, order: 3 },
    cover: { gradient: "from-purple-500 via-indigo-500 to-blue-500", icon: "🧬", image: "/vae-images/vae-icon.png" },
    readingTime: 30,
    published: false,
  },
  {
    slug: "claude-code-mcp-setup",
    title: { zh: "Claude Code 配置 MCP 服务器：像 USB 一样给 AI 接上外设", en: "Claude Code MCP Setup: Give Your AI USB-Like Plug-and-Play Powers" },
    description: {
      zh: "不需要写代码——复制一段 JSON，Claude Code 就能搜 GitHub 仓库、打开网页截图、读写本地文件。三步配好 GitHub、Playwright、Filesystem 三个 MCP 服务器。",
      en: "No coding required — copy a JSON snippet and Claude Code can search GitHub repos, browse and screenshot web pages, and access local files. Three steps, three MCP servers.",
    },
    date: "2026-07-16",
    tags: ["Claude Code", "MCP", "GitHub", "Playwright", "Filesystem", "灵感产物"],
    category: "indie",
    cover: { gradient: "from-[#D87756] via-[#D2734C] to-[#C06843]", icon: "🔌", image: "/statusline-cover.png" },
    readingTime: 8,
    prerequisites: [
      { zh: "Claude Code 终端版已安装并能正常启动", en: "Claude Code CLI installed and running" },
      { zh: "Node.js 已安装（npx 需要）", en: "Node.js installed (required for npx)" },
      { zh: "GitHub 账号（用于生成 Personal Access Token）", en: "GitHub account (for Personal Access Token)" },
    ],
    featured: false,
    published: true,
  },
  {
    slug: "hermes-agent-qq-wechat",
    title: { zh: "我把 AI 装进了 QQ 和微信：Hermes Agent 全平台部署记", en: "I Put AI into QQ & WeChat: A Hermes Agent Story" },
    description: {
      zh: "从零搭建能「看」图的 QQ/微信机器人：DeepSeek 做大脑，OCR 做眼睛，发一张截图就能自动提取文字、分析数据、返回统计结果。完整从部署到实战的记录。",
      en: "Build a vision-capable QQ/WeChat bot from scratch: DeepSeek as the brain, OCR as the eyes. Send a screenshot, get extracted text, data analysis, and stats back — a complete deployment walkthrough.",
    },
    date: "2026-07-18",
    tags: ["Hermes Agent", "QQ Bot", "微信", "OCR", "EasyOCR", "DeepSeek", "灵感产物"],
    category: "indie",
    categoryColor: "from-[#0606b4] to-[#4a4ef0]",
    cover: { gradient: "from-[#0606b4] via-[#2a2ad6] to-[#4a4ef0]", icon: "🤖", image: "/hermes-cover.png" },
    readingTime: 25,
    prerequisites: [
      { zh: "Python 基础（Hermes Agent 基于 Python）", en: "Basic Python" },
      { zh: "DeepSeek API Key（作为 LLM 后端）", en: "DeepSeek API Key" },
      { zh: "QQ 开放平台账号（需实名认证）", en: "QQ Open Platform account" },
    ],
    featured: false,
    published: true,
  },
  {
    slug: "claude-code-statusline",
    title: { zh: "一行命令，让 Claude Code 终端「活」起来", en: "One Command to Bring Your Claude Code Terminal to Life" },
    description: {
      zh: "一句提示词，Claude 帮你写实时状态栏：当前模型、Git 分支、上下文用量、会话时长，每秒自动刷新，全在终端底部一目了然。",
      en: "One prompt and Claude builds you a live status bar: current model, Git branch, context usage, session duration — auto-refreshes every second, all at a glance.",
    },
    date: "2026-06-29",
    tags: ["Claude Code", "终端", "状态栏", "Python", "灵感产物"],
    category: "indie",
    cover: { gradient: "from-[#D87756] via-[#D2734C] to-[#C06843]", icon: "📊", image: "/statusline-cover.png" },
    readingTime: 15,
    prerequisites: [
      { zh: "Claude Code 终端版已安装并能正常启动", en: "Claude Code CLI installed and running" },
      { zh: "Python 3 已安装并加入系统 PATH", en: "Python 3 installed and in PATH" },
      { zh: "Git for Windows（Windows 用户需要 Git Bash）", en: "Git for Windows (Git Bash required on Windows)" },
    ],
    featured: false,
    published: true,
  },
  {
    slug: "codex-obsidian-workflow",
    title: {
      zh: "把 AI 住进笔记库：Codex + Obsidian 自动化工作流",
      en: "Move AI Into Your Notes: A Codex + Obsidian Automation Workflow",
    },
    description: {
      zh: "用 Codex 把 Obsidian 笔记库改造成会自动运转的系统：每天 20:00 AI 热点自动归档、22:50 日记提醒、按月整理。从目录设计到计划任务，一步步搭出自己的第二大脑。",
      en: "Turning an Obsidian vault into a self-running system with Codex: AI news auto-archived at 8pm, diary reminders at 10:50pm, monthly organization. From folder design to scheduled tasks — build your own second brain step by step.",
    },
    date: "2026-08-07",
    tags: ["Codex", "Obsidian", "自动化", "工作流", "Windows"],
    category: "indie",
    categoryColor: "from-sky-600 via-indigo-600 to-violet-600",
    cover: { gradient: "from-sky-600 via-indigo-600 to-violet-600", icon: "🧠", image: "/codex-obsidian-cover.svg" },
    readingTime: 18,
    prerequisites: [
      { zh: "Obsidian 已安装并建好笔记库", en: "Obsidian installed with a vault" },
      { zh: "Node.js 已安装（脚本运行需要）", en: "Node.js installed (for scripts)" },
      { zh: "Windows 10/11（用到计划任务）", en: "Windows 10/11 (scheduled tasks)" },
    ],
    published: true,
  },
  {
    slug: "aihot-interest-radar",
    title: {
      zh: "给 AI 热点装上兴趣雷达：Windows 自定义弹窗实战",
      en: "An Interest Radar for AI News: Custom Windows Popups in Practice",
    },
    description: {
      zh: "每天 20:00 自动抓取 AI 热点，只在你关心的主题（AGI、self、注意力…）出现时弹窗提醒。从系统通知踩坑到原生 C# 弹窗，附实时倒计时和完整代码。",
      en: "Fetch AI news automatically at 8pm and get a popup only when topics you care about (AGI, self-attention…) appear. From broken system toasts to a native C# popup with a live countdown — full code included.",
    },
    date: "2026-08-07",
    tags: ["Windows", "PowerShell", "WPF", "自动化", "弹窗"],
    category: "indie",
    categoryColor: "from-amber-500 via-orange-500 to-rose-500",
    cover: { gradient: "from-amber-500 via-orange-500 to-rose-500", icon: "📡", image: "/aihot-radar-cover.svg" },
    readingTime: 20,
    prerequisites: [
      { zh: "Windows 10/11", en: "Windows 10/11" },
      { zh: "了解 JSON 配置格式", en: "Familiar with JSON config" },
      { zh: "PowerShell 基础（能看懂脚本）", en: "Basic PowerShell (able to read scripts)" },
    ],
    published: true,
  },
];

// 按日期倒序排列，已发布优先
export function getPublishedPosts() {
  return blogPosts
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// 获取系列文章
export function getSeriesPosts(seriesName: string) {
  return blogPosts
    .filter((p) => p.published && p.series?.name.zh === seriesName)
    .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}

// 获取同系列的前后篇
export function getAdjacentPosts(slug: string) {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post?.series) return { prev: null, next: null };

  const seriesPosts = getSeriesPosts(post.series.name.zh);
  const index = seriesPosts.findIndex((p) => p.slug === slug);

  return {
    prev: index > 0 ? seriesPosts[index - 1] : null,
    next: index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null,
  };
}
