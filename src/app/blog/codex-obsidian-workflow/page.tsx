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

const post = blogPosts.find((p) => p.slug === "codex-obsidian-workflow")!;

const content = {
  zh: {
    intro_p1:
      "如果你用笔记软件做过知识管理，大概率遇到过这几个问题：收藏了但再也没打开过、笔记堆积成山却找不到想要的、坚持几天就断更。它们看起来像「自律问题」，但根子上往往是同一个——<strong>知识的流入完全靠手动</strong>：每条新信息都要自己建文件夹、起文件名、写日期、加标签。",
    intro_p2:
      "这篇教你用 Codex 把这套「整理」本身自动化：每天 20:00 热点自动归档、22:50 提醒写日记、按月自动整理。全程不需要你自己写代码——<strong>你只需要告诉 Codex 你想要什么，剩下的它来做。</strong>",
    h2_prep: "准备工作",
    prep_p1: "动手前确认下面五样东西，每项都配了说明和验证方法。最重要的是第一项：Codex 本身。",
    prep_check1: "检查 1：Codex 能用吗？（最重要）",
    prep_check1_desc: "打开终端，输入 <code>codex</code> 回车。能看到 Codex 的对话界面就说明 OK。",
    prep_check1_fast: "更快地打开终端：<strong>右键 Windows 图标（开始按钮）→ 选择「终端」</strong>，或者按 Win+R 输入 <code>powershell</code> 回车。",
    prep_check1_caption: "▲ 终端里输入 codex 后进入对话界面，就说明 Codex 可用",
    prep_check1_no: "没装 Codex？直接告诉它「帮我安装 Codex CLI」，它可以满足你；也可以去 Codex 官网下载。",
    prep_check2: "检查 2：Obsidian 装了吗？",
    prep_check2_desc:
      "Obsidian 是本地优先的笔记软件，完全免费。点击旁边的图标（或 <a href='https://obsidian.md/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>obsidian.md</a>）下载安装，然后新建一个笔记库（Vault），名字随意，比如 SecondBrain。能正常创建并打开笔记，就说明 OK。",
    prep_check3: "检查 3：Node.js 装了吗？",
    prep_check3_desc:
      "我们的脚本靠 Node.js 运行，装一次一劳永逸。点击旁边的图标（或 <a href='https://nodejs.org/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a>）下载 <strong>LTS 版</strong>。然后在终端输入 <code>node --version</code>——能看到版本号（比如 v20.x）就说明装好了。",
    prep_check3_step: "装好后验证：",
    prep_check3_s1: "<strong>重新打开终端</strong>，输入 <code>node --version</code>",
    prep_check3_s2: "显示版本号就成功了；国内下载慢可以换镜像：<code>npm config set registry https://registry.npmmirror.com</code>",
    prep_check4: "检查 4：知道脚本放哪",
    prep_check4_desc:
      "所有脚本统一放在笔记库下的 <code>.codex/scripts/</code> 目录。用文件管理器打开你的笔记库文件夹，新建 <code>.codex</code> 和 <code>scripts</code> 两级目录。注意：以点开头的文件夹在 Obsidian 笔记列表里看不到，但文件管理器里能看到，这是正常的。",
    prep_check4_tip: "💡 不会建目录？没关系，直接告诉 Codex「帮我建好 .codex/scripts 目录」，它可以实现你所有需求。",
    prep_check5: "检查 5：能找到 Windows 任务计划程序",
    prep_check5_desc:
      "后面注册自动化任务要用它。按 Win 键，搜索「任务计划程序」并打开。能打开这个窗口就 OK——先不用做任何操作。",
    h2_tell: "第一步：告诉 Codex 你想要什么",
    tell_p1: "不需要自己写代码。直接把这个需求复制给 Codex：",
    tell_code_title: "给 Codex 的提示词（可以直接复制）",
    tell_p2:
      "Codex 会先问你几个问题——笔记库的路径、热点数据源、几点执行。回答完，它会自动帮你：建好目录结构、写好三个脚本、注册好 Windows 计划任务。",
    tell_tip:
      "💡 如果 Codex 没按你想的做，把它的输出贴回去，告诉它哪里不对（比如「热点文件放错文件夹了」），它会自己修正。",
    h2_get: "你会得到什么",
    get_p1: "做完之后，你的笔记库会变成这样：",
    get_code_title: "目录结构",
    get_p2: "以及三个各司其职的脚本：",
    get_li1: "<strong>fetch_aihot.js</strong>——每天抓取 AI 热点，写成 Markdown 放进 5-Summaries",
    get_li2: "<strong>check_diary.js + remind_diary.ps1</strong>——每天 22:50 检查日记写没写，没写就弹提醒",
    get_li3: "<strong>check_inbox.js + remind_inbox.ps1</strong>——Inbox 里有东西就提醒你处理",
    get_p3: "Windows 任务计划程序里会多出三个定时任务，到点自动跑，不需要你手动开任何东西。",
    get_tip: "觉得目录结构不合口味？告诉 Codex 换成你喜欢的组织方式，它可以满足你。",
    h2_vault: "笔记库为什么这么设计",
    vault_p1:
      "自动化能跑起来的前提是结构稳定。库分成五层，每层一个职责，新东西永远先落 0-Inbox，处理完再归位：",
    vault_li1: "<strong>0-Inbox</strong>（入口）——所有新东西先落这里",
    vault_li2: "<strong>1-Daily</strong>——日记，按 <code>2026年8月/</code> 按月归档",
    vault_li3: "<strong>2-Projects / 3-Areas</strong>——项目与领域思考",
    vault_li4: "<strong>4-Resources</strong>——资料收藏",
    vault_li5: "<strong>5-Summaries</strong>——汇总类：AI 热点、周总结",
    vault_p2:
      "三个关键设计：一是 <strong>Inbox 清零原则</strong>——所有东西先落 Inbox，处理完必须归位；二是 <strong>按月归档</strong>——日记和热点都按月分文件夹，「2026 年 7 月发生了什么」一目了然；三是 <strong>双向链接</strong>——每篇日记末尾自动补上关联笔记，让知识长成网络。",
    h2_hot: "热点是怎么自动归档的",
    hot_p1:
      "每天 20:00，<code>fetch_aihot.js</code> 从 AI HOT 抓当天的热点，整理成 Markdown，写到 <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>。生成的文件长这样（真实文件的一部分）：",
    hot_p2: "验证方法：到点后打开 5-Summaries，能看到当天的文件，就说明跑通了。",
    h2_aihot: "顺带安利：AI HOT 这个热点源",
    aihot_p1:
      "这套系统能跑起来，数据源很关键。我用的是 <a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline font-semibold'>AI HOT</a>——一个每天精选 AI 领域热点的聚合站。它能干什么？把全网 AI 动态里的「重要信息」捞出来，按天整理好，给每条配上标题、摘要和原文链接，让你不用自己刷一堆信息流。",
    aihot_p2: "三个优点：",
    aihot_li1: "<strong>精选而非搬运：</strong>每天只保留真正值得看的 AI 动态",
    aihot_li2: "<strong>结构化数据：</strong>每条都有标题、摘要和原文链接，直接能加工成 Markdown",
    aihot_li3: "<strong>有公开 API：</strong>脚本一行请求就能拉到当天内容，自动化零门槛",
    aihot_p3: "如果你也在做 AI 相关的知识管理，可以把它当作知识库的「每日输入源」。",
    h2_diary: "日记提醒是怎么工作的",
    diary_p1:
      "22:50 脚本检查当天有没有日记，没有就弹系统通知「今天还没写日记，快去写两笔」。",
    diary_p2:
      "写完后，跟 Codex 说一句「今天的日记整理一下」，它就会把 Inbox 里的日记移到 <code>1-Daily/2026年8月/</code>、加上日期和标签、在末尾补上当天的 AI 热点链接和关联笔记——正文一个字不动。",
    h2_day: "一天的实际流程",
    day_p1: "系统跑起来之后，你的一天是这样的：",
    day_li1: "<strong>早上：</strong>打开 Obsidian，昨天的日记已经在 1-Daily 里，末尾带着昨天的 AI 热点链接",
    day_li2: "<strong>20:00：</strong>热点自动抓取，出现在 5-Summaries；命中你订阅的主题时还会弹窗提醒（下一篇）",
    day_li3: "<strong>晚上：</strong>写日记 → 喊一句「整理一下」→ Inbox 清空、日记归位",
    day_li4: "<strong>月底：</strong>当月文件夹自动成型，月度总结直接用当月的日记和热点写",
    day_p2: "你需要做的，只剩读和想。",
    h2_faq: "常见问题",
    faq_intro: "最常被问到的问题：",
    faq_q1: "需要会写代码吗？",
    faq_a1: "不需要从零写。把需求告诉 Codex，它帮你生成脚本和任务配置；你只需要会复制粘贴提示词、会看验证结果。",
    faq_q2: "Codex 没按我说的做怎么办？",
    faq_a2: "把它的输出贴回去，告诉它哪里不对（比如「热点文件放错文件夹了」），它会修正。它的能力边界在于你描述得清不清楚。",
    faq_q3: "怎么改执行时间？",
    faq_a3: "打开 Windows「任务计划程序」，找到对应任务，右键 → 属性 → 触发器 → 编辑时间。",
    faq_q4: "出问题了怎么看？",
    faq_a4: "脚本会往 <code>scripts/</code> 目录写日志（如 <code>aihot_keywords.log</code>）。把日志最后几行复制给 Codex，它一般直接定位。",
    faq_q5: "不想用了怎么停？",
    faq_a5: "在任务计划程序里禁用对应任务即可；想彻底卸载就删脚本 + 删任务。",
    h2_next: "下一步",
    next_p1:
      "这套工作流还在长。下一篇给热点加一个「兴趣雷达」：抓完后自动扫描关键词，只有命中你关心的主题（AGI、self、注意力…）才弹窗提醒，不命中就不打扰。",
    next_link: "兴趣雷达：Windows 自定义弹窗实战 →",
    h2_ref: "相关资源",
    ref1_title: "兴趣雷达（本系列下一篇）",
    ref1_desc: "给 AI 热点装上关键词提醒弹窗",
    ref2_title: "本站仓库",
    ref2_desc: "这套博客与脚本的源码都在 GitHub",
    ref3_title: "AI HOT 数据源",
    ref3_desc: "每天 20:00 抓取的热点来源",
    ref4_title: "Windows 任务计划程序",
    ref4_desc: "搜索「任务计划程序」即可管理所有自动化任务",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "本文全程用 Codex 撰写。文中的目录结构、脚本片段和计划任务，都是这套系统真实运行的样子——你照着「第一步」把需求告诉 Codex，也能得到同一套。",
    bottom_tip: "卡住了？把报错复制给 Codex，它会帮你排查。",
  },
  en: {
    intro_p1:
      "If you've managed knowledge in a note app, you've probably hit these: things you saved and never opened again, notes piling up with nothing findable, streaks that break after a few days. They look like discipline problems, but the root cause is usually the same — <strong>knowledge flows in entirely manually</strong>: every new item needs its own folder, filename, date, and tags.",
    intro_p2:
      "This post shows you how to automate that \"organizing\" itself with Codex: news auto-archived at 8pm, diary reminders at 10:50pm, automatic monthly filing. No coding from scratch — <strong>you tell Codex what you want, and it builds it for you.</strong>",
    h2_prep: "Preparation",
    prep_p1: "Before we start, confirm these five things. Each has instructions and a way to verify. The most important one is the first: Codex itself.",
    prep_check1: "Check 1: Is Codex available? (Most Important)",
    prep_check1_desc: "Open a terminal and run <code>codex</code>. If you land in Codex's conversation interface, you're good.",
    prep_check1_fast: "Faster way to open a terminal: <strong>right-click the Windows icon (Start button) → choose \"Terminal\"</strong>, or press Win+R and type <code>powershell</code>.",
    prep_check1_caption: "▲ Run codex in the terminal and reach its conversation interface — Codex is ready",
    prep_check1_no: "Codex not installed? Just tell it \"help me install Codex CLI\" — it can; or download it from the official site.",
    prep_check2: "Check 2: Is Obsidian installed?",
    prep_check2_desc:
      "Obsidian is a local-first note app, completely free. Click the icon next to this text (or <a href='https://obsidian.md/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>obsidian.md</a>) to download and install it, then create a vault — any name, e.g., SecondBrain. If you can create and open notes, you're good.",
    prep_check3: "Check 3: Is Node.js installed?",
    prep_check3_desc:
      "Our scripts run on Node.js — install once, done. Click the icon next to this text (or <a href='https://nodejs.org/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a>) to download the <strong>LTS version</strong>. Then run <code>node --version</code> in the terminal — seeing a version (e.g., v20.x) means it's installed.",
    prep_check3_step: "Verify after installing:",
    prep_check3_s1: "<strong>Reopen the terminal</strong> and run <code>node --version</code>",
    prep_check3_s2: "A version number means success; if downloads are slow, set the mirror with <code>npm config set registry https://registry.npmmirror.com</code>",
    prep_check4: "Check 4: Know where the scripts live",
    prep_check4_desc:
      "All scripts go into <code>.codex/scripts/</code> inside your vault. Open the vault folder in a file manager and create the <code>.codex</code> and <code>scripts</code> folders. Note: dot-folders don't appear in Obsidian's note list, but they do in the file manager — that's normal.",
    prep_check4_tip: "💡 Don't know how to create folders? Just tell Codex \"create the .codex/scripts folder for me\" — it can handle all your needs.",
    prep_check5: "Check 5: Can you find Task Scheduler?",
    prep_check5_desc:
      "We'll use it to register the automation tasks. Press the Win key, search \"Task Scheduler,\" and open it. Being able to open the window is enough — don't touch anything yet.",
    h2_tell: "Step 1: Tell Codex What You Want",
    tell_p1: "No need to write code yourself. Just paste this request to Codex:",
    tell_code_title: "Prompt for Codex (copy-paste ready)",
    tell_p2:
      "Codex will ask a few questions — your vault path, the news source, what time things should run. Answer them, and it will build the folder structure, write the three scripts, and register the Windows scheduled tasks for you.",
    tell_tip:
      "💡 If Codex doesn't do what you asked, paste its output back and tell it what's wrong (e.g., \"the news file went to the wrong folder\") — it will fix it.",
    h2_get: "What You'll Get",
    get_p1: "When it's done, your vault looks like this:",
    get_code_title: "Folder structure",
    get_p2: "Plus three single-purpose scripts:",
    get_li1: "<strong>fetch_aihot.js</strong> — fetches AI news daily and writes Markdown into 5-Summaries",
    get_li2: "<strong>check_diary.js + remind_diary.ps1</strong> — at 10:50pm, checks whether today's diary exists and reminds you if not",
    get_li3: "<strong>check_inbox.js + remind_inbox.ps1</strong> — reminds you when Inbox has items",
    get_p3: "Windows Task Scheduler will have three new tasks that run on their own — no need to open anything manually.",
    get_tip: "Don't like the folder layout? Tell Codex to organize it your way — it can.",
    h2_vault: "Why the Vault Is Designed This Way",
    vault_p1:
      "Automation needs a stable structure to run against. Five layers, one job each. Everything new lands in 0-Inbox first, then moves to its layer:",
    vault_li1: "<strong>0-Inbox</strong> (inbox) — everything new lands here",
    vault_li2: "<strong>1-Daily</strong> — diaries, archived by month like <code>2026-08/</code>",
    vault_li3: "<strong>2-Projects / 3-Areas</strong> — projects and area thinking",
    vault_li4: "<strong>4-Resources</strong> — saved materials",
    vault_li5: "<strong>5-Summaries</strong> — summaries: AI news, weekly recaps",
    vault_p2:
      "Three key design decisions: the <strong>Inbox-zero principle</strong> — everything lands in Inbox and must be filed; <strong>monthly archiving</strong> — diaries and news grouped by month, so \"what happened in July 2026\" is instantly clear; and <strong>bidirectional links</strong> — each diary links to related notes, letting knowledge grow into a network.",
    h2_hot: "How News Gets Archived Automatically",
    hot_p1:
      "At 8pm, <code>fetch_aihot.js</code> fetches the day's AI news from AI HOT, formats it as Markdown, and writes to <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>. The generated file looks like this (a real excerpt):",
    hot_p2: "Verify: after 8pm, open 5-Summaries — if today's file is there, it works.",
    h2_aihot: "A Side Recommendation: AI HOT as Your News Source",
    aihot_p1:
      "This system only works because of its data source. I use <a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline font-semibold'>AI HOT</a> — an aggregator that curates AI news every day. What does it do? It pulls the important items out of the whole AI landscape, organizes them by day, and attaches a title, summary, and source link to each.",
    aihot_p2: "Three reasons I like it:",
    aihot_li1: "<strong>Curated, not aggregated:</strong> only genuinely worth-reading AI news survives",
    aihot_li2: "<strong>Structured data:</strong> title, summary, and source link per item — ready to become Markdown",
    aihot_li3: "<strong>Public API:</strong> one request pulls the day's content — zero-friction automation",
    aihot_p3: "If you manage AI knowledge too, treat it as the \"daily input source\" for your vault.",
    h2_diary: "How the Diary Reminder Works",
    diary_p1:
      "At 10:50pm, a script checks whether today's diary exists; if not, it pops a system notification — \"You haven't written your diary today, go write a couple lines.\"",
    diary_p2:
      "After you write it, tell Codex \"organize today's diary.\" It moves the note from Inbox to <code>1-Daily/2026年8月/</code>, adds date and tags, and appends today's AI news link plus related notes — without touching a word of the body.",
    h2_day: "A Day in the Life",
    day_p1: "Once the system runs, your day looks like this:",
    day_li1: "<strong>Morning:</strong> open Obsidian — yesterday's diary is already in 1-Daily, with yesterday's AI news link at the end",
    day_li2: "<strong>8pm:</strong> news is fetched automatically into 5-Summaries; matching topics even pop a reminder (next post)",
    day_li3: "<strong>Evening:</strong> write the diary → say \"organize it\" → Inbox clears, diary files itself",
    day_li4: "<strong>End of month:</strong> the month's folder is already shaped; the monthly recap writes itself",
    day_p2: "All you have to do is read and think.",
    h2_faq: "FAQ",
    faq_intro: "The questions readers ask most:",
    faq_q1: "Do I need to know how to code?",
    faq_a1: "Not from scratch. Tell Codex what you want and it generates the scripts and task config; you just copy prompts and check results.",
    faq_q2: "What if Codex doesn't do what I asked?",
    faq_a2: "Paste its output back and tell it what's wrong (e.g., \"the news file went to the wrong folder\"). It will fix it. How well it works depends on how clearly you describe the problem.",
    faq_q3: "How do I change the execution time?",
    faq_a3: "Open Windows Task Scheduler, find the task, right-click → Properties → Triggers → Edit the time.",
    faq_q4: "How do I debug when something breaks?",
    faq_a4: "Scripts write logs to <code>scripts/</code> (e.g., <code>aihot_keywords.log</code>). Paste the last few lines to Codex — it usually pinpoints the issue.",
    faq_q5: "How do I stop it?",
    faq_a5: "Disable the task in Task Scheduler; scripts can stay. To uninstall completely, delete the scripts and tasks.",
    h2_next: "What's Next",
    next_p1:
      "This workflow keeps growing. The next post adds an \"Interest Radar\" to the news: after fetching, keywords are scanned, and a popup appears only when topics you care about (AGI, self, attention…) match — no match, no interruption.",
    next_link: "Interest Radar: Custom Windows Popups in Practice →",
    h2_ref: "Related Resources",
    ref1_title: "Interest Radar (Next in Series)",
    ref1_desc: "Keyword-alert popups for AI news",
    ref2_title: "This Site's Repository",
    ref2_desc: "Source code for this blog and its scripts on GitHub",
    ref3_title: "AI HOT Source",
    ref3_desc: "The curated AI news source fetched at 8pm",
    ref4_title: "Windows Task Scheduler",
    ref4_desc: "Search \"Task Scheduler\" to manage all automation tasks",
    bottom_title: "How This Article Was Written",
    bottom_desc:
      "Written entirely with Codex. The folder structure, scripts, and scheduled tasks here are how this system really runs — follow Step 1 and tell Codex what you want, and you'll get the same thing.",
    bottom_tip: "Stuck? Paste the error to Codex — it will help you debug.",
  },
} as const;

