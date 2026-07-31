"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { getPublishedPosts, categories, type BlogPost } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";
import { WelcomeLayout } from "@/components/welcome-layout";
import { TypewriterText } from "@/components/typewriter-text";
import { PremiumButton } from "@/components/premium-button";

const blogText = {
  zh: {
    section: "博客",
    title: "博客",
    desc: "技术博客与学习笔记。",
    qaLink: "AI 问答记录",
    all: "全部",
    readTime: "分钟阅读",
    seriesLabel: "系列",
  },
  en: {
    section: "Blog",
    title: "Blog",
    desc: "Tech blog and learning notes.",
    qaLink: "AI Q&A Logs",
    all: "All",
    readTime: "min read",
    seriesLabel: "Series",
  },
} as const;

export default function Blog() {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.removeItem("blog-entered");
    if (sessionStorage.getItem("blog-entered") === "true") {
      setEntered(true);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!entered) {
    return <BlogWelcome onEnter={() => { sessionStorage.setItem("blog-entered", "true"); setEntered(true); }} />;
  }

  return (
    <Suspense fallback={<div className="pt-12 pb-24 px-8 md:px-16 lg:px-24"><div className="max-w-7xl mx-auto">Loading...</div></div>}>
      <BlogContent />
    </Suspense>
  );
}

// 博客背景浮动词 — 覆盖学习路线全阶段
const blogBgWords = [
  // 生成模型
  "VAE", "ELBO", "KL散度", "重参数化", "潜在空间", "编码器", "解码器",
  // 扩散模型
  "DDPM", "Stable Diffusion", "CLIP", "UNet", "Cross-Attention", "去噪",
  // Transformer
  "Attention", "Multi-Head", "Self-Attention", "位置编码", "Transformer", "BERT",
  // 强化学习
  "Q-Learning", "DQN", "贝尔曼方程", "策略梯度", "经验回放", "奖励函数",
  // 视觉
  "YOLO", "BLIP-2", "LLaVA", "目标检测", "图像描述", "视频理解",
  // 基础
  "PyTorch", "反向传播", "梯度下降", "损失函数", "优化器", "学习率",
  // 工具
  "Python", "Git", "Linux", "Flask", "Next.js", "CUDA",
];

function BlogWelcome({ onEnter }: { onEnter: () => void }) {
  const { lang } = useLang();
  const mainText = lang === "zh" ? "欢迎来到慕安延的博客空间" : "Welcome to Muanyan's Blog Space";
  const subText = lang === "zh" ? "BLOG SPACE" : "BLOG SPACE";
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSub(true), mainText.length * 80 + 400);
    const t2 = setTimeout(() => setShowBtn(true), mainText.length * 80 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mainText]);

  return (
    <WelcomeLayout bgWords={blogBgWords}>
      <div className="welcome-pre">{subText}</div>
      <h1 className="welcome-h1">
        <TypewriterText text={mainText} speed={80} cursor={true} />
      </h1>
      {showSub && (
        <div className="welcome-en">
          <TypewriterText text={lang === "zh" ? "Welcome to Muanyan's Blog Space" : "Welcome to Muanyan's Blog Space"} speed={60} cursor={false} />
        </div>
      )}
      {!showSub && <div className="welcome-en" style={{ opacity: 0 }}>&nbsp;</div>}
      <button
        onClick={onEnter}
        className="welcome-btn"
        style={{
          opacity: showBtn ? 1 : 0,
          transform: showBtn ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease-out",
        }}
      >
        <span>{lang === "zh" ? "欢 迎 进 入" : "Welcome In"}<span className="arrow">→</span></span>
      </button>
      {!showBtn && <div style={{ height: 60 }} />}
    </WelcomeLayout>
  );
}

function BlogContent() {
  const { lang } = useLang();
  const T = blogText[lang];
  const searchParams = useSearchParams();
  const posts = getPublishedPosts();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 从所有已发布文章中提取唯一标签
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // 从 URL 读取 tag 参数
  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag) setActiveTag(tag);
  }, [searchParams]);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <div className="pt-12 pb-24 px-4 sm:px-5 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
                {T.section}
              </h2>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
              {T.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
              {T.desc}
            </p>
          </div>
          <Link
            href="/qa"
            className="mt-3 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25"
          >
            {T.qaLink}
            <span>→</span>
          </Link>
        </div>

        {/* Tag cloud filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all ${
              !activeTag
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {T.all}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTag === tag
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              # {tag}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} T={T} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500 dark:text-zinc-400">
              {lang === "zh" ? "没有找到匹配的文章" : "No matching posts found"}
            </p>
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lang === "zh" ? "清除筛选" : "Clear filters"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, lang, T }: { post: BlogPost; lang: "zh" | "en"; T: (typeof blogText)[keyof typeof blogText] }) {
  const cat = categories[post.category];
  // 封面图片使用大尺寸的 slug 白名单
  const isLargeCover = post.slug === "claude-code-statusline" || post.slug === "claude-code-mcp-setup" || post.slug === "hermes-agent-qq-wechat" || post.slug === "agi-era-thoughts";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden">
        {/* Cover image */}
        <div className={`w-full h-40 bg-gradient-to-br ${post.cover.gradient} flex items-center justify-center relative overflow-hidden`}>
          {post.cover.image ? (
            <img src={`${BASE_PATH}${post.cover.image}`} alt="" className={`relative z-10 object-contain group-hover:scale-110 transition-transform duration-500 rounded-xl ${isLargeCover ? "w-48 h-48" : "w-28 h-28"}`} />
          ) : (
            <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500 select-none">
              {post.cover.icon}
            </span>
          )}
          {/* Series badge */}
          {post.series && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-black/30 backdrop-blur-sm text-white rounded-full">
              {T.seriesLabel} {post.series.order}/{post.series.total}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags + date */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`px-2.5 py-1 text-xs font-semibold bg-gradient-to-r ${post.categoryColor ?? cat.color} text-white rounded-full`}>
              {cat[lang]}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{post.date}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">· {post.readingTime} {T.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
            {post.title[lang]}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {post.description[lang]}
          </p>
        </div>
      </div>
    </Link>
  );
}
