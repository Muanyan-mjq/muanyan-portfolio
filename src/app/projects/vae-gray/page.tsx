"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { VAEIcon } from "@/components/vae-icon";
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

/* ---------- i18n ---------- */
const t = {
  zh: {
    back: "← 项目列表",
    tag: "PyTorch · MNIST",
    heroTitle: "变分自编码器",
    heroSub: "从数学直觉到可运行的生成模型",
    heroDesc: "只用 4 个数字表示一张 784 像素的手写数字。压缩比 196:1。这不是魔术，是信息瓶颈迫使编码器学习数字最本质的特征——笔画走向、弧度、粗细。",
    btnBlog: "阅读完整博客 →",
    btnCode: "GitHub 源码",
    secArch: "架构",
    archHead: "28×28 → 4-dim → 28×28",
    archBody: "编码器将输入图像逐层压缩，经三层卷积后展平为 μ 和 σ，重参数化采样得到潜在向量 z。解码器从这 4 个数字出发，逐层上采样，重建出与原图几乎一致的输出。",
    steps: [
      { label: "Encoder", detail: "3×Conv2d + BatchNorm + LeakyReLU", arrow: "28×28 → 14×14 → 7×7 → FC → μ, log σ²" },
      { label: "Reparameterize", detail: "z = μ + σ ⊙ ε,  ε ~ N(0,1)", arrow: "分离随机性，梯度可流通" },
      { label: "Decoder", detail: "FC → 3×ConvTranspose2d + Sigmoid", arrow: "4-dim → 7×7 → 14×14 → 28×28" },
    ],
    secTrain: "训练",
    trainHead: "MSE + KL 散度，100 轮",
    trainBody: "重构损失保证输出像原图，KL 散度把潜在空间约束到标准正态分布。两者在 ELBO 框架下联合优化，共同训练编码器和解码器。",
    trainCaption: "Loss 从 50+ 降至 30 以下",
    secRecon: "重建",
    reconHead: "训练 90 轮后的重建效果",
    reconBody: "上排是原始 MNIST 手写数字，下排是 VAE 的输出。两者之间的差异肉眼几乎不可分辨。",
    reconCaption: "原始（上） vs 重建（下）",
    secDesign: "三个关键设计",
    cards: [
      { n: "01", title: "重参数化", body: "把采样操作从计算图中分离。z = μ + σ·ε，其中 ε 是外部随机噪声。反向传播时梯度只走到 μ 和 σ，随机性不阻塞梯度流。" },
      { n: "02", title: "ELBO 损失", body: "Evidence Lower Bound = 重构项 − KL 项。重构项拉大不同图片的 z 距离，KL 项把所有 z 约束到 N(0,1)。两者对抗，平衡点就是好的潜在空间。" },
      { n: "03", title: "4 维瓶颈", body: "784 像素 → 4 个数字。信息瓶颈是 VAE 的精髓——维度太小，编码器不能死记硬背，必须提取笔画结构、数字类别这样的高级抽象特征。" },
    ],
    secBlog: "完整技术细节请阅读博客",
    blogTitle: "VAE 学习笔记（一）：从直觉到实现",
    blogDesc: "编码器/解码器架构、重参数化技巧、ELBO 损失函数推导、100 轮训练全流程",
    footer: "Built with PyTorch · MNIST · 100 epochs · Open Source",
  },
  en: {
    back: "← Projects",
    tag: "PyTorch · MNIST",
    heroTitle: "Variational Autoencoder",
    heroSub: "From mathematical intuition to a working generative model",
    heroDesc: "Four numbers to represent a 784-pixel handwritten digit. A 196:1 compression ratio. It's not magic — the information bottleneck forces the encoder to learn what truly defines a digit: stroke direction, curvature, thickness.",
    btnBlog: "Read Full Blog →",
    btnCode: "GitHub Source",
    secArch: "Architecture",
    archHead: "28×28 → 4-dim → 28×28",
    archBody: "The encoder progressively compresses the input through three convolutional layers, flattens it into μ and σ, then samples a latent vector z via reparameterization. The decoder takes those four numbers and upsamples layer by layer to reconstruct an almost-identical output.",
    steps: [
      { label: "Encoder", detail: "3×Conv2d + BatchNorm + LeakyReLU", arrow: "28×28 → 14×14 → 7×7 → FC → μ, log σ²" },
      { label: "Reparameterize", detail: "z = μ + σ ⊙ ε,  ε ~ N(0,1)", arrow: "Decouples randomness from gradient flow" },
      { label: "Decoder", detail: "FC → 3×ConvTranspose2d + Sigmoid", arrow: "4-dim → 7×7 → 14×14 → 28×28" },
    ],
    secTrain: "Training",
    trainHead: "MSE + KL Divergence, 100 Epochs",
    trainBody: "Reconstruction loss ensures the output looks like the original. KL divergence constrains the latent space toward a standard normal distribution. Both are jointly optimized under the ELBO framework, training encoder and decoder simultaneously.",
    trainCaption: "Loss drops from 50+ to below 30",
    secRecon: "Reconstruction",
    reconHead: "Results after 90 epochs",
    reconBody: "Top row: original MNIST digits. Bottom row: VAE reconstructions. The difference is nearly imperceptible to the human eye.",
    reconCaption: "Original (top) vs Reconstructed (bottom)",
    secDesign: "Three Key Design Decisions",
    cards: [
      { n: "01", title: "Reparameterization", body: "Separating the sampling operation from the computation graph. z = μ + σ·ε with external noise ε. Gradients flow to μ and σ during backprop — randomness never blocks the path." },
      { n: "02", title: "ELBO Loss", body: "Evidence Lower Bound = reconstruction term − KL term. The reconstruction term spreads different images' z apart while the KL term pulls all z toward N(0,1). Their equilibrium defines a good latent space." },
      { n: "03", title: "4-dim Bottleneck", body: "784 pixels → 4 numbers. The bottleneck is the essence of VAE — with so few dimensions, the encoder cannot memorize. It must extract high-level abstractions: stroke structure, digit class, writing style." },
    ],
    secBlog: "Full technical details in the blog post",
    blogTitle: "VAE Notes (1): From Intuition to Implementation",
    blogDesc: "Encoder/decoder architecture, reparameterization trick, ELBO loss derivation, full 100-epoch training pipeline",
    footer: "Built with PyTorch · MNIST · 100 epochs · Open Source",
  },
};

