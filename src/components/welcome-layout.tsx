"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { BASE_PATH } from "@/lib/base-path";

interface WelcomeLayoutProps {
  children: React.ReactNode;
  /** 背景浮动文字列表 */
  bgWords?: string[];
}

/**
 * 欢迎页面共享布局
 * - 渐变背景 + 浮动背景文字 + 左上角座右铭 + 顶部导航
 */
export function WelcomeLayout({ children, bgWords = [] }: WelcomeLayoutProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current || bgWords.length === 0) return;
    const container = bgRef.current;
    container.innerHTML = "";

    const isMobile = window.innerWidth < 768;
    // 手机端只取一半文字，减少密度
    const words = isMobile ? bgWords.filter((_, i) => i % 2 === 0) : bgWords;
    const cols = isMobile ? 3 : 6;

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      const rows = Math.ceil(words.length / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const baseX = (col / cols) * 100 + 100 / cols / 2;
      const baseY = (row / rows) * 100 + 100 / rows / 2;
      span.style.left = `${baseX + (Math.random() - 0.5) * 10}%`;
      span.style.top = `${baseY + (Math.random() - 0.5) * 8}%`;
      span.style.fontSize = `${(isMobile ? 14 : 18) + Math.random() * (isMobile ? 8 : 14)}px`;
      span.style.opacity = `${0.1 + Math.random() * 0.08}`;
      span.style.animationDelay = `${Math.random() * 10}s`;
      span.style.animationDuration = `${8 + Math.random() * 12}s`;
      span.style.transform = `rotate(${-15 + Math.random() * 30}deg)`;
      container.appendChild(span);
    });
  }, [bgWords]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden welcome-bg"
      style={{
        fontFamily: "'Inter', 'Noto Sans SC', -apple-system, sans-serif",
      }}
    >
      {/* 浮动背景文字 */}
      <div ref={bgRef} className="bg-texts" />

      {/* 左上角座右铭 */}
      <div className="quote-tl">不要把梦想埋没！</div>

      {/* 居中内容 */}
      <div className="welcome-container">
        {children}
      </div>
    </div>
  );
}
