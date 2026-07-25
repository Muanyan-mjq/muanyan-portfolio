"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { VAEIcon } from "@/components/vae-icon";
import { BASE_PATH } from "@/lib/base-path";

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

function SectionLabel({ children, color = "indigo" }: { children: string; color?: "indigo" | "blue" | "purple" | "pink" }) {
  const colors = {
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
}

function VAEArchFlow() {
  const { lang } = useLang();
  const nodes = [
    { labelEn: "Encoder", labelZh: "\u7F16\u7801\u5668", dimIn: "28x28", dimOut: "\u03BC, log \u03C3\u00B2", color: "blue" },
    { labelEn: "Latent Space", labelZh: "\u6F5C\u5728\u7A7A\u95F4", dimIn: "z ~ N(\u03BC, \u03C3\u00B2)", dimOut: "4 / 16 dim", color: "purple" },
    { labelEn: "Decoder", labelZh: "\u89E3\u7801\u5668", dimIn: "4 / 16 dim", dimOut: "28x28 / RGB", color: "pink" },
  ];
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-8">
      {nodes.map((node, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <>
              <div className="relative w-12 md:w-20 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full md:block hidden">
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-lg" style={{ animation: "flow-dot 2.5s ease-in-out infinite", animationDelay: `${i * 0.6}s` }} />
              </div>
              <div className="md:hidden text-xl text-indigo-400">&darr;</div>
            </>
          )}
          <div className="group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-700" />
            <div className="relative w-36 h-24 md:w-44 md:h-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-lg mb-1">
                {node.color === "blue" ? "\u{1F535}" : node.color === "purple" ? "\u{1F7E3}" : "\u{1FA77}"}
              </span>
              <span className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200">{lang === "zh" ? node.labelZh : node.labelEn}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">{node.dimIn}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">&rarr; {node.dimOut}</span>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function ExperimentRow({ exp, lang }: { exp: { key: string; valLoss: string; color: boolean; note: string }; lang: "zh" | "en" }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/15 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 text-sm">
        {exp.key}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{exp.valLoss}</span>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${exp.color ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {exp.color ? (lang === "zh" ? "\u2713 \u8272\u5F69\u6B63\u5E38" : "\u2713 Color OK") : (lang === "zh" ? "\u2717 \u7070\u8272\u8F93\u51FA" : "\u2717 Grayscale")}
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{exp.note}</p>
      </div>
    </div>
  );
}

const T = {
  zh: {
    heroTitle: "VAE \u9879\u76EE",
    heroTagline: "\u53D8\u5206\u81EA\u7F16\u7801\u5668 \u2014 \u4ECE\u539F\u7406\u5230\u5B9E\u8DF5",
    heroDesc: "\u901A\u8FC7\u53EF\u89C6\u5316\u5B9E\u9A8C\u6DF1\u5165\u7406\u89E3 VAE \u7684\u5DE5\u4F5C\u539F\u7406\u3002\u4ECE\u624B\u5199\u6570\u5B57\u91CD\u5EFA\u5230\u5F69\u8272\u56FE\u50CF\u751F\u6210\uFF0C\u5C55\u793A\u7F16\u7801\u5668-\u89E3\u7801\u5668\u67B6\u6784\u3001\u91CD\u53C2\u6570\u5316\u6280\u5DE7\u548C ELBO \u635F\u5931\u51FD\u6570\u7684\u5B8C\u6574\u8BAD\u7EC3\u6D41\u7A0B\u3002",
    heroBlog1: "\u9605\u8BFB\u535A\u5BA2\uFF1A\u539F\u7406\u7BC7",
    heroBlog2: "\u9605\u8BFB\u535A\u5BA2\uFF1A\u5F69\u8272\u4F18\u5316\u7BC7",
    heroGH: "GitHub \u6E90\u7801",
    flowTitle: "VAE \u5DE5\u4F5C\u6D41\u7A0B",
    flowDesc: "\u4E00\u5F20\u56FE\u7247\u5148\u88AB\u7F16\u7801\u5668\u538B\u7F29\u6210\u6F5C\u5728\u7A7A\u95F4\u4E2D\u7684\u4E00\u4E2A\u5C0F\u5411\u91CF\uFF0C\u518D\u4ECE\u8FD9\u4E2A\u5C0F\u5411\u91CF\u901A\u8FC7\u89E3\u7801\u5668\u8FD8\u539F\u6210\u65B0\u56FE\u7247\u3002\u8BAD\u7EC3\u5B8C\u6210\u540E\uFF0C\u5728\u6F5C\u5728\u7A7A\u95F4\u4E2D\u968F\u673A\u91C7\u6837\uFF0C\u5C31\u80FD\u751F\u6210\u5168\u65B0\u7684\u56FE\u50CF\u3002",
    trainTitle: "\u8BAD\u7EC3\u8FC7\u7A0B",
    trainDesc: "\u8BAD\u7EC3\u5FAA\u73AF\uFF1A\u524D\u5411\u4F20\u64AD \u2192 \u8BA1\u7B97\u635F\u5931\uFF08MSE + KL \u6563\u5EA6\uFF09\u2192 \u53CD\u5411\u4F20\u64AD \u2192 \u66F4\u65B0\u6743\u91CD\u3002\u7ECF\u8FC7 100 \u8F6E\u8BAD\u7EC3\uFF0CLoss \u4ECE 50+ \u7A33\u6B65\u964D\u81F3 30 \u4EE5\u4E0B\u3002",
    trainLossCaption: "\u25B4 \u8BAD\u7EC3\u8FC7\u7A0B\u4E2D\u7684 Loss \u4E0B\u964D\u66F2\u7EBF\uFF08MSE + KL\uFF09",
    reconTitle: "\u91CD\u5EFA\u6548\u679C",
    reconDesc: "\u4E0A\u56FE\u662F\u539F\u59CB MNIST \u624B\u5199\u6570\u5B57\uFF0C\u4E0B\u56FE\u662F VAE \u91CD\u5EFA\u7ED3\u679C\u3002\u7ECF\u8FC7 90 \u8F6E\u8BAD\u7EC3\u540E\uFF0C\u91CD\u5EFA\u56FE\u50CF\u51E0\u4E4E\u4E0E\u539F\u59CB\u56FE\u50CF\u4E00\u81F4\u3002",
    reconCaption: "\u25B4 VAE \u91CD\u5EFA\u5BF9\u6BD4\uFF1A\u4E0A\u6392\u539F\u56FE\uFF0C\u4E0B\u6392\u91CD\u5EFA",
    colorTitle: "\u5F69\u8272\u56FE\u50CF\u5B9E\u9A8C",
    colorDesc: "\u5728\u57FA\u7840 VAE \u4E0A\u6269\u5C55\u5230 3 \u901A\u9053 RGB\uFF0C\u7ECF\u5386\u4E86\u4E00\u6B21\u7ECF\u5178\u7684\u2018\u6A21\u578B\u7B97\u8D26\u2019\u5F0F\u8C03\u8BD5\u8FC7\u7A0B\uFF1A",
    colorExpTableTitle: "\u25B4 \u5B9E\u9A8C\u8BB0\u5F55\u603B\u89C8",
    colorExp1Note: "\u968F\u673A\u67D3\u8272 \u2192 \u6A21\u578B\u81EA\u9002\u5E94\u5FFD\u7565\u989C\u8272\u566A\u58F0\uFF0C\u5168\u8F93\u51FA\u7070\u5EA6",
    colorExp2Note: "\u6309\u7C7B\u67D3\u8272 + BCE \u66FF\u4EE3 MSE\uFF0C\u989C\u8272\u6210\u529F\u8F93\u51FA",
    colorExp3Note: "latent_size 8\u219216 + \u03B2 0.1\u21920.05\uFF0C\u7CBE\u5EA6\u8FDB\u4E00\u6B65\u63D0\u5347",
    colorExpDesc: "\u6700\u5173\u952E\u7684\u6559\u8BAD\uFF1A\u6A21\u578B\u4E0D\u662F\u4E0D\u60F3\u5B66\u989C\u8272\uFF0C\u800C\u662F\u989C\u8272\u4F5C\u4E3A\u968F\u673A\u566A\u58F0\u5728 Loss \u4E2D\u7684\u6743\u91CD\u53EA\u6709 0.6%\uFF0C\u6700\u4F18\u7B56\u7565\u5C31\u662F\u5FFD\u7565\u5B83\u3002\u7ED1\u5B9A\u989C\u8272\u5230\u6570\u5B57\u7C7B\u522B\u540E\uFF0C\u989C\u8272\u53D8\u6210\u8BED\u4E49\u4FE1\u53F7\uFF0C\u6A21\u578B\u81EA\u7136\u5B66\u4F1A\u4E86\u3002",
    colorReconCaption: "\u25B4 \u5F69\u8272 VAE \u91CD\u5EFA\u6548\u679C\uFF08\u5B9E\u9A8C #3\uFF09",
    toolkitTitle: "\u4F18\u5316\u5DE5\u5177\u7BB1",
    toolkitItems: [
      { name: "BCE \u66FF\u4EE3 MSE", desc: "BCE \u5728\u8FB9\u754C\u50CF\u7D20\u5904\u68AF\u5EA6\u66F4\u5C16\u9510\uFF0C\u907F\u514D MSE \u7684\u7070\u8272\u96FE\u6548\u5E94" },
      { name: "\u03B2 \u7CFB\u6570 + KL \u9884\u70ED", desc: "\u03B2=0.05 \u63A7\u5236\u91CD\u5EFA/KL \u6743\u91CD\u6BD4\uFF0C\u524D 20 \u8F6E\u6E10\u8FDB\u5F15\u5165 KL \u7EA6\u675F" },
      { name: "\u4F59\u5F26\u9000\u706B\u5B66\u4E60\u7387", desc: "\u4ECE 0.001 \u5E73\u6ED1\u964D\u81F3 1e-5\uFF0C\u524D\u671F\u5927\u6B65\u5FEB\u8D70\u3001\u540E\u671F\u7CBE\u7EC6\u8C03\u6574" },
      { name: "\u81EA\u9002\u5E94\u68AF\u5EA6\u88C1\u526A", desc: "EMA \u52A8\u6001\u9608\u503C\uFF0C\u5F53\u524D\u68AF\u5EA6\u8D85\u8FC7\u5386\u53F2\u5747\u503C 5 \u500D\u65F6\u624D\u88C1\u5207" },
      { name: "\u65E9\u505C + \u9A8C\u8BC1\u96C6", desc: "val_loss \u8FDE\u7EED 10 \u8F6E\u4E0D\u521B\u65B0\u4F4E\u81EA\u52A8\u505C\u6B62\uFF0C\u907F\u514D\u8FC7\u62DF\u5408" },
    ],
    blogTitle: "\u6DF1\u5165\u5B66\u4E60",
    blogDesc: "\u9879\u76EE\u9875\u9762\u662F\u5FEB\u901F\u6982\u89C8\u3002\u5B8C\u6574\u7684\u6280\u672F\u7EC6\u8282\u3001\u6570\u5B66\u63A8\u5BFC\u548C\u4EE3\u7801\u5B9E\u73B0\u8BF7\u9605\u8BFB\u535A\u5BA2\uFF1A",
    blog1Title: "VAE \u5B66\u4E60\u7B14\u8BB0\uFF08\u4E00\uFF09\uFF1A\u4ECE\u76F4\u89C9\u5230\u5B9E\u73B0",
    blog1Desc: "\u7F16\u7801\u5668/\u89E3\u7801\u5668\u67B6\u6784\u3001\u91CD\u53C2\u6570\u5316\u6280\u5DE7\u3001ELBO \u635F\u5931\u51FD\u6570\u63A8\u5BFC\u3001100 \u8F6E\u8BAD\u7EC3\u5168\u6D41\u7A0B",
    blog2Title: "VAE \u5B66\u4E60\u7B14\u8BB0\uFF08\u4E8C\uFF09\uFF1A\u5F69\u8272\u56FE\u50CF\u4E0E\u4F18\u5316",
    blog2Desc: "3 \u901A\u9053\u6269\u5C55\u3001\u968F\u673A\u67D3\u8272\u5931\u8D25\u8C03\u8BD5\u3001\u6309\u7C7B\u67D3\u8272\u4FEE\u590D\u3001\u03B2-VAE \u4E0E\u4F18\u5316\u5DE5\u5177\u7BB1",
    backToProjects: "\u2190 \u8FD4\u56DE\u9879\u76EE\u5217\u8868",
  },
  en: {
    heroTitle: "VAE Project",
    heroTagline: "Variational Autoencoder \u2014 From Theory to Practice",
    heroDesc: "Deep dive into VAE through visualization experiments. From handwritten digit reconstruction to color image generation, this project demonstrates the full training pipeline of encoder-decoder architecture, reparameterization trick, and ELBO loss function.",
    heroBlog1: "Read Blog: Principles",
    heroBlog2: "Read Blog: Color Optimization",
    heroGH: "GitHub Source",
    flowTitle: "VAE Workflow",
    flowDesc: "An image is compressed by the encoder into a small vector in latent space, then reconstructed back by the decoder. Once trained, sampling randomly in latent space generates entirely new images.",
    trainTitle: "Training Process",
    trainDesc: "Core loop: forward pass \u2192 compute loss (MSE + KL divergence) \u2192 backward pass \u2192 update weights. Loss drops from 50+ to below 30 over 100 epochs.",
    trainLossCaption: "\u25B4 Training loss curve (MSE + KL) over epochs",
    reconTitle: "Reconstruction Results",
    reconDesc: "Top row: original MNIST digits. Bottom row: VAE reconstructions. After 90 epochs, reconstructions are nearly identical to originals.",
    reconCaption: "\u25B4 VAE reconstruction comparison: top original, bottom reconstructed",
    colorTitle: "Color Image Experiments",
    colorDesc: "Extending to 3-channel RGB sparked a classic debugging journey:",
    colorExpTableTitle: "\u25B4 Experiment log overview",
    colorExp1Note: "Random coloring \u2192 model adaptively ignores color noise, outputs grayscale only",
    colorExp2Note: "Per-class coloring + BCE replaces MSE, color successfully outputs",
    colorExp3Note: "latent_size 8\u219216 + \u03B2 0.1\u21920.05, precision further improved",
    colorExpDesc: "The key insight: the model wasn\u2019t refusing to learn color \u2014 it was doing cost-benefit analysis. Random color had 0.6% weight in the loss, so the optimal strategy was to ignore it. Binding color to digit class turned it into a semantic signal, and the model naturally learned.",
    colorReconCaption: "\u25B4 Color VAE reconstruction results (Experiment #3)",
    toolkitTitle: "Optimization Toolkit",
    toolkitItems: [
      { name: "BCE replaces MSE", desc: "Sharper gradients at boundary pixels, eliminates MSE\u2019s gray fog effect" },
      { name: "\u03B2 coefficient + KL warm-up", desc: "\u03B2=0.05 balances recon/KL weight, gradual KL introduction over 20 epochs" },
      { name: "Cosine annealing LR", desc: "Smooth decay from 0.001 to 1e-5, fast convergence then fine-tuning" },
      { name: "Adaptive gradient clipping", desc: "EMA dynamic threshold, clips only when gradient exceeds 5\u00D7 historical mean" },
      { name: "Early stopping + val set", desc: "Auto-stops when val_loss fails to improve for 10 consecutive epochs" },
    ],
    blogTitle: "Deep Dive",
    blogDesc: "This page is a quick overview. For full technical details, math derivations, and code:",
    blog1Title: "VAE Notes (1): From Intuition to Implementation",
    blog1Desc: "Encoder/decoder architecture, reparameterization trick, ELBO loss derivation, full 100-epoch training",
    blog2Title: "VAE Notes (2): Color Images & Optimization",
    blog2Desc: "3-channel extension, random coloring failure debug, per-class coloring fix, \u03B2-VAE and optimization toolkit",
    backToProjects: "\u2190 Back to Projects",
  },
};

export default function VAEPage() {
  const { lang } = useLang();
  const t = T[lang];

  const experiments = [
    { key: "#1", valLoss: "302.23", color: false, note: lang === "zh" ? T.zh.colorExp1Note : T.en.colorExp1Note },
    { key: "#2", valLoss: "252.35", color: true, note: lang === "zh" ? T.zh.colorExp2Note : T.en.colorExp2Note },
    { key: "#3", valLoss: "224.80", color: true, note: lang === "zh" ? T.zh.colorExp3Note : T.en.colorExp3Note },
  ];

  const tkColors = [
    "bg-amber-50 dark:bg-amber-950/20", "bg-emerald-50 dark:bg-emerald-950/20",
    "bg-sky-50 dark:bg-sky-950/20", "bg-violet-50 dark:bg-violet-950/20",
    "bg-rose-50 dark:bg-rose-950/20",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-500/[0.08] via-purple-500/[0.04] to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <Reveal>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {t.backToProjects}
            </Link>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <VAEIcon size="md" />
                  <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                    PyTorch &middot; MNIST
                  </span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                  {t.heroTitle}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-xl md:text-2xl text-indigo-600 dark:text-indigo-300 font-medium mb-6">
                  {t.heroTagline}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-xl">
                  {t.heroDesc}
                </p>
              </Reveal>
              <Reveal delay={400}>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/blog/vae-1-introduction"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 text-sm shadow-lg shadow-zinc-900/10 dark:shadow-white/10">
                    {t.heroBlog1}
                  </Link>
                  <Link href="/blog/vae-2-color"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-300 text-sm shadow-lg shadow-indigo-500/25">
                    {t.heroBlog2}
                  </Link>
                  <a href="https://github.com/Muanyan-mjq/vae-color" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 transition-all duration-300 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    {t.heroGH}
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={500}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-pink-500/10 rounded-[2.5rem] blur-2xl" />
                <div className="relative p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
                  <VAEArchFlow />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Flow Details ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>{lang === "zh" ? "\u5DE5\u4F5C\u6D41\u7A0B" : "WORKFLOW"}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.flowTitle}</h2>
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{t.flowDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12">
              {[
                { label: "Encoder", stat: "28x28", to: "4-dim", desc: lang === "zh" ? "\u8F93\u5165\u56FE\u50CF\u538B\u7F29\u81F3 4 \u7EF4\u5411\u91CF" : "Input compressed to 4-dim vector" },
                { label: "Latent", stat: "N(0,1)", to: "z", desc: lang === "zh" ? "\u4ECE\u6807\u51C6\u6B63\u6001\u5206\u5E03\u91C7\u6837" : "Sampled from standard normal" },
                { label: "Decoder", stat: "4-dim", to: "28x28", desc: lang === "zh" ? "\u4ECE\u5411\u91CF\u8FD8\u539F\u5B8C\u6574\u56FE\u50CF" : "Reconstructed from vector" },
              ].map((item, i) => (
                <div key={i} className="text-center p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">{item.label}</div>
                  <div className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white font-mono mb-1">
                    {item.stat} <span className="text-indigo-500">&rarr;</span> {item.to}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Training ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel color="blue">{lang === "zh" ? "\u8BAD\u7EC3\u8FC7\u7A0B" : "TRAINING"}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.trainTitle}</h2>
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{t.trainDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="my-10">
              <img
                src={BASE_PATH + "/vae-images/vae-loss-curve.png"}
                alt="VAE training loss curve"
                className="rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-zinc-200 dark:border-zinc-800"
              />
              <figcaption className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-3">{t.trainLossCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ===== Reconstruction ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel color="purple">{lang === "zh" ? "\u91CD\u5EFA\u6548\u679C" : "RECONSTRUCTION"}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.reconTitle}</h2>
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{t.reconDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure className="my-10">
              <img
                src={BASE_PATH + "/vae-images/vae-reconstruction.jpg"}
                alt="VAE reconstruction comparison"
                className="rounded-2xl shadow-xl w-full border border-zinc-200 dark:border-zinc-800"
              />
              <figcaption className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-3">{t.reconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ===== Color Experiments ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel color="pink">{lang === "zh" ? "\u5F69\u8272\u5B9E\u9A8C" : "COLOR EXPERIMENTS"}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.colorTitle}</h2>
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{t.colorDesc}</p>
          </Reveal>
          <Reveal delay={150}>
            <div className="my-8 space-y-3">
              {experiments.map((exp) => (
                <ExperimentRow key={exp.key} exp={exp} lang={lang} />
              ))}
            </div>
            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">{t.colorExpTableTitle}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              {t.colorExpDesc}
            </p>
          </Reveal>
          <Reveal delay={250}>
            <figure className="my-10">
              <img
                src={BASE_PATH + "/vae-images/vae-color-reconstruction.png"}
                alt="Color VAE reconstruction"
                className="rounded-2xl shadow-xl w-full border border-zinc-200 dark:border-zinc-800"
              />
              <figcaption className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-3">{t.colorReconCaption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ===== Optimization Toolkit ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionLabel>{lang === "zh" ? "\u4F18\u5316\u5DE5\u5177\u7BB1" : "OPTIMIZATION TOOLKIT"}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.toolkitTitle}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {t.toolkitItems.map((item, i) => (
                <div key={item.name}
                  className={`group p-5 rounded-2xl ${tkColors[i]} hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">{i + 1}</span>
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">{item.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Blog Links ===== */}
      <section className="relative py-16 md:py-20 px-6 md:px-12 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t.blogTitle}</h2>
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 mb-10">{t.blogDesc}</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            <Reveal delay={100}>
              <Link href="/blog/vae-1-introduction"
                className="group relative block p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <span className="text-2xl text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500 mb-2">{t.blog1Title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-200 transition-colors duration-500">{t.blog1Desc}</p>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={200}>
              <Link href="/blog/vae-2-color"
                className="group relative block p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <span className="text-2xl text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-white transition-colors duration-500 mb-2">{t.blog2Title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-pink-200 transition-colors duration-500">{t.blog2Desc}</p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {lang === "zh"
              ? "\u57FA\u4E8E PyTorch \u00B7 MNIST \u6570\u636E\u96C6 \u00B7 100 \u8F6E\u8BAD\u7EC3 \u00B7 \u5F00\u6E90\u4EE3\u7801\u53EF\u5728 GitHub \u67E5\u770B"
              : "Built with PyTorch \u00B7 MNIST dataset \u00B7 100 epochs \u00B7 Open source on GitHub"}
          </p>
        </div>
      </section>
    </div>
  );
}
