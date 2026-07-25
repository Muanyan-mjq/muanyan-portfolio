"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BASE_PATH } from "@/lib/base-path";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.08 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(32px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const DIGIT_COLORS = [
  "#f56565", "#68d391", "#63b3ed", "#f6e05e", "#b794f4",
  "#76e4f7", "#ed8936", "#f687b3", "#9ae6b4", "#4fd1c5",
];

const content = {
  zh: {
    back: "← 返回项目列表",
    badge: "PyTorch · MNIST · 3通道 RGB",
    title: "彩色 VAE",
    subtitle: "一次调试教会我的事",
    desc: "从灰度到彩色看似只多两个通道，实际上引发了一连串新问题。最核心的教训不是调参技巧，而是——模型不傻，它在算账。",
    blogLink: "阅读完整博客",
    ghLink: "GitHub 源码",
    storyTitle: "调试故事",
    storySections: [
      {
        label: "实验 #1",
        emoji: "🎲",
        title: "随机染色 → 全灰度输出",
        body: "给每张 MNIST 图片乘一个随机 RGB 系数，以为变体越多模型学得越好。训练 100 轮，loss 正常收敛到 302.23，但生成的图片全部是灰度。模型自适应地学会了忽略颜色。",
        loss: "302.23",
        status: "失败",
      },
      {
        label: "根因",
        emoji: "🔍",
        title: "一笔账：颜色只值 0.6%",
        body: "笔画像素只占图片的 15%，输出灰度 vs 彩色的 BCE 差异只有每像素 0.14。颜色信号在总 loss 中的权重不到 0.6%——模型在形状上多费一点力，loss 降得多得多。颜色作为随机噪声，最优策略就是忽略。",
        loss: "0.6%",
        status: "关键洞察",
      },
      {
        label: "实验 #2",
        emoji: "🎯",
        title: "按类染色 → 颜色成功",
        body: "把颜色绑定到数字类别：0=红、1=绿、2=蓝……颜色变成语义信号，模型必须准确区分 R/G/B。仅改了一行代码，val_loss 从 302 降到 252（↓16.5%），颜色成功输出。",
        loss: "252.35",
        status: "修复",
      },
      {
        label: "实验 #3",
        emoji: "🚀",
        title: "调参优化 → 精度再提升",
        body: "latent_size 8→16（更大隐空间），β 0.1→0.05（更偏重建精度）。val_loss 进一步降到 224.80（↓10.9%），同时引入 BCE 损失、KL 预热、余弦退火学习率、自适应梯度裁剪。",
        loss: "224.80",
        status: "最优",
      },
      {
        label: "实验 #4",
        emoji: "🧬",
        title: "CVAE → 可控生成",
        body: "在编码器和解码器中注入标签条件。现在可以说「给我画一个红色的 5」——从随机生成到按需生成。val_loss 222.50，KL 下降 16.5%，标签信息有效帮助编码。",
        loss: "222.50",
        status: "进化",
      },
    ],
    insightTitle: "核心教训",
    insightBody: "不是「颜色不够鲜艳」，而是「颜色作为信号不够可靠」。改架构、调参数都解决不了数据构造的问题。养成习惯：先分析 loss 在罚什么，再动手改。",
    toolkitTitle: "优化工具箱",
    toolkitItems: [
      { name: "BCE 替代 MSE", desc: "BCE 在边界像素处梯度更尖锐，避免 MSE 的灰色雾效应" },
      { name: "β 系数 + KL 预热", desc: "β=0.05 控制重建/KL 权重比，前 20 轮渐进引入 KL 约束" },
      { name: "余弦退火学习率", desc: "从 0.001 平滑降至 1e-5，前期大步快走、后期精细调整" },
      { name: "自适应梯度裁剪", desc: "EMA 动态阈值，当前梯度超过历史均值 5 倍时才裁剪" },
      { name: "早停 + 验证集", desc: "val_loss 连续 10 轮不创新低自动停止，避免过拟合" },
    ],
    reconTitle: "重建效果",
    reconDesc: "实验 #3（latent=16, β=0.05, 按类染色）的最终重建结果。上排为按类染色的原始彩色 MNIST，下排为 VAE 重建输出。",
    reconCaption: "▲ 彩色 VAE 重建对比（实验 #3, latent=16, β=0.05）",
    blogTitle: "深入学习",
    blogDesc: "项目页面是快速概览。完整的技术细节、数学推导和代码实现请阅读博客：",
    blogCardTitle: "VAE 学习笔记（二）：彩色图像与优化",
    blogCardDesc: "3 通道扩展、随机染色失败调试、按类染色修复、β-VAE 与优化工具箱",
  },
  en: {
    back: "← Back to Projects",
    badge: "PyTorch · MNIST · 3-Channel RGB",
    title: "Color VAE",
    subtitle: "What One Debugging Session Taught Me",
    desc: "Going from grayscale to color seems like just two more channels — but it triggers a cascade of new problems. The core lesson isn't about tuning tricks. It's this: the model isn't stupid. It's doing the math.",
    blogLink: "Read Full Blog",
    ghLink: "GitHub Source",
    storyTitle: "The Debugging Story",
    storySections: [
      {
        label: "Experiment #1",
        emoji: "🎲",
        title: "Random Coloring → All Grayscale",
        body: "Multiply each MNIST image by random RGB coefficients. More variation = better learning, right? Wrong. 100 epochs, loss converged normally to 302.23 — but all outputs were grayscale. The model adaptively learned to ignore color.",
        loss: "302.23",
        status: "Failed",
      },
      {
        label: "Root Cause",
        emoji: "🔍",
        title: "The Math: Color is Worth 0.6%",
        body: "Stroke pixels are only ~15% of the image. BCE difference between grayscale and correct color: just ~0.14 per pixel. Color signal accounts for less than 0.6% of total loss — the model gets far more reduction by improving shape. Color as random noise: the optimal strategy is to ignore it.",
        loss: "0.6%",
        status: "Key Insight",
      },
      {
        label: "Experiment #2",
        emoji: "🎯",
        title: "Per-Class Coloring → Success",
        body: "Bind color to digit class: 0=Red, 1=Green, 2=Blue... Color becomes a semantic signal, not noise. One line changed. val_loss: 302→252 (↓16.5%). Color works.",
        loss: "252.35",
        status: "Fixed",
      },
      {
        label: "Experiment #3",
        emoji: "🚀",
        title: "Parameter Tuning → Best Accuracy",
        body: "latent_size 8→16 (more capacity), β 0.1→0.05 (bias toward reconstruction). val_loss: 252→225 (↓10.9%). Added BCE loss, KL warm-up, cosine annealing, adaptive gradient clipping.",
        loss: "224.80",
        status: "Optimal",
      },
      {
        label: "Experiment #4",
        emoji: "🧬",
        title: "CVAE → Controllable Generation",
        body: "Inject label conditioning into encoder and decoder. Now you can say 'draw a red 5.' From random generation to on-demand generation. val_loss: 222.50, KL ↓16.5%.",
        loss: "222.50",
        status: "Evolution",
      },
    ],
    insightTitle: "Core Lesson",
    insightBody: "It's not that 'colors aren't bright enough.' It's that 'color as a signal isn't reliable enough.' Changing architecture or tuning parameters won't fix a data construction problem. Build the habit: first analyze what the loss is actually penalizing, then act.",
    toolkitTitle: "Optimization Toolkit",
    toolkitItems: [
      { name: "BCE replaces MSE", desc: "Sharper gradients at boundary pixels, eliminates MSE's gray fog effect" },
      { name: "β coefficient + KL warm-up", desc: "β=0.05 balances recon/KL weight, gradual KL over 20 epochs" },
      { name: "Cosine annealing LR", desc: "Smooth decay from 0.001 to 1e-5 for fine convergence" },
      { name: "Adaptive gradient clipping", desc: "EMA dynamic threshold, clips only when 5× historical mean" },
      { name: "Early stopping + val set", desc: "Auto-stops when val_loss fails to improve for 10 epochs" },
    ],
    reconTitle: "Reconstruction",
    reconDesc: "Final reconstruction results from Experiment #3 (latent=16, β=0.05, per-class coloring). Top: original colored MNIST. Bottom: VAE reconstruction output.",
    reconCaption: "▲ Color VAE reconstruction (Experiment #3, latent=16, β=0.05)",
    blogTitle: "Deep Dive",
    blogDesc: "This page is a quick overview. For full technical details, math derivations, and code:",
    blogCardTitle: "VAE Notes (2): Color Images & Optimization",
    blogCardDesc: "3-channel extension, random coloring failure debug, per-class coloring fix, β-VAE and optimization toolkit",
  },
};

