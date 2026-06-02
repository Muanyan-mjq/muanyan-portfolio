export interface BlogPost {
  slug: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  date: string;           // YYYY-MM-DD
  updated?: string;       // 最后更新日期
  tags: string[];
  category: "learning" | "project" | "algorithm" | "reading";
  series?: {
    name: { zh: string; en: string };
    order: number;        // 第几篇
    total: number;        // 共几篇
  };
  cover: {
    gradient: string;     // Tailwind gradient classes
    icon: string;         // emoji
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
} as const;

// VAE 系列
const vaeSeries = {
  name: { zh: "VAE 学习系列", en: "VAE Learning Series" },
  total: 3,
};

export const blogPosts: BlogPost[] = [
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
    cover: { gradient: "from-indigo-500 via-purple-500 to-pink-500", icon: "🧠" },
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
    date: "2026-06-15",
    tags: ["VAE", "深度学习", "PyTorch", "图像生成"],
    category: "learning",
    series: { ...vaeSeries, order: 2 },
    cover: { gradient: "from-pink-500 via-rose-500 to-orange-500", icon: "🎨" },
    readingTime: 25,
    published: false,
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
    cover: { gradient: "from-purple-500 via-indigo-500 to-blue-500", icon: "🎯" },
    readingTime: 30,
    published: false,
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
