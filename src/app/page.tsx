"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_PATH } from "@/lib/base-path";
import { useLang } from "@/components/language-context";
import { VAEIcon } from "@/components/vae-icon";
import { TypewriterText } from "@/components/typewriter-text";

// Translations — 主要内容的中英文对照
const t = {
  zh: {
    openTo: "Open to opportunities",
    motto: "不要把梦想埋没！",
    bio: "计算机科学与技术专业学生，热爱系统化思考。以 VAE 为切入点研究生成模型，同时从 Q-Learning 入手学习强化学习。学习习惯是「先理解原理，再写代码」。",
    uni: "湖北理工学院",
    year: "2025 届",
    edu: "教育背景",
    eduCurrent: "在读",
    eduMajor: "计算机科学与技术（卓越工程师试点班）",
    eduFuture: "远景规划：扩散模型与多模态方向持续深耕",
    awards: "获奖经历",
    skills: "技能",
    blog: "博客",
    viewAll: "查看全部",
    projects: "项目经历",
    contact: "联系方式",
    ghDesc: "查看我的项目和贡献",
    emailDesc: "联系我",
    footerBio: "计算机科学与技术专业学生，专注于生成模型与强化学习研究。",
    footerLinks: "链接",
    footerHome: "首页",
    footerBlog: "博客",
    footerResearch: "研究笔记",
    footerQA: "问答",
    footerContact: "联系",
    footerRights: "All rights reserved.",
    footerMadeWith: "使用 Next.js + Tailwind CSS 构建",
    backToTop: "回到顶部",
    awardPhotoHint: "点击查看获奖照片",
    awardPhotoPlaceholder: "获奖照片待添加",
    awardPhotoGuide: "将照片放入 public/awards/ 目录后更新 awards 数组中的 image 路径",
    // 项目
    projVAETitle: "VAE 原理学习与可视化",
    projVAEDesc: "从零理解变分自编码器：Encoder/Decoder 架构、重参数化、ELBO 损失。100 轮训练全记录。",
    projColorTitle: "VAE 彩色图像与优化",
    projColorDesc: "一次经典调试：随机染色失败→根因分析→按类修复→loss 降 25.6%。",
    projFlaskTitle: "Flask 智能课表助手",
    projFlaskDesc: "基于 Flask + Ollama 本地大模型的智能课表管理工具。",
    projSXYTitle: "随心耶",
    projSXYDesc: "日记书写 + 专注计时 + 塔罗/八字/星座，Flutter 开发的个人 App。",
    tagDL: "深度学习",
    tagWeb: "网页应用",
    tagSolo: "独立开发",
    tagDesktop: "桌面应用",
    // DeepSeek Monitor
    projDSMTitle: "DeepSeek Monitor",
    projDSMDesc: "基于 Tauri 2 + React + Rust 的 Windows 桌面应用，实时监控 DeepSeek API 用量。7 套主题配色，系统托盘驻留。",
    // 博客
    blogTag: "示例",
    blogDesc: "示例 MDX 博客文章，支持 JSX 和 Markdown 混合编写。",
  },
  en: {
    openTo: "Open to opportunities",
    motto: "Don't bury your dreams!",
    bio: "CS student with a passion for systematic thinking. Exploring generative models through VAE and reinforcement learning via Q-Learning. I believe in understanding the 'why' before the 'how'.",
    uni: "Hubei Polytechnic University",
    year: "Class of 2025",
    edu: "Education",
    eduCurrent: "Current",
    eduMajor: "Computer Science & Technology (Honors Program)",
    eduFuture: "Long-term: Deep diving into diffusion models and multimodal research",
    awards: "Awards",
    skills: "Skills",
    blog: "Blog",
    viewAll: "View all",
    projects: "Projects",
    contact: "Contact",
    ghDesc: "View my projects and contributions",
    emailDesc: "Get in touch",
    footerBio: "CS student focused on generative models and reinforcement learning research.",
    footerLinks: "Links",
    footerHome: "Home",
    footerBlog: "Blog",
    footerResearch: "Research",
    footerQA: "Q&A",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
    footerMadeWith: "Built with Next.js + Tailwind CSS",
    backToTop: "Back to top",
    awardPhotoHint: "Click to view award photo",
    awardPhotoPlaceholder: "Award photo coming soon",
    awardPhotoGuide: "Place photos in public/awards/ and update the image path in the awards array",
    // 项目
    projVAETitle: "VAE Understanding & Visualization",
    projVAEDesc: "Understanding VAE from scratch: Encoder/Decoder architecture, reparameterization, ELBO loss. Full training log.",
    projColorTitle: "VAE Color Images & Optimization",
    projColorDesc: "A classic debugging story: random coloring failure → root cause → per-class fix → 25.6% loss reduction.",
    projFlaskTitle: "Flask Smart Timetable Assistant",
    projFlaskDesc: "An intelligent timetable management tool built with Flask + Ollama local LLM.",
    projSXYTitle: "Flowdiary",
    projSXYDesc: "A personal app with journaling, focus timer, and Tarot / BaZi / Zodiac. Built with Flutter.",
    tagDL: "Deep Learning",
    tagWeb: "Web App",
    tagSolo: "Solo",
    tagDesktop: "Desktop App",
    // DeepSeek Monitor
    projDSMTitle: "DeepSeek Monitor",
    projDSMDesc: "A Windows desktop app built with Tauri 2 + React + Rust for real-time DeepSeek API usage monitoring. 7 themes, system tray integration.",
    // 博客
    blogTag: "Sample",
    blogDesc: "Sample MDX blog post supporting JSX and Markdown.",
  },
} as const;

