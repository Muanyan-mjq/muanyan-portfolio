"use client";

import { useState } from "react";
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
      "上一篇搭好了每日 AI 热点自动归档——每天 20:00，7 条热点整整齐齐地躺进 Obsidian。但很快发现一个新问题：<strong>7 条里我真正关心的可能只有一两条</strong>。AGI、self、注意力、算子……我每天都要打开那份文件，从头翻到尾，就为了确认「今天有没有我关心的」。翻到没有的时候，那种失落感特别真实。",
    intro_p2:
      "于是有了「兴趣雷达」：热点抓取完成后自动扫描关键词，命中我订阅的主题就弹窗提醒，没命中就静默。原则一句话：<strong>命中才打扰，不命中不打扰。</strong>本文讲清楚它怎么设计、踩了哪四个坑、以及怎么改成你自己的。",
    h2_need: "需求：什么样的提醒才算是「好提醒」",
    need_p1: "动手前，我先把需求写成了三条硬标准：",
    need_li1: "<strong>精准：</strong>只在我关心的主题出现时提醒，其他一概静默",
    need_li2: "<strong>即时：</strong>热点抓完马上判断，不隔夜",
    need_li3: "<strong>可定制：</strong>过几天想研究新方向了，改配置就行，不用改代码",
    need_p2: "这三条标准后来帮我做了很多设计取舍——比如关键词要用「主题 + 别名」而不是散词，弹窗要能一键打开笔记，配置要独立成文件。",
    h2_plan: "方案总览",
    plan_p1:
      "三步：抓取（上一篇的脚本，已有）→ 关键词扫描 → 弹窗。全部在本地跑，每天 20:00 由同一个计划任务触发。流程是这样的：",
    plan_step1: "<strong>抓取：</strong><code>fetch_aihot.js</code> 把热点写成 Markdown（上一篇讲过）",
    plan_step2: "<strong>扫描：</strong>抓取完成后自动调用通知脚本，读当天文件，逐个主题检查关键词",
    plan_step3: "<strong>弹窗：</strong>命中任意主题 → 弹出自定义窗口；否则写一行日志，安静结束",
    h2_config: "关键词怎么配：主题 + 别名",
    config_p1:
      "一开始我试过直接用散词（AGI、self、attention…），但很快发现问题：<strong>散词不知道「属于哪个主题」</strong>，弹窗只能说「命中：self」，你还是不知道这条值不值得看。",
    config_p2:
      "改成「主题 + 别名」之后，每个主题下挂多个匹配词，命中任一就归入该主题。弹窗告诉你是「哪个主题」，还带上命中的那条热点标题——一眼就知道该不该点开。",
    config_code_title: "aihot_keywords.json（真实配置）",
    config_p3:
      "想研究新方向？加一个 topic 就行。脚本每次运行都会重新读这个文件，不用改任何代码——这满足了需求里的第三条「可定制」。",
    h2_design: "弹窗交互是怎么设计的",
    design_p1: "弹窗不是随便画的，每个选择都有理由：",
    design_li1: "<strong>为什么居中：</strong>右下角太容易被忽略，居中一定会被看到",
    design_li2: "<strong>为什么亮色 Fluent 风：</strong>和 Windows 11 的视觉语言一致，白底圆角阴影，看着不突兀",
    design_li3: "<strong>为什么实时倒计时：</strong>告诉你它「会自己走」，不会一直占着屏幕；20 秒够读完一条标题",
    design_li4: "<strong>为什么有按钮：</strong>「打开热点笔记」直接跳 Obsidian，看到感兴趣的当场就读",
    h2_popup: "弹窗长什么样",
    popup_p1: "最终效果（这是我机器上的真实截图）：",
    popup_p2:
      "顶部蓝色渐变条、左侧渐变圆形 🔥 图标、标题 + 命中主题数、三个主题标签、命中内容卡片（左侧蓝色竖条强调）、右下角「20 秒后自动关闭」实时倒计时 + 两个圆角按钮。",
    h2_pit1: "坑 1：系统通知根本弹不出来",
    pit1_p1:
      "第一版用的是 WinRT Toast（Windows 通知中心那种）。代码调用成功、日志也写了，但屏幕上什么都没有。排查半天发现：这种「应用未注册」的通知会被系统静默吞掉——调用返回成功，但系统根本不展示。",
    pit1_p2: "结论：<strong>别依赖系统通知，自己做窗口。</strong>这也让我彻底掌握了弹窗的样式控制权。",
    h2_pit2: "坑 2：PowerShell 的事件处理不触发",
    pit2_p1:
      "换成 WPF 窗口后，按钮和计时器都「不工作」——点了没反应，窗口也不自动关。排查了很久才明白：PowerShell 的事件处理脚本需要运行空间有空闲，而 <code>Dispatcher.Run()</code> 把主运行空间堵死了，事件永远轮不到执行。",
    pit2_p2:
      "解法：把弹窗逻辑整体用 <code>Add-Type</code> 编译成原生 C# 类，按钮、计时器全部走 .NET 原生事件，跟 PowerShell 的事件机制彻底解耦。改完之后按钮和倒计时立刻正常。",
    h2_pit3: "坑 3：窗口关了，进程还赖着不走",
    pit3_p1:
      "原生 C# 里计时器正常跳了（每秒写日志为证），窗口也关了，但进程就是不退出。原因：直接 <code>Dispatcher.Run()</code> 不会因为窗口关闭而返回。正确做法是 WPF 的标准用法：<strong><code>Application.Run(window)</code></strong>——窗口一关，应用就退出。",
    h2_pit4: "坑 4：中文乱码",
    pit4_p1:
      "PowerShell 5.1 读脚本默认按系统编码，UTF-8 无 BOM 的中文脚本直接乱码报错。所有脚本文件必须存成 <strong>UTF-8 with BOM</strong>。这个坑在上一篇也提过，值得再强调一次。",
    h2_code: "核心代码",
    code_p1: "弹窗 + 实时倒计时最核心的部分（C#，简化）：",
    code_p2:
      "完整脚本在 <code>.codex/scripts/notify_aihot_keywords.ps1</code>，关键词配置在同目录 <code>aihot_keywords.json</code>，想直接抄的话两行命令就能跑起来。",
    h2_result: "运行效果：日志长什么样",
    result_p1: "每次运行都会写日志，命中与否都有记录。真实日志示例：",
    result_code: `2026-08-07 20:49 NOTIFY: 多模态 / 生成 | Runway 上线 Seedance 2.5，支持 50 个角色参考
2026-08-07 20:06 OK: 无命中`,
    result_p2:
      "「无命中」的日子是大多数——这很好，说明它真的只在值得的时候出现。命中那天，弹窗里的标题就是日志里那条，点「打开热点笔记」直接跳到 Obsidian 的对应文件。",
    h2_custom: "怎么改成自己的",
    custom_p1: "四个最常用的定制点：",
    custom_li1: "<strong>换主题：</strong>改 <code>aihot_keywords.json</code>，一个 topic 就是一组关键词",
    custom_li2: "<strong>换样式：</strong>XAML 里改颜色、圆角、宽度、图标",
    custom_li3: "<strong>换时长：</strong>把传给 <code>Show()</code> 的秒数改掉，比如 15 或 30",
    custom_li4: "<strong>换位置：</strong><code>WindowStartupLocation</code> 改成 CenterScreen 或 Manual 自己定位",
    custom_p2: "想加声音、加图标、改成点击卡片就打开笔记？这些都是 XAML 里几分钟的事，改完重启脚本即可。",
    h2_faq: "常见问题",
    faq_intro: "几个常见问题：",
    faq_q1: "关键词会误报吗？",
    faq_a1: "会。比如裸词「self」可能命中 self-hosted、self-improving。所以配置里尽量用精确短语（Self-Initialization、self-attention），少用单字母/短词。误报多就把词改精确，宁可漏报不要打扰。",
    faq_q2: "弹窗不弹出来怎么办？",
    faq_a2: "先看 <code>aihot_keywords.log</code> 最后几行：如果是「SKIP: 热点文件不存在」，说明抓取没成功，检查网络和计划任务；如果是「OK: 无命中」，说明今天确实没有你关心的主题。",
    faq_q3: "一天会弹几次？",
    faq_a3: "每天最多一次——热点每天只抓一次，扫描也只在抓取后跑一次。不会重复打扰。",
    faq_q4: "想手动测试弹窗？",
    faq_a4: "运行 <code>powershell -File notify_aihot_keywords.ps1 -Test</code>，会立刻弹一个测试窗口（带倒计时），不动也会自动消失。",
    h2_next: "下一步",
    next_p1:
      "这个「兴趣雷达」的思路还能延伸：不只是热点——论文、视频、播客，任何每天会新增的内容源都能接。下一篇可能是把弹窗做成一个更通用的「订阅提醒器」。",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "全程用 Codex 撰写。文中的弹窗截图就是我机器上的真实运行画面，四个坑也都真真实实发生过。",
  },
  en: {
    intro_p1:
      "The previous post set up daily AI news archiving — at 8pm, seven items land neatly in Obsidian. But a new problem appeared fast: <strong>of those seven, I really only care about one or two</strong>. AGI, self, attention, operators… every day I'd open the file and skim from top to bottom, just to check \"is there anything for me today?\" And on the days there wasn't, the letdown was real.",
    intro_p2:
      "So I built the \"Interest Radar\": after the news is fetched, keywords are scanned automatically; if a topic I subscribe to matches, a popup appears; otherwise it stays silent. One principle: <strong>interrupt only on a match — otherwise, don't interrupt.</strong> This post covers how it's designed, the four pitfalls I hit, and how to make it yours.",
    h2_need: "Requirements: What Makes a Good Notification",
    need_p1: "Before building, I wrote down three hard requirements:",
    need_li1: "<strong>Precise:</strong> only notify when a topic I care about appears — everything else stays silent",
    need_li2: "<strong>Timely:</strong> judge immediately after the news is fetched, not the next day",
    need_li3: "<strong>Customizable:</strong> when I want to follow a new direction, edit config — not code",
    need_p2:
      "These three requirements later drove many design decisions — keywords as \"topics with aliases\" instead of loose words, a popup that opens the note in one click, and config as a standalone file.",
    h2_plan: "The Plan",
    plan_p1:
      "Three steps: fetch (the script from the previous post) → keyword scan → popup. Everything runs locally, triggered by the same 8pm scheduled task. The flow:",
    plan_step1: "<strong>Fetch:</strong> <code>fetch_aihot.js</code> writes the news as Markdown (from the previous post)",
    plan_step2: "<strong>Scan:</strong> after fetching, the notify script is called automatically; it reads today's file and checks each topic's keywords",
    plan_step3: "<strong>Popup:</strong> any topic matched → show a custom window; otherwise write one log line and end quietly",
    h2_config: "Configuring Keywords: Topics with Aliases",
    config_p1:
      "At first I tried loose words (AGI, self, attention…), but a problem showed up quickly: <strong>a loose word doesn't know which topic it belongs to</strong> — the popup could only say \"matched: self,\" and you still don't know if it's worth reading.",
    config_p2:
      "Switching to \"topics with aliases\" fixed it: each topic carries several match words, and hitting any of them counts as that topic. The popup tells you which topic — and includes the matched headline, so you know at a glance whether to open it.",
    config_code_title: "aihot_keywords.json (real config)",
    config_p3:
      "Want to follow a new direction? Just add a topic. The script re-reads this file on every run — no code changes. That satisfies requirement three: customizable.",
    h2_design: "Designing the Popup Interaction",
    design_p1: "The popup wasn't drawn casually — every choice has a reason:",
    design_li1: "<strong>Centered:</strong> the bottom-right corner is too easy to miss; center-screen gets seen",
    design_li2: "<strong>Light Fluent style:</strong> consistent with Windows 11's visual language — white, rounded, soft shadow, unobtrusive",
    design_li3: "<strong>Live countdown:</strong> tells you it will go away on its own; 20 seconds is enough to read one headline",
    design_li4: "<strong>Buttons:</strong> \"Open news note\" jumps straight to Obsidian — read it the moment you're interested",
    h2_popup: "What the Popup Looks Like",
    popup_p1: "The final result (a real screenshot from my machine):",
    popup_p2:
      "A blue gradient bar on top, a gradient circular 🔥 icon on the left, title + matched-topic count, three topic chips, a matched-content card with a blue accent bar, and a live \"closes in N seconds\" countdown plus two rounded buttons.",
    h2_pit1: "Pit 1: System Notifications Never Showed Up",
    pit1_p1:
      "The first version used WinRT toasts (the notification-center kind). The API call succeeded and logs were written, but nothing appeared on screen. After digging: this kind of \"unregistered app\" notification gets silently swallowed by the system — the call succeeds, but Windows never displays it.",
    pit1_p2: "Lesson: <strong>don't rely on system toasts — build your own window.</strong> As a bonus, I got full control over the styling.",
    h2_pit2: "Pit 2: PowerShell Event Handlers Never Fired",
    pit2_p1:
      "After switching to a WPF window, the buttons and timer \"didn't work\" — clicks did nothing and the window never auto-closed. It took a while to realize: PowerShell event scripts need the runspace to be free, but <code>Dispatcher.Run()</code> blocks the main runspace, so events never get a chance to run.",
    pit2_p2:
      "Fix: compile the whole popup logic into a native C# class with <code>Add-Type</code>, so buttons and timers use plain .NET events — completely decoupled from PowerShell's event machinery. After that, buttons and the countdown worked immediately.",
    h2_pit3: "Pit 3: The Process Refused to Exit",
    pit3_p1:
      "In native C#, the timer ticked correctly (proven by per-second log lines), the window closed — but the process stayed alive. Why: a bare <code>Dispatcher.Run()</code> doesn't return when the window closes. The right way is WPF's standard pattern: <strong><code>Application.Run(window)</code></strong> — when the window closes, the app exits.",
    h2_pit4: "Pit 4: Garbled Chinese Characters",
    pit4_p1:
      "PowerShell 5.1 reads scripts using the system codepage, so UTF-8 scripts without a BOM get mangled and fail to parse. Every script must be saved as <strong>UTF-8 with BOM</strong>. I mentioned this in the previous post — it's worth repeating.",
    h2_code: "Core Code",
    code_p1: "The heart of the popup + live countdown (C#, simplified):",
    code_p2:
      "The full script lives at <code>.codex/scripts/notify_aihot_keywords.ps1</code>, and keyword config is in <code>aihot_keywords.json</code> next to it. Two commands and you're running.",
    h2_result: "In Action: What the Log Looks Like",
    result_p1: "Every run writes a log line, whether it matched or not. A real example:",
    result_code: `2026-08-07 20:49 NOTIFY: Multimodal / Generation | Runway launches Seedance 2.5
2026-08-07 20:06 OK: no match`,
    result_p2:
      "Most days say \"no match\" — which is good; it only appears when it's worth appearing. On a match day, the headline in the popup is exactly that log line, and \"Open news note\" jumps straight to the file in Obsidian.",
    h2_custom: "Making It Your Own",
    custom_p1: "The four most useful customization points:",
    custom_li1: "<strong>Topics:</strong> edit <code>aihot_keywords.json</code> — one topic is one group of keywords",
    custom_li2: "<strong>Style:</strong> change colors, radius, width, icon in the XAML",
    custom_li3: "<strong>Duration:</strong> change the seconds passed to <code>Show()</code>, e.g. 15 or 30",
    custom_li4: "<strong>Position:</strong> set <code>WindowStartupLocation</code> to CenterScreen or Manual",
    custom_p2:
      "Want a sound, an icon, or click-anywhere-to-open? Those are minutes of XAML edits — restart the script and you're done.",
    h2_faq: "FAQ",
    faq_intro: "A few common questions:",
    faq_q1: "Can keywords false-positive?",
    faq_a1: "Yes. A bare word like \"self\" can match self-hosted or self-improving. So use precise phrases (Self-Initialization, self-attention) and avoid single letters or short words. If it over-notifies, tighten the words — better to under-notify than to annoy.",
    faq_q2: "What if the popup doesn't appear?",
    faq_a2: "Check the last lines of <code>aihot_keywords.log</code>: \"SKIP: hot file not found\" means the fetch failed — check network and the scheduled task; \"OK: no match\" means today simply had nothing you care about.",
    faq_q3: "How many times per day?",
    faq_a3: "At most once — news is fetched once a day and scanned right after. No repeated interruptions.",
    faq_q4: "How do I test the popup manually?",
    faq_a4: "Run <code>powershell -File notify_aihot_keywords.ps1 -Test</code> — a test window pops up immediately (with countdown) and disappears on its own.",
    h2_next: "What's Next",
    next_p1:
      "This \"interest radar\" idea extends beyond news — papers, videos, podcasts, any source that grows daily. The next step might be turning the popup into a general-purpose \"subscription notifier.\"",
    bottom_title: "How This Article Was Written",
    bottom_desc:
      "Written entirely with Codex. The popup screenshot is a real capture from my machine, and all four pitfalls actually happened.",
  },
} as const;

