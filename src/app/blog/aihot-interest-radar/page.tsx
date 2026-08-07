"use client";

import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { CodeBlock } from "@/components/code-block";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

const post = blogPosts.find((p) => p.slug === "aihot-interest-radar")!;

const content = {
  zh: {
    intro_p1:
      "上一篇搭好了每日 AI 热点自动归档。但很快发现一个新问题：热点每天 7 条，我真正关心的可能只有一两条——AGI、self、注意力这些。每天翻完整份文件找「有没有我关心的」，太浪费时间。",
    intro_p2:
      "于是有了「兴趣雷达」：热点抓取完成后自动扫描关键词，命中我订阅的主题就弹窗提醒，没命中就静默。原则就一句话：<strong>命中才打扰，不命中不打扰。</strong>",
    h2_plan: "方案总览",
    plan_p1:
      "三步：抓取（上一篇文章里的脚本，已有）→ 关键词扫描 → 弹窗。全部在本地跑，每天 20:00 由同一个计划任务触发。",
    plan_step1: "<strong>抓取：</strong><code>fetch_aihot.js</code> 把热点写成 Markdown",
    plan_step2: "<strong>扫描：</strong>通知脚本读当天文件，逐个主题检查关键词",
    plan_step3: "<strong>弹窗：</strong>命中任意主题 → 弹出自定义窗口；否则静默写日志",
    h2_config: "关键词怎么配",
    config_p1:
      "关键词不是一堆散词，而是<strong>「主题 + 别名」</strong>：每个主题下挂多个匹配词，命中任一就归入该主题。这样弹窗告诉你是「哪个主题」，而不是「哪个词」。",
    config_code_title: "aihot_keywords.json",
    config_p2: "想研究新方向？加一个 topic 就行，脚本每次运行都会重新读这个文件，不用改任何代码。",
    h2_popup: "弹窗长什么样",
    popup_p1: "最终效果（这是我机器上的真实截图）：",
    popup_p2:
      "设计参考 Windows 11 的 Fluent 风格：白底、圆角、柔和阴影、蓝色强调。540px 宽、屏幕居中、20 秒实时倒计时，按钮可以直接打开 Obsidian 里的热点笔记。",
    h2_pit1: "坑 1：系统通知根本弹不出来",
    pit1_p1:
      "第一版用的是 WinRT Toast（Windows 通知中心那种）。代码调用成功、日志也写了，但屏幕上什么都没有。排查半天发现：这种「应用未注册」的通知会被系统静默吞掉。结论：<strong>别依赖系统通知，自己做窗口。</strong>",
    h2_pit2: "坑 2：PowerShell 的事件处理不触发",
    pit2_p1:
      "换成 WPF 窗口后，按钮和计时器都「不工作」——点了没反应，窗口也不自动关。原因：PowerShell 的事件处理脚本需要运行空间有空闲，而 <code>Dispatcher.Run()</code> 把主运行空间堵死了，事件永远轮不到执行。",
    pit2_p2:
      "解法：把弹窗逻辑整体用 <code>Add-Type</code> 编译成原生 C# 类，按钮、计时器全部走 .NET 原生事件，跟 PowerShell 的事件机制彻底解耦。",
    h2_pit3: "坑 3：窗口关了，进程还赖着不走",
    pit3_p1:
      "原生 C# 里计时器正常跳了（每秒写日志为证），窗口也关了，但进程就是不退出——因为直接 <code>Dispatcher.Run()</code> 不会因为窗口关闭而返回。正确做法是 WPF 的标准用法：<strong><code>Application.Run(window)</code></strong>，窗口一关应用就退出。",
    h2_pit4: "坑 4：中文乱码",
    pit4_p1:
      "PowerShell 5.1 读脚本默认按系统编码，UTF-8 无 BOM 的中文脚本直接乱码报错。脚本文件必须存成 <strong>UTF-8 with BOM</strong>。",
    h2_code: "核心代码",
    code_p1: "弹窗 + 实时倒计时最核心的部分（C#，简化）：",
    code_p2:
      "完整脚本在 <code>.codex/scripts/notify_aihot_keywords.ps1</code>，关键词配置在同目录 <code>aihot_keywords.json</code>，想直接抄的话两行命令就能跑起来。",
    h2_custom: "怎么改成自己的",
    custom_li1: "<strong>换主题：</strong>改 <code>aihot_keywords.json</code>，一个 topic 就是一组关键词",
    custom_li2: "<strong>换样式：</strong>XAML 里改颜色、圆角、宽度、图标",
    custom_li3: "<strong>换时长：</strong>把传给 <code>Show()</code> 的秒数改掉",
    custom_li4: "<strong>换位置：</strong><code>WindowStartupLocation</code> 改成 CenterScreen 或 Manual",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc:
      "全程用 Codex 撰写。文中的弹窗截图就是我机器上的真实运行画面，踩的四个坑也都真真实实发生过。",
  },
  en: {
    intro_p1:
      "The previous post set up daily AI news archiving. But a new problem appeared fast: 7 items a day, and I only really care about one or two — AGI, self, attention, that kind of thing. Skimming the whole file every day just to check \"is there anything I care about\" wastes too much time.",
    intro_p2:
      "So I built the \"Interest Radar\": after the news is fetched, keywords are scanned automatically; if a topic I subscribe to matches, a popup appears; otherwise it stays silent. One principle: <strong>interrupt only on a match — otherwise, don't interrupt.</strong>",
    h2_plan: "The Plan",
    plan_p1:
      "Three steps: fetch (the script from the previous post) → keyword scan → popup. Everything runs locally, triggered by the same 8pm scheduled task.",
    plan_step1: "<strong>Fetch:</strong> <code>fetch_aihot.js</code> writes the news as Markdown",
    plan_step2: "<strong>Scan:</strong> the notify script reads today's file and checks each topic's keywords",
    plan_step3: "<strong>Popup:</strong> any topic matched → show a custom window; otherwise log and stay silent",
    h2_config: "Configuring Keywords",
    config_p1:
      "Keywords aren't a pile of loose words — they're <strong>topics with aliases</strong>. Each topic carries several match words; hitting any of them counts as that topic. So the popup tells you \"which topic,\" not \"which word.\"",
    config_code_title: "aihot_keywords.json",
    config_p2:
      "Want to follow a new research direction? Just add a topic. The script re-reads this file on every run — no code changes needed.",
    h2_popup: "What the Popup Looks Like",
    popup_p1: "The final result (a real screenshot from my machine):",
    popup_p2:
      "Design follows the Windows 11 Fluent style: white background, rounded corners, soft shadow, blue accents. 540px wide, centered on screen, with a live 20-second countdown and a button that opens the note in Obsidian.",
    h2_pit1: "Pit 1: System Notifications Never Showed Up",
    pit1_p1:
      "The first version used WinRT toasts (the notification-center kind). The API call succeeded and logs were written, but nothing appeared on screen. After digging, it turned out this kind of \"unregistered app\" notification gets silently swallowed by the system. Lesson: <strong>don't rely on system toasts — build your own window.</strong>",
    h2_pit2: "Pit 2: PowerShell Event Handlers Never Fired",
    pit2_p1:
      "After switching to a WPF window, the buttons and timer \"didn't work\" — clicks did nothing and the window never auto-closed. Why? PowerShell event scripts need the runspace to be free, but <code>Dispatcher.Run()</code> blocks the main runspace, so events never get a chance to run.",
    pit2_p2:
      "Fix: compile the whole popup logic into a native C# class with <code>Add-Type</code>, so buttons and timers use plain .NET events — completely decoupled from PowerShell's event machinery.",
    h2_pit3: "Pit 3: The Process Refused to Exit",
    pit3_p1:
      "In native C#, the timer ticked correctly (proven by per-second log lines), the window closed — but the process stayed alive, because a bare <code>Dispatcher.Run()</code> doesn't return when the window closes. The right way is WPF's standard pattern: <strong><code>Application.Run(window)</code></strong> — when the window closes, the app exits.",
    h2_pit4: "Pit 4: Garbled Chinese Characters",
    pit4_p1:
      "PowerShell 5.1 reads scripts using the system codepage, so UTF-8 scripts without a BOM get mangled and fail to parse. Script files must be saved as <strong>UTF-8 with BOM</strong>.",
    h2_code: "Core Code",
    code_p1: "The heart of the popup + live countdown (C#, simplified):",
    code_p2:
      "The full script lives at <code>.codex/scripts/notify_aihot_keywords.ps1</code>, and keyword config is in <code>aihot_keywords.json</code> next to it. Two commands and you're running.",
    h2_custom: "Making It Your Own",
    custom_li1: "<strong>Topics:</strong> edit <code>aihot_keywords.json</code> — one topic is one group of keywords",
    custom_li2: "<strong>Style:</strong> change colors, radius, width, icon in the XAML",
    custom_li3: "<strong>Duration:</strong> change the seconds passed to <code>Show()</code>",
    custom_li4: "<strong>Position:</strong> set <code>WindowStartupLocation</code> to CenterScreen or Manual",
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

      <h2 id="plan">{t("h2_plan")}</h2>
      <p>{t("plan_p1")}</p>
      <ol className="list-decimal pl-5 my-4 space-y-3 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("plan_step1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("plan_step2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("plan_step3") }} />
      </ol>

      <h2 id="config">{t("h2_config")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("config_p1") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{t("config_code_title")}</p>
      <CodeBlock language="json">
        {codeBlocks.configJson[lang as keyof typeof codeBlocks.configJson] ?? codeBlocks.configJson.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("config_p2") }} />

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

      <h2 id="pit2">{t("h2_pit2")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit2_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("pit2_p2") }} />

      <h2 id="pit3">{t("h2_pit3")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit3_p1") }} />

      <h2 id="pit4">{t("h2_pit4")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("pit4_p1") }} />

      <h2 id="code">{t("h2_code")}</h2>
      <p>{t("code_p1")}</p>
      <CodeBlock language="csharp">
        {codeBlocks.csharp[lang as keyof typeof codeBlocks.csharp] ?? codeBlocks.csharp.zh}
      </CodeBlock>
      <p dangerouslySetInnerHTML={{ __html: t("code_p2") }} />

      <h2 id="custom">{t("h2_custom")}</h2>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("custom_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("custom_li4") }} />
      </ul>

      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
      </div>
    </BlogPostLayout>
  );
}