// Skill data
const skills = [
  { name: "Python", percent: 70 },
  { name: "C", percent: 50 },
  { name: "C++", percent: 45 },
  { name: "HTML/CSS", percent: 55 },
  { name: "Flask", percent: 50 },
  { name: "PyTorch", percent: 40 },
  { name: "VAE", percent: 35 },
  { name: "AI Agent", percent: 30 },
  { name: "Git", percent: 55 },
  { name: "Linux", percent: 45 },
];

// Orbiting tags data — 头像 hover 时沿水波环轨道均匀环绕
// radius 对应三层水波环展开后的半径：外环 240, 中环 216, 内环 192
// 每层标签等间距分布，层间错开 30° 避免重叠
const orbitTags = [
  // 研究方向 — 外环 (6个, 间距60°)
  { label: { zh: "VAE", en: "VAE" }, angle: -90, radius: 240, color: "from-indigo-500 to-purple-500" },
  { label: { zh: "生成模型", en: "Generative" }, angle: -30, radius: 240, color: "from-purple-500 to-pink-500" },
  { label: { zh: "强化学习", en: "RL" }, angle: 30, radius: 240, color: "from-cyan-500 to-blue-500" },
  { label: { zh: "扩散模型", en: "Diffusion" }, angle: 90, radius: 240, color: "from-pink-500 to-rose-500" },
  { label: { zh: "机器学习", en: "ML" }, angle: 150, radius: 240, color: "from-teal-500 to-emerald-500" },
  { label: { zh: "深度学习", en: "DL" }, angle: 210, radius: 240, color: "from-blue-500 to-indigo-500" },
  // 技术栈 — 中环 (6个, 间距60°, 偏移30°)
  { label: { zh: "PyTorch", en: "PyTorch" }, angle: -60, radius: 216, color: "from-orange-500 to-red-500" },
  { label: { zh: "Python", en: "Python" }, angle: 0, radius: 216, color: "from-yellow-500 to-blue-500" },
  { label: { zh: "C++", en: "C++" }, angle: 60, radius: 216, color: "from-sky-500 to-blue-600" },
  { label: { zh: "Flask", en: "Flask" }, angle: 120, radius: 216, color: "from-gray-500 to-zinc-700" },
  { label: { zh: "Git", en: "Git" }, angle: 180, radius: 216, color: "from-orange-600 to-red-600" },
  { label: { zh: "Linux", en: "Linux" }, angle: 240, radius: 216, color: "from-yellow-500 to-orange-500" },
  // 兴趣爱好 — 内环 (5个, 间距72°)
  { label: { zh: "阅读", en: "Reading" }, angle: -90, radius: 192, color: "from-amber-500 to-yellow-500" },
  { label: { zh: "音乐", en: "Music" }, angle: -18, radius: 192, color: "from-emerald-500 to-teal-500" },
  { label: { zh: "羽毛球", en: "Badminton" }, angle: 54, radius: 192, color: "from-lime-500 to-green-500" },
  { label: { zh: "摄影", en: "Photography" }, angle: 126, radius: 192, color: "from-violet-500 to-purple-500" },
  { label: { zh: "旅行", en: "Travel" }, angle: 198, radius: 192, color: "from-sky-500 to-indigo-500" },
];

