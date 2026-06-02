"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/language-context";

const translations = {
  zh: {
    section: "Projects",
    title: "项目经历",
    subtitle: "个人项目与实验作品。",
    projects: [
      {
        title: "VAE 原理学习与可视化",
        desc: "VAE 原理学习与可视化实验，理解变分自编码器的编码-解码过程。掌握 ELBO 损失函数和重参数化技巧。",
        tag: "Deep Learning",
        icon: "🧠",
      },
      {
        title: "VAE 彩色图像优化",
        desc: "在基础 VAE 上进行彩色图像生成优化，提升重建质量。实验不同网络结构和损失函数的组合效果。",
        tag: "Deep Learning",
        icon: "🎨",
      },
      {
        title: "Flask 智能课表助手",
        desc: "基于 Flask + Ollama 本地大模型的智能课表管理工具，支持自然语言指令增删查改课表。",
        tag: "Web App",
        icon: "📅",
      },
    ],
  },
  en: {
    section: "Projects",
    title: "Projects",
    subtitle: "Personal projects and experimental works.",
    projects: [
      {
        title: "VAE Understanding & Visualization",
        desc: "Learning VAE principles through visualization experiments. Mastering the encoder-decoder process, ELBO loss function, and reparameterization trick.",
        tag: "Deep Learning",
        icon: "🧠",
      },
      {
        title: "VAE Color Image Optimization",
        desc: "Optimizing color image generation on top of the basic VAE to improve reconstruction quality. Experimenting with different network architectures and loss function combinations.",
        tag: "Deep Learning",
        icon: "🎨",
      },
      {
        title: "Flask Smart Timetable Assistant",
        desc: "A smart timetable management tool based on Flask + Ollama local LLM, supporting natural language commands for CRUD operations.",
        tag: "Web App",
        icon: "📅",
      },
    ],
  },
};

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
        <span className="inline-block w-[3px] h-[1em] bg-emerald-500 dark:bg-emerald-400 ml-1 align-middle animate-pulse rounded-full" />
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
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
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

export default function Projects() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <ProjectsWelcome onEnter={() => setEntered(true)} />;
  }

  return <ProjectsContent />;
}

function ProjectsWelcome({ onEnter }: { onEnter: () => void }) {
  const { lang } = useLang();
  const mainText = lang === "zh" ? "这里是慕安延的项目空间" : "This is Muanyan's Project Space";
  const subText = lang === "zh" ? "Welcome to Muanyan's Projects" : "Welcome to Muanyan's Projects";
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
        <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-rose-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
              className="px-10 py-4 text-base font-medium bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
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

function ProjectsContent() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div className="pt-12 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              {t.section}
            </h2>
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-300">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {t.projects.map((project, index) => (
            <div key={index} className="group h-full">
              <div className="h-full p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl">{project.icon}</span>
                  <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    {project.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-4">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
