"use client";

import { useEffect, useRef, useState } from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
}

/**
 * 代码块组件 — 使用 Shiki 语法高亮（VS Code 同款引擎）
 * 支持：Python, JavaScript, TypeScript, Bash, JSON 等
 */
export function CodeBlock({ children, language = "python" }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const result = await codeToHtml(children.trim(), {
          lang: language,
          theme: "one-dark-pro",
          transformers: [
            {
              pre(node) {
                // 移除默认的 style，用我们的 class
                if (node.properties.style) {
                  delete node.properties.style;
                }
                node.properties.class = "code-block-pre";
              },
            },
          ],
        });
        if (!cancelled) setHtml(result);
      } catch {
        // 降级：无高亮显示
        if (!cancelled) {
          setHtml(
            `<pre class="code-block-pre"><code>${children
              .trim()
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</code></pre>`
          );
        }
      }
    }

    highlight();
    return () => { cancelled = true; };
  }, [children, language, mounted]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper group my-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
      {/* 顶部栏：语言标签 + 复制按钮 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#282c34] border-b border-zinc-700">
        <div className="flex items-center gap-2">
          {/* 三个小圆点 */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-zinc-400 ml-2 font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* 代码内容 */}
      <div
        className="bg-[#282c34] overflow-x-auto [&_.code-block-pre]:!m-0 [&_.code-block-pre]:!rounded-none [&_.code-block-pre]:!border-0 [&_code]:!bg-transparent [&_code]:block [&_code]:p-4 [&_code]:text-[14px] [&_code]:leading-[1.75] [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html || `<pre class="code-block-pre"><code>${children.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>` }}
      />
    </div>
  );
}
