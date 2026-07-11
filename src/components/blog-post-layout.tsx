"use client";

import { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { getAdjacentPosts, categories, type BlogPost } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const blogPostText = {
  zh: {
    back: "返回博客",
    toc: "目录",
    prerequisites: "前置知识",
    seriesNav: "系列文章",
    prev: "上一篇",
    next: "下一篇",
    share: "分享",
    copied: "已复制!",
    copyCode: "复制",
    readingTime: "分钟阅读",
    updated: "最后更新",
    copyright: "版权声明",
  },
  en: {
    back: "Back to Blog",
    toc: "Contents",
    prerequisites: "Prerequisites",
    seriesNav: "Series",
    prev: "Previous",
    next: "Next",
    share: "Share",
    copied: "Copied!",
    copyCode: "Copy",
    readingTime: "min read",
    updated: "Last updated",
    copyright: "Copyright",
  },
} as const;

interface BlogPostLayoutProps {
  children: ReactNode;
  post?: BlogPost;
  seriesPosts?: BlogPost[];
}

export function BlogPostLayout({ children, post, seriesPosts }: BlogPostLayoutProps) {
  const { lang } = useLang();
  const T = blogPostText[lang];
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const tocNavRef = useRef<HTMLElement>(null);

  const adjacentPosts = post ? getAdjacentPosts(post.slug) : { prev: null, next: null };
  const cat = post ? categories[post.category] : null;

  // 从内容中提取标题生成目录（useLayoutEffect 在 DOM 更新后同步执行，无延迟）
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll("h2, h3");
    if (headings.length === 0) return;

    const items: TocItem[] = [];
    const idCount: Record<string, number> = {};

    headings.forEach((h, index) => {
      // 优先保留 JSX 中手动设置的 id，没有才自动生成
      let baseId = h.id || h.textContent?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w一-鿿-]/g, "")
        .slice(0, 50) || `heading-${index}`;

      // 去重
      if (idCount[baseId]) {
        idCount[baseId]++;
        baseId = `${baseId}-${idCount[baseId]}`;
      } else {
        idCount[baseId] = 1;
      }

      h.id = baseId;
      (h as HTMLElement).style.scrollMarginTop = "90px";
      items.push({ id: baseId, text: h.textContent || "", level: h.tagName === "H2" ? 2 : 3 });
    });
    setToc(items);
  }, [lang]);

  // 滚动监听 — 当前章节标题高亮
  useEffect(() => {
    if (toc.length === 0 || !contentRef.current) return;

    const headings = Array.from(contentRef.current.querySelectorAll("h2, h3"));
    if (headings.length === 0) return;

    const HEADER_H = 90;
    let prev = "";

    const update = () => {
      let active = headings[0]?.id || "";

      // 从后往前：找第一个顶部已经超过 header 线的标题
      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].getBoundingClientRect().top <= HEADER_H + 6) {
          active = headings[i].id;
          break;
        }
      }

      if (active !== prev) {
        prev = active;
        setActiveId(active);
      }
    };

    // 直接用 scroll 事件（不用 RAF），响应更快
    window.addEventListener("scroll", update, { passive: true });
    setTimeout(update, 150);

    return () => {
      window.removeEventListener("scroll", update);
    };
  }, [toc]);

  // 活跃项变化时，目录自动滚动到可见位置
  useEffect(() => {
    if (!activeId || !tocNavRef.current) return;
    const activeLink = tocNavRef.current.querySelector(`[data-toc-id="${activeId}"]`);
    if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  // 代码复制功能
  useEffect(() => {
    if (!contentRef.current) return;
    const blocks = contentRef.current.querySelectorAll("pre");
    blocks.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;
      const btn = document.createElement("button");
      btn.setAttribute("data-copy-btn", "true");
      btn.textContent = T.copyCode;
      btn.className = "absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-md transition-all backdrop-blur-sm border border-white/10";
      btn.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || "";
        await navigator.clipboard.writeText(code);
        btn.textContent = T.copied;
        btn.className = btn.className.replace("text-white/70", "text-emerald-400");
        setTimeout(() => {
          btn.textContent = T.copyCode;
          btn.className = btn.className.replace("text-emerald-400", "text-white/70");
        }, 2000);
      };
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }, [T.copyCode, T.copied]);

  return (
    <>
      <div className="pt-2 pb-10 px-4 sm:px-5 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* 文章封面 Banner */}
          {post && (
            <div className={`w-full ${
"h-44 md:h-72"
            } rounded-2xl bg-gradient-to-br ${post.cover.gradient} flex items-center justify-center mb-6 relative overflow-hidden`}>
              {post.cover.image ? (
                <img src={`${BASE_PATH}${post.cover.image}`} alt="" className={`relative z-10 object-contain rounded-lg ${
                  post.slug.startsWith("vae") ? "w-32 md:w-48 h-28 md:h-40" : "w-[85%] md:w-[75%] h-auto max-h-[40vh]"
                }`} />
              ) : (
                <span className="text-8xl opacity-60 relative z-10">{post.cover.icon}</span>
              )}
              {post.series && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-semibold bg-black/30 backdrop-blur-sm text-white rounded-full">
                  {post.series.name[lang]} · {post.series.order}/{post.series.total}
                </span>
              )}
            </div>
          )}

          <div className="flex gap-12">
            {/* 左侧边栏 — 系列导航 + 目录 */}
            <aside className="hidden lg:block w-48 shrink-0">
              <div className="sticky top-20 space-y-8">
                {/* 系列导航 */}
                {seriesPosts && seriesPosts.length > 1 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      {T.seriesNav}
                    </p>
                    <nav className="flex flex-col gap-0.5">
                      {seriesPosts.map((sp) => (
                        <Link
                          key={sp.slug}
                          href={`/blog/${sp.slug}`}
                          className={`text-[13px] leading-relaxed transition-all pl-4 border-l-2 py-1.5 ${
                            sp.slug === post?.slug
                              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/20 rounded-r-lg"
                              : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400"
                          }`}
                        >
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mr-1.5">{sp.series?.order}.</span>
                          {sp.title[lang]}
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}

                {/* 文章目录 */}
                {toc.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      {T.toc}
                    </p>
                    <nav ref={tocNavRef} data-toc-nav className="flex flex-col gap-0.5 max-h-[50vh] overflow-y-auto scrollbar-hide">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            // 立即更新高亮，不等滚动事件
                            setActiveId(item.id);
                            const el = document.getElementById(item.id);
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth", block: "start" });
                              window.history.replaceState(null, "", `#${item.id}`);
                            }
                          }}
                          data-toc-id={item.id}
                          className={`text-[13px] leading-relaxed transition-all py-1 shrink-0 ${
                            item.level === 3 ? "pl-6" : "pl-4"
                          } ${
                            activeId === item.id
                              ? "text-indigo-600 dark:text-indigo-400 font-medium border-l-2 border-indigo-500"
                              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-l-2 border-transparent"
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </aside>

            {/* 右侧正文 */}
            <article className="flex-1 min-w-0">
              {/* 文章元信息头 */}
              {post && (
                <div className="mb-6">
                  {/* 分类 + 日期 + 阅读时间 */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {cat && (
                      <span className={`px-3 py-1 text-xs font-semibold bg-gradient-to-r ${cat.color} text-white rounded-full`}>
                        {cat[lang]}
                      </span>
                    )}
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{post.date}</span>
                    <span className="text-sm text-zinc-400 dark:text-zinc-500">· {post.readingTime} {T.readingTime}</span>
                    {post.updated && (
                      <span className="text-sm text-zinc-400 dark:text-zinc-500">· {T.updated}: {post.updated}</span>
                    )}
                  </div>

                  {/* 标题 */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight mb-3">
                    {post.title[lang]}
                  </h1>

                  {/* 摘要 */}
                  <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 border-l-4 border-indigo-500 pl-4">
                    {post.description[lang]}
                  </p>

                  {/* 前置知识 */}
                  {post.prerequisites && post.prerequisites.length > 0 && (
                    <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2.5 flex items-center gap-2">
                        <span>📋</span> {T.prerequisites}
                      </p>
                      <ul className="space-y-1.5">
                        {post.prerequisites.map((pre, i) => (
                          <li key={i} className="text-sm text-amber-600 dark:text-amber-300/80 flex items-start gap-2.5">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                            {pre[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 正文内容 - 纸张效果 */}
              <div
                ref={contentRef}
                className="blog-content prose prose-base sm:prose-lg md:prose-xl prose-zinc dark:prose-invert max-w-none
                  bg-white dark:bg-zinc-900
                  rounded-2xl
                  shadow-[0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)]
                  border border-zinc-100 dark:border-zinc-800/50
                  px-5 py-5
                  sm:px-6 sm:py-6
                  md:px-8 md:py-8
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl sm:prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:mt-14 md:prose-h2:mt-20 prose-h2:mb-6 md:prose-h2:mb-8 prose-h2:pb-3 md:prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-indigo-500/30 prose-h2:text-indigo-900 dark:prose-h2:text-indigo-100
                  prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-[26px] prose-h3:mt-10 md:prose-h3:mt-14 prose-h3:mb-4 md:prose-h3:mb-6 prose-h3:pl-3 md:prose-h3:pl-5 prose-h3:border-l-[3px] md:prose-h3:border-l-[5px] prose-h3:border-indigo-400 prose-h3:text-zinc-800 dark:prose-h3:text-zinc-200
                  prose-p:text-base sm:prose-p:text-lg md:prose-p:text-[19px] prose-p:leading-[1.8] md:prose-p:leading-[1.9] prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:mb-4 md:prose-p:mb-6
                  prose-li:text-base sm:prose-li:text-lg md:prose-li:text-[19px] prose-li:leading-[1.8] md:prose-li:leading-[1.9] prose-li:text-zinc-700 dark:prose-li:text-zinc-300
                  prose-ul:my-5 prose-ol:my-5
                  prose-li:my-1.5
                  prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-indigo-700 dark:prose-strong:text-indigo-300 prose-strong:font-bold
                  prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] md:prose-code:text-[14px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:font-normal
                  prose-pre:bg-[#1e1e2e] dark:prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700 prose-pre:shadow-lg prose-pre:my-6
                  prose-pre:p-0 prose-pre:overflow-hidden
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-400
                  prose-hr:my-10 prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800
                  [&_pre_code]:bg-transparent [&_pre_code]:p-3 md:[&_pre_code]:p-4 [&_pre_code]:block [&_pre_code]:overflow-x-auto [&_pre_code]:text-[12px] sm:[&_pre_code]:text-[13px] md:[&_pre_code]:text-[14px] [&_pre_code]:leading-[1.6] md:[&_pre_code]:leading-[1.7]
                "
              >
                {children}
              </div>

              {/* 文章底部 — 标签 + 上下篇 + 分享 */}
              {post && (
                <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        # {tag}
                      </Link>
                    ))}
                  </div>

                  {/* 上下篇导航 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {adjacentPosts.prev && (
                      <Link
                        href={`/blog/${adjacentPosts.prev.slug}`}
                        className="group p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all"
                      >
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          {T.prev}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {adjacentPosts.prev.title[lang]}
                        </p>
                      </Link>
                    )}
                    {adjacentPosts.next && (
                      <Link
                        href={`/blog/${adjacentPosts.next.slug}`}
                        className="group p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all md:text-right"
                      >
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1 justify-end">
                          {T.next}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {adjacentPosts.next.title[lang]}
                        </p>
                      </Link>
                    )}
                  </div>

                  {/* 分享 + 版权 */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(window.location.href);
                        alert(T.copied);
                      }}
                      className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      🔗 {T.share}
                    </button>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      © {post.date.split("-")[0]} Muanyan
                    </p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
