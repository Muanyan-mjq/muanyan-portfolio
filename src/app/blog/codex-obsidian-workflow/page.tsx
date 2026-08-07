"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";

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
      "如果你用笔记软件做过知识管理，大概率遇到过这几个问题：收藏了但再也没打开过、笔记堆积成山却找不到想要的、坚持几天就断更。它们看起来像「自律问题」，但根子上往往是同一个——<strong>知识的流入完全靠手动</strong>：每条新信息都要自己建文件夹、起文件名、写日期、加标签。手动搬运一旦中断，整个系统就跟着停滞，库慢慢就荒了。",
    intro_p2:
      "我的 Obsidian 笔记库 SecondBrain 也经历过这个阶段，直到我开始用 Codex 当助手，才意识到：<strong>搬运信息这件事，恰恰是 AI 最擅长、也最该交给它的。</strong>与其要求自己每天坚持手动整理，不如把「整理」本身自动化。本文就是这套方案的完整记录：笔记库怎么设计、三个自动化分别做什么、怎么用 Windows 计划任务串起来，以及我踩过的坑。",
    h2_what: "先回答一个问题：为什么要这么搭",
    what_p1:
      "Obsidian 是本地优先的笔记软件，文件就是纯 Markdown，支持双向链接——特别适合当「第二大脑」。Codex 是 AI 编程助手，能读写文件、写脚本、做自动化。两者结合的点在于：<strong>Obsidian 负责存，Codex 负责搬。</strong>",
    what_p2:
      "具体到我的使用场景，最值钱的自动化是这三件：每天 20:00 自动抓取 AI 热点归档、22:50 提醒写日记、每月自动整理归档。下面一个个讲。",
    h2_vault: "第一步：笔记库怎么设计",
    vault_p1:
      "自动化的前提是结构稳定。如果文件夹三天两头变，脚本也跟着乱。我的库分五层，每层一个职责，新东西永远先落在 0-Inbox，处理完再归位到对应层：",
    vault_li1: "<strong>0-Inbox</strong>（入口）——所有新东西先落这里，统一处理",
    vault_li2: "<strong>1-Daily</strong>——日记，按 <code>2026年8月/</code> 这样按月归档",
    vault_li3: "<strong>2-Projects / 3-Areas</strong>——项目与领域思考，中长期沉淀",
    vault_li4: "<strong>4-Resources</strong>——资料收藏",
    vault_li5: "<strong>5-Summaries</strong>——汇总类：AI 热点、周总结都在这",
    vault_code_title: "目录结构（真实截图版）",
    vault_p2:
      "几个关键设计：一是 <strong>Inbox 清零原则</strong>——所有东西先落 Inbox，处理完必须归位，绝不堆积；二是 <strong>按月份归档</strong>——日记和热点都按月分文件夹，查询时「2026 年 7 月发生了什么」一目了然；三是 <strong>双向链接</strong>——每篇日记末尾自动补上关联笔记，让知识自动长成网络。",
    h2_hot: "自动化一：AI 热点每天自动归档",
    hot_p1:
      "我每天会看 AI 热点（数据源是 AI HOT，一个聚合站），但不想手动复制粘贴。于是写了个 Node 脚本 <code>fetch_aihot.js</code>，每天 20:00 由计划任务触发：抓当天的热点 → 整理成 Markdown → 写到 <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>。",
    hot_code_title: "抓取脚本的核心逻辑（简化）",
    hot_p2: "生成的文件长这样（这是真实文件的一部分）：",
    hot_p3:
      "注意文件名和路径都带月份：<code>AI热点-2026-08-07.md</code> 躺在 <code>2026年8月/</code> 文件夹里。这就是「按月归档」的自动版。",
    h2_diary: "自动化二：日记提醒",
    diary_p1:
      "写日记是最容易断的。所以我设了 22:50 的提醒：脚本检查当天有没有日记文件，没有就弹系统通知「今天还没写日记，快去写两笔」。",
    diary_p2:
      "写完后，我只要跟 Codex 说一句「今天的日记整理一下」，它就会：把 Inbox 里的日记移到 <code>1-Daily/2026年8月/</code>、加上日期和标签、在末尾补上当天的 AI 热点链接和关联笔记——正文一个字不动。整理完 Inbox 又空了。",
    h2_archive: "自动化三：月度归档",
    archive_p1:
      "每月初自动建 <code>{YYYY年M月}</code> 文件夹。8 月的文件夹 7 月底就建好了，等 9 月到来时，8 月的日记和热点已经整整齐齐，随时能查。这个逻辑写在抓取脚本和日记脚本里：路径永远按「当前月份」生成，所以归档是自动发生的，不需要专门的归档步骤。",
    h2_tasks: "这些是怎么串起来的",
    tasks_p1: "全部是 Windows 计划任务 + Node/PowerShell 脚本，不依赖任何第三方服务。任务清单（真实配置）：",
    tasks_code_title: "计划任务清单",
    tasks_p2:
      "脚本都放在 <code>D:\\DeepLearning_Code\\SecondBrain\\.codex\\scripts\\</code> 下，一共五个文件，职责单一：抓热点、查日记、查 Inbox、发提醒、周总结。",
    tasks_p3:
      "选计划任务而不是插件，原因很简单：<strong>透明、可改、不依赖别人</strong>。想改逻辑直接改代码，出了问题看日志就知道是哪一步。",
    h2_day: "一天的实际流程",
    day_p1: "这套系统跑起来之后，我的一天是这样的：",
    day_li1: "<strong>早上：</strong>打开 Obsidian，昨天的日记已经在 1-Daily 里，末尾带着昨天的 AI 热点链接",
    day_li2: "<strong>20:00：</strong>热点自动抓取，今晚的热点出现在 5-Summaries，命中我订阅的主题时还会弹窗提醒",
    day_li3: "<strong>晚上：</strong>写日记 → 喊一句「整理一下」→ Inbox 清空、日记归位",
    day_li4: "<strong>月底：</strong>当月文件夹自动成型，月度总结直接用当月的日记和热点写",
    day_p2: "我需要做的，只剩读和想。",
    h2_pit: "踩过的坑（真实经验）",
    pit_p1: "这套系统不是一次搭成的，以下四个坑我都实际踩过：",
    pit_li1: "<strong>中文乱码：</strong>PowerShell 5.1 读脚本默认按系统编码，UTF-8 无 BOM 的中文脚本会乱码报错。所有 .ps1 脚本必须存成 UTF-8 with BOM。",
    pit_li2: "<strong>日期错位：</strong>脚本里如果用 UTC 日期（toISOString），晚上 8 点之后会变成第二天。要按本地时区取日期。",
    pit_li3: "<strong>重复任务：</strong>我一度配了两个一模一样的抓取任务，每天跑两遍、弹两次提醒。清理时保留带日志的那个，禁用了另一个。",
    pit_li4: "<strong>误删恢复：</strong>有次误删了整个 Inbox 文件夹，好在 Windows 回收站能恢复，加上脚本路径都是按月份生成的，重建很快。养成「重要操作前先备份」的习惯。",
    h2_faq: "常见问题",
    faq_intro: "读者问得最多的几个问题：",
    faq_q1: "这套系统需要会写代码吗？",
    faq_a1: "不需要从零写。把本文的脚本和任务配置当作模板，让 Codex 或 Claude 帮你改成自己的路径和文件名即可。重点是理解「目录结构稳定 + 定时任务触发脚本」这个思路。",
    faq_q2: "脚本放在哪里？",
    faq_a2: "我的脚本统一放在 <code>SecondBrain\\.codex\\scripts\\</code> 下，和笔记库放一起，方便备份。你也可以放任何位置，只要计划任务里的路径对得上。",
    faq_q3: "怎么改抓取时间？",
    faq_a3: "打开 Windows 任务计划程序（搜索「任务计划程序」），找到对应的任务，右键 → 属性 → 触发器 → 编辑时间即可。",
    faq_q4: "出问题了怎么看日志？",
    faq_a4: "每个脚本都往 <code>scripts\\</code> 目录写日志（比如 <code>aihot_keywords.log</code>）。先看日志里最后几行，把报错复制给 Codex，它一般能直接定位。",
    faq_q5: "不想用了怎么停？",
    faq_a5: "在任务计划程序里禁用对应任务即可，脚本文件留着不碍事。想彻底卸载就删脚本 + 删任务。",
    h2_next: "下一步",
    next_p1:
      "这套工作流还在长。下一篇写它的最新成员：<strong>兴趣雷达</strong>——热点抓完后自动扫描关键词，只有命中我关心的主题（AGI、self、注意力…）才弹窗提醒，不命中就不打扰。",
    next_link: "兴趣雷达：Windows 自定义弹窗实战 →",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "本文全程用 Codex 撰写。文中的目录结构、脚本片段和计划任务都是真实运行中的那套——包括那些坑，也都是真踩过的。",
  },
  en: {
    intro_p1:
      "If you've managed knowledge in a note app, you've probably hit these: things you saved and never opened again, notes piling up with nothing findable, streaks that break after a few days. They look like discipline problems, but the root cause is usually the same — <strong>knowledge flows in entirely manually</strong>: every new item needs its own folder, filename, date, and tags. Once the manual pipeline stalls, the whole system stalls, and the vault slowly dies.",
    intro_p2:
      "My Obsidian vault SecondBrain went through exactly this phase — until I started using Codex as an assistant and realized: <strong>moving information around is exactly what AI is best at, and exactly what should be delegated.</strong> Rather than demanding daily manual filing, automate the filing itself. This article is the full record of that solution: how the vault is designed, what the three automations do, how Windows scheduled tasks tie them together, and the pitfalls I hit.",
    h2_what: "First: Why Build It This Way",
    what_p1:
      "Obsidian is a local-first note app — notes are plain Markdown with bidirectional links, great as a \"second brain.\" Codex is an AI coding assistant that can read and write files and build automations. The combination: <strong>Obsidian stores, Codex moves.</strong>",
    what_p2:
      "In my setup, the three most valuable automations are: fetching AI news every day at 8pm, reminding me to write a diary at 10:50pm, and archiving everything by month. Let's go through them one by one.",
    h2_vault: "Step 1: Designing the Vault",
    vault_p1:
      "Automation needs a stable structure. If folders change every few days, scripts get confused too. My vault has five layers, one job each. Everything new lands in 0-Inbox first, then moves to its layer once processed:",
    vault_li1: "<strong>0-Inbox</strong> (inbox) — everything new lands here first",
    vault_li2: "<strong>1-Daily</strong> — diaries, archived by month like <code>2026-08/</code>",
    vault_li3: "<strong>2-Projects / 3-Areas</strong> — projects and area thinking, long-term",
    vault_li4: "<strong>4-Resources</strong> — saved materials",
    vault_li5: "<strong>5-Summaries</strong> — summaries: AI news, weekly recaps",
    vault_code_title: "Folder structure (from the real vault)",
    vault_p2:
      "Three key design decisions: the <strong>Inbox-zero principle</strong> — everything lands in Inbox and must be filed, never left to pile up; <strong>monthly archiving</strong> — diaries and news are grouped by month so \"what happened in July 2026\" is instantly clear; and <strong>bidirectional links</strong> — each diary automatically links to related notes, letting knowledge grow into a network on its own.",
    h2_hot: "Automation 1: AI News Auto-Archived Every Day",
    hot_p1:
      "I read AI news daily (sourced from AI HOT, an aggregator), but I didn't want to copy-paste it by hand. So I wrote a Node script, <code>fetch_aihot.js</code>, triggered by a scheduled task at 8pm: fetch the day's news → format as Markdown → write to <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>.",
    hot_code_title: "Core fetch logic (simplified)",
    hot_p2: "The generated file looks like this (a real excerpt):",
    hot_p3:
      "Notice both the filename and the path carry the month: <code>AI热点-2026-08-07.md</code> lives inside <code>2026年8月/</code>. That's the automatic version of monthly archiving.",
    h2_diary: "Automation 2: Diary Reminder",
    diary_p1:
      "Diaries are the easiest habit to break. So I set a 10:50pm reminder: the script checks whether today's diary exists; if not, it pops a system notification — \"You haven't written your diary today, go write a couple lines.\"",
    diary_p2:
      "After I write it, I just tell Codex \"organize today's diary.\" It moves the note from Inbox to <code>1-Daily/2026年8月/</code>, adds date and tags, and appends today's AI news link plus related notes — without touching a word of the body. Inbox is empty again.",
    h2_archive: "Automation 3: Monthly Archiving",
    archive_p1:
      "At the start of each month the <code>{YYYY年M月}</code> folder is created automatically. August's folder was ready at the end of July — when September arrives, August's diaries and news are already tidy and searchable. This logic lives inside the fetch and diary scripts: paths are always generated from the current month, so archiving happens on its own, with no dedicated step.",
    h2_tasks: "How It All Connects",
    tasks_p1: "Everything runs on Windows scheduled tasks + Node/PowerShell scripts — no third-party services. The task list (real config):",
    tasks_code_title: "Scheduled task list",
    tasks_p2:
      "Scripts live in <code>D:\\DeepLearning_Code\\SecondBrain\\.codex\\scripts\\</code> — five files, each with one job: fetch news, check diary, check Inbox, send reminders, weekly summary.",
    tasks_p3:
      "Why scheduled tasks instead of plugins? Simple: <strong>transparent, editable, and independent</strong>. Change the logic by editing code; when something breaks, the logs tell you exactly which step.",
    h2_day: "A Day in the Life",
    day_p1: "Once this system runs, my day looks like this:",
    day_li1: "<strong>Morning:</strong> open Obsidian — yesterday's diary is already in 1-Daily, with yesterday's AI news link at the end",
    day_li2: "<strong>8pm:</strong> news is fetched automatically and appears in 5-Summaries; if it matches my subscribed topics, a popup reminds me",
    day_li3: "<strong>Evening:</strong> write the diary → say \"organize it\" → Inbox clears, diary files itself",
    day_li4: "<strong>End of month:</strong> the month's folder is already shaped; the monthly recap writes itself from the diaries and news",
    day_p2: "All I have to do is read and think.",
    h2_pit: "Pitfalls (Real Experience)",
    pit_p1: "This system wasn't built in one go. Four pitfalls I actually hit:",
    pit_li1: "<strong>Garbled Chinese:</strong> PowerShell 5.1 reads scripts using the system codepage, so UTF-8 without BOM gets mangled. Every .ps1 must be saved as UTF-8 with BOM.",
    pit_li2: "<strong>Off-by-one dates:</strong> if the script uses UTC dates (toISOString), after 8pm it rolls to the next day. Always take the date from the local timezone.",
    pit_li3: "<strong>Duplicate tasks:</strong> I once had two identical fetch tasks — it ran twice a day and popped double reminders. Keep the one with logs, disable the other.",
    pit_li4: "<strong>Accidental deletion:</strong> I once deleted the whole Inbox folder by mistake. The Windows Recycle Bin saved it, and because script paths are month-based, rebuilding was fast. Backup before any big operation.",
    h2_faq: "FAQ",
    faq_intro: "The questions readers ask most:",
    faq_q1: "Do I need to know how to code?",
    faq_a1: "Not from scratch. Use this article's scripts and task config as templates, and have Codex or Claude adapt them to your paths and filenames. The core idea to grasp: \"stable folder structure + scheduled tasks running scripts.\"",
    faq_q2: "Where do the scripts live?",
    faq_a2: "Mine live in <code>SecondBrain\\.codex\\scripts\\</code>, inside the vault so they're backed up together. Any location works as long as the scheduled task paths match.",
    faq_q3: "How do I change the fetch time?",
    faq_a3: "Open Task Scheduler (search \"Task Scheduler\"), find the task, right-click → Properties → Triggers → Edit the time.",
    faq_q4: "How do I debug when something breaks?",
    faq_a4: "Every script writes a log in the <code>scripts\\</code> folder (e.g. <code>aihot_keywords.log</code>). Read the last few lines and paste the error to Codex — it usually pinpoints the issue directly.",
    faq_q5: "How do I stop it?",
    faq_a5: "Disable the task in Task Scheduler; the scripts can stay. To uninstall completely, delete the scripts and the tasks.",
    h2_next: "What's Next",
    next_p1:
      "This workflow keeps growing. The next post covers its newest member: the <strong>Interest Radar</strong> — after fetching news, it scans keywords and pops a notification only when topics you care about (AGI, self, attention…) appear. No match, no interruption.",
    next_link: "Interest Radar: Custom Windows Popups in Practice →",
    bottom_title: "How This Article Was Written",
    bottom_desc:
      "Written entirely with Codex. The folder structure, scripts, and scheduled tasks here are the real ones running on my machine — including the pitfalls, which really happened.",
  },
} as const;

