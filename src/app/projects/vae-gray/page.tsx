"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { VAEIcon } from "@/components/vae-icon";
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

const content = {
  zh: {
    back: "← 返回项目列表",
    badge: "PyTorch · MNIST · 灰度重建",
    title: "变分自编码器",
    subtitle: "从直觉到实现",
    desc: "从零开始理解 VAE 的核心原理：编码器如何压缩图像、潜在空间如何组织信息、解码器如何还原细节。用直觉、数学和代码三种方式，跑通第一个生成模型。",
    blogLink: "阅读完整博客",
    ghLink: "GitHub 源码",
    archTitle: "架构",
    archDesc: "一张 28×28 的手写数字被编码器压缩成 4 维向量，再从这个向量通过解码器重建出完整图像。训练完成后，在潜在空间中随机采样就能生成全新的数字。",
    trainTitle: "训练",
    trainDesc: "100 轮训练，MSE + KL 散度联合优化。Loss 从 50+ 稳步降至 30 以下，编码器学会高效表示，解码器学会精准还原。",
    trainCaption: "▲ 训练 Loss 曲线（MSE + KL 散度）",
    reconTitle: "重建",
    reconDesc: "上排为原始 MNIST 手写数字，下排为 VAE 经过 90 轮训练后的重建结果。两者几乎无法区分——模型已经学会了数字的"本质特征"。",
    reconCaption: "▲ VAE 重建对比：上排原始，下排重建",
    noteTitle: "关键设计",
    notes: [
      { label: "重参数化技巧", body: "z = μ + σ·ε，ε ~ N(0,1)。把随机性从计算图中分离，让梯度能通过采样节点反向传播。" },
      { label: "ELBO 损失", body: "重构误差 + KL 散度。前者保证重建质量，后者把潜在空间约束到标准正态分布，使随机采样有效。" },
      { label: "潜在空间维度", body: "仅用 4 个数字表示一张 784 像素的图片。压缩比 196:1，信息瓶颈迫使编码器学习最本质的特征。" },
    ],
    blogTitle: "深入学习",
    blogDesc: "项目页面是快速概览。完整的技术细节、数学推导和代码实现请阅读博客：",
    blogCardTitle: "VAE 学习笔记（一）：从直觉到实现",
    blogCardDesc: "编码器/解码器架构、重参数化技巧、ELBO 损失函数推导、100 轮训练全流程",
  },
  en: {
    back: "← Back to Projects",
    badge: "PyTorch · MNIST · Grayscale",
    title: "Variational Autoencoder",
    subtitle: "From Intuition to Implementation",
    desc: "Understanding VAE core principles from scratch: how the encoder compresses images, how latent space organizes information, how the decoder reconstructs details. Three approaches — intuition, math, and code — to build your first generative model.",
    blogLink: "Read Full Blog",
    ghLink: "GitHub Source",
    archTitle: "Architecture",
    archDesc: "A 28×28 handwritten digit is compressed by the encoder into a 4-dimensional vector, then reconstructed back into a full image by the decoder. Once trained, sampling randomly in latent space generates entirely new digits.",
    trainTitle: "Training",
    trainDesc: "100 epochs, jointly optimized with MSE + KL divergence. Loss drops from 50+ to below 30 — the encoder learns efficient representations, the decoder learns precise reconstruction.",
    trainCaption: "▲ Training loss curve (MSE + KL divergence)",
    reconTitle: "Reconstruction",
    reconDesc: "Top: original MNIST digits. Bottom: VAE reconstructions after 90 epochs. Nearly indistinguishable — the model has learned the essential features of handwritten digits.",
    reconCaption: "▲ VAE reconstruction: top original, bottom reconstruction",
    noteTitle: "Key Design Decisions",
    notes: [
      { label: "Reparameterization Trick", body: "z = μ + σ·ε, ε ~ N(0,1). Separates randomness from the computation graph, allowing gradients to flow through the sampling node." },
      { label: "ELBO Loss", body: "Reconstruction error + KL divergence. The former ensures output quality; the latter constrains the latent space to a standard normal distribution for valid random sampling." },
      { label: "Latent Dimension", body: "Only 4 numbers represent a 784-pixel image. 196:1 compression ratio — the information bottleneck forces the encoder to learn the most essential features." },
    ],
    blogTitle: "Deep Dive",
    blogDesc: "This page is a quick overview. For full technical details, math derivations, and code:",
    blogCardTitle: "VAE Notes (1): From Intuition to Implementation",
    blogCardDesc: "Encoder/decoder architecture, reparameterization trick, ELBO loss derivation, full 100-epoch training pipeline",
  },
};

