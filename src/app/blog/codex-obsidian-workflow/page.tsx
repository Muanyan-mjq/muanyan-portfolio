"use client";

import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";

const post = blogPosts.find((p) => p.slug === "codex-obsidian-workflow")!;

const content = {
  zh: {
    intro_p1:
      "我的 Obsidian 笔记库叫 SecondBrain，已经用了很久。但一直有个尴尬：<strong>知识的流入靠手动</strong>——每天刷到的 AI 热点、写下的日记、突然冒出来的想法，都得自己搬进库里。搬着搬着就懒了，库就荒了。",
    intro_p2:
      "直到我开始用 Codex 当助手，才意识到一件事：为什么不让 AI 来搬？于是有了这套工作流。核心一句话：<strong>笔记库里的东西，尽量自动流进来、自动归位；人只负责读和想。</strong>",
    h2_vault: "第一步：笔记库怎么设计",
    vault_p1: "自动化的前提是结构稳定。如果文件夹三天两头变，脚本也跟着乱。我的库分成五层，每层一个职责：",
    vault_li1: "<strong>0-Inbox</strong>（入口）——所有新东西先落这里，统一处理",
    vault_li2: "<strong>1-Daily</strong>——日记，按 <code>2026年8月/</code> 这样按月归档",
    vault_li3: "<strong>2-Projects / 3-Areas</strong>——项目与领域思考，中长期沉淀",
    vault_li4: "<strong>4-Resources</strong>——资料收藏",
    vault_li5: "<strong>5-Summaries</strong>——汇总类，AI 热点、周总结都在这",
    vault_code_title: "目录结构（简化）",
    h2_hot: "自动化一：AI 热点每天自动归档",
    hot_p1:
      "每天 20:00，Windows 计划任务跑一个 Node 脚本 <code>fetch_aihot.js</code>：从 AI HOT 抓当天的热点，整理成 Markdown，写到 <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>。",
    hot_code_title: "抓取脚本的核心逻辑（简化）",
    hot_p2: "生成的文件长这样：",
    h2_diary: "自动化二：日记提醒",
    diary_p1:
      "22:50 再跑一个提醒脚本：如果当天还没写日记，就弹系统通知「今天还没写日记，快去写两笔」。",
    diary_p2:
      "写完后，我只要跟 Codex 说一句「今天的日记整理一下」，它就会把 Inbox 里的日记移到 <code>1-Daily/2026年8月/</code>、加上日期和标签、在末尾补上关联笔记链接——正文一个字不动。",
    h2_archive: "自动化三：月度归档",
    archive_p1:
      "每月初自动建 <code>{YYYY年M月}</code> 文件夹，日记、AI 热点都按月份归位。8 月的文件夹早早就建好了，等 9 月到来时，8 月的记录已经整整齐齐，随时能查。",
    h2_tasks: "这些是怎么串起来的",
    tasks_p1: "全部是 Windows 计划任务 + Node/PowerShell 脚本，不用装任何第三方服务：",
    tasks_code_title: "计划任务清单",
    tasks_p2:
      "选计划任务而不是插件，原因很简单：<strong>透明、可改、不依赖别人</strong>。脚本就躺在 <code>.codex/scripts/</code> 里，想改逻辑直接改代码，出了问题看日志就知道是哪一步。",
    h2_effect: "现在的效果",
    effect_p1:
      "每天打开 Obsidian，看到的都是已经整理好的东西：今天的热点躺在 5-Summaries，日记躺在 1-Daily，Inbox 永远是空的。我只需要做一件事——读，然后想。",
    h2_next: "下一步",
    next_p1:
      "这套工作流还在长。下一篇写它的最新成员：<strong>兴趣雷达</strong>——热点抓完后自动扫描关键词，只有命中我关心的主题（AGI、self、注意力…）才弹窗提醒，不命中就不打扰。",
    next_link: "兴趣雷达：Windows 自定义弹窗实战 →",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "本文全程用 Codex 撰写，文中的目录结构、脚本片段和计划任务都是真实运行中的那套。",
  },
  en: {
    intro_p1:
      "My Obsidian vault is called SecondBrain, and I've used it for a long time. But there was always an awkward part: <strong>knowledge flowed in manually</strong> — the AI news I browsed, the diary I wrote, the ideas that popped up — I had to carry them into the vault myself. Carry enough times and you get lazy; the vault goes stale.",
    intro_p2:
      "Until I started using Codex as an assistant, and realized: why not let the AI carry things in? That's this workflow. One sentence at its core: <strong>things in the vault should flow in and file themselves automatically — humans only read and think.</strong>",
    h2_vault: "Step 1: Designing the Vault",
    vault_p1: "Automation needs a stable structure. If folders change every few days, the scripts get confused too. My vault has five layers, one job each:",
    vault_li1: "<strong>0-Inbox</strong> (inbox) — everything new lands here first",
    vault_li2: "<strong>1-Daily</strong> — diaries, archived by month like <code>2026-08/</code>",
    vault_li3: "<strong>2-Projects / 3-Areas</strong> — projects and area thinking, long-term",
    vault_li4: "<strong>4-Resources</strong> — saved materials",
    vault_li5: "<strong>5-Summaries</strong> — summaries: AI news, weekly recaps",
    vault_code_title: "Folder structure (simplified)",
    h2_hot: "Automation 1: AI News Auto-Archived Every Day",
    hot_p1:
      "At 8pm every day, a Windows scheduled task runs a Node script <code>fetch_aihot.js</code>: it fetches the day's AI news from AI HOT, formats it as Markdown, and writes it to <code>5-Summaries/2026年8月/AI热点-2026-08-07.md</code>.",
    hot_code_title: "Core fetch logic (simplified)",
    hot_p2: "The generated file looks like this:",
    h2_diary: "Automation 2: Diary Reminder",
    diary_p1:
      "At 10:50pm another script checks: if today's diary isn't written yet, pop a system notification — \"You haven't written your diary today, go write a couple lines.\"",
    diary_p2:
      "After I write it, I just tell Codex \"organize today's diary.\" It moves the note from Inbox to <code>1-Daily/2026年8月/</code>, adds date and tags, and appends related-note links at the end — without touching a word of the body.",
    h2_archive: "Automation 3: Monthly Archiving",
    archive_p1:
      "At the start of each month the folder <code>{YYYY年M月}</code> is created automatically, and diaries and AI news are filed by month. August's folder was ready early — when September arrives, August's records are already tidy and searchable.",
    h2_tasks: "How It All Connects",
    tasks_p1: "Everything runs on Windows scheduled tasks + Node/PowerShell scripts — no third-party services:",
    tasks_code_title: "Scheduled task list",
    tasks_p2:
      "Why scheduled tasks instead of plugins? Simple: <strong>transparent, editable, and independent</strong>. Scripts live in <code>.codex/scripts/</code> — change the logic by editing the code, and check logs when something breaks.",
    h2_effect: "The Result",
    effect_p1:
      "Every day when I open Obsidian, everything is already organized: today's news sits in 5-Summaries, the diary sits in 1-Daily, and Inbox is always empty. My only job is to read — then think.",
    h2_next: "What's Next",
    next_p1:
      "This workflow keeps growing. The next post covers its newest member: the <strong>Interest Radar</strong> — after fetching news, it scans keywords and pops a notification only when topics you care about (AGI, self, attention…) appear. No match, no interruption.",
    next_link: "Interest Radar: Custom Windows Popups in Practice →",
    bottom_title: "How This Article Was Written",
    bottom_desc:
      "Written entirely with Codex. The folder structure, script snippets, and scheduled tasks in this article are the real ones running on my machine.",
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
    zh: `20:00  Codex_AI热点推送        node fetch_aihot.js        抓取热点 → 写入 5-Summaries
22:50  SecondBrain_DiaryReminder  remind_diary.ps1           没写日记就弹提醒
10:00  SecondBrain_InboxMonitor   remind_inbox.ps1           Inbox 有东西就提醒
18:00  SecondBrain_InboxMonitor   remind_inbox.ps1`,
    en: `20:00  Codex_AI热点推送        node fetch_aihot.js        fetch news → write to 5-Summaries
22:50  SecondBrain_DiaryReminder  remind_diary.ps1           remind if diary not written
10:00  SecondBrain_InboxMonitor   remind_inbox.ps1           remind if Inbox has items
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

      <h2 id="effect">{t("h2_effect")}</h2>
      <p>{t("effect_p1")}</p>

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
