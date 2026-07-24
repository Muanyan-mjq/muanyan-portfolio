"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";

interface ExpandableCodeProps {
  children: string;
  title?: string;
  language?: string;
  previewLines?: number;
}

/**
 * 可展开代码块 — 超过 previewLines 行时默认折叠，点按钮展开
 * 用在博客文章中展示长代码段，避免页面滚动过长
 * title 可选：显示在代码块上方的标签文字
 */
export function ExpandableCode({ children: code, title, language = "python", previewLines = 25 }: ExpandableCodeProps) {
  const lines = code.split("\n").length;
  const isLong = lines > previewLines;
  const [expanded, setExpanded] = useState(false);

  // 标签（有 title 才渲染）
  const titleLabel = title ? (
    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2 mt-6">{title}</p>
  ) : null;

  if (!isLong) {
    return (
      <>
        {titleLabel}
        <CodeBlock language={language}>{code}</CodeBlock>
      </>
    );
  }

  return (
    <div className="relative my-6">
      {titleLabel}
      <div className={!expanded ? "relative" : ""} style={!expanded ? { maxHeight: `${previewLines * 28}px`, overflow: "hidden" } : undefined}>
        <CodeBlock language={language}>{code}</CodeBlock>
        {!expanded && (
          <>
            {/* 渐变遮罩 */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none rounded-b-xl"
              style={{
                height: "120px",
                background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,1) 100%)",
              }}
            />
            {/* 暗色模式遮罩 */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none rounded-b-xl hidden dark:block"
              style={{
                height: "120px",
                background: "linear-gradient(to bottom, transparent 0%, rgba(24,24,27,0.85) 40%, rgba(24,24,27,1) 100%)",
              }}
            />
          </>
        )}
      </div>

      {!expanded && (
        <div className="flex justify-center -mt-2 relative z-10">
          <button
            onClick={() => setExpanded(true)}
            className="px-5 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-md hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
          >
            展开完整代码（共 {lines} 行）
            <svg className="w-4 h-4 ml-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {expanded && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setExpanded(false)}
            className="px-4 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            收起代码
            <svg className="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