export default function VAEColorPage() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Animated color dots background */}
        <div className="absolute inset-0 opacity-20">
          {DIGIT_COLORS.map((color, i) => (
            <div key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                backgroundColor: color,
                width: `${200 + Math.random() * 300}px`,
                height: `${200 + Math.random() * 300}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float-${i} ${6 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-[2px]" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reveal>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {t.back}
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_420px] gap-12 md:gap-20 items-center">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex gap-1">
                    {DIGIT_COLORS.slice(0, 5).map((c, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="px-3 py-1 text-[11px] font-medium tracking-wider uppercase bg-white/5 text-zinc-400 rounded-full border border-white/10">
                    {t.badge}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
                  <span className="bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {t.title}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-2xl md:text-3xl text-zinc-500 font-light mb-8 tracking-tight">
                  {t.subtitle}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl mb-10">
                  {t.desc}
                </p>
              </Reveal>
              <Reveal delay={400}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/blog/vae-2-color"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-200 transition-all duration-300 text-sm shadow-lg shadow-white/10 hover:-translate-y-0.5">
                    {t.blogLink}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                  <a href="https://github.com/Muanyan-mjq/vae-color" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-zinc-300 font-semibold rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-sm hover:-translate-y-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {t.ghLink}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Hero: loss stat card */}
            <Reveal delay={500}>
              <div className="relative hidden lg:block">
                <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-xs font-semibold tracking-[0.3em] uppercase text-zinc-500 mb-8">Loss Journey</div>
                  {[
                    { loss: "302.23", label: "随机染色 (灰度)", color: "#f56565" },
                    { loss: "252.35", label: "按类染色", color: "#f6e05e", delta: "↓16.5%" },
                    { loss: "224.80", label: "调参优化", color: "#68d391", delta: "↓10.9%" },
                    { loss: "222.50", label: "CVAE", color: "#4fd1c5", delta: "↓1.0%" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <div className="font-mono text-2xl font-bold tracking-tight">{item.loss}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{item.label}</div>
                      </div>
                      {item.delta && (
                        <span className="text-xs font-bold text-emerald-400">{item.delta}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== THE STORY ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-600">The Story</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-16">{t.storyTitle}</h2>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            <div className="space-y-8">
              {t.storySections.map((section, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-[11px] top-1 w-4 h-4 rounded-full border-2 hidden md:flex items-center justify-center"
                      style={{ borderColor: DIGIT_COLORS[i], backgroundColor: i === 1 ? DIGIT_COLORS[i] : "transparent" }}>
                      {i === 1 && <div className="w-1.5 h-1.5 rounded-full bg-[#080810]" />}
                    </div>

                    <div className="group p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:bg-white/[0.05]">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{section.emoji}</span>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600">{section.label}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            section.status === "失败" || section.status === "Failed" ? "bg-red-500/10 text-red-400" :
                            section.status === "关键洞察" || section.status === "Key Insight" ? "bg-yellow-500/10 text-yellow-400" :
                            section.status === "修复" || section.status === "Fixed" ? "bg-emerald-500/10 text-emerald-400" :
                            section.status === "最优" || section.status === "Optimal" ? "bg-emerald-500/10 text-emerald-400" :
                            "bg-cyan-500/10 text-cyan-400"
                          }`}>
                            {section.status}
                          </span>
                        </div>
                        <div className="font-mono text-2xl font-bold tracking-tight" style={{ color: DIGIT_COLORS[i] }}>
                          {section.loss}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{section.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== KEY INSIGHT ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#050508]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent border border-yellow-500/20 p-10 md:p-16">
              <div className="absolute top-0 right-0 text-[20rem] leading-none opacity-[0.02] select-none font-black text-yellow-500">!</div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">💡</span>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-yellow-500/60">{t.insightTitle}</span>
                </div>
                <p className="text-xl md:text-3xl font-light leading-relaxed text-zinc-300 max-w-3xl">
                  {t.insightBody}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== OPTIMIZATION TOOLKIT ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-600">{t.toolkitTitle}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-12">{t.toolkitTitle}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {t.toolkitItems.map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: DIGIT_COLORS[i] + "20", color: DIGIT_COLORS[i] }}>
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== RECONSTRUCTION ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#050508]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-600">{t.reconTitle}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{t.reconTitle}</h2>
            <p className="text-lg text-zinc-400 max-w-2xl">{t.reconDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="mt-12">
              <img src={`${BASE_PATH}/vae-images/vae-color-reconstruction.png`} alt="Color VAE reconstruction"
                className="w-full rounded-2xl border border-white/10" />
              <figcaption className="text-sm text-zinc-500 mt-4">{t.reconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ========== BLOG LINK ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t.blogTitle}</h2>
            <p className="text-lg text-zinc-400 mb-10">{t.blogDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <Link href="/blog/vae-2-color"
              className="group relative block p-10 rounded-[2.5rem] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-fuchsia-600/10 to-cyan-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              <div className="relative z-10 flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                  <div className="flex gap-0.5">
                    {DIGIT_COLORS.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-2 h-6 rounded-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-500 mb-2">{t.blogCardTitle}</h3>
                  <p className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500 leading-relaxed">{t.blogCardDesc}</p>
                </div>
                <div className="ml-auto shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-6 md:px-12 bg-[#050508] border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-zinc-600">
            {lang === "zh" ? "基于 PyTorch · MNIST 数据集 · 4 次实验 · 开源代码" : "Built with PyTorch · MNIST dataset · 4 experiments · Open source"}
          </p>
        </div>
      </section>

      {/* Float animation keyframes */}
      <style jsx>{`
        ${DIGIT_COLORS.map((_, i) => `
          @keyframes float-${i} {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(${20 - i * 3}px, ${-30 + i * 5}px) scale(1.1); }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
