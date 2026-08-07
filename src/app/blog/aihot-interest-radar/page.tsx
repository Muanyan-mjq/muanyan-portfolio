"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

function CollapsibleCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-4 mb-3 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className="text-[15px] font-semibold text-zinc-900 dark:text-white">{title}</span>
        <svg className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        opacity: isOpen ? 1 : 0,
        transition: "grid-template-rows 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease-out",
      }}>
        <div style={{ overflow: "hidden" }}>
          <div className="p-4 pt-0 text-[16px] leading-[1.8] text-zinc-800 dark:text-zinc-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const post = blogPosts.find((p) => p.slug === "aihot-interest-radar")!;

const content = {
  zh: {
    intro_p1:
      "上一篇搭好了每日 AI 热点自动归档——每天 20:00，7 条热点整整齐齐地躺进 Obsidian。但很快发现一个新问题：<strong>7 条里你真正关心的可能只有一两条</strong>。AGI、self、注意力、算子……每天都要打开那份文件从头翻到尾，就为了确认「今天有没有我关心的」。没有命中时，这一晚的热点就只是 7 条标题。",
    intro_p2:
      "这篇教你给热点加一个「兴趣雷达」：抓完后自动扫描关键词，命中你订阅的主题就弹窗提醒，没命中就静默——就像聊天软件的「特别关心」，只有被标记的人才弹提醒。全程不需要你自己写代码，<strong>你告诉 Codex 你想要什么，剩下的它来做。</strong>",
    h2_prep: "准备工作",
    prep_p1: "动手前确认下面四样东西。大部分在上一篇已经讲过——没搭过的，先点链接回上一篇看。",
    prep_check1: "检查 1：Codex 能用吗？",
    prep_check1_desc: "和上一篇检查 1 一样：打开终端输入 <code>codex</code>，能进入对话界面就 OK。",
    prep_check1_link: "Codex 安装与终端教程（上一篇）→",
    prep_check2: "检查 2：上一篇的抓取脚本跑通了吗？",
    prep_check2_desc:
      "兴趣雷达是接在热点抓取后面的，先确认热点文件能正常生成：打开 <code>5-Summaries/2026年8月/</code>，能看到当天的 <code>AI热点-日期.md</code> 就 OK。",
    prep_check2_link: "没搭好？先看这一篇 →",
    prep_check3: "检查 3：终端能打开吗？",
    prep_check3_desc: "本篇的弹窗脚本要用终端运行。更快的方式：<strong>右键 Windows 图标（开始按钮）→ 选择「终端」</strong>，能打开下面这样的窗口就 OK：",
    prep_check3_caption: "▲ Windows 终端正常打开（Windows Terminal）",
    prep_check4: "检查 4：知道文件放哪",
    prep_check4_desc:
      "两个文件会放在 <code>.codex/scripts/</code> 下：<code>notify_aihot_keywords.ps1</code>（弹窗脚本）和 <code>aihot_keywords.json</code>（关键词配置）。不会建目录？直接告诉 Codex「帮我建好 .codex/scripts 目录」，它可以实现你所有需求。",
    h2_what: "兴趣雷达是什么",
    what_p1:
      "一句话：<strong>给热点抓取加一道过滤器。</strong>抓取完成后自动扫描当天文件里的关键词，命中你订阅的主题就弹一个居中的弹窗（带实时倒计时和「打开笔记」按钮），没命中就安静地写一行日志。",
    h2_tell: "第一步：告诉 Codex 你想要什么",
    tell_p1: "把这个需求复制给 Codex：",
    tell_code_title: "给 Codex 的提示词（可以直接复制）",
    tell_p2:
      "Codex 会生成一个关键词配置文件和一个弹窗脚本，并告诉你怎么接进上一篇的计划任务。你只需要在后面两步里按自己的兴趣改关键词。",
    tell_tip:
      "💡 如果 Codex 生成的弹窗样式你不喜欢（太暗、太大、位置不对），把需求告诉它——比如「改成小一点、放右下角」——它可以满足你。",
    h2_get: "你会得到什么",
    get_p1: "做完之后，你会得到两个文件 + 一个弹窗：",
    get_code_title: "文件清单",
    get_p2: "弹窗长这样（真实截图）：",
    get_p3:
      "顶部蓝色渐变条、左侧渐变圆形 🔥 图标、标题 + 命中主题数、三个主题标签、命中内容卡片、右下角「20 秒后自动关闭」实时倒计时 + 两个圆角按钮。「打开热点笔记」会直接跳 Obsidian 打开当天热点。",
    h2_config: "第二步：配置你关心的关键词",
    config_p1:
      "关键词不是一堆散词，而是<strong>「主题 + 别名」</strong>：每个主题下挂多个匹配词，命中任一就归入该主题。这样弹窗告诉你是「哪个主题」，而不是「哪个词」。",
    config_code_title: "aihot_keywords.json",
    config_p2:
      "想研究新方向？照着格式加一个 topic 就行。脚本每次运行都会重新读这个文件，不用改任何代码。不想手动编辑也没关系——<strong>直接告诉 Codex「帮我加一个 XX 主题」，它会帮你改。</strong>",
    h2_custom: "第三步：按你的习惯定制",
    custom_p1: "四个最常用的定制点：",
    custom_li1: "<strong>换时长：</strong>把脚本里传给 <code>Show()</code> 的秒数改掉，比如 15 或 30",
    custom_li2: "<strong>换样式：</strong>XAML 里改颜色、圆角、宽度、图标",
    custom_li3: "<strong>换位置：</strong><code>WindowStartupLocation</code> 改成 CenterScreen 或 Manual",
    custom_li4: "<strong>手动测试：</strong>运行 <code>powershell -File notify_aihot_keywords.ps1 -Test</code>，立刻弹一个测试窗口",
    custom_p2:
      "如果你觉得这样还不够好看，或者有其他想法——加提示音、换成自己的图标、点击卡片直接打开——<strong>告诉 Codex 就行，它可以满足你。</strong>",
    h2_faq: "常见问题",
    faq_intro: "遇到问题先看这里，都是真实踩过的坑：",
    faq_q1: "弹窗根本不显示",
    faq_a1: "第一版用的是系统通知（WinRT Toast），代码调用成功、日志也写了，但屏幕上什么都没有——「应用未注册」的通知会被系统静默吞掉。解决办法：自己做窗口（本文的方案就是）。如果你用的是旧脚本，把它换成自定义窗口版本。",
    faq_q2: "弹窗能显示，但按钮和倒计时没反应",
    faq_a2: "如果你用 PowerShell 直接写 WPF，会遇到这个问题：PowerShell 的事件处理脚本需要运行空间有空闲，而 Dispatcher.Run() 把运行空间占死了，事件永远排不上队。解决办法：用 Codex 把弹窗逻辑编译成原生 C# 类（Add-Type），事件走 .NET 原生通道，立刻正常。",
    faq_q3: "窗口关了，进程还卡着不退出",
    faq_a3: "直接 Dispatcher.Run() 不会因为窗口关闭而返回。要用 WPF 的标准写法 Application.Run(window)——窗口一关，进程就退出。",
    faq_q4: "中文乱码 / 脚本报错",
    faq_a4: "PowerShell 5.1 读脚本默认按系统编码，UTF-8 无 BOM 的中文脚本会乱码。把脚本文件存成 UTF-8 with BOM 即可。",
    faq_q5: "关键词会误报吗？",
    faq_a5: "会。比如裸词「self」可能命中 self-hosted。所以配置里尽量用精确短语（Self-Initialization、self-attention），少用短词。误报多就把词改精确，宁可漏报不要打扰。",
    h2_next: "下一步",
    next_p1:
      "「兴趣雷达」的思路还能延伸：不只是热点——论文、视频、播客，任何每天会新增的内容源都能接。下一步可能是把它做成一个更通用的「订阅提醒器」。",
    h2_ref: "相关资源",
    ref1_title: "Codex + Obsidian 工作流（上一篇）",
    ref1_desc: "这套自动化系统的整体设计",
    ref2_title: "通知脚本 notify_aihot_keywords.ps1",
    ref2_desc: "SecondBrain/.codex/scripts/ 下，弹窗与倒计时的完整实现",
    ref3_title: "关键词配置 aihot_keywords.json",
    ref3_desc: "同目录下，改主题就改这个文件",
    ref4_title: "AI HOT 数据源",
    ref4_desc: "每天 20:00 抓取的热点来源：精选 AI 动态、带摘要与原文链接",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "全程用 Codex 撰写。文中的弹窗截图就是我机器上的真实运行画面，FAQ 里的问题也都真真实实发生过——你遇到同样的现象时，直接对号入座。",
    bottom_tip: "卡住了？把报错复制给 Codex，它会帮你排查。",
  },
  en: {
    intro_p1:
      "The previous post set up daily AI news archiving — at 8pm, seven items land neatly in Obsidian. But a new problem appeared fast: <strong>of those seven, you probably only care about one or two</strong>. AGI, self, attention, operators… every day you'd open the file and skim top to bottom, just to check \"is there anything for me today?\" On days with no match, those seven items are just seven headlines.",
    intro_p2:
      "This post shows you how to add an \"Interest Radar\" to that news: after fetching, keywords are scanned automatically; a popup appears only when a topic you subscribe to matches, and stays silent otherwise — like \"close friends\" notifications in a chat app. No coding from scratch — <strong>you tell Codex what you want, and it builds it for you.</strong>",
    h2_prep: "Preparation",
    prep_p1: "Before we start, confirm these four things. Most were covered in the previous post — if you haven't set them up, follow the links back first.",
    prep_check1: "Check 1: Is Codex available?",
    prep_check1_desc: "Same as Check 1 in the previous post: open a terminal, run <code>codex</code>, and reach its conversation interface.",
    prep_check1_link: "Codex install & terminal guide (previous post) →",
    prep_check2: "Check 2: Is the fetch script from the previous post working?",
    prep_check2_desc:
      "The radar hooks onto the news fetch, so first confirm the news file generates: open <code>5-Summaries/2026年8月/</code> — if today's <code>AI热点-日期.md</code> is there, you're good.",
    prep_check2_link: "Not set up yet? Read this post first →",
    prep_check3: "Check 3: Can you open a terminal?",
    prep_check3_desc: "This post's popup script runs in a terminal. Faster way: <strong>right-click the Windows icon (Start button) → choose \"Terminal\"</strong> — a window like this means you're good:",
    prep_check3_caption: "▲ Windows Terminal opens normally (Windows Terminal)",
    prep_check4: "Check 4: Know where the files live",
    prep_check4_desc:
      "Two files go into <code>.codex/scripts/</code>: <code>notify_aihot_keywords.ps1</code> (the popup script) and <code>aihot_keywords.json</code> (keyword config). Don't know how to create folders? Just tell Codex \"create the .codex/scripts folder for me\" — it can handle all your needs.",
    h2_what: "What the Interest Radar Is",
    what_p1:
      "In one sentence: <strong>a filter on top of the news fetch.</strong> After fetching, it scans the day's file for keywords; if a topic you subscribe to matches, it pops a centered window (with a live countdown and an \"Open note\" button); otherwise it quietly writes a log line.",
    h2_tell: "Step 1: Tell Codex What You Want",
    tell_p1: "Paste this request to Codex:",
    tell_code_title: "Prompt for Codex (copy-paste ready)",
    tell_p2:
      "Codex will produce a keyword config file, a popup script, and instructions for hooking it into the scheduled task from the previous post. All you do next is customize the keywords to your interests.",
    tell_tip:
      "💡 If you don't like the popup Codex generated (too dark, too big, wrong position), tell it — \"make it smaller, bottom-right\" — it can.",
    h2_get: "What You'll Get",
    get_p1: "When it's done, you get two files + one popup:",
    get_code_title: "File list",
    get_p2: "The popup looks like this (a real screenshot):",
    get_p3:
      "A blue gradient bar on top, a gradient circular 🔥 icon, title + matched-topic count, topic chips, a matched-content card, and a live \"closes in N seconds\" countdown plus two rounded buttons. \"Open news note\" jumps straight to Obsidian.",
    h2_config: "Step 2: Configure the Topics You Care About",
    config_p1:
      "Keywords aren't loose words — they're <strong>topics with aliases</strong>. Each topic carries several match words; hitting any of them counts as that topic. So the popup tells you \"which topic,\" not \"which word.\"",
    config_code_title: "aihot_keywords.json",
    config_p2:
      "Want to follow a new direction? Just add a topic in the same format. The script re-reads this file on every run — no code changes. Don't want to edit JSON by hand? <strong>Just tell Codex \"add a topic for XX\" — it will edit it for you.</strong>",
    h2_custom: "Step 3: Customize to Your Habits",
    custom_p1: "The four most useful customization points:",
    custom_li1: "<strong>Duration:</strong> change the seconds passed to <code>Show()</code>, e.g. 15 or 30",
    custom_li2: "<strong>Style:</strong> change colors, radius, width, icon in the XAML",
    custom_li3: "<strong>Position:</strong> set <code>WindowStartupLocation</code> to CenterScreen or Manual",
    custom_li4: "<strong>Manual test:</strong> run <code>powershell -File notify_aihot_keywords.ps1 -Test</code> — a test window pops immediately",
    custom_p2:
      "If it still doesn't look good enough, or you have other ideas — add a sound, use your own icon, click the card to open — <strong>just tell Codex, it can.</strong>",
    h2_faq: "FAQ",
    faq_intro: "Stuck? Check these first — all are real pitfalls:",
    faq_q1: "The popup never shows",
    faq_a1: "The first version used system toasts (WinRT). The API call succeeded and logs were written, but nothing appeared — \"unregistered app\" notifications get silently swallowed. Fix: build your own window (this post's approach). If you have the old script, swap it for the custom-window version.",
    faq_q2: "The popup shows, but buttons and countdown don't work",
    faq_a2: "If you wrote the WPF window directly in PowerShell, this happens: PowerShell event handlers need a free runspace, but Dispatcher.Run() blocks the runspace, so events never fire. Fix: have Codex compile the popup logic into a native C# class (Add-Type) — events go through .NET directly and work immediately.",
    faq_q3: "The window closes but the process stays",
    faq_a3: "A bare Dispatcher.Run() doesn't return when the window closes. Use WPF's standard Application.Run(window) — when the window closes, the process exits.",
    faq_q4: "Garbled Chinese / script errors",
    faq_a4: "PowerShell 5.1 reads scripts using the system codepage; UTF-8 without BOM gets mangled. Save the script as UTF-8 with BOM.",
    faq_q5: "Can keywords false-positive?",
    faq_a5: "Yes. A bare word like \"self\" can match self-hosted. Use precise phrases (Self-Initialization, self-attention) and avoid short words. If it over-notifies, tighten the words — better to under-notify than to annoy.",
    h2_next: "What's Next",
    next_p1:
      "The \"interest radar\" idea extends beyond news — papers, videos, podcasts, any source that grows daily. The next step might be turning it into a general-purpose \"subscription notifier.\"",
    h2_ref: "Related Resources",
    ref1_title: "Codex + Obsidian Workflow (Previous Post)",
    ref1_desc: "The overall design of this automation system",
    ref2_title: "Notify Script notify_aihot_keywords.ps1",
    ref2_desc: "Under SecondBrain/.codex/scripts/ — the full popup + countdown implementation",
    ref3_title: "Keyword Config aihot_keywords.json",
    ref3_desc: "In the same directory — edit topics here",
    ref4_title: "AI HOT Source",
    ref4_desc: "The curated AI news source fetched at 8pm — titles, summaries, and source links",
    bottom_title: "How This Article Was Written",
    bottom_desc:
      "Written entirely with Codex. The popup screenshot is a real capture from my machine, and every FAQ entry is a pitfall that actually happened — match your symptom, find your fix.",
    bottom_tip: "Stuck? Paste the error to Codex — it will help you debug.",
  },
} as const;

