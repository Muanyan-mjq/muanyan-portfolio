"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/components/language-context";
import { WelcomeLayout } from "@/components/welcome-layout";
import { TypewriterText } from "@/components/typewriter-text";
import { PremiumButton } from "@/components/premium-button";
import { VAEIcon } from "@/components/vae-icon";
import { BASE_PATH } from "@/lib/base-path";

const translations = {
  zh: {
    section: "项目经历",
    title: "项目经历",
    subtitle: "个人项目与实验作品。",
    projects: [
      {
        title: "VAE 灰度数字生成",
        desc: "从零开始理解变分自编码器——编码器/解码器架构、重参数化技巧、ELBO 损失函数。100 轮训练，从噪声到清晰数字的全过程。",
        tag: "深度学习",
        icon: "vae-bw",
        link: "/projects/vae-gray",
      },
      {
        title: "VAE 彩色图像与优化",
        desc: "一次经典调试：随机染色失败→根因分析→按类修复→loss 降 25.6%。BCE、β-VAE、KL 预热、余弦退火——完整训练优化工具箱。",
        tag: "深度学习",
        icon: "vae-color",
        link: "/projects/vae-color",
      },
      {
        title: "Flask 智能课表助手",
        desc: "基于 Flask + Ollama 本地大模型的智能课表管理工具，支持自然语言指令增删查改课表。",
        tag: "网页应用",
        icon: "📅",
      },
      {
        title: "随心耶",
        desc: "日记书写 + 专注计时 + 塔罗/八字/星座，Flutter 开发的个人 App。",
        tag: "独立开发",
        icon: "sui_xin_ye",
        link: "/projects/flowdiary",
      },
      {
        title: "DeepSeek Monitor",
        desc: "基于 Tauri 2 + React + Rust 的 Windows 桌面应用，实时监控 DeepSeek API 用量。7 套主题配色，系统托盘驻留。",
        tag: "桌面应用",
        icon: "deepseek-monitor",
        link: "/projects/deepseek-monitor",
      },
    ],
  },
  en: {
    section: "Projects",
    title: "Projects",
    subtitle: "Personal projects and experimental works.",
    projects: [
      {
        title: "VAE Grayscale Digit Generation",
        desc: "Understanding VAE from scratch: encoder-decoder architecture, reparameterization trick, ELBO loss. Full 100-epoch training journey from noise to clear digits.",
        tag: "Deep Learning",
        icon: "vae-bw",
        link: "/projects/vae-gray",
      },
      {
        title: "VAE Color Images & Optimization",
        desc: "A classic debugging story: random coloring failure → root cause analysis → per-class fix → 25.6% loss reduction. Full optimization toolkit included.",
        tag: "Deep Learning",
        icon: "vae-color",
        link: "/projects/vae-color",
      },
      {
        title: "Flask Smart Timetable Assistant",
        desc: "A smart timetable management tool based on Flask + Ollama local LLM, supporting natural language commands for CRUD operations.",
        tag: "Web App",
        icon: "📅",
      },
      {
        title: "Flowdiary",
        desc: "A personal app with journaling, focus timer, and Tarot / BaZi / Zodiac. Built with Flutter.",
        tag: "Solo",
        icon: "sui_xin_ye",
        link: "/projects/flowdiary",
      },
      {
        title: "DeepSeek Monitor",
        desc: "A Windows desktop app built with Tauri 2 + React + Rust for real-time DeepSeek API usage monitoring. 7 themes, system tray integration.",
        tag: "Desktop App",
        icon: "deepseek-monitor",
        link: "/projects/deepseek-monitor",
      },
    ],
  },
};

export default function Projects() {
  // 初始状态固定为 false，避免服务端/客户端 hydration 不一致
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.removeItem("projects-entered");
    if (sessionStorage.getItem("projects-entered") === "true") {
      setEntered(true);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!entered) {
    return <ProjectsWelcome onEnter={() => { sessionStorage.setItem("projects-entered", "true"); setEntered(true); }} />;
  }

  return <ProjectsContent />;
}

// 项目背景浮动词 — 项目经历 + 技术栈
const projectBgWords = [
  // VAE 项目
  "VAE", "彩色生成", "MNIST", "CIFAR-10", "CelebA", "重建质量",
  "编码器", "解码器", "潜在空间", "ELBO", "重参数化", "KL散度",
  // Flask 课表
  "Flask", "Ollama", "qwen2", "课表管理", "自然语言", "RESTful API",
  // 技术栈
  "PyTorch", "TensorFlow", "CNN", "RNN", "GAN", "Transformer",
  // 工程
  "Git", "GitHub", "Linux", "Docker", "SSH", "VS Code",
  // 前端
  "Next.js", "React", "Tailwind CSS", "TypeScript", "MDX", "Vercel",
  // DeepSeek Monitor
  "Tauri 2", "Rust", "WebView2", "DeepSeek API", "系统托盘", "主题系统",
];

function ProjectsWelcome({ onEnter }: { onEnter: () => void }) {
  const { lang } = useLang();
  const mainText = lang === "zh" ? "欢迎来到慕安延的项目空间" : "Welcome to Muanyan's Project Space";
  const subText = lang === "zh" ? "PROJECT SPACE" : "PROJECT SPACE";
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSub(true), mainText.length * 80 + 400);
    const t2 = setTimeout(() => setShowBtn(true), mainText.length * 80 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mainText]);

  return (
    <WelcomeLayout bgWords={projectBgWords}>
      <div className="welcome-pre">{subText}</div>
      <h1 className="welcome-h1">
        <TypewriterText text={mainText} speed={80} cursor={true} />
      </h1>
      {showSub && (
        <div className="welcome-en">
          <TypewriterText text={lang === "zh" ? "Welcome to Muanyan's Project Space" : "Welcome to Muanyan's Project Space"} speed={60} cursor={false} />
        </div>
      )}
      {!showSub && <div className="welcome-en" style={{ opacity: 0 }}>&nbsp;</div>}
      <button
        onClick={onEnter}
        className="welcome-btn"
        style={{
          opacity: showBtn ? 1 : 0,
          transform: showBtn ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease-out",
        }}
      >
        <span>{lang === "zh" ? "欢 迎 进 入" : "Welcome In"}<span className="arrow">→</span></span>
      </button>
      {!showBtn && <div style={{ height: 60 }} />}
    </WelcomeLayout>
  );
}

function ProjectsContent() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div className="pt-12 pb-24 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              {t.section}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
            {t.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t.projects.map((project, index) => {
            const cardContent = (
              <div className="h-full p-5 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-5 sm:mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  {project.icon === "vae-bw" ? (
                    <VAEIcon size="lg" className="grayscale" />
                  ) : project.icon === "vae-color" ? (
                    <VAEIcon size="lg" />
                  ) : project.icon === "sui_xin_ye" ? (
                    <img src={`${BASE_PATH}/sui_xin_ye_icon.png`} alt="随心耶" className="w-20 h-20 rounded-xl object-contain" />
                  ) : project.icon === "deepseek-monitor" ? (
                    <div className="h-20 flex items-center">
                      <img src={`${BASE_PATH}/deepseek-monitor/deepseek-color.png`} alt="DeepSeek Monitor" className="w-16 h-16 rounded-xl object-contain" />
                    </div>
                  ) : (
                    <span className="text-4xl sm:text-5xl">{project.icon}</span>
                  )}
                  <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    {project.tag}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 sm:mb-4">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
                  {project.desc}
                </p>
              </div>
            );

            if ("link" in project && project.link) {
              return (
                <Link key={index} href={project.link} className="group h-full block">
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={index} className="group h-full">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
