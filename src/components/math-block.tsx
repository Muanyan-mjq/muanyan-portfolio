"use client";

import { useEffect, useRef } from "react";

interface MathBlockProps {
  children: string;
  display?: boolean; // true = 块级公式（div），false = 行内公式（span）
}

/**
 * 数学公式渲染组件 — 使用 KaTeX
 * 用法：
 *   行内：<InlineMath>x^2 + y^2 = z^2</InlineMath>
 *   块级：<MathBlock>{"\\int_0^1 f(x) dx"}</MathBlock>
 */
export function MathBlock({ children, display = true }: MathBlockProps) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const katex = await import("katex");
        if (cancelled || !ref.current) return;
        katex.render(children, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [children, display]);

  // 块级用 div，行内用 span（避免 <div> 嵌套在 <p> 中的 HTML 错误）
  if (display) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="my-6 py-4 px-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-x-auto text-center"
      >
        {children}
      </div>
    );
  }

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="inline">
      {children}
    </span>
  );
}

export function InlineMath({ children }: { children: string }) {
  return <MathBlock display={false}>{children}</MathBlock>;
}
