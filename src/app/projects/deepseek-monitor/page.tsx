"use client";

import { useRef, useState, useEffect } from "react";
import { useLang } from "@/components/language-context";
import { BASE_PATH } from "@/lib/base-path";

const S = (n: string) => `${BASE_PATH}/deepseek-monitor/${n}`;

// ── 滚动入场动画 ──────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.06 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── 7 套主题数据 ──────────────────────────────────────
// shot: 实际截图文件名（截图内容和文件名对不上，这里做交叉映射）
// 颜色取自项目 styles.css 中每个 data-theme 的 --brand / --fg
const THEMES = [
  { key: "dark",  nameZh: "暗色", nameEn: "Dark",  bg: "#1a1810", card: "#262316", accent: "#4d6bfe", text: "#f6efde", shot: "theme-sunset" },
  { key: "light", nameZh: "亮色", nameEn: "Light", bg: "#d8e9ef", card: "#ffffff", accent: "#2d6cf6", text: "#193044", shot: "theme-sakura" },
  { key: "ocean", nameZh: "海洋", nameEn: "Ocean", bg: "#061a28", card: "#0a2235", accent: "#0ea5e9", text: "#bae6fd", shot: "theme-lavender" },
  { key: "forest", nameZh: "森林", nameEn: "Forest", bg: "#071a12", card: "#0d241a", accent: "#10b981", text: "#bbf7d0", shot: "theme-dark" },
  { key: "sunset", nameZh: "暖金日落", nameEn: "Warm Sunset", bg: "#1c1810", card: "#2a2014", accent: "#f59e0b", text: "#fed7aa", shot: "theme-light" },
  { key: "sakura", nameZh: "樱花", nameEn: "Sakura", bg: "#1a1016", card: "#261820", accent: "#e91e63", text: "#fbcfe8", shot: "theme-ocean" },
  { key: "lavender", nameZh: "薰衣草", nameEn: "Lavender", bg: "#151024", card: "#1f1830", accent: "#8b5cf6", text: "#e9d5ff", shot: "theme-forest" },
];

// ── 功能卡片数据 ──────────────────────────────────────
const FEATURES = [
  { icon: "💰", key: "balance" },
  { icon: "📊", key: "usage" },
  { icon: "📈", key: "chart" },
  { icon: "🔔", key: "alert" },
  { icon: "🔄", key: "sync" },
  { icon: "🖥️", key: "tray" },
];

// ── 技术栈标签 ────────────────────────────────────────
const TECH_TAGS = ["Tauri 2", "React 18", "TypeScript", "Rust", "Vite", "Reqwest", "WebView2"];

// ═══════════════════════════════════════════════════════
// 翻译
// ═══════════════════════════════════════════════════════
const T = {
  zh: {
    appName: "DeepSeek Monitor",
    tagline: "Windows 桌面端的 DeepSeek API 用量监控器",
    heroDesc: "一款基于 Tauri 2 构建的轻量级 Windows 桌面应用，驻扎在系统托盘，实时追踪 DeepSeek API 的账户余额、Token 用量与 7 日消耗趋势。7 套精心调配的主题，从暗夜到暖金日落，让监控面板也成为桌面一景。",
    heroGH: "GitHub 仓库",
    heroDemo: "查看截图",

    statBalance: "账户余额",
    statTokens: "Token 用量",
    statCache: "缓存命中率",
    statDays: "7 日趋势",

    themeTitle: "7 套主题配色",
    themeSub: "从暗色到薰衣草紫，每一套都独立定义了面板背景、卡片渐变、品牌强调色和图表分区色，一键切换，即时生效。",

    featureTitle: "核心功能",
    featureBalanceTitle: "余额实时查询",
    featureBalanceDesc: "调用 DeepSeek 官方 /user/balance 接口，一键获取账户余额，支持设置余额告警阈值，低于阈值时面板变色提醒。",
    featureUsageTitle: "用量数据追踪",
    featureUsageDesc: "接入 DeepSeek Platform 用量 API，展示当月消费、Token 总量、请求次数、缓存命中/未命中明细。按 V4 Flash / V4 Pro 模型拆分统计。",
    featureChartTitle: "7 日消耗趋势图",
    featureChartDesc: "堆叠柱状图展示近 7 天缓存命中、缓存未命中、输出 Token 三类数据，悬浮提示显示当日精确数值。",
    featureAlertTitle: "余额告警",
    featureAlertDesc: "可自定义告警阈值，余额低于阈值时余额卡片状态变化，面板顶部弹出告警横幅，不同主题有独立告警配色。",
    featureSyncTitle: "Token 自动捕获",
    featureSyncDesc: "打开 WebView2 窗口登录 DeepSeek Platform，注入 JS 自动拦截 fetch/XHR 请求，捕获 Bearer Token。同时扫描 WebView2 磁盘缓存作为备用通道。",
    featureTrayTitle: "系统托盘驻留",
    featureTrayDesc: "最小化到 Windows 系统托盘而非任务栏，左键单击托盘图标切换面板显隐，右键菜单提供「显示主面板」与「退出」。",

    archTitle: "技术架构",
    archDesc: "Tauri 2 作为桌面壳，前端 React + TypeScript 渲染 UI，后端 Rust 处理 HTTP 请求、系统托盘、注册表操作和 Token 捕获。",
    archFrontend: "React 18 + TypeScript\nVite 5 构建 · Lucide Icons\n单文件组件 · 纯 CSS 主题系统",
    archBackend: "Rust · Tauri 2 Commands\nReqwest HTTP · Serde JSON\nWebView2 磁盘缓存扫描",
    archBridge: "Tauri IPC Bridge\nInvoke / Event 双向通信\nJS 注入 · window.title 轮询",

    screenshotTitle: "应用截图",
    screenshotDashboard: "主面板 · 余额 + 用量 + 趋势图",
    screenshotSettings: "设置页 · API Key · Token · 告警配置",
    screenshotThemes: "7 套主题效果",

    linksTitle: "链接",
    linksGH: "GitHub 仓库",
    linksGHDesc: "查看源码、提交 Issue 或 PR",
    linksRelease: "下载安装包",
    linksReleaseDesc: "最新版本 x64-setup.exe",

    footerNote: "本项目 fork 自 Joyi-code/DeepSeekMonitorWindows，上游源自 JayHome137/deepseek-monitor。非 DeepSeek 官方产品。所有数据仅存储在本地 %APPDATA% 目录，不上传任何第三方。",
    backToProjects: "← 返回项目列表",
  },
  en: {
    appName: "DeepSeek Monitor",
    tagline: "DeepSeek API Usage Monitor for Windows Desktop",
    heroDesc: "A lightweight Windows desktop app built with Tauri 2. Lives in your system tray, tracking DeepSeek API account balance, token usage, and 7-day consumption trends in real time. With 7 meticulously crafted themes, from Dark to Warm Sunset, your monitoring panel becomes part of your desktop aesthetic.",
    heroGH: "GitHub Repo",
    heroDemo: "Screenshots",

    statBalance: "Account Balance",
    statTokens: "Token Usage",
    statCache: "Cache Hit Rate",
    statDays: "7-Day Trend",

    themeTitle: "7 Theme Color Schemes",
    themeSub: "From Dark to Lavender, every theme independently defines panel backgrounds, card gradients, brand accents, and chart segment colors. One-click switch, instant effect.",

    featureTitle: "Core Features",
    featureBalanceTitle: "Real-time Balance Query",
    featureBalanceDesc: "Calls the official DeepSeek /user/balance endpoint to fetch account balance. Configurable low-balance alert threshold — the balance card changes color when it drops below.",
    featureUsageTitle: "Usage Data Tracking",
    featureUsageDesc: "Connects to DeepSeek Platform usage APIs, displaying monthly cost, total tokens, request count, and cache hit/miss breakdown. Per-model stats for V4 Flash and V4 Pro.",
    featureChartTitle: "7-Day Trend Chart",
    featureChartDesc: "Stacked bar chart showing cache hit, cache miss, and output tokens over the last 7 days. Hover tooltips reveal precise daily values.",
    featureAlertTitle: "Balance Alert",
    featureAlertDesc: "Customizable alert threshold. When balance drops below it, the balance card state changes and a warning banner appears at the top. Each theme has independent alert colors.",
    featureSyncTitle: "Auto Token Capture",
    featureSyncDesc: "Opens a WebView2 window to DeepSeek Platform, injects JS to intercept fetch/XHR requests and capture the Bearer token. Also scans WebView2 disk cache as a fallback channel.",
    featureTrayTitle: "System Tray Integration",
    featureTrayDesc: "Minimizes to the Windows system tray instead of the taskbar. Left-click the tray icon to toggle panel visibility. Right-click menu offers 'Show' and 'Quit'.",

    archTitle: "Tech Architecture",
    archDesc: "Tauri 2 as the desktop shell — React + TypeScript renders the UI, Rust handles HTTP requests, system tray, registry operations, and token capture on the backend.",
    archFrontend: "React 18 + TypeScript\nVite 5 Build · Lucide Icons\nSingle-file components · Pure CSS theming",
    archBackend: "Rust · Tauri 2 Commands\nReqwest HTTP · Serde JSON\nWebView2 disk cache scanner",
    archBridge: "Tauri IPC Bridge\nInvoke / Event bidirectional\nJS injection · window.title polling",

    screenshotTitle: "Screenshots",
    screenshotDashboard: "Dashboard · Balance + Usage + Trend",
    screenshotSettings: "Settings · API Key · Token · Alert Config",
    screenshotThemes: "7 Theme Variations",

    linksTitle: "Links",
    linksGH: "GitHub Repository",
    linksGHDesc: "View source, submit issues or PRs",
    linksRelease: "Download Installer",
    linksReleaseDesc: "Latest x64-setup.exe",

    footerNote: "This project is forked from Joyi-code/DeepSeekMonitorWindows, upstream from JayHome137/deepseek-monitor. Not an official DeepSeek product. All data is stored locally in %APPDATA% — nothing is uploaded to any third party.",
    backToProjects: "← Back to Projects",
  },
} as const;