const codeBlocks = {
  prompt: {
    zh: `给 AI 热点加一个兴趣雷达：
1. 写一个 PowerShell 脚本 notify_aihot_keywords.ps1：
   - 读取当天的 AI热点 Markdown 文件
   - 扫描 aihot_keywords.json 里配置的主题关键词
   - 命中就弹一个居中的弹窗（带实时倒计时和"打开笔记"按钮）
   - 没命中就写一行日志，静默结束
2. 关键词配置独立成 aihot_keywords.json，
   格式用"主题 + 别名"：每个主题下挂多个匹配词
3. 弹窗用 WPF 做，样式参考 Windows 11（亮色、圆角、渐变强调）
4. 脚本要能被 fetch_aihot.js 抓取完成后自动调用`,
    en: `Add an interest radar to my AI news:
1. A PowerShell script notify_aihot_keywords.ps1:
   - Reads today's AI news Markdown file
   - Scans the topic keywords configured in aihot_keywords.json
   - On a match, pops a centered window (live countdown + "Open note" button)
   - On no match, writes one log line and ends silently
2. Keyword config lives in its own aihot_keywords.json,
   using "topics with aliases": multiple match words per topic
3. Build the popup with WPF, Windows 11 style (light, rounded, gradient accent)
4. The script must be callable right after fetch_aihot.js finishes`,
  },
  configJson: {
    zh: `{
  "topics": [
    { "name": "AGI", "keywords": ["AGI", "通用人工智能"] },
    { "name": "Self-Initialization / 注意力",
      "keywords": ["Self-Initialization", "attention", "注意力", "元认知"] },
    { "name": "算子 / 国产芯片",
      "keywords": ["算子", "国产芯片", "昇腾", "Triton"] },
    { "name": "多模态 / 生成",
      "keywords": ["多模态", "视频生成", "Sora", "Runway"] }
  ]
}`,
    en: `{
  "topics": [
    { "name": "AGI", "keywords": ["AGI", "artificial general intelligence"] },
    { "name": "Self-Initialization / Attention",
      "keywords": ["Self-Initialization", "attention", "meta-cognition"] },
    { "name": "Operators / Domestic Chips",
      "keywords": ["operator", "domestic chip", "Ascend", "Triton"] },
    { "name": "Multimodal / Generation",
      "keywords": ["multimodal", "video generation", "Sora", "Runway"] }
  ]
}`,
  },
};

