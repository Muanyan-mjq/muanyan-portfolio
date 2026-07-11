"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { VAEIcon } from "@/components/vae-icon";

const translations = {
  zh: {
    section: "问答记录",
    pageTitle: "问答记录",
    subtitle: "按项目分类的 AI 问答记录，点击卡片进入对应项目的问答页面。",
    tagDL: "深度学习",
    countSuffix: "条问答",
    view: "查看",
    moreTitle: "更多项目问答",
    moreDesc: "后续会添加强化学习、数据结构等项目的问答记录",
    searchPlaceholder: "搜索问题或答案...",
    searchResults: "搜索结果",
    noResults: "未找到匹配的内容",
    clearSearch: "清除搜索",
    // 项目数据
    vaeTitle: "VAE 变分自编码器",
    vaeDesc: "从卷积基础到损失函数，30 个问答覆盖 VAE 的完整学习过程。",
  },
  en: {
    section: "Q&A",
    pageTitle: "Q&A Records",
    subtitle: "AI Q&A records organized by project. Click a card to view the corresponding Q&A page.",
    tagDL: "Deep Learning",
    countSuffix: "Q&As",
    view: "View",
    moreTitle: "More Project Q&As",
    moreDesc: "Reinforcement learning, data structures, and other project Q&As coming soon",
    searchPlaceholder: "Search questions or answers...",
    searchResults: "Search Results",
    noResults: "No matching content found",
    clearSearch: "Clear search",
    vaeTitle: "VAE Variational Autoencoder",
    vaeDesc: "From convolution basics to loss functions, 30 Q&As covering the complete VAE learning process.",
  },
} as const;

// VAE 问答数据用于搜索
const vaeQAData = [
  { q: "卷积是什么逻辑？什么操作流程？", qEn: "What is the logic of convolution? What is the process?", a: "用 VAE 里的实际参数来讲：kernel_size=3, stride=2, padding=1。卷积就是'用一个小窗口扫描图片'。", aEn: "Using actual VAE parameters: kernel_size=3, stride=2, padding=1. Convolution is 'scanning an image with a small window'." },
  { q: "卷积核的具体计算是什么？", qEn: "What is the specific calculation of a convolution kernel?", a: "用一个超简单的例子。假设图片是 3×3，卷积核 2×2，一步步算。", aEn: "A super simple example. Suppose the image is 3x3, kernel is 2x2, step by step." },
  { q: "MSE 和 KL 散度是什么？", qEn: "What are MSE and KL divergence?", a: "MSE（均方误差）——两张图像不像。KL散度——两个分布像不像。", aEn: "MSE (Mean Squared Error) - how different two images are. KL divergence - how different two distributions are." },
  { q: "为什么乘 784？量级具体指什么？", qEn: "Why multiply by 784? What does magnitude mean?", a: "量级=数值的大小级别。不乘784时MSE≈0.05，KL≈2.0，KL主导训练。乘784后MSE≈39，两者同一量级。", aEn: "Magnitude = the scale of a numerical value. Without 784, MSE≈0.05, KL≈2.0, KL dominates. After multiplying, MSE≈39, both at same magnitude." },
  { q: "Decoder 的过程是不是由 z 来专门确定？", qEn: "Is the Decoder process specifically determined by z?", a: "对。Decoder是一个确定的函数：输入z→输出图片，没有随机性。同一个z永远出同一张图。", aEn: "Yes. Decoder is a deterministic function: input z → output image, no randomness. Same z always produces same image." },
  { q: "Encoder 和 Decoder 是同时学习的吗？", qEn: "Are Encoder and Decoder learned simultaneously?", a: "是的。Encoder和Decoder是同时训练的。反馈调节就是反向传播。", aEn: "Yes. Encoder and Decoder are trained simultaneously. Feedback adjustment is backpropagation." },
];

export default function QAIndex() {
  const { lang } = useLang();
  const t = translations[lang];
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof vaeQAData>([]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 搜索功能
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = vaeQAData.filter(item => {
      const q = lang === "zh" ? item.q : item.qEn;
      const a = lang === "zh" ? item.a : item.aEn;
      return q.toLowerCase().includes(query) || a.toLowerCase().includes(query);
    });
    setSearchResults(results);
  }, [searchQuery, lang]);

  const qaProjects = [
    {
      id: "vae",
      title: t.vaeTitle,
      description: t.vaeDesc,
      icon: "vae",
      tag: t.tagDL,
      count: 30,
      href: "/qa/vae",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="pt-12 pb-24 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              {t.section}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
            {t.subtitle}
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-10">
          <div className="relative max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 搜索结果 */}
        {searchQuery && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              {t.searchResults} ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((item, index) => (
                  <div key={index} className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all">
                    <p className="font-medium text-zinc-900 dark:text-white mb-2">
                      {lang === "zh" ? item.q : item.qEn}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {lang === "zh" ? item.a : item.aEn}
                    </p>
                    <Link href="/qa/vae" className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      {t.view} →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400">{t.noResults}</p>
            )}
          </div>
        )}

        {/* Project cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {qaProjects.map((project) => (
            <Link key={project.id} href={project.href} className="group block">
              <div className="h-full p-5 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                {/* 顶部渐变条 */}
                <div className={`w-full h-1 bg-gradient-to-r ${project.gradient} rounded-full mb-6 sm:mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* 图标 + 标签 */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  {project.icon === "vae" ? (
                    <VAEIcon size="lg" />
                  ) : (
                    <span className="text-4xl sm:text-5xl">{project.icon}</span>
                  )}
                  <span className={`px-3 py-1.5 text-xs font-semibold bg-gradient-to-r ${project.gradient} text-white rounded-full`}>
                    {project.tag}
                  </span>
                </div>
                {/* 标题 */}
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 sm:mb-4">
                  {project.title}
                </h3>
                {/* 描述 */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base mb-6">
                  {project.description}
                </p>
                {/* 底部：问答数量 + 箭头 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    {project.count} {t.countSuffix}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t.view}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* 占位：更多项目 */}
          <div className="h-full p-5 sm:p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">📚</span>
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              {t.moreTitle}
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              {t.moreDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        >
          ↑
        </button>
      )}
    </div>
  );
}