// ═══════════════════════════════════════════════════════
// 模拟仪表盘数据卡片（Hero 区域）
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// 页面主体
// ═══════════════════════════════════════════════════════
export default function DeepSeekMonitorPage() {
  const { lang } = useLang();
  const t = T[lang];
  const [activeTheme, setActiveTheme] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [openArchCards, setOpenArchCards] = useState<Set<number>>(new Set([1])); // 架构：默认展开 Tauri
  const [showApiCard, setShowApiCard] = useState(false); // DeepSeek API 管线点击

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-white dark:bg-black">
        {/* 背景装饰 — 亮暗模式自适应 */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-500/[0.08] via-purple-500/[0.04] to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        {/* 浮动光点 */}
        <div className="absolute top-1/4 left-[10%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 dark:bg-indigo-400/60 animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/40 dark:bg-purple-400/60 animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/3 left-[30%] w-1 h-1 rounded-full bg-pink-400/30 dark:bg-pink-400/50 animate-pulse" style={{ animationDelay: "0.8s" }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          {/* 返回链接 */}
<div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* 左侧：文字 */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <img src={S("deepseek-color.png")} alt="DeepSeek" className="w-10 h-10 rounded-lg ring-2 ring-indigo-500/20" />
                  <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/30">v1.1.1</span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                  {t.appName}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-xl md:text-2xl text-indigo-600 dark:text-indigo-300 font-medium mb-6">
                  {t.tagline}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-xl">
                  {t.heroDesc}
                </p>
              </Reveal>
              {/* 技术标签 */}
              <Reveal delay={350}>
                <div className="flex flex-wrap gap-2 mb-8">
                  {TECH_TAGS.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
              {/* 按钮 */}
              <Reveal delay={400}>
                <div className="flex flex-wrap items-center gap-4">
                  <a href="https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-zinc-900/10 dark:shadow-white/10">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {t.heroGH}
                  </a>
                  <a href="https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows/releases" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-500/25">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {t.linksRelease}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* 右侧仪表盘 */}
            <Reveal delay={500}>
              <div className="relative group/parent">
                {/* 辉光 */}
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 rounded-[2.5rem] blur-2xl group-hover/parent:from-indigo-500/35 group-hover/parent:via-purple-500/25 transition-all duration-1000" />
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-2xl border border-indigo-400/20 rotate-12 group-hover/parent:rotate-[25deg] group-hover/parent:border-indigo-400/40 group-hover/parent:scale-110 transition-all duration-700" />
                <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl border border-purple-400/15 -rotate-12 group-hover/parent:-rotate-[22deg] group-hover/parent:border-purple-400/30 group-hover/parent:scale-110 transition-all duration-700 delay-100" />

                {/* 卡片主体 */}
                <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl shadow-black/20" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #141223 100%)" }}>
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
                  <div className="relative p-5 md:p-6">

                    {/* 标题栏 */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_4px_#ff5f5740]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] shadow-[0_0_4px_#febc2e40]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] shadow-[0_0_4px_#28c84040]" />
                      </div>
                      <span className="ml-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">DeepSeek Monitor</span>
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                    </div>

                    {/* 余额主卡片 */}
                    <div className="p-4 rounded-2xl mb-4 transition-all duration-300 hover:scale-[1.01]" style={{ background: "linear-gradient(135deg, #4d6bfe12, #4d6bfe08)", border: "1px solid #4d6bfe18" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2" strokeWidth={2}/></svg>
                          {t.statBalance}
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#34d399]/15 text-[#34d399] rounded-full flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#34d399] animate-pulse" />
                          {lang === "zh" ? "可用" : "OK"}
                        </span>
                      </div>
                      <div className="text-[2rem] font-bold text-white font-mono tracking-tight leading-none mb-3">¥ 23.45</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg transition-colors duration-300 hover:bg-[#f59e0b]/5" style={{ background: "#f59e0b0d" }}>
                          <div className="text-[9px] text-[#f59e0b] mb-0.5">{lang === "zh" ? "今日消耗" : "Today"}</div>
                          <div className="text-sm font-bold text-white">¥ 0.32</div>
                        </div>
                        <div className="p-2 rounded-lg transition-colors duration-300 hover:bg-[#f59e0b]/5" style={{ background: "#f59e0b0d" }}>
                          <div className="text-[9px] text-[#f59e0b] mb-0.5">{lang === "zh" ? "本月消费" : "Month"}</div>
                          <div className="text-sm font-bold text-white">¥ 12.80</div>
                        </div>
                      </div>
                    </div>

                    {/* 模型用量行 */}
                    <div className="space-y-2 mb-4">
                      {[
                        { name: "V4 Flash", icon: "⚡", tokens: "824K", pct: 68, cost: "8.42", hit: "86.1%", c1: "#3b82f6", c2: "#60a5fa" },
                        { name: "V4 Pro", icon: "🧠", tokens: "423K", pct: 32, cost: "4.38", hit: "89.5%", c1: "#8b5cf6", c2: "#a78bfa" },
                      ].map(m => (
                        <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-default" style={{ background: "rgba(255,255,255,0.03)" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `linear-gradient(135deg, ${m.c1}30, ${m.c2}20)` }}>{m.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-white">{m.name}</span>
                              <span className="text-[10px] font-mono text-zinc-400">{m.tokens}</span>
                            </div>
                            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${m.c1}, ${m.c2})`, animation: "fill-bar 1.5s ease-out" }} />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-[9px]" style={{ color: m.c1 }}>{lang === "zh" ? "命中率" : "Hit"} {m.hit}</span>
                              <span className="text-[9px] font-mono text-zinc-500">¥{m.cost}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 柱状图 */}
                    <div>
                      <div className="flex items-end gap-[3px] h-16 px-0.5">
                        {[0.35,0.58,0.45,0.78,0.52,0.92,0.68].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end gap-[2px] group/bar cursor-default">
                            <div className="w-full rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-125" style={{ height: `${h*100}%`, background: "linear-gradient(to top, #6366f1, #818cf8)", opacity: 0.45 + h*0.55 }} />
                            <div className="w-full rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-125" style={{ height: `${h*28}%`, background: "linear-gradient(to top, #34d399, #6ee7b7)", opacity: 0.3 + h*0.4 }} />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5 text-[8px] text-zinc-600 font-mono">
                        {["6/26","6/27","6/28","6/29","6/30","7/1","7/2"].map(d => <span key={d}>{d}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 7 主题展示 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.themeTitle}</h2>
              <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">{t.themeSub}</p>
            </div>
          </Reveal>

          {/* 主题色条 */}
          <Reveal delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
              {THEMES.map((theme, i) => (
                <button
                  key={theme.key}
                  onClick={() => setActiveTheme(i)}
                  className={`group relative p-4 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 cursor-pointer ${
                    i === activeTheme
                      ? "border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.03]"
                      : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  {/* 色块 */}
                  <div className="flex gap-1.5 mb-3">
                    <div className="w-6 h-6 rounded-md" style={{ backgroundColor: theme.accent }} />
                    <div className="w-6 h-6 rounded-md" style={{ backgroundColor: theme.card, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <div className="w-6 h-6 rounded-md" style={{ backgroundColor: theme.text, opacity: 0.6 }} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold" style={{ color: theme.text }}>{lang === "zh" ? theme.nameZh : theme.nameEn}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-0.5 opacity-50" style={{ color: theme.text }}>{theme.nameEn}</div>
                  </div>
                  {/* 选中指示器 */}
                  {i === activeTheme && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          {/* 选中主题的预览 */}
          <Reveal delay={200}>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-700" style={{ backgroundColor: THEMES[activeTheme].bg }}>
              {/* 模拟窗口栏 */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full opacity-40" style={{ backgroundColor: THEMES[activeTheme].accent }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-30" style={{ backgroundColor: THEMES[activeTheme].accent }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-20" style={{ backgroundColor: THEMES[activeTheme].accent }} />
              </div>
              {/* 模拟内容 */}
              <div className="p-6 md:p-8 grid grid-cols-3 gap-4">
                {[0, 1, 2].map(row => (
                  <div key={row} className="p-4 rounded-xl" style={{ backgroundColor: THEMES[activeTheme].card }}>
                    <div className="w-3/4 h-2 rounded-full mb-3 opacity-20" style={{ backgroundColor: THEMES[activeTheme].text }} />
                    <div className="w-1/2 h-5 rounded-md mb-2" style={{ backgroundColor: THEMES[activeTheme].accent, opacity: 0.7 }} />
                    <div className="w-full h-1.5 rounded-full opacity-10" style={{ backgroundColor: THEMES[activeTheme].text }} />
                  </div>
                ))}
              </div>
              {/* 主题名称标签 */}
              <div className="absolute bottom-4 right-6 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm" style={{ backgroundColor: `${THEMES[activeTheme].accent}22`, color: THEMES[activeTheme].accent, border: `1px solid ${THEMES[activeTheme].accent}33` }}>
                {lang === "zh" ? THEMES[activeTheme].nameZh : THEMES[activeTheme].nameEn}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 7 主题画廊 ═══ */}
      <section className="relative pt-20 pb-8 md:pt-28 md:pb-12 px-6 md:px-12 overflow-hidden" style={{ background: "linear-gradient(180deg, #f0f4ff 0%, #faf5ff 50%, #f8f9fa 100%)" }}>
        <div className="relative max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
              {lang === "zh" ? "主题画廊" : "THEME GALLERY"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">{t.screenshotTitle}</h2>
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mt-4">
              {lang === "zh" ? "7 套精心调配的主题，每一套都经过独立的配色设计" : "7 meticulously crafted themes, each with independently designed color palettes"}
            </p>
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 mb-12" />
          </Reveal>

          {/* 触发按钮 — 居中，高交互感 */}
          {!showGallery && (
            <div className="flex justify-center py-8">
              <button
                onClick={() => setShowGallery(true)}
                className="group relative"
              >
                {/* 外层脉冲波纹 */}
                <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" style={{ animationDuration: "2.5s" }} />
                <span className="absolute inset-0 rounded-2xl bg-indigo-500/10 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.8s" }} />
                {/* 按钮主体 */}
                <span className="relative flex items-center gap-4 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 group-active:scale-95">
                  {/* 左侧展开图标 */}
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16m0 0l-4-4m4 4l4-4m6-12v16m0 0l4-4m-4 4l-4-4" /></svg>
                  <span className="text-lg">{lang === "zh" ? "展开全部主题" : "Reveal All Themes"}</span>
                  {/* 右侧展开图标 */}
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 4v16m0 0l4-4m-4 4l-4-4M7 20V4m0 0L3 8m4-4l4 4" /></svg>
                </span>
              </button>
            </div>
          )}

          {/* 图片区域 — 左右拉出，慢速优雅 */}
          {showGallery && <div className="transition-all duration-1000 opacity-100">
            {/* 第一行 4 张 — 从左侧拉出 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
              {[THEMES[0], THEMES[1], THEMES[2], THEMES[3]].map((theme, i) => (
                <div key={theme.key}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.bg,
                    transform: showGallery ? "translateX(0)" : "translateX(-130%)",
                    opacity: showGallery ? 1 : 0,
                    transition: `all 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 180}ms`,
                  }}>
                  <div className="absolute top-3 left-3 flex gap-1 z-10">
                    <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.accent }} />
                    <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: theme.accent }} />
                    <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: theme.accent }} />
                  </div>
                  <img src={S(`${theme.shot}.png`)} alt={theme.nameEn} className="w-full h-auto group-hover:scale-105 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-sm">{lang === "zh" ? theme.nameZh : theme.nameEn}</div>
                    <div className="flex gap-1 mt-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                      <div className="w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: theme.text }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 第二行：3 张截图 + 1 个 CTA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[THEMES[4], THEMES[5], THEMES[6]].map((theme, i) => (
                <div key={theme.key}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.bg,
                    transform: showGallery ? "translateX(0)" : "translateX(130%)",
                    opacity: showGallery ? 1 : 0,
                    transition: `all 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${i * 180 + 500}ms`,
                  }}>
                  <div className="absolute top-3 left-3 flex gap-1 z-10">
                    <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.accent }} />
                    <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: theme.accent }} />
                    <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: theme.accent }} />
                  </div>
                  <img src={S(`${theme.shot}.png`)} alt={theme.nameEn} className="w-full h-auto group-hover:scale-105 transition-all duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-sm">{lang === "zh" ? theme.nameZh : theme.nameEn}</div>
                    <div className="flex gap-1 mt-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                      <div className="w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: theme.text }} />
                    </div>
                  </div>
                </div>
              ))}

              {/* 第8张：配色征集 CTA */}
              <div
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: THEMES[6].bg,
                  transform: showGallery ? "translateX(0)" : "translateX(130%)",
                  opacity: showGallery ? 1 : 0,
                  transition: `all 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${3 * 180 + 500}ms`,
                }}
                onClick={() => window.open("https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows/issues", "_blank")}
              >
                {/* 顶部渐变光条 */}
                <div className="h-1 bg-gradient-to-r rounded-t-2xl" style={{ backgroundImage: `linear-gradient(90deg, ${THEMES[0].accent}, ${THEMES[1].accent}, ${THEMES[2].accent}, ${THEMES[3].accent}, ${THEMES[4].accent}, ${THEMES[5].accent}, ${THEMES[6].accent})` }} />
                {/* 窗口圆点 */}
                <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                </div>
                {/* 内容 */}
                <div className="p-6 md:p-8 flex flex-col items-center text-center h-full justify-center min-h-[200px]">
                  {/* 图标 + 脉冲环 */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${THEMES[6].accent}20, ${THEMES[6].accent}08)` }}>
                      🎨
                    </div>
                    <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: THEMES[6].accent, animationDuration: "3s" }} />
                  </div>
                  {/* 标题 */}
                  <h4 className="text-white font-bold text-base mb-2">
                    {lang === "zh" ? "你的配色" : "Your Palette"}
                  </h4>
                  <p className="text-[11px] leading-relaxed mb-5 max-w-[200px]" style={{ color: THEMES[6].text, opacity: 0.65 }}>
                    {lang === "zh" ? "有更好的颜色设计？分享你的配色方案，出现在下一次更新中" : "Got a better design? Share your color scheme for the next update"}
                  </p>
                  {/* CTA 按钮 */}
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{ backgroundColor: `${THEMES[6].accent}20`, color: THEMES[6].accent, border: `1px solid ${THEMES[6].accent}30` }}>
                    {lang === "zh" ? "提交 Issue" : "Open Issue"}
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </div>
              </div>
            </div>

            {/* 收起按钮 */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setShowGallery(false)}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  {lang === "zh" ? "收起" : "Collapse"}
                </button>
              </div>
          </div>
          }
        </div>
      </section>

      {/* ═══ 核心功能 ═══ */}
      <section className="pt-4 pb-20 md:pt-8 md:pb-28 px-6 md:px-12 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
                {lang === "zh" ? "功能一览" : "FEATURES"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">{t.featureTitle}</h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6" />
            </div>
          </Reveal>

          <div className="space-y-16 md:space-y-24">
            {/* ── 01 余额实时查询 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">01</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureBalanceTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureBalanceDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                </div>
                <div>
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] p-6 shadow-xl shadow-black/40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs text-[#888]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2" strokeWidth={1.5}/><line x1="1" y1="10" x2="23" y2="10" strokeWidth={1.5}/></svg>
                        {lang === "zh" ? "账户余额" : "Account Balance"}
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#34d399]/15 text-[#34d399] rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                        {lang === "zh" ? "可用" : "Active"}
                      </span>
                    </div>
                    <div className="text-[2.25rem] font-bold text-white mb-5 font-mono tracking-tight">¥ 23.45</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl transition-all duration-300 hover:scale-[1.03] group/mini cursor-default" style={{ backgroundColor: "#f59e0b12" }}>
                        <div className="text-[10px] mb-0.5" style={{ color: "#f59e0b" }}>{lang === "zh" ? "当日消耗" : "Today"}</div>
                        <div className="text-lg font-bold text-white group-hover/mini:scale-105 transition-transform">¥ 0.32</div>
                      </div>
                      <div className="p-3 rounded-xl transition-all duration-300 hover:scale-[1.03] group/mini2 cursor-default" style={{ backgroundColor: "#f59e0b12" }}>
                        <div className="text-[10px] mb-0.5" style={{ color: "#f59e0b" }}>{lang === "zh" ? "本月消费" : "This Month"}</div>
                        <div className="text-lg font-bold text-white group-hover/mini2:scale-105 transition-transform">¥ 12.80</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 02 用量数据追踪 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="md:order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">02</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureUsageTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureUsageDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" />
                </div>
                <div className="md:order-1">
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] p-6 shadow-xl shadow-black/40 space-y-3">
                    {[
                      { name: "V4 Flash", icon: "⚡", tokens: "824,391", cost: "8.42", eff: "98K", pct: 68, hit: "86.12", c1: "#3b82f6", c2: "#60a5fa" },
                      { name: "V4 Pro", icon: "🧠", tokens: "422,991", cost: "4.38", eff: "97K", pct: 32, hit: "89.47", c1: "#8b5cf6", c2: "#a78bfa" },
                    ].map(m => (
                      <div key={m.name} className="flex items-center gap-3 p-4 bg-[#1a1a2e] rounded-2xl group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${m.c1}, ${m.c2})` }}>{m.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white mb-1">{m.name}</div>
                          <div className="text-[11px] text-[#888] mb-1.5">{m.tokens} Tokens</div>
                          <div className="h-1.5 bg-[#ffffff10] rounded-full overflow-hidden relative">
                            <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${m.c1}, ${m.c2})`, animation: "fill-bar 1.5s ease-out" }}>
                              <div className="absolute inset-0 w-8 h-full skew-x-[-30deg] translate-x-[-200%]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer 2.5s 0.5s infinite" }} />
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-white">¥ {m.cost}</div>
                          <div className="text-[10px] text-[#666]">{m.eff} T/¥</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-[10px] px-1">
                      <span style={{ color: "#3b82f6" }}>Flash {lang === "zh" ? "命中率" : "Hit"} 86.12%</span>
                      <span style={{ color: "#8b5cf6" }}>Pro {lang === "zh" ? "命中率" : "Hit"} 89.47%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 03 7日消耗趋势图 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">03</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureChartTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureChartDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                </div>
                <div>
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] p-6 shadow-xl shadow-black/40">
                    <div className="flex items-center gap-4 mb-5">
                      {[
                        { c: "#5b8def", l: lang === "zh" ? "缓存命中" : "Cache Hit" },
                        { c: "#a78bfa", l: lang === "zh" ? "缓存未命中" : "Cache Miss" },
                        { c: "#34d399", l: lang === "zh" ? "输出Token" : "Output" },
                      ].map(it => (
                        <div key={it.c} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: it.c }} />
                          <span className="text-[10px] text-[#888]">{it.l}</span>
                        </div>
                      ))}
                      <div className="ml-auto text-[10px] text-[#666]">{lang === "zh" ? "单位: K" : "Unit: K"}</div>
                    </div>
                    <div className="flex items-end gap-1.5 h-28 mb-2">
                      {[{ h:52,m:18,o:14 },{ h:78,m:22,o:20 },{ h:60,m:25,o:15 },{ h:95,m:30,o:25 },{ h:70,m:20,o:18 },{ h:110,m:35,o:30 },{ h:82,m:28,o:22 }].map((d, j) => (
                        <div key={j} className="flex-1 flex flex-col justify-end group/bar cursor-default">
                          <div className="w-full rounded-t-[3px] group-hover/bar:brightness-125 transition-all" style={{ height: `${(d.o/180)*100}%`, backgroundColor: "#34d399", minHeight: d.o>0?2:0 }} />
                          <div className="w-full group-hover/bar:brightness-125 transition-all" style={{ height: `${(d.m/180)*100}%`, backgroundColor: "#a78bfa", minHeight: d.m>0?2:0 }} />
                          <div className="w-full rounded-b-[3px] group-hover/bar:brightness-125 transition-all" style={{ height: `${(d.h/180)*100}%`, backgroundColor: "#5b8def", minHeight: 2 }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-[#666] font-mono">
                      {["6/26","6/27","6/28","6/29","6/30","7/1","7/2"].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 04 余额告警 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="md:order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">04</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-rose-400 to-red-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureAlertTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureAlertDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-rose-400 to-red-500" />
                </div>
                <div className="md:order-1">
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] shadow-xl shadow-black/40 overflow-hidden">
                    <div className="px-5 pt-5">
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4" style={{ backgroundColor: "#f43f5e12", border: "1px solid #f43f5e25" }}>
                        <svg className="w-4 h-4 text-[#f43f5e] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        <span className="text-xs text-[#f43f5e] font-medium">
                          {lang === "zh" ? "账户余额低于告警线（¥5.00），当前余额 ¥3.20" : "Balance below threshold (¥5.00), current ¥3.20"}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="1" y="4" width="22" height="16" rx="2" strokeWidth={1.5}/><line x1="1" y1="10" x2="23" y2="10" strokeWidth={1.5}/></svg>
                          {lang === "zh" ? "账户余额" : "Account Balance"}
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full flex items-center gap-1" style={{ backgroundColor: "#f9731615", color: "#f97316" }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#f97316" }} />
                          {lang === "zh" ? "余额偏低" : "Low"}
                        </span>
                      </div>
                      <div className="text-[2.25rem] font-bold text-[#f97316] mb-4 font-mono tracking-tight">¥ 3.20</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-[#1a1a2e] rounded-xl">
                          <div className="text-[10px] text-[#888] mb-0.5">{lang === "zh" ? "告警阈值" : "Threshold"}</div>
                          <div className="text-lg font-bold text-white">¥ 5.00</div>
                        </div>
                        <div className="p-3 bg-[#1a1a2e] rounded-xl">
                          <div className="text-[10px] text-[#888] mb-0.5">{lang === "zh" ? "差额" : "Shortfall"}</div>
                          <div className="text-lg font-bold text-[#f43f5e]">- ¥ 1.80</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 05 Token 自动捕获 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">05</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-violet-400 to-purple-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureSyncTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureSyncDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-violet-400 to-purple-500" />
                </div>
                <div>
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] shadow-xl shadow-black/40 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#ffffff10]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffffff20]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffffff20]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffffff20]" />
                      <div className="flex-1 mx-3 px-3 py-1 bg-[#ffffff10] rounded-md text-[10px] text-[#aaa] font-mono truncate flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        platform.deepseek.com
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] text-[#888] mb-2 font-mono uppercase tracking-wider">{lang === "zh" ? "// 注入脚本 — 拦截 fetch/XHR" : "// Injected — hooks fetch & XHR"}</div>
                      <div className="p-3 bg-[#0a0a14] rounded-xl font-mono text-[10px] leading-relaxed">
                        <div className="text-[#666]">const orig = window.fetch;</div>
                        <div className="text-[#666]">window.fetch = async (...a) =&gt; {"{"}</div>
                        <div className="text-[#666] pl-3">const r = await orig(...a);</div>
                        <div className="text-[#c084fc] pl-3">const t = r.headers.get(</div>
                        <div className="text-[#34d399] pl-6">'Authorization'</div>
                        <div className="text-[#c084fc] pl-3">) || '';</div>
                        <div className="text-[#fb923c] pl-3">if (t.startsWith('Bearer ')) {"{"}</div>
                        <div className="text-[#34d399] pl-6">document.title = t;</div>
                        <div className="text-[#fb923c] pl-3">{"}"}</div>
                        <div className="text-[#666] pl-3">return r;</div>
                        <div className="text-[#666]">{"};"}</div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                        <span className="text-[#34d399] font-medium">{lang === "zh" ? "Token 已捕获 ✓  sk-..." : "Token captured ✓  sk-..."}</span>
                        <span className="text-[#666] ml-auto">{lang === "zh" ? "双通道：title + IPC" : "Dual: title + IPC"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── 06 系统托盘驻留 ── */}
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="md:order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-7xl md:text-8xl font-black text-zinc-100 dark:text-zinc-800 select-none">06</span>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-indigo-400 to-blue-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-5">{t.featureTrayTitle}</h3>
                  <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">{t.featureTrayDesc}</p>
                  <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500" />
                </div>
                <div className="md:order-1">
                  <div className="bg-[#0f0f1a] rounded-[2rem] border border-[#ffffff10] shadow-xl shadow-black/40 overflow-hidden">
                    <div className="px-5 pt-5 pb-3">
                      <div className="text-[10px] text-[#888] mb-3 font-mono uppercase tracking-wider">{lang === "zh" ? "Windows 系统托盘" : "Windows System Tray"}</div>
                      <div className="h-12 bg-[#1a1a2e] rounded-xl flex items-center justify-end px-3 gap-1.5 relative border border-[#ffffff10]">
                        {[1, 2, 3].map(k => (
                          <div key={k} className="w-7 h-7 rounded-md bg-[#ffffff10] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm bg-[#ffffff15]" />
                          </div>
                        ))}
                        <div className="w-px h-5 bg-[#ffffff15] mx-1" />
                        <div className="relative">
                          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <img src={S("deepseek-color.png")} alt="DeepSeek" className="w-5 h-5 rounded-sm" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34d399] ring-2 ring-[#0f0f1a]" />
                        </div>
                        <div className="absolute -top-[88px] right-3 w-36 bg-[#1a1a2e] rounded-lg shadow-xl border border-[#ffffff15] overflow-hidden text-xs">
                          <div className="px-3 py-2 hover:bg-[#ffffff10] cursor-default text-white flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {lang === "zh" ? "显示主面板" : "Show"}
                          </div>
                          <div className="border-t border-[#ffffff10] px-3 py-2 hover:bg-[#ffffff10] cursor-default text-[#f43f5e] flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            {lang === "zh" ? "退出" : "Quit"}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-[9px]">
                        <span className="text-[#666]">{lang === "zh" ? "左键点击 → 切换显隐" : "Left click → toggle"}</span>
                        <span style={{ color: "#6366f1" }}>{lang === "zh" ? "开机自启 ✓" : "Auto-start ✓"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 技术架构 ═══ */}
      <section className="relative py-24 md:py-36 px-6 md:px-12 bg-white dark:bg-zinc-950 overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#8b5cf6]/3 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#0ea5e9]/3 blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 md:mb-18">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
                {lang === "zh" ? "架构设计" : "ARCHITECTURE"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-3">{t.archTitle}</h2>
              <p className="text-sm text-zinc-400">{lang === "zh" ? "四层架构，点击展开技术细节" : "4-layer stack, click to explore"}</p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-5" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {([
              { id: 0, icon: "🖥️", title: "Windows 10/11", accent: "#4d6bfe", layer: lang === "zh" ? "平台层" : "Platform",
                desc: lang === "zh" ? "驻扎系统托盘，左键显隐、右键菜单。WebView2 Runtime 渲染引擎。HKCU 注册表实现开机自启。所有配置与缓存仅存储于 %APPDATA% 本地目录。" : "Lives in system tray. WebView2 rendering. HKCU registry auto-start. All config & cache stored locally in %APPDATA%.",
                tags: lang === "zh" ? ["System Tray 驻留", "WebView2 Runtime", "HKCU 开机自启", "%APPDATA% 本地", "单实例 Mutex"] : ["System Tray", "WebView2 Runtime", "HKCU Registry", "%APPDATA% Local", "Single Mutex"] },
              { id: 1, icon: "🦀", title: "Tauri 2 Shell", accent: "#8b5cf6", layer: lang === "zh" ? "核心桥接层" : "Core Bridge",
                desc: lang === "zh" ? "IPC invoke/event 桥接前端 JS 与后端 Rust。WebView2 注入拦截 XHR/Fetch 自动捕获 Bearer Token。window.title 轮询 + 磁盘缓存扫描构成双通道兜底机制。" : "IPC bridges frontend JS & backend Rust. JS injection hooks XHR/Fetch to auto-capture tokens. window.title polling + disk cache scanning as dual-channel fallback.",
                tags: lang === "zh" ? ["IPC 双向通信", "JS 注入 XHR", "Token 自动捕获", "磁盘缓存扫描", "NSIS 安装包"] : ["IPC Bridge", "JS Injection", "Token Capture", "Cache Scanner", "NSIS Bundler"] },
              { id: 2, icon: "⚛️", title: "React 18 + TS", accent: "#0ea5e9", layer: lang === "zh" ? "表现层" : "Presentation",
                desc: lang === "zh" ? "1245 行单文件组件覆盖全部界面。7 套主题纯 CSS 变量驱动，一键切换即时生效。Vite 5 + HMR 开发，Lucide React 图标，自研堆叠柱状图组件。" : "1245-line single-file component. 7 themes via CSS variables. Vite 5 + HMR. Lucide React icons. Custom stacked bar chart.",
                tags: lang === "zh" ? ["Vite 5 + HMR", "Lucide Icons", "纯 CSS 7 主题", "自定义图表", "1245 行 TS"] : ["Vite 5 + HMR", "Lucide Icons", "7 CSS Themes", "Custom Chart", "1245 lines TS"] },
              { id: 3, icon: "⚙️", title: "Rust + API", accent: "#10b981", layer: lang === "zh" ? "服务层" : "Services",
                desc: lang === "zh" ? "Reqwest 异步 HTTP 调用 DeepSeek 官方端点。Serde 处理 JSON。调用 /user/balance 查余额，/usage/amount 与 /usage/cost 获取用量，配置与 Token 安全存储。" : "Reqwest async HTTP to DeepSeek endpoints. Serde JSON. Calls /user/balance for funds, /usage/amount & /usage/cost for usage data.",
                tags: lang === "zh" ? ["Reqwest HTTP", "Serde JSON", "/user/balance", "/usage/amount", "/usage/cost"] : ["Reqwest HTTP", "Serde JSON", "/user/balance", "/usage/amount", "/usage/cost"] },
            ] as const).map((card, i) => {
              const isOpen = openArchCards.has(card.id);
              const toggle = () => {
                const next = new Set(openArchCards);
                if (next.has(card.id)) next.delete(card.id); else next.add(card.id);
                setOpenArchCards(next);
              };
              return (
                <div key={card.id}
                  className="group rounded-2xl transition-all duration-500 cursor-pointer flex flex-col relative"
                  style={{
                    border: `1px solid ${isOpen ? card.accent + "60" : card.accent + "12"}`,
                    backgroundColor: isOpen ? `${card.accent}08` : undefined,
                    boxShadow: isOpen ? `0 0 30px ${card.accent}10, 0 8px 32px ${card.accent}08` : undefined,
                    transform: isOpen ? "scale(1.02)" : undefined,
                    zIndex: isOpen ? 10 : undefined,
                  }}
                  onClick={toggle}>

                  {/* 顶部色条 — 展开时变亮 */}
                  <div className="h-0.5 rounded-t-2xl transition-all duration-500" style={{
                    background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)`,
                    opacity: isOpen ? 1 : 0.3,
                  }} />

                  <div className="p-5 flex-1 flex flex-col">
                    {/* 头部 */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-500"
                          style={{
                            background: isOpen ? `linear-gradient(135deg, ${card.accent}, ${card.accent}cc)` : `linear-gradient(135deg, ${card.accent}20, ${card.accent}10)`,
                            color: isOpen ? "#fff" : card.accent,
                            boxShadow: isOpen ? `0 4px 12px ${card.accent}40` : undefined,
                          }}>
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] leading-tight">{card.title}</h3>
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: card.accent, opacity: 0.5 }}>{card.layer}</p>
                        </div>
                      </div>
                      <div className={`transition-transform duration-500 mt-1 ${isOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}>
                        <svg className="w-4 h-4" style={{ color: card.accent, opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M19 9l-7 7-7-7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      </div>
                    </div>

                    {/* 展开内容 */}
                    <div className="overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] flex-1"
                      style={{ maxHeight: isOpen ? "500px" : "0px", opacity: isOpen ? 1 : 0 }}>
                      <div className="space-y-3 pt-1 pb-1">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {card.tags.map((t, j) => (
                            <span key={t} className="px-2 py-0.5 text-[10px] rounded-md font-medium transition-all duration-300"
                              style={{
                                backgroundColor: `${card.accent}10`,
                                color: card.accent,
                                border: `1px solid ${card.accent}18`,
                                transitionDelay: `${j * 50}ms`,
                                transform: isOpen ? "translateY(0)" : "translateY(8px)",
                                opacity: isOpen ? 1 : 0,
                              }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部数据流 — 架构管线 */}
          <Reveal delay={600}>
            <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-6">
                {lang === "zh" ? "数据流 · 点击展开对应层" : "Data Flow · Click to Expand"}
              </p>
              <div className="flex items-center justify-center flex-wrap gap-2">
                {/* Windows */}
                <button onClick={() => { const n = new Set(openArchCards); n.has(0) ? n.delete(0) : n.add(0); setOpenArchCards(n); }}
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    color: openArchCards.has(0) ? "#fff" : "#4d6bfe",
                    backgroundColor: openArchCards.has(0) ? "#4d6bfe" : "#4d6bfe10",
                    border: `1.5px solid ${openArchCards.has(0) ? "#4d6bfe" : "#4d6bfe25"}`,
                    boxShadow: openArchCards.has(0) ? "0 8px 24px #4d6bfe40" : undefined,
                  }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🖥️</span> Windows
                  </span>
                </button>

                {/* 箭头 */}
                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>

                {/* Tauri 2 */}
                <button onClick={() => { const n = new Set(openArchCards); n.has(1) ? n.delete(1) : n.add(1); setOpenArchCards(n); }}
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    color: openArchCards.has(1) ? "#fff" : "#8b5cf6",
                    backgroundColor: openArchCards.has(1) ? "#8b5cf6" : "#8b5cf610",
                    border: `1.5px solid ${openArchCards.has(1) ? "#8b5cf6" : "#8b5cf625"}`,
                    boxShadow: openArchCards.has(1) ? "0 8px 24px #8b5cf640" : undefined,
                  }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🦀</span> Tauri 2
                  </span>
                </button>

                {/* 双向箭头 */}
                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>

                {/* React+TS */}
                <button onClick={() => { const n = new Set(openArchCards); n.has(2) ? n.delete(2) : n.add(2); setOpenArchCards(n); }}
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    color: openArchCards.has(2) ? "#fff" : "#0ea5e9",
                    backgroundColor: openArchCards.has(2) ? "#0ea5e9" : "#0ea5e910",
                    border: `1.5px solid ${openArchCards.has(2) ? "#0ea5e9" : "#0ea5e925"}`,
                    boxShadow: openArchCards.has(2) ? "0 8px 24px #0ea5e940" : undefined,
                  }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">⚛️</span> React+TS
                  </span>
                </button>

                {/* 双向箭头 */}
                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>

                {/* Tauri 2 (repeat) */}
                <span className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    color: openArchCards.has(1) ? "#fff" : "#8b5cf6",
                    backgroundColor: openArchCards.has(1) ? "#8b5cf6" : "#8b5cf610",
                    border: `1.5px solid ${openArchCards.has(1) ? "#8b5cf6" : "#8b5cf625"}`,
                    boxShadow: openArchCards.has(1) ? "0 8px 24px #8b5cf640" : undefined,
                    cursor: "pointer",
                  }}
                  onClick={() => { const n = new Set(openArchCards); n.has(1) ? n.delete(1) : n.add(1); setOpenArchCards(n); }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🦀</span> Tauri 2
                  </span>
                </span>

                {/* 双向箭头 */}
                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>

                {/* Rust+API */}
                <button onClick={() => { const n = new Set(openArchCards); n.has(3) ? n.delete(3) : n.add(3); setOpenArchCards(n); }}
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    color: openArchCards.has(3) ? "#fff" : "#10b981",
                    backgroundColor: openArchCards.has(3) ? "#10b981" : "#10b98110",
                    border: `1.5px solid ${openArchCards.has(3) ? "#10b981" : "#10b98125"}`,
                    boxShadow: openArchCards.has(3) ? "0 8px 24px #10b98140" : undefined,
                  }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">⚙️</span> Rust+API
                  </span>
                </button>

                {/* 箭头 */}
                <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>

                {/* DeepSeek API — 可点击展开 */}
                <button onClick={() => setShowApiCard(!showApiCard)}
                  className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 hover:-translate-y-1 hover:shadow-lg inline-flex items-center gap-2"
                  style={{
                    color: showApiCard ? "#fff" : "#f59e0b",
                    backgroundColor: showApiCard ? "#f59e0b" : "#f59e0b10",
                    border: `1.5px solid ${showApiCard ? "#f59e0b" : "#f59e0b25"}`,
                    boxShadow: showApiCard ? "0 8px 24px #f59e0b40" : undefined,
                  }}>
                  <span className="text-base">🤖</span> DeepSeek API
                  <svg className={`w-3.5 h-3.5 transition-all duration-300 ${showApiCard ? "rotate-90" : "opacity-50 group-hover:opacity-100"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
            </div>

            {/* DeepSeek API 展开信息卡 */}
            <div className={`mt-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${showApiCard ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="p-5 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">🤖</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">DeepSeek API</h4>
                    <a href="https://platform.deepseek.com/api-docs" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-mono text-amber-500 hover:text-amber-600 dark:hover:text-amber-300 underline underline-offset-2 transition-colors">
                      platform.deepseek.com/api-docs ↗
                    </a>
                  </div>
                  <p className="text-xs text-amber-600/80 dark:text-amber-300/70 leading-relaxed">
                    {lang === "zh"
                      ? "DeepSeek 开放平台 API，本应用通过 /user/balance 查询余额，/usage/amount 与 /usage/cost 获取用量数据。所有请求由 Rust 后端通过 Reqwest 异步发起。"
                      : "DeepSeek open platform API. This app queries /user/balance for account funds, /usage/amount and /usage/cost for usage data. All requests are made asynchronously via Rust's Reqwest."}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 关于项目 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
                {lang === "zh" ? "关于项目" : "ABOUT"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {lang === "zh" ? "感谢开源" : "Open Source Credits"}
              </h2>
              <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-loose">
                {lang === "zh"
                  ? "本项目 fork 自 Joyi-code/DeepSeekMonitorWindows，上游源自 JayHome137/deepseek-monitor。感谢原作者的开源贡献。"
                  : "Forked from Joyi-code/DeepSeekMonitorWindows, upstream from JayHome137/deepseek-monitor. Thanks to the original authors for their open-source contributions."}
              </p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6" />
            </div>
          </Reveal>

          {/* Fork 链 — 三张独立卡片 */}
          <Reveal delay={150}>
            <div className="space-y-0 mb-8">
              {/* ── 第一张：Joyi-code ── */}
              <a href="https://github.com/Joyi-code/DeepSeekMonitorWindows" target="_blank" rel="noopener noreferrer"
                className="block group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-300 dark:bg-indigo-500/40 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500 transition-colors" />
                <div className="flex items-center gap-4 p-5 pl-6">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/15 flex items-center justify-center text-indigo-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Joyi-code<span className="text-zinc-400 dark:text-zinc-500">/</span>DeepSeekMonitorWindows
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {lang === "zh" ? "v1.1.0 原始版本" : "v1.1.0 original"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {lang === "zh" ? "Joyi-code 的 Windows 适配版本，本项目的直接 fork 上游" : "Windows adaptation by Joyi-code, direct fork upstream of this project"}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </a>

              {/* 垂直连接线 */}
              <div className="flex justify-center py-1.5">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-4 bg-gradient-to-b from-indigo-200 to-purple-300 dark:from-indigo-500/30 dark:to-purple-500/30" />
                  <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600">fork</span>
                  <div className="w-px h-4 bg-gradient-to-b from-purple-300 to-indigo-200 dark:from-purple-500/30 dark:to-indigo-500/30" />
                </div>
              </div>

              {/* ── 第二张：当前项目（高亮）─── */}
              <div className="block group relative rounded-2xl border-2 border-indigo-500/30 dark:border-indigo-500/25 shadow-lg shadow-indigo-500/5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10"
                style={{ background: "linear-gradient(135deg, #4d6bfe08, #8b5cf608)" }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500" />
                <div className="flex items-center gap-4 p-5 pl-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 w-9 h-9 rounded-xl bg-indigo-500/30 animate-ping" style={{ animationDuration: "3s" }} />
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border border-indigo-400/30 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href="https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows" target="_blank" rel="noopener noreferrer"
                        className="text-base font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Muanyan-mjq<span className="text-zinc-400 dark:text-zinc-500">/</span>DeepSeekMonitor-Windows
                      </a>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-sm shadow-indigo-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {lang === "zh" ? "当前" : "CURRENT"}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">v1.1.1</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {lang === "zh" ? "你的 fork，新增 7 套主题、余额告警、缓存命中率精确显示" : "Your fork — 7 themes, balance alerts, cache hit precision"}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </div>

              {/* 垂直连接线 */}
              <div className="flex justify-center py-1.5">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-4 bg-gradient-to-b from-purple-200 to-zinc-300 dark:from-purple-500/30 dark:to-zinc-600/30" />
                  <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600">upstream</span>
                  <div className="w-px h-4 bg-gradient-to-b from-zinc-300 to-purple-200 dark:from-zinc-600/30 dark:to-purple-500/30" />
                </div>
              </div>

              {/* ── 第三张：JayHome137 ── */}
              <a href="https://github.com/JayHome137/deepseek-monitor" target="_blank" rel="noopener noreferrer"
                className="block group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-purple-300 dark:bg-purple-500/40 group-hover:bg-purple-400 dark:group-hover:bg-purple-500 transition-colors" />
                <div className="flex items-center gap-4 p-5 pl-6">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/15 flex items-center justify-center text-purple-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        JayHome137<span className="text-zinc-400 dark:text-zinc-500">/</span>deepseek-monitor
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        {lang === "zh" ? "初始思路来源" : "original concept"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {lang === "zh" ? "JayHome137 提出的 DeepSeek 用量监控思路，一切开始的地方" : "The original DeepSeek monitoring concept by JayHome137 — where it all started"}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </a>
            </div>
          </Reveal>

          {/* 隐私声明 */}
          <Reveal delay={250}>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5">
              <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                  {lang === "zh" ? "非 DeepSeek 官方产品" : "Not an Official DeepSeek Product"}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-300/70 leading-relaxed">
                  {lang === "zh"
                    ? "所有数据仅存储在本地 "
                    : "All data is stored locally in "}
                  <code className="px-1 py-0.5 text-[11px] font-mono bg-amber-100 dark:bg-amber-500/10 rounded text-amber-700 dark:text-amber-400">%APPDATA%</code>
                  {lang === "zh"
                    ? " 目录，不上传任何第三方服务器。"
                    : " — nothing is uploaded to any third-party server."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 链接 CTA ═══ */}
      <section className="relative py-24 md:py-40 px-6 md:px-12 bg-white dark:bg-zinc-950 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/[0.04] via-purple-500/[0.04] to-pink-500/[0.04] blur-3xl" />
        {/* 浮动微粒子 */}
        <div className="absolute top-[15%] left-[10%] w-1 h-1 rounded-full bg-indigo-400/30 animate-pulse" style={{ animationDelay: "0s", animation: "float-soft 4s ease-in-out infinite" }} />
        <div className="absolute top-[25%] right-[12%] w-1.5 h-1.5 rounded-full bg-purple-400/30 animate-pulse" style={{ animationDelay: "1s", animation: "float-soft 5s ease-in-out infinite" }} />
        <div className="absolute bottom-[30%] left-[20%] w-1 h-1 rounded-full bg-pink-400/30 animate-pulse" style={{ animationDelay: "2s", animation: "float-soft 4.5s ease-in-out infinite" }} />
        <div className="absolute bottom-[20%] right-[8%] w-1.5 h-1.5 rounded-full bg-indigo-400/20 animate-pulse" style={{ animationDelay: "0.5s", animation: "float-soft 5.5s ease-in-out infinite" }} />
        <div className="absolute top-[60%] left-[5%] w-1 h-1 rounded-full bg-purple-400/25 animate-pulse" style={{ animationDelay: "3s", animation: "float-soft 3.8s ease-in-out infinite" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
              {lang === "zh" ? "获取项目" : "GET STARTED"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              {lang === "zh" ? "开源 & 免费使用" : "Open Source & Free"}
            </h2>
            <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-16">
              {lang === "zh" ? "MIT 协议开源，所有数据仅存储在本地。欢迎 Star、Issue 和 PR。" : "MIT licensed. All data stored locally. Stars, issues, and PRs welcome."}
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
            {/* GitHub 卡片 */}
            <Reveal delay={100}>
              <a href="https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows" target="_blank" rel="noopener noreferrer"
                className="group relative block p-8 md:p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl overflow-hidden hover:scale-[1.02]">
                {/* 背景渐变 — 从底部滑入 */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500 mb-2">{t.linksGH}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-400 transition-colors duration-500 mb-6">{t.linksGHDesc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500">
                    {lang === "zh" ? "浏览源码" : "View Source"}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </a>
            </Reveal>

            {/* Release 卡片 */}
            <Reveal delay={200}>
              <a href="https://github.com/Muanyan-mjq/DeepSeekMonitor-Windows/releases" target="_blank" rel="noopener noreferrer"
                className="group relative block p-8 md:p-10 rounded-[2rem] border-2 border-[#4d6bfe]/30 hover:border-[#4d6bfe] transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#4d6bfe]/10 overflow-hidden hover:scale-[1.02]">
                {/* 背景渐变 — 从底部滑入 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4d6bfe] via-[#6b8cff] to-[#3b5ce7] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#4d6bfe] to-[#3b5ce7] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#4d6bfe]/20">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500 mb-2">{t.linksRelease}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-blue-200 transition-colors duration-500 mb-6">{t.linksReleaseDesc}</p>
                  {/* 版本信息 */}
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#4d6bfe]/10 group-hover:bg-white/20 transition-colors duration-500">
                    <span className="text-xs font-mono font-bold text-[#4d6bfe] group-hover:text-white transition-colors">v1.1.1</span>
                    <span className="w-px h-3 bg-[#4d6bfe]/30 group-hover:bg-white/40" />
                    <span className="text-xs text-[#4d6bfe] group-hover:text-blue-200 transition-colors">x64-setup.exe</span>
                  </div>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