const codeBlocks = {
  prompt: {
    zh: `帮我搭一套 Obsidian 笔记库自动化：
1. 写一个 Node 脚本，每天抓 AI HOT 的热点，整理成 Markdown，
   存到 5-Summaries/{年份年月份}/AI热点-{日期}.md
2. 写一个 PowerShell 提醒脚本，每天 22:50 检查当天日记有没有写，
   没写就弹系统通知
3. 帮我注册 Windows 计划任务：每天 20:00 跑抓取，22:50 跑提醒

笔记库结构：0-Inbox、1-Daily、2-Projects、3-Areas、4-Resources、5-Summaries
脚本统一放在 .codex/scripts/ 下，每个脚本要有日志`,
    en: `Build me an Obsidian vault automation:
1. A Node script that fetches AI HOT news daily, formats it as Markdown,
   and saves to 5-Summaries/{YYYY年M月}/AI热点-{YYYY-MM-DD}.md
2. A PowerShell reminder that checks at 10:50pm whether today's diary exists
   and pops a system notification if not
3. Register Windows scheduled tasks: fetch at 8pm, remind at 10:50pm

Vault structure: 0-Inbox, 1-Daily, 2-Projects, 3-Areas, 4-Resources, 5-Summaries
Put all scripts under .codex/scripts/ and give each one a log`,
  },
  vaultTree: {
    zh: `SecondBrain/
├── 0-Inbox/          # 入口：新想法、未整理的东西
├── 1-Daily/          # 日记（按 2026年8月/ 归档）
├── 2-Projects/       # 项目（CV、VAE、比赛…）
├── 3-Areas/          # 领域思考（AGI、Agent…）
├── 4-Resources/      # 资料收藏
└── 5-Summaries/      # 汇总：AI热点、周总结`,
    en: `SecondBrain/
├── 0-Inbox/          # inbox: new ideas, unsorted stuff
├── 1-Daily/          # diaries (archived by month)
├── 2-Projects/       # projects (CV, VAE, competitions…)
├── 3-Areas/          # area thinking (AGI, Agents…)
├── 4-Resources/      # saved materials
└── 5-Summaries/      # summaries: AI news, weekly recaps`,
  },
  hotMd: {
    zh: `---
tags: [AI热点, 资讯]
created: 2026-08-07
---

# AI 热点 · 2026-08-07

## [Runway 上线 Seedance 2.5，支持 50 个角色参考](https://...)

Runway 发布了支持 50 个角色参考的视频生成模型…

## [OpenAI 披露 ChatGPT 全球 10 亿用户画像](https://...)

35 岁及以上用户用量上升…

---
*数据来源：AI HOT — 过去 24 小时精选*`,
    en: `---
tags: [AI热点, 资讯]
created: 2026-08-07
---

# AI News · 2026-08-07

## [Runway launches Seedance 2.5 with 50 character references](https://...)

Runway released a video generation model supporting 50 character references…

## [OpenAI reveals ChatGPT's 1B global users](https://...)

Usage among users 35+ is rising…

---
*Source: AI HOT — curated from the last 24 hours*`,
  },
};

