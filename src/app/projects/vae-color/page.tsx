"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BASE_PATH } from "@/lib/base-path";

/* ---------- scroll reveal ---------- */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
    <div ref={ref} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(36px)", transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- 10-class color palette ---------- */
const C = [
  { hex: "#ef4444", label: "0 · Red" },
  { hex: "#22c55e", label: "1 · Green" },
  { hex: "#3b82f6", label: "2 · Blue" },
  { hex: "#eab308", label: "3 · Yellow" },
  { hex: "#a855f7", label: "4 · Purple" },
  { hex: "#06b6d4", label: "5 · Cyan" },
  { hex: "#f97316", label: "6 · Orange" },
  { hex: "#ec4899", label: "7 · Pink" },
  { hex: "#84cc16", label: "8 · Lime" },
  { hex: "#14b8a6", label: "9 · Teal" },
];

/* ---------- i18n ---------- */
const t = {
  zh: {
    back: "← 项目列表",
    tag: "PyTorch · MNIST · RGB",
    heroTitle: "彩色 VAE",
    heroSub: "一次调试教会我的事——模型不傻，它在算账",
    heroDesc: "从灰度到彩色，看起来只多了两个通道。实际上引爆了一连串新问题。最核心的教训不是调参技巧：模型输出全灰不是 bug，是它在当前数据构造下的最优策略。",
    btnBlog: "阅读完整博客 →",
    btnCode: "GitHub 源码",
    statTitle: "Loss 演化",
    stats: [
      { loss: "302.23", label: "随机染色", note: "全灰度", c: 0 },
      { loss: "252.35", label: "按类染色", note: "↓16.5%", c: 1 },
      { loss: "224.80", label: "调参优化", note: "↓10.9%", c: 2 },
      { loss: "222.50", label: "CVAE", note: "可控", c: 4 },
    ],
    secStory: "调试故事",
    story: [
      { emoji: "🎲", tag: "实验 #1", tagColor: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", title: "随机染色 → 全灰度", body: "每张 MNIST 乘随机 RGB 系数。100 轮训练，loss 正常收敛到 302.23。打开生成结果——全部是灰度图。模型学会了忽视颜色。", loss: "302.23", lossColor: "#ef4444" },
      { emoji: "🔍", tag: "根因分析", tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", title: "一笔账：颜色只值 0.6%", body: "笔画像素 ≈15%，灰度输出 vs 正确彩色的 BCE 差异 ≈0.14/像素。颜色信号在总 loss 中权重不到 0.6%。最优策略：忽略颜色噪声，全力学形状。不是模型的问题——是你的数据设计有问题。", loss: "0.6%", lossColor: "#eab308" },
      { emoji: "🎯", tag: "实验 #2", tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", title: "按类染色 → 成功", body: "颜色绑定到数字类别：0=红、1=绿、2=蓝…颜色变成语义信号，模型必须区分 R/G/B。只改了一行代码，val_loss 从 302 降到 252（↓16.5%），颜色成功。", loss: "252.35", lossColor: "#22c55e" },
      { emoji: "🚀", tag: "实验 #3", tagColor: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400", title: "调参 → 最佳精度", body: "latent_size 8→16（更大隐空间），β 0.1→0.05（更偏重建）。val_loss 降到 224.80（↓10.9%）。同步引入 BCE、KL 预热、余弦退火、自适应梯度裁剪。", loss: "224.80", lossColor: "#3b82f6" },
      { emoji: "🧬", tag: "实验 #4", tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", title: "CVAE → 可控生成", body: "编码器和解码器注入标签条件。现在可以说「画一个红色的 5」。从随机生成到按需生成。val_loss 222.50，KL 下降 16.5%。CVAE 的定性价值远超 1% 的 loss 下降。", loss: "222.50", lossColor: "#a855f7" },
    ],
    secInsight: "核心教训",
    insight: "「颜色不够鲜艳」不是问题，「颜色作为信号不够可靠」才是。改架构、调参数之前，先问自己：loss 到底在罚什么？如果你设计的数据让模型的最优策略就是忽略某个信号——那它一定会忽略。这不是 bug，是好的优化。",
    secToolkit: "优化工具箱",
    toolkit: [
      { name: "BCE 替代 MSE", desc: "梯度在边界处最尖锐，惩罚模糊输出，避免 MSE 的灰色雾" },
      { name: "β 系数 + KL 预热", desc: "β=0.05，前 20 轮从 0 线性增长，先学重建再引入 KL 约束" },
      { name: "余弦退火学习率", desc: "0.001 → 1e-5，前期大步赶路，后期小碎步踩准" },
      { name: "自适应梯度裁剪", desc: "EMA 动态阈值，超历史均值 5 倍才裁剪，全程自适应" },
      { name: "早停 + 验证集", desc: "5 万训练 + 1 万验证，val_loss 连续 10 轮不创新低自动停" },
    ],
    secRecon: "重建效果",
    reconHead: "实验 #3 最终重建结果",
    reconBody: "上排为按类染色的原始彩色 MNIST，下排为 VAE 重建输出。实验参数：latent=16, β=0.05, 按类染色, 100 轮训练。",
    reconCaption: "原始彩色 MNIST（上） vs VAE 重建（下）",
    secBlog: "完整技术细节请阅读博客",
    blogTitle: "VAE 学习笔记（二）：彩色图像与优化",
    blogDesc: "3 通道扩展、随机染色失败调试、按类染色修复、β-VAE 与优化工具箱",
    footer: "Built with PyTorch · MNIST · 4 experiments · Open Source",
  },
  en: {
    back: "← Projects",
    tag: "PyTorch · MNIST · RGB",
    heroTitle: "Color VAE",
    heroSub: "What one debugging session taught me — models do the math",
    heroDesc: "Going from grayscale to color looks like just two more channels. It actually triggers a cascade of new problems. The core lesson: all-gray output isn't a bug — it's the model's optimal strategy under your data design.",
    btnBlog: "Read Full Blog →",
    btnCode: "GitHub Source",
    statTitle: "Loss Evolution",
    stats: [
      { loss: "302.23", label: "Random", note: "Grayscale", c: 0 },
      { loss: "252.35", label: "Per-Class", note: "↓16.5%", c: 1 },
      { loss: "224.80", label: "Tuned", note: "↓10.9%", c: 2 },
      { loss: "222.50", label: "CVAE", note: "Controllable", c: 4 },
    ],
    secStory: "The Debugging Story",
    story: [
      { emoji: "🎲", tag: "Exp #1", tagColor: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", title: "Random coloring → all gray", body: "Multiply each MNIST by random RGB. 100 epochs, loss converged normally. Opened the results — completely grayscale. The model learned to ignore color.", loss: "302.23", lossColor: "#ef4444" },
      { emoji: "🔍", tag: "Root Cause", tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", title: "The math: color is worth 0.6%", body: "Stroke pixels ≈15%, BCE difference gray vs color ≈0.14/pixel. Color signal <0.6% of total loss. Optimal strategy: ignore the noise, focus on shape. It's not a model problem — it's a data design problem.", loss: "0.6%", lossColor: "#eab308" },
      { emoji: "🎯", tag: "Exp #2", tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", title: "Per-class coloring → success", body: "Bind color to digit class: 0=Red, 1=Green... Color becomes semantic. One line changed. val_loss: 302→252 (↓16.5%). Color works.", loss: "252.35", lossColor: "#22c55e" },
      { emoji: "🚀", tag: "Exp #3", tagColor: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400", title: "Tuning → best accuracy", body: "latent_size 8→16, β 0.1→0.05. val_loss: 224.80 (↓10.9%). Added BCE, KL warm-up, cosine annealing, adaptive gradient clipping.", loss: "224.80", lossColor: "#3b82f6" },
      { emoji: "🧬", tag: "Exp #4", tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", title: "CVAE → controllable", body: "Label conditioning in encoder and decoder. Now you can say 'draw a red 5.' From random to on-demand generation. val_loss: 222.50, KL ↓16.5%. Qualitative gain far exceeds the 1% quantitative improvement.", loss: "222.50", lossColor: "#a855f7" },
    ],
    secInsight: "Core Lesson",
    insight: "It's not that 'colors aren't bright enough' — it's that 'color as a signal isn't reliable enough.' Before changing architecture or tuning parameters, ask: what is the loss actually penalizing? If your data design makes ignoring a signal the optimal strategy, the model will ignore it. That's not a bug — it's good optimization.",
    secToolkit: "Optimization Toolkit",
    toolkit: [
      { name: "BCE replaces MSE", desc: "Sharpest gradients at boundaries, penalizes ambiguity, no gray fog" },
      { name: "β coefficient + KL warm-up", desc: "β=0.05, linear ramp over 20 epochs, content first then regularization" },
      { name: "Cosine annealing LR", desc: "0.001 → 1e-5 smooth decay, fast progress then fine convergence" },
      { name: "Adaptive gradient clipping", desc: "EMA dynamic threshold, clips only at 5× historical mean" },
      { name: "Early stopping + val set", desc: "50K train + 10K val, auto-stop after 10 no-improvement epochs" },
    ],
    secRecon: "Reconstruction",
    reconHead: "Experiment #3 Final Results",
    reconBody: "Top: original colored MNIST (per-class coloring). Bottom: VAE reconstruction. Config: latent=16, β=0.05, per-class coloring, 100 epochs.",
    reconCaption: "Original colored MNIST (top) vs VAE reconstruction (bottom)",
    secBlog: "Full technical details in the blog post",
    blogTitle: "VAE Notes (2): Color Images & Optimization",
    blogDesc: "3-channel extension, random coloring failure debug, per-class coloring fix, β-VAE and optimization toolkit",
    footer: "Built with PyTorch · MNIST · 4 experiments · Open Source",
  },
};

export default function VAEColorPage() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <main className="bg-white dark:bg-[#050508] text-zinc-900 dark:text-zinc-100">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Color orbs — light mode: subtle tint; dark mode: vibrant glow */}
        <div className="absolute inset-0 pointer-events-none">
          {C.filter((_, i) => i % 2 === 0).map((col, i) => (
            <div key={i}
              className="absolute rounded-full blur-[120px] opacity-[0.04] dark:opacity-[0.08]"
              style={{
                backgroundColor: col.hex,
                width: `${250 + i * 30}px`, height: `${250 + i * 30}px`,
                top: `${10 + i * 22}%`, left: `${3 + i * 20}%`,
              }}
            />
          ))}
        </div>
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-0">
          <Reveal>
            <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-16">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {c.back}
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">
            <div>
              <Reveal delay={100}>
                {/* Color palette indicator */}
                <div className="flex items-center gap-1 mb-10">
                  {C.slice(0, 5).map((col, i) => (
                    <div key={i} className="w-1.5 h-5 rounded-full transition-transform hover:scale-150" style={{ backgroundColor: col.hex }} title={col.label} />
                  ))}
                  <span className="ml-3 text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">{c.tag}</span>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-black tracking-tighter leading-[0.92] mb-6">
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">{c.heroTitle}</span>
                </h1>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-xl md:text-2xl text-zinc-400 dark:text-zinc-500 font-light tracking-tight mb-6">{c.heroSub}</p>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mb-10">{c.heroDesc}</p>
              </Reveal>
              <Reveal delay={500}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/blog/vae-2-color"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-300 hover:-translate-y-0.5">
                    {c.btnBlog}
                  </Link>
                  <a href="https://github.com/Muanyan-mjq/vae-color" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-white/15 text-zinc-600 dark:text-zinc-400 text-sm font-semibold rounded-xl hover:border-zinc-400 dark:hover:border-white/30 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {c.btnCode}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: loss stats */}
            <Reveal delay={600}>
              <div className="hidden lg:block p-8 rounded-[2rem] bg-white dark:bg-[#0a0a12] border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.statTitle}</span>
                <div className="mt-6 space-y-4">
                  {c.stats.map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: C[s.c].hex }} />
                      <div className="flex-1">
                        <div className="font-mono text-2xl font-bold tracking-tight">{s.loss}</div>
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{s.label}</div>
                      </div>
                      {s.note && <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{s.note}</span>}
                    </div>
                  ))}
                </div>

                {/* Mini color swatches */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600 mb-3">Digit → Color</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {C.map((col, i) => (
                      <div key={i} className="aspect-square rounded-md flex items-center justify-center text-[10px] font-bold text-white/90 transition-transform hover:scale-110 shadow-sm"
                        style={{ backgroundColor: col.hex }}>
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ STORY TIMELINE ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-zinc-50 dark:bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secStory}</span>
          </Reveal>

          <div className="mt-12 space-y-6">
            {c.story.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group grid md:grid-cols-[1fr_120px] gap-4 md:gap-8 p-6 md:p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] transition-all duration-500">
                  <div className="flex gap-4">
                    <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.tagColor}`}>{item.tag}</span>
                        <h3 className="font-bold text-sm">{item.title}</h3>
                      </div>
                      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                  <div className="md:text-right flex md:block items-center gap-2">
                    <span className="font-mono text-xl font-bold tracking-tight" style={{ color: item.lossColor }}>{item.loss}</span>
                    {i < c.story.length - 1 && (
                      <div className="hidden md:block w-px h-6 mx-auto mt-2 bg-zinc-200 dark:bg-white/10" />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KEY INSIGHT ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-[#050508]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[3rem] p-10 md:p-16 bg-amber-50 dark:bg-amber-500/[0.04] border border-amber-200 dark:border-amber-500/10">
              <span className="absolute top-8 right-10 text-[15rem] leading-none font-black text-amber-200/30 dark:text-amber-500/[0.03] select-none pointer-events-none">!</span>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">💡</span>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-500/60">{c.secInsight}</span>
                </div>
                <p className="text-lg md:text-2xl font-light leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-3xl">{c.insight}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ OPTIMIZATION TOOLKIT ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-zinc-50 dark:bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secToolkit}</span>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
            {c.toolkit.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: C[i].hex + "18", color: C[i].hex }}>
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                  </div>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RECONSTRUCTION ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-[#050508]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secRecon}</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-4 mb-4">{c.reconHead}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg">{c.reconBody}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="mt-10">
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                <img src={`${BASE_PATH}/vae-images/vae-color-reconstruction.png`} alt="Color VAE reconstruction" className="w-full" />
              </div>
              <figcaption className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3">{c.reconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ═══ BLOG LINK ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-zinc-50 dark:bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">{c.secBlog}</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/blog/vae-2-color"
              className="group block p-10 md:p-14 rounded-[2.5rem] border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-fuchsia-500/80 to-cyan-500/80 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className="relative z-10 flex flex-wrap items-center gap-6 md:gap-10">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center gap-0.5 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                  {C.slice(0, 3).map((col, i) => (
                    <div key={i} className="w-1.5 h-6 rounded-sm" style={{ backgroundColor: col.hex }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-white transition-colors duration-500 mb-1">{c.blogTitle}</h3>
                  <p className="text-sm text-zinc-500 group-hover:text-white/80 transition-colors duration-500">{c.blogDesc}</p>
                </div>
                <div className="w-11 h-11 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6 md:px-12 bg-white dark:bg-[#050508] border-t border-zinc-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">{c.footer}</p>
          <Link href="/projects" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">{c.back}</Link>
        </div>
      </footer>
    </main>
  );
}