const codeBlocks = {
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
  fetchCore: {
    zh: `// fetch_aihot.js（简化）
const data = await get('https://aihot.virxact.com/api/public/items?mode=selected&since=...');
const main = data.items.slice(0, 7);

let md = \`# AI 热点 · \${today}\\n\\n\`;
main.forEach(i => {
  md += \`## [\${i.title}](\${i.permalink})\\n\\n\${i.summary}\\n\\n\`;
});
fs.writeFileSync(\`5-Summaries/\${monthDir}/AI热点-\${today}.md\`, md);`,
    en: `// fetch_aihot.js (simplified)
const data = await get('https://aihot.virxact.com/api/public/items?mode=selected&since=...');
const main = data.items.slice(0, 7);

let md = \`# AI News · \${today}\\n\\n\`;
main.forEach(i => {
  md += \`## [\${i.title}](\${i.permalink})\\n\\n\${i.summary}\\n\\n\`;
});
fs.writeFileSync(\`5-Summaries/\${monthDir}/AI热点-\${today}.md\`, md);`,
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
  tasks: {
    zh: `20:00  Codex_AI热点推送        node fetch_aihot.js        fetch news → 5-Summaries
22:50  SecondBrain_DiaryReminder  remind_diary.ps1           diary reminder
10:00  SecondBrain_InboxMonitor   remind_inbox.ps1           Inbox reminder
18:00  SecondBrain_InboxMonitor   remind_inbox.ps1`,
    en: `20:00  Codex_AI热点推送        node fetch_aihot.js        fetch news → 5-Summaries
22:50  SecondBrain_DiaryReminder  remind_diary.ps1           diary reminder
10:00  SecondBrain_InboxMonitor   remind_inbox.ps1           Inbox reminder
18:00  SecondBrain_InboxMonitor   remind_inbox.ps1`,
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

      <h2 id="what">{t("h2_what")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("what_p1") }} />
      <p>{t("what_p2")}</p>

      <h2 id="vault">{t("h2_vault")}</h2>
      <p>{t("vault_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("vault_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li4") }} />
        <li dangerouslySetInnerHTML={{ __html: t("vault_li5") }} />
      </ul>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("vault_code_title")}</p>
      <CodeBlock language="text">
        {codeBlocks.vaultTree[lang as keyof typeof codeBlocks.vaultTree] ?? codeBlocks.vaultTree.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("vault_p2") }} />

      <h2 id="hot">{t("h2_hot")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("hot_p1") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("hot_code_title")}</p>
      <CodeBlock language="javascript">
        {codeBlocks.fetchCore[lang as keyof typeof codeBlocks.fetchCore] ?? codeBlocks.fetchCore.zh}
      </CodeBlock>
      <p>{t("hot_p2")}</p>
      <CodeBlock language="markdown">
        {codeBlocks.hotMd[lang as keyof typeof codeBlocks.hotMd] ?? codeBlocks.hotMd.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("hot_p3") }} />

      <h2 id="diary">{t("h2_diary")}</h2>
      <p>{t("diary_p1")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("diary_p2") }} />

      <h2 id="archive">{t("h2_archive")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("archive_p1") }} />

      <h2 id="tasks">{t("h2_tasks")}</h2>
      <p>{t("tasks_p1")}</p>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("tasks_code_title")}</p>
      <CodeBlock language="text">
        {codeBlocks.tasks[lang as keyof typeof codeBlocks.tasks] ?? codeBlocks.tasks.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("tasks_p2") }} />
      <p dangerouslySetInnerHTML={{ __html: t("tasks_p3") }} />

      <h2 id="day">{t("h2_day")}</h2>
      <p>{t("day_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("day_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li4") }} />
      </ul>
      <p>{t("day_p2")}</p>

      <h2 id="pit">{t("h2_pit")}</h2>
      <p>{t("pit_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("pit_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("pit_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("pit_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("pit_li4") }} />
      </ul>

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

      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
      </div>
    </BlogPostLayout>
  );
}