export default function VAEGrayPage() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Gradient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-zinc-200/60 dark:from-zinc-800/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reveal>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-12">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {t.back}
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_380px] gap-12 md:gap-20 items-center">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <VAEIcon size="md" className="grayscale dark:grayscale-0 dark:brightness-200" />
                  <span className="px-3 py-1 text-[11px] font-medium tracking-wider uppercase bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-800">
                    {t.badge}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
                  {t.title}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-2xl md:text-3xl text-zinc-400 dark:text-zinc-500 font-light mb-8 tracking-tight">
                  {t.subtitle}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-10">
                  {t.desc}
                </p>
              </Reveal>
              <Reveal delay={400}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/blog/vae-1-introduction"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-300 text-sm shadow-lg shadow-zinc-900/10 dark:shadow-white/10 hover:-translate-y-0.5">
                    {t.blogLink}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                  <a href="https://github.com/Muanyan-mjq/The_simple_vae" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300 text-sm hover:-translate-y-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {t.ghLink}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Hero visual: architecture flow */}
            <Reveal delay={500}>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 to-transparent rounded-[2.5rem]" />
                <div className="relative flex flex-col items-center gap-6 py-10">
                  {[
                    { label: "Encoder", in: "28×28×1", out: "μ, σ → 4-dim", emoji: "⬇", line: "Compress" },
                    { label: "Latent z", in: "4-dim vector", out: "N(0,1) prior", emoji: "⬡", line: "Sample" },
                    { label: "Decoder", in: "4-dim → 28×28", out: "Reconstructed", emoji: "⬆", line: "Rebuild" },
                  ].map((node, i) => (
                    <div key={i} className="flex flex-col items-center">
                      {i > 0 && <div className="w-px h-8 bg-gradient-to-b from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600" />}
                      <div className="w-48 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                        <div className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">{node.label}</div>
                        <div className="text-[11px] font-mono text-zinc-500 leading-relaxed">{node.in}</div>
                        <div className="text-[11px] font-mono text-zinc-500 leading-relaxed">→ {node.out}</div>
                        <div className="mt-2 text-[10px] tracking-wider uppercase text-zinc-300 dark:text-zinc-600">{node.line}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== TRAINING ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">02</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{t.trainTitle}</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">{t.trainDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="mt-12">
              <img src={`${BASE_PATH}/vae-images/vae-loss-curve.png`} alt="Training loss curve"
                className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm" />
              <figcaption className="text-sm text-zinc-400 mt-4">{t.trainCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ========== RECONSTRUCTION ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">03</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{t.reconTitle}</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">{t.reconDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="mt-12">
              <img src={`${BASE_PATH}/vae-images/vae-reconstruction.jpg`} alt="VAE reconstruction"
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800" />
              <figcaption className="text-sm text-zinc-400 mt-4">{t.reconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ========== KEY DESIGN NOTES ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400">04</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{t.noteTitle}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              {t.notes.map((note, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5 text-lg font-black text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-all duration-500">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{note.label}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{note.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== BLOG LINK ========== */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t.blogTitle}</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10">{t.blogDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <Link href="/blog/vae-1-introduction"
              className="group relative block p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-700 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              <div className="relative z-10 flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                  <VAEIcon size="sm" className="grayscale dark:grayscale-0 dark:brightness-200 group-hover:brightness-0 group-hover:invert transition-all duration-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500 mb-2">{t.blogCardTitle}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-300 transition-colors duration-500 leading-relaxed">{t.blogCardDesc}</p>
                </div>
                <div className="ml-auto shrink-0 w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-zinc-400">
            {lang === "zh" ? "基于 PyTorch · MNIST 数据集 · 100 轮训练 · 开源代码" : "Built with PyTorch · MNIST dataset · 100 epochs · Open source"}
          </p>
        </div>
      </section>
    </div>
  );
}