// Scroll animation hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// 按住拖拽滚动 hook — 区分点击和拖拽
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startY = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      hasDragged.current = false;
      startY.current = e.clientY;
      scrollStart.current = el.scrollTop;
      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dy = e.clientY - startY.current;
      // 移动超过 5px 才算拖拽
      if (Math.abs(dy) > 5) {
        hasDragged.current = true;
        e.preventDefault();
        el.scrollTop = scrollStart.current - dy;
      }
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      el.style.cursor = "grab";
      // 如果发生了拖拽，阻止后续的 click 事件
      if (hasDragged.current) {
        const preventClick = (e: Event) => {
          e.stopPropagation();
          e.preventDefault();
          el.removeEventListener("click", preventClick, true);
        };
        el.addEventListener("click", preventClick, true);
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return { ref, style: { cursor: "grab" as const } };
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Awards data — 后续替换 image 路径为真实获奖照片
const awardsData = [
  {
    id: 1,
    year: "2026.05",
    title: { zh: "第19届中国大学生计算机设计大赛", en: "19th Chinese Collegiate Computing Design Competition" },
    subtitle: { zh: "中南赛区 · 湖北省一等奖", en: "Central-South Division · Hubei Province First Prize" },
    image: "", // 后续替换为获奖照片路径，如 "/awards/ccc2026.jpg"
  },
];

export default function Home() {
  const { lang } = useLang();
  const T = t[lang];
  const [mounted, setMounted] = useState(false);
  const [animatedPercents, setAnimatedPercents] = useState<number[]>(
    skills.map(() => 0)
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const eduDrag = useDragScroll();
  const awardDrag = useDragScroll();
  useEffect(() => {
    setMounted(true);
    // 页面加载后 500ms 直接播放动画
    const timer = setTimeout(() => {
      setAnimatedPercents(skills.map((s) => s.percent));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 w-fit">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{T.openTo}</span>
              </div>
              <h1 className="text-[clamp(4rem,10vw,8rem)] font-bold tracking-tight leading-[0.85] mb-6">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">马佳祺</span>
              </h1>
              <p className="text-2xl md:text-3xl text-zinc-400 dark:text-zinc-500 font-light tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-10">Muanyan</p>
              <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg mb-6 md:mb-8">
                {T.bio}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                  {T.uni}
                </span>
                <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                <span>{T.year}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80 group/avatar cursor-pointer" style={{ overflow: "visible" }}>
                {/* Water wave rings — 鼠标靠近才出现，不自动播放 */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/0 group-hover/avatar:border-indigo-500/30 scale-50 group-hover/avatar:scale-150 opacity-0 group-hover/avatar:opacity-100 transition-all duration-1000 ease-out" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/0 group-hover/avatar:border-purple-500/30 scale-50 group-hover/avatar:scale-[1.35] opacity-0 group-hover/avatar:opacity-100 transition-all duration-1000 ease-out delay-200" />
                <div className="absolute inset-0 rounded-full border-2 border-pink-500/0 group-hover/avatar:border-pink-500/30 scale-50 group-hover/avatar:scale-120 opacity-0 group-hover/avatar:opacity-100 transition-all duration-1000 ease-out delay-400" />
                {/* 静态装饰环 — 始终显示 */}
                <div className="absolute inset-0 border border-indigo-500/10 rounded-full" />
                <div className="absolute inset-4 border border-purple-500/10 rounded-full" />
                <div className="absolute inset-8 border border-pink-500/10 rounded-full" />
                {/* Avatar */}
                <div className="absolute inset-12 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl group-hover/avatar:scale-110 transition-transform duration-500 z-10">
                  <Image src={`${BASE_PATH}/avatar.png`} alt="马佳祺" width={256} height={256} className="w-full h-full object-cover" priority />
                </div>
                {/* 座右铭 — hover 时显示，下移避免被标签遮挡 */}
                <div className="absolute -bottom-[170px] left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-0 translate-y-4 group-hover/avatar:opacity-100 group-hover/avatar:translate-y-0 transition-all duration-700 ease-out delay-[1100ms]">
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide whitespace-nowrap drop-shadow-sm">
                    &ldquo;<TypewriterText text={T.motto} speed={100} cursor={false} />&rdquo;
                  </p>
                </div>
                {/* Orbiting tags — hover 时环绕头像出现 */}
                {orbitTags.map((tag, i) => {
                  const rad = (tag.angle * Math.PI) / 180;
                  const cx = 160 + tag.radius * Math.cos(rad);
                  const cy = 160 + tag.radius * Math.sin(rad);
                  return (
                    <div
                      key={tag.label.zh}
                      className="absolute z-20 pointer-events-none opacity-0 scale-75 group-hover/avatar:opacity-100 group-hover/avatar:scale-100 transition-all duration-500 ease-out"
                      style={{
                        left: `${cx}px`,
                        top: `${cy}px`,
                        transform: "translate(-50%, -50%)",
                        transitionDelay: `${80 + i * 60}ms`,
                      }}
                    >
                      <span className={`inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r ${tag.color} text-white rounded-full shadow-lg whitespace-nowrap`}>
                        {tag.label[lang]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">{T.edu}</h2>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div
              ref={eduDrag.ref}
              className="relative max-h-[420px] overflow-y-auto scrollbar-hide"
              style={eduDrag.style}
            >
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />

              <div className="space-y-8 pr-2">
                {/* Current */}
                <div className="relative pl-12 sm:pl-16 md:pl-20">
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-4 border-white dark:border-zinc-950" />
                  <div className="p-5 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">{T.eduCurrent}</span>
                        <h3 className="mt-4 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{T.uni}</h3>
                        <p className="mt-2 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">{T.eduMajor}</p>
                      </div>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">2025 - 2029</span>
                    </div>
                  </div>
                </div>

                {/* Future */}
                <div className="relative pl-12 sm:pl-16 md:pl-20">
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-700 border-4 border-white dark:border-zinc-950" />
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">{T.eduFuture}</p>
                  </div>
                </div>
              </div>
              {/* 底部渐变遮罩 — 提示可滚动 */}
              <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Awards — 时间线布局 + 渐变色块 */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">{T.awards}</h2>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div
              ref={awardDrag.ref}
              className="relative max-h-[420px] overflow-y-auto scrollbar-hide"
              style={awardDrag.style}
            >
              {/* 时间线竖线 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
              <div className="space-y-8 pr-2">
                {awardsData.map((award, index) => {
                  const gradients = [
                    "from-indigo-500 to-purple-500",
                    "from-purple-500 to-pink-500",
                    "from-pink-500 to-rose-500",
                    "from-cyan-500 to-blue-500",
                  ];
                  const grad = gradients[index % gradients.length];
                  return (
                    <div key={award.id} className="relative pl-20">
                      {/* 时间线节点 */}
                      <div className={`absolute left-6 top-3 w-5 h-5 rounded-full bg-gradient-to-r ${grad} border-4 border-white dark:border-zinc-950 shadow-lg`} />
                      {/* 卡片 */}
                      <button
                        onClick={() => setLightboxIndex(index)}
                        className="group w-full text-left cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                          <div className="flex flex-col md:flex-row items-stretch">
                            {/* 左侧渐变色块 */}
                            <div className={`md:w-2 w-full h-1 md:h-auto bg-gradient-to-b md:bg-gradient-to-b ${grad}`} />
                            {/* 内容区 */}
                            <div className="flex-1 p-5 sm:p-8">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {award.title[lang]}
                                  </h3>
                                  <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                                    {award.subtitle[lang]}
                                  </p>
                                  <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                                    {T.awardPhotoHint}
                                  </p>
                                </div>
                                <span className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${grad} bg-clip-text text-transparent whitespace-nowrap`}>
                                  {award.year}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* 底部渐变遮罩 — 提示可滚动 */}
              <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Skills */}
      <section className="relative py-20 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950" />
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-6 mb-12 md:mb-20">
              <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
                {T.skills}
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-24 gap-y-8 md:gap-y-12">
            {skills.map((skill, index) => (
              <AnimatedSection key={skill.name} delay={index * 60}>
                <div className="group">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {animatedPercents[index]}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${animatedPercents[index]}%`,
                        transitionDelay: `${index * 100 + 300}ms`,
                      }}
                    />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Blog — 横向滑动 */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
                  {T.blog}
                </h2>
              </div>
              <Link
                href="/blog"
                onClick={() => sessionStorage.removeItem("blog-entered")}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                {T.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection delay={100}>
              <Link href="/blog/claude-code-statusline" className="group block h-full">
                <div className="h-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="w-full h-48 bg-gradient-to-br from-[#D87756] via-[#D2734C] to-[#C06843] flex items-center justify-center relative overflow-hidden">
                    <img src={`${BASE_PATH}/statusline-cover.png`} alt="Claude Code 状态栏" className="w-60 object-contain rounded-xl relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-[#D87756] to-[#C06843] text-white rounded-full">
                        {lang === "zh" ? "灵感产物" : "Inspired Work"}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">2026-06-29</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">· 15 {lang === "zh" ? "分钟阅读" : "min read"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {lang === "zh" ? "自定义 Claude Code 状态栏" : "Custom Claude Code Status Line"}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {lang === "zh"
                        ? "不需要手写代码。在 Claude Code 里复制一句提示词，回答几个问题，三行状态栏就做好了。"
                        : "No coding required. Copy a prompt into Claude Code, answer a few questions, and your three-line status bar is ready."}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <Link href="/blog/vae-1-introduction" className="group block h-full">
                <div className="h-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <VAEIcon size="2xl" className="relative z-10" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                        {lang === "zh" ? "学习笔记" : "Learning"}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">2026-06-02</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">· 20 {lang === "zh" ? "分钟阅读" : "min read"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {lang === "zh" ? "VAE 学习笔记（一）：从直觉到实现" : "VAE Notes (1): From Intuition to Implementation"}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {lang === "zh"
                        ? "从零开始理解变分自编码器：什么是编码器和解码器？什么是潜在空间？如何用 KL 散度约束分布？"
                        : "Understanding VAE from scratch: What are encoders and decoders? What is latent space? How does KL divergence constrain the distribution?"}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* Projects */}
      <section className="py-20 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-6">
                <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
                  {T.projects}
                </h2>
              </div>
              <Link
                href="/projects"
                onClick={() => sessionStorage.removeItem("projects-entered")}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                {T.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { id: "01", title: T.projSXYTitle, desc: T.projSXYDesc, tag: T.tagSolo, icon: "sui_xin_ye", link: "/projects/flowdiary" },
              { id: "02", title: T.projDSMTitle, desc: T.projDSMDesc, tag: T.tagDesktop, icon: "deepseek-monitor", link: "/projects/deepseek-monitor" },
              { id: "03", title: T.projVAETitle, desc: T.projVAEDesc, tag: T.tagDL, icon: "vae-bw", link: "/blog/vae-1-introduction" },
              { id: "04", title: T.projColorTitle, desc: T.projColorDesc, tag: T.tagDL, icon: "vae-color", link: "/blog/vae-2-color" },
              { id: "05", title: T.projFlaskTitle, desc: T.projFlaskDesc, tag: T.tagWeb, icon: "📅" },
            ].map((project, index) => {
              const isVAEBW = project.icon === "vae-bw";
              const isVAEColor = project.icon === "vae-color";

              const cardContent = (
                <div className="h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden">
                  {(isVAEBW || isVAEColor) ? (
                    <div className="w-full h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={`${BASE_PATH}/vae-images/${isVAEBW ? "vae-reconstruction.jpg" : "vae-color-reconstruction.png"}`}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  <div className={isVAEBW || isVAEColor ? "p-5 sm:p-6" : "p-5 sm:p-8"}>
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      {isVAEBW ? (
                        <VAEIcon size="sm" className="grayscale" />
                      ) : isVAEColor ? (
                        <VAEIcon size="sm" />
                      ) : project.icon === "sui_xin_ye" ? (
                        <img src={`${BASE_PATH}/sui_xin_ye_icon.png`} alt="随心耶" className="w-12 h-12 rounded-xl object-contain" />
                      ) : project.icon === "deepseek-monitor" ? (
                        <img src={`${BASE_PATH}/deepseek-monitor/deepseek-color.png`} alt="DeepSeek Monitor" className="w-10 h-10 rounded-xl object-contain" />
                      ) : (
                        <span className="text-3xl">{project.icon}</span>
                      )}
                      <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                        {project.tag}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 sm:mb-3">
                      {project.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                      {project.desc}
                    </p>
                  </div>
                </div>
              );

              return (
                <AnimatedSection key={project.id} delay={index * 150}>
                  {"link" in project && project.link ? (
                    <Link href={project.link!} className="group h-full block">
                      {cardContent}
                    </Link>
                  ) : (
                    <div className="group h-full">
                      {cardContent}
                    </div>
                  )}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-6 mb-16">
              <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
                {T.contact}
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                href: "https://github.com/Muanyan-mjq",
                icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
                label: "GitHub",
                value: "Muanyan-mjq",
                desc: T.ghDesc,
                external: true,
              },
              {
                href: "mailto:muanyan7@gmail.com",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
                label: "Email",
                value: "muanyan7@gmail.com",
                desc: T.emailDesc,
                external: false,
              },
            ].map((contact, index) => (
              <AnimatedSection key={contact.label} delay={index * 100}>
                <a href={contact.href} target={contact.external ? "_blank" : undefined} rel={contact.external ? "noopener noreferrer" : undefined} className="group block">
                  <div className="p-5 sm:p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                    <p className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                      <span className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors">{contact.icon}</span>
                      {contact.label}
                    </p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pl-8">
                      {contact.value}
                    </p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal — 点击奖项卡片弹出图片 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full mx-4 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {/* 图片区域 */}
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 flex items-center justify-center">
              {awardsData[lightboxIndex].image ? (
                <Image
                  src={awardsData[lightboxIndex].image}
                  alt={awardsData[lightboxIndex].title[lang]}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto text-indigo-300 dark:text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg">{T.awardPhotoPlaceholder}</p>
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">{T.awardPhotoGuide}</p>
                </div>
              )}
            </div>
            {/* 底部信息 */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{awardsData[lightboxIndex].year}</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{awardsData[lightboxIndex].title[lang]}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{awardsData[lightboxIndex].subtitle[lang]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
