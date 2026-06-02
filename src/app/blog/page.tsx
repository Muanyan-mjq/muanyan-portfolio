"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { getPublishedPosts, categories, type BlogPost } from "@/lib/blog-data";

const blogText = {
  zh: {
    section: "Blog",
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

  if (!entered) {
    return <BlogWelcome onEnter={() => setEntered(true)} />;
  }

  return (
    <Suspense fallback={<div className="pt-12 pb-24 px-8 md:px-16 lg:px-24"><div className="max-w-7xl mx-auto">Loading...</div></div>}>
      <BlogContent />
    </Suspense>
  );
}

// 丝滑打字机效果 hook
function useTypewriter(text: string, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      timer = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setDone(true);
        }
      }, speed);
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, speed, delay]);

  return { displayed, done };
}

function TypewriterText({ text, speed = 80, delay = 0, className = "", cursor = true }: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}) {
  const { displayed, done } = useTypewriter(text, speed, delay);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <span className="inline-block w-[3px] h-[1em] bg-indigo-500 dark:bg-indigo-400 ml-1 align-middle animate-pulse rounded-full" />
      )}
    </span>
  );
}

// 高级按钮组件
function PremiumButton({ onClick, children, className = "" }: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
    onClick();
  };

  return (
    <button onClick={handleClick} className={`relative overflow-hidden group ${className}`}>
      {/* 光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      {/* 涟漪 */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute bg-white/20 rounded-full animate-ping"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

function BlogWelcome({ onEnter }: { onEnter: () => void }) {
  const { lang } = useLang();
  const mainText = lang === "zh" ? "这里是慕安延的博客空间" : "This is Muanyan's Blog Space";
  const subText = lang === "zh" ? "Welcome to Muanyan's Blog Space" : "Welcome to Muanyan's Blog Space";
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSub(true), mainText.length * 80 + 400);
    const t2 = setTimeout(() => setShowBtn(true), mainText.length * 80 + subText.length * 60 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mainText, subText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-8 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* 简洁背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* 主标题 */}
        <div
          className={`mb-6 cursor-default transition-all duration-300 ease-out ${
            hovered ? "transform -translate-y-1" : ""
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h1
            className="text-5xl md:text-7xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100"
            style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
          >
            <TypewriterText text={mainText} speed={80} cursor={false} />
          </h1>
        </div>

        {/* 副标题 */}
        {showSub && (
          <div
            className={`mb-12 cursor-default transition-all duration-300 ease-out ${
              hovered ? "transform -translate-y-0.5" : ""
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <p
              className="text-lg md:text-xl font-normal text-zinc-500 dark:text-zinc-400 tracking-widest"
              style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
            >
              <TypewriterText text={subText} speed={60} cursor={false} />
            </p>
          </div>
        )}
        {!showSub && <div className="mb-12 h-[2em]" />}

        {/* 按钮 */}
        {showBtn && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PremiumButton
              onClick={onEnter}
              className="px-10 py-4 text-base font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {lang === "zh" ? "欢迎进入" : "Welcome In"}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </PremiumButton>
          </div>
        )}
      </div>
    </div>
  );
}

function BlogContent() {
  const { lang } = useLang();
  const T = blogText[lang];
  const searchParams = useSearchParams();
  const posts = getPublishedPosts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 从 URL 读取 tag 参数
  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag) setActiveTag(tag);
  }, [searchParams]);

  const filteredPosts = posts
    .filter((p) => !activeCategory || p.category === activeCategory)
    .filter((p) => !activeTag || p.tags.includes(activeTag));

  return (
    <div className="pt-12 pb-24 px-8 md:px-16 lg:px-24">
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
            <h1 className="text-5xl font-bold text-zinc-900 dark:text-white">
              {T.title}
            </h1>
            <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">
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

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              !activeCategory
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {T.all}
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeCategory === key
                  ? `bg-gradient-to-r ${cat.color} text-white`
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat[lang]}
            </button>
          ))}
        </div>

        {/* Tag filter indicator */}
        {activeTag && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {lang === "zh" ? "筛选标签：" : "Filtering by tag:"}
            </span>
            <span className="px-3 py-1.5 text-sm font-medium bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center gap-2">
              # {activeTag}
              <button
                onClick={() => setActiveTag(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* Card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} T={T} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-500 dark:text-zinc-400">
              {lang === "zh" ? "没有找到匹配的文章" : "No matching posts found"}
            </p>
            {(activeCategory || activeTag) && (
              <button
                onClick={() => { setActiveCategory(null); setActiveTag(null); }}
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

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden">
        {/* Cover image */}
        <div className={`w-full h-40 bg-gradient-to-br ${post.cover.gradient} flex items-center justify-center relative`}>
          <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500">
            {post.cover.icon}
          </span>
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
            <span className={`px-2.5 py-1 text-xs font-semibold bg-gradient-to-r ${cat.color} text-white rounded-full`}>
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