export default function CodexObsidianWorkflowPage() {
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
      <p dangerouslySetInnerHTML={{ __html: t("prep_check1_fast") }} />
      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-2xl mx-auto">
          <img src={`${BASE_PATH}/blog-images/terminal.png`} alt="Terminal running codex" className="w-full" />
        </div>
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">{t("prep_check1_caption")}</figcaption>
      </figure>
      <div className="mt-4 px-5 py-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl text-[16px] leading-[1.8] text-amber-800 dark:text-amber-200" dangerouslySetInnerHTML={{ __html: t("prep_check1_no") }} />

      <h3 className="mt-8">{t("prep_check2")}</h3>
      <p className="flex items-center gap-3 my-2">
        <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer" title="Obsidian 官网"><img src={`${BASE_PATH}/blog-images/obsidian-logo.svg`} alt="Obsidian logo" className="w-9 h-9" /></a>
        <span className="text-[15px] text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "Obsidian 官网：" : "Official site:"} <a href="https://obsidian.md/" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">obsidian.md</a></span>
      </p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_desc") }} />

      <h3 className="mt-8">{t("prep_check3")}</h3>
      <p className="flex items-center gap-3 my-2">
        <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" title="Node.js 官网"><img src={`${BASE_PATH}/blog-images/nodejs-logo.svg`} alt="Node.js logo" className="w-9 h-9" /></a>
        <span className="text-[15px] text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "Node.js 官网：" : "Official site:"} <a href="https://nodejs.org/" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">nodejs.org</a></span>
      </p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check3_desc") }} />
      <p>{t("prep_check3_step")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("prep_check3_s1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("prep_check3_s2") }} />
      </ul>

      <h3 className="mt-8">{t("prep_check4")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check4_desc") }} />
      <div className="mt-4 px-5 py-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep_check4_tip") }} />

      <h3 className="mt-8">{t("prep_check5")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check5_desc") }} />

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
        {codeBlocks.vaultTree[lang as keyof typeof codeBlocks.vaultTree] ?? codeBlocks.vaultTree.zh}
      </CodeBlock>
      <p>{t("get_p2")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("get_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("get_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("get_li3") }} />
      </ul>
      <p>{t("get_p3")}</p>
      <div className="mt-4 px-5 py-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("get_tip") }} />

      <h2 id="vault">{t("h2_vault")}</h2>
      <p>{t("vault_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("vault_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li4") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li5") }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("vault_p2") }} />

      <h2 id="hot">{t("h2_hot")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("hot_p1") }} />
      <CodeBlock language="markdown">
        {codeBlocks.hotMd[lang as keyof typeof codeBlocks.hotMd] ?? codeBlocks.hotMd.zh}
      </CodeBlock>
      <p>{t("hot_p2")}</p>

      <h2 id="aihot">{t("h2_aihot")}</h2>
      <p className="flex items-center gap-3 my-2">
        <img src={`${BASE_PATH}/blog-images/aihot.ico`} alt="AI HOT icon" className="w-8 h-8" />
        <a href="https://aihot.virxact.com/" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">aihot.virxact.com</a>
      </p>
      <p dangerouslySetInnerHTML={{ __html: t("aihot_p1") }} />
      <p>{t("aihot_p2")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("aihot_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("aihot_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("aihot_li3") }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("aihot_p3") }} />

      <h2 id="diary">{t("h2_diary")}</h2>
      <p>{t("diary_p1")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("diary_p2") }} />

      <h2 id="day">{t("h2_day")}</h2>
      <p>{t("day_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("day_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li4") }} />
      </ul>
      <p>{t("day_p2")}</p>

      <h2 id="faq">{t("h2_faq")}</h2>
      <p>{t("faq_intro")}</p>
      <CollapsibleCard title={t("faq_q1")}><p>{t("faq_a1")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q2")}><p>{t("faq_a2")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q3")}><p>{t("faq_a3")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q4")}><p>{t("faq_a4")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q5")}><p>{t("faq_a5")}</p></CollapsibleCard>

      <h2 id="next">{t("h2_next")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("next_p1") }} />
      <Link
        href="/blog/aihot-interest-radar"
        className="group inline-flex items-center gap-2 mt-3 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md bg-zinc-50 dark:bg-zinc-900/50"
      >
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">{t("next_link")}</span>
        <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <h2 id="ref">{t("h2_ref")}</h2>
      <div className="mt-6 space-y-3">
        {[
          { icon: "📡", title: t("ref1_title"), desc: t("ref1_desc"), href: "/blog/aihot-interest-radar", external: false },
          { icon: "💻", title: t("ref2_title"), desc: t("ref2_desc"), href: "https://github.com/Muanyan-mjq/muanyan-portfolio", external: true },
          { icon: "🔥", title: t("ref3_title"), desc: t("ref3_desc"), href: "https://aihot.virxact.com/", external: true },
          { icon: "⏰", title: t("ref4_title"), desc: t("ref4_desc"), href: "#tasks", external: false },
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