export default function AihotInterestRadarPage() {
  const { lang } = useLang();
  const t = (key: string) => {
    const section = content[lang as keyof typeof content] ?? content.zh;
    return (section as Record<string, string>)[key] ?? key;
  };

  return (
    <BlogPostLayout post={post}>
      <p dangerouslySetInnerHTML={{ __html: t("intro_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("intro_p2") }} />

      <h2 id="prep">{t("h2_prep")}</h2>
      <p>{t("prep_p1")}</p>
      <h3>{t("prep_check1")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check1_desc") }} />
      <Link
        href="/blog/codex-obsidian-workflow"
        className="group inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md bg-zinc-50 dark:bg-zinc-900/50"
      >
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:underline">{t("prep_check1_link")}</span>
        <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <h3 className="mt-8">{t("prep_check2")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_desc") }} />
      <Link
        href="/blog/codex-obsidian-workflow"
        className="group inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md bg-zinc-50 dark:bg-zinc-900/50"
      >
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:underline">{t("prep_check2_link")}</span>
        <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <h3 className="mt-8">{t("prep_check3")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check3_desc") }} />
      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-2xl mx-auto">
          <img src={`${BASE_PATH}/blog-images/terminal.png`} alt="Windows Terminal open" className="w-full" />
        </div>
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">{t("prep_check3_caption")}</figcaption>
      </figure>

      <h3 className="mt-8">{t("prep_check4")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check4_desc") }} />

      <h2 id="what">{t("h2_what")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("what_p1") }} />

      <h2 id="tell">{t("h2_tell")}</h2>
      <p>{t("tell_p1")}</p>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("tell_code_title")}</p>
      <CodeBlock language="text">
        {codeBlocks.prompt[lang as keyof typeof codeBlocks.prompt] ?? codeBlocks.prompt.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("tell_p2") }} />
      <div className="mt-4 px-5 py-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl text-[16px] leading-[1.8] text-amber-800 dark:text-amber-200" dangerouslySetInnerHTML={{ __html: t("tell_tip") }} />

      <h2 id="get">{t("h2_get")}</h2>
      <p>{t("get_p1")}</p>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("get_code_title")}</p>
      <CodeBlock language="text">
        {`notify_aihot_keywords.ps1   # 弹窗脚本
aihot_keywords.json       # 关键词配置`}
      </CodeBlock>
      <p>{t("get_p2")}</p>
      <figure className="my-8">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-lg mx-auto">
          <img src={`${BASE_PATH}/aihot-popup.png`} alt="AI hot news interest radar popup" className="w-full" />
        </div>
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {lang === "zh" ? "▲ 命中主题时的弹窗：标签、命中标题、倒计时、一键打开" : "▲ The popup on a match: topic chips, matched headline, countdown, one-click open"}
        </figcaption>
      </figure>
      <p dangerouslySetInnerHTML={{ __html: t("get_p3") }} />

      <h2 id="config">{t("h2_config")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("config_p1") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("config_code_title")}</p>
      <CodeBlock language="json">
        {codeBlocks.configJson[lang as keyof typeof codeBlocks.configJson] ?? codeBlocks.configJson.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("config_p2") }} />

      <h2 id="custom">{t("h2_custom")}</h2>
      <p>{t("custom_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("custom_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li4") }} />
      </ul>
      <div className="mt-4 px-5 py-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("custom_p2") }} />

      <h2 id="faq">{t("h2_faq")}</h2>
      <p>{t("faq_intro")}</p>
      <CollapsibleCard title={t("faq_q1")}><p>{t("faq_a1")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q2")}><p>{t("faq_a2")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q3")}><p>{t("faq_a3")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q4")}><p>{t("faq_a4")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q5")}><p>{t("faq_a5")}</p></CollapsibleCard>

      <h2 id="next">{t("h2_next")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("next_p1") }} />

      <h2 id="ref">{t("h2_ref")}</h2>
      <div className="mt-6 space-y-3">
        {[
          { icon: "🧠", title: t("ref1_title"), desc: t("ref1_desc"), href: "/blog/codex-obsidian-workflow", external: false },
          { icon: "📜", title: t("ref2_title"), desc: t("ref2_desc"), href: "#get", external: false },
          { icon: "⚙️", title: t("ref3_title"), desc: t("ref3_desc"), href: "#config", external: false },
          { icon: "🔥", title: t("ref4_title"), desc: t("ref4_desc"), href: "https://aihot.virxact.com/", external: true },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{item.title}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>

      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{t("bottom_tip")}</p>
      </div>
    </BlogPostLayout>
  );
}