const codeBlocks = {
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
  csharp: {
    zh: `// C#：实时倒计时 + 自动关闭（简化）
var countdown = (TextBlock)win.FindName("CountdownText");
int left = seconds;

var timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1) };
timer.Tick += (s, e) =>
{
    left--;
    if (left <= 0) { timer.Stop(); win.Close(); }
    else countdown.Text = left + " 秒后自动关闭";
};
timer.Start();

// 关键：用 Application.Run，窗口关闭后进程才会退出
var app = new Application();
app.Run(win);`,
    en: `// C#: live countdown + auto-close (simplified)
var countdown = (TextBlock)win.FindName("CountdownText");
int left = seconds;

var timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1) };
timer.Tick += (s, e) =>
{
    left--;
    if (left <= 0) { timer.Stop(); win.Close(); }
    else countdown.Text = left + "s to auto-close";
};
timer.Start();

// Key: use Application.Run so the process exits when the window closes
var app = new Application();
app.Run(win);`,
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

      <h2 id="need">{t("h2_need")}</h2>
      <p>{t("need_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("need_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("need_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("need_li3") }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("need_p2") }} />

      <h2 id="plan">{t("h2_plan")}</h2>
      <p>{t("plan_p1")}</p>
      <ol className="list-decimal pl-5 my-4 space-y-3 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("plan_step1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("plan_step2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("plan_step3") }} />
      </ol>

      <h2 id="config">{t("h2_config")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("config_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("config_p2") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("config_code_title")}</p>
      <CodeBlock language="json">
        {codeBlocks.configJson[lang as keyof typeof codeBlocks.configJson] ?? codeBlocks.configJson.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("config_p3") }} />

      <h2 id="design">{t("h2_design")}</h2>
      <p>{t("design_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("design_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_li4") }} />
      </ul>

      <h2 id="popup">{t("h2_popup")}</h2>
      <p>{t("popup_p1")}</p>
      <img
        src={`${BASE_PATH}/aihot-popup.png`}
        alt="AI hot news interest radar popup"
        className="w-full max-w-2xl rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg my-3"
      />
      <p dangerouslySetInnerHTML={{ __html: t("popup_p2") }} />

      <h2 id="pit1">{t("h2_pit1")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit1_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("pit1_p2") }} />

      <h2 id="pit2">{t("h2_pit2")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit2_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("pit2_p2") }} />

      <h2 id="pit3">{t("h2_pit3")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit3_p1") }} />

      <h2 id="pit4">{t("h2_pit4")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit4_p1") }} />

      <h2 id="result">{t("h2_result")}</h2>
      <p>{t("result_p1")}</p>
      <CodeBlock language="text">{t("result_code")}</CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("result_p2") }} />

      <h2 id="code">{t("h2_code")}</h2>
      <p>{t("code_p1")}</p>
      <CodeBlock language="csharp">
        {codeBlocks.csharp[lang as keyof typeof codeBlocks.csharp] ?? codeBlocks.csharp.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("code_p2") }} />

      <h2 id="custom">{t("h2_custom")}</h2>
      <p>{t("custom_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("custom_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li4") }} />
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("custom_p2") }} />

      <h2 id="faq">{t("h2_faq")}</h2>
      <p>{t("faq_intro")}</p>
      <CollapsibleCard title={t("faq_q1")}><p>{t("faq_a1")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q2")}><p>{t("faq_a2")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q3")}><p>{t("faq_a3")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q4")}><p>{t("faq_a4")}</p></CollapsibleCard>

      <h2 id="next">{t("h2_next")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("next_p1") }} />

      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
      </div>
    </BlogPostLayout>
  );
}