export default function VAEGrayPage() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <main className="bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
        {/* Dot grid — right side only */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04] dark:opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-0">
          <Reveal>
            <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-16">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {c.back}
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_360px] gap-16 items-start">
            <div>
              <Reveal delay={100}>
                <div className="flex items-center gap-3 mb-10">
                  <VAEIcon size="sm" className="grayscale dark:brightness-200" />
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">{c.tag}</span>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-black tracking-tighter leading-[0.92] mb-6">
                  {c.heroTitle}
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
                  <Link href="/blog/vae-1-introduction"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-300 hover:-translate-y-0.5">
                    {c.btnBlog}
                  </Link>
                  <a href="https://github.com/Muanyan-mjq/The_simple_vae" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-semibold rounded-xl hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {c.btnCode}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: architecture stack */}
            <Reveal delay={600}>
              <div className="hidden lg:flex flex-col gap-3 pt-8">
                {c.steps.map((step, i) => (
                  <div key={i} className="group relative">
                    {i < 2 && <div className="absolute left-1/2 -bottom-[15px] w-px h-3 bg-zinc-200 dark:bg-zinc-800 z-0" />}
                    <div className="relative p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-x-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">{i + 1}</span>
                        <span className="text-sm font-bold">{step.label}</span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 leading-relaxed">{step.arrow}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ TRAINING ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secTrain}</span>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 mt-8">
            <Reveal delay={100}>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{c.trainHead}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{c.trainBody}</p>
            </Reveal>
            <Reveal delay={200}>
              <figure>
                <img src={`${BASE_PATH}/vae-images/vae-loss-curve.png`} alt="Loss curve"
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm" />
                <figcaption className="text-[11px] text-zinc-400 mt-3">{c.trainCaption}</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ RECONSTRUCTION ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secRecon}</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-4 mb-4">{c.reconHead}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg">{c.reconBody}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="mt-10">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <img src={`${BASE_PATH}/vae-images/vae-reconstruction.jpg`} alt="VAE reconstruction" className="w-full" />
              </div>
              <figcaption className="text-[11px] text-zinc-400 mt-3">{c.reconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ═══ THREE DESIGN CARDS ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">{c.secDesign}</span>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {c.cards.map((card, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1">
                  <span className="text-4xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors duration-500">{card.n}</span>
                  <h3 className="text-lg font-bold mt-4 mb-3">{card.title}</h3>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG LINK ═══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">{c.secBlog}</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/blog/vae-1-introduction"
              className="group block p-10 md:p-14 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-zinc-900 dark:bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className="relative z-10 flex flex-wrap items-center gap-6 md:gap-10">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                  <VAEIcon size="sm" className="grayscale dark:brightness-200 group-hover:brightness-0 group-hover:invert transition-all duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-white dark:group-hover:text-zinc-900 transition-colors duration-500 mb-1">{c.blogTitle}</h3>
                  <p className="text-sm text-zinc-500 group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors duration-500">{c.blogDesc}</p>
                </div>
                <div className="w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-400">{c.footer}</p>
          <Link href="/projects" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">{c.back}</Link>
        </div>
      </footer>
    </main>
  );
}
