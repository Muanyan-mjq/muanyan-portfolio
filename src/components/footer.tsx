"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";

const footerText = {
  zh: {
    bio: "计算机科学与技术专业学生，专注于生成模型与强化学习研究。",
    home: "首页",
    blog: "博客",
    research: "研究笔记",
    qa: "问答",
    contact: "联系",
    rights: "All rights reserved.",
    backToTop: "回到顶部",
    madeWith: "使用 Next.js + Tailwind CSS 构建",
    lastUpdated: "最后更新",
    visitors: "访客",
  },
  en: {
    bio: "CS student focused on generative models and reinforcement learning research.",
    home: "Home",
    blog: "Blog",
    research: "Research",
    qa: "Q&A",
    contact: "Contact",
    rights: "All rights reserved.",
    backToTop: "Back to top",
    madeWith: "Built with Next.js + Tailwind CSS",
    lastUpdated: "Last updated",
    visitors: "Visitors",
  },
} as const;

export function Footer() {
  const { lang } = useLang();
  const T = footerText[lang];
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 访客计数（使用 localStorage）
  useEffect(() => {
    const stored = localStorage.getItem("visitor_count");
    const count = stored ? parseInt(stored) + 1 : 1;
    localStorage.setItem("visitor_count", count.toString());
    setVisitorCount(count);
  }, []);

  return (
    <>
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        title={T.backToTop}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            {/* 左：品牌 + 访客统计 */}
            <div>
              <Link href="/" className="inline-block mb-2">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Muanyan
                </span>
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                {T.bio}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {T.visitors}: {visitorCount}
              </p>
            </div>

            {/* 右：联系方式（图标在前） */}
            <div className="flex flex-col gap-2.5 md:items-end">
              <a
                href="https://github.com/Muanyan-mjq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                GitHub
              </a>
              <a
                href="mailto:muanyan7@gmail.com"
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                muanyan7@gmail.com
              </a>
            </div>
          </div>

          {/* 底部：版权 + 技术栈 + 更新时间 */}
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              © 2026 Muanyan. {T.rights}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {T.lastUpdated}: 2026-06-22
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {T.madeWith}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
