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
    // ---- 开头 ----
    intro_p1:
      "想象一个场景：你每天打开 Obsidian，昨天的日记已经躺在 1-Daily 里，末尾自动挂上了昨天的 AI 热点链接；20:00 整，当天的热点自动抓取、筛选、写成 Markdown 存进 5-Summaries——如果命中你关心的主题还会弹窗提醒；晚上写完日记，喊一句「整理一下」，Inbox 清空、日记归位、双向链接补全。你唯一需要做的，是读和想。",
    intro_p2:
      "这套系统的核心是 <strong>Codex</strong>（执行自动化）和 <strong>Obsidian</strong>（承载知识网络）。Claude Code 在你遇到复杂问题时辅助思考和排查——属于锦上添花，不是必需品。本文是这套系统的完整搭建实录——从插件配置到四条自动化线，从 Dataview 仪表盘到 WPF 弹窗提醒。",

    // ---- 工具分工 ----
    h2_roles: "工具分工：主角与配角",
    roles_intro:
      "在动手之前，先搞清楚谁干什么——这决定了你不会把精力花在错的地方。",

    role1_title: "Codex — 执行者（主角）",
    role1_desc:
      "Codex 是这套系统的<strong>核心引擎</strong>。它的 <code>.codex/rules.md</code> 里定义了四条自动化线——热点抓取、Inbox 整理、周总结、月总结。每次打开和它的对话，它会自动检查今天的热点有没有抓、Inbox 是不是堆了超过 3 篇——该抓的抓、该提醒的提醒。它不需要你写代码，但需要你给它写清楚规则：什么时候触发、做什么、结果放哪。<code>rules.md</code> 就是你和它的「合同」。",
    role1_detail:
      "Codex 能直接读写笔记库文件、执行 Node.js 和 PowerShell 脚本、注册 Windows 计划任务。脚本可能很长（WPF 弹窗那个有 200+ 行），但你不需要手写——描述清楚需求，Codex 生成，你验证。",

    role2_title: "Obsidian — 承载者（平台）",
    role2_desc:
      "Obsidian 是知识最终落脚的地方。它提供了让知识从「一堆文件」变成「一张网络」的基础设施：<strong>双向链接</strong>让每篇笔记产生关联，<strong>Dataview</strong> 把笔记库变成可查询的数据库，<strong>Templater</strong> 新建笔记时自动套模板，<strong>Calendar</strong> 侧边栏日历一目了然。Codex 把信息灌进来，你负责读和想。",

    role3_title: "Claude Code — 辅助角色（锦上添花）",
    role3_desc:
      "Claude Code 不是必需品——<strong>这套系统只用 Codex + Obsidian 就能完整跑起来。</strong>但在这些场景里它能帮大忙：设计笔记库结构时跟它讨论方案、写 Templater 模板让它给建议、脚本报错了贴给它排查、弹窗样式不满意让它帮忙改 XAML。它的核心优势是理解和推理——你描述不清楚问题时，它能帮你理清思路。",
    role3_detail_p1:
      "Claude Code 通过 <strong>Claudian 插件</strong>可以直接嵌入 Obsidian——在 Obsidian 里按快捷键就能调出来，不需要切窗口。和之前写的 ",
    role3_link1: "MCP 配置教程",
    role3_link2: "状态栏教程",
    role3_detail_p2:
      " 一样，Claude Code 擅长的是理解和推理。这套系统里它不负责执行——那是 Codex 的活。",
    roles_summary:
      "<strong>Codex 是引擎，Obsidian 是底盘，Claude Code 是副驾驶。</strong>引擎和底盘就能把车开起来；副驾驶在你迷路时帮你指方向。这篇文章的主角是 Codex 和 Obsidian——后面所有内容围绕它们展开。需要 Claude Code 的时候会单独标注。",

    // ---- 准备工作 ----
    h2_prep: "准备工作",
    prep_intro: "下面五项里，前三项必须手动完成（装软件），后两项 Codex 会帮你做（建目录、注册任务）。每项都标了「你需要做」还是「Codex 会做」，跟着走就行。",

    prep1_title: "1. Obsidian 笔记库初始化（你需要做）",
    prep1_desc:
      "下载安装 Obsidian（<a href='https://obsidian.md/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>obsidian.md</a>，完全免费），新建一个笔记库（Vault），名字随意——我这套叫 SecondBrain。能正常创建并打开笔记就 OK。",
    prep1_plugins_intro: "然后装四个社区插件。路径：打开 Obsidian → 左下角齿轮（设置）→ Community plugins → 右上角「Browse」，逐个搜索安装：",
    prep1_plugins:
      "<li><strong>Dataview</strong>：把笔记库当数据库查。Dashboard 看板靠它实时显示「活跃项目」「Inbox 积压数」「最近修改」。</li><li><strong>Calendar</strong>：侧边栏日历视图，哪天写了日记一目了然。点击日期直接打开/创建当天日记。</li><li><strong>Templater</strong>：模板引擎。装好后打开它的设置（Settings → 社区插件 → Templater 的齿轮图标），找到 <strong>Folder Templates</strong> 区域，填 <code>1-Daily</code> 对应 <code>Templates/daily.md</code>；然后开启 <strong>Trigger Templater on new file creation</strong>。效果：每次在 1-Daily 下新建笔记，自动套模板。</li><li><strong>Tag Wrangler</strong>：标签多了以后批量改名，保持体系统一。</li>",
    prep1_templater:
      "然后在笔记库里新建 <code>Templates/daily.md</code> 文件，内容见下方代码块。模板的作用：自动注入日期和标签，日记不用从空文件开始写。",

    prep2_title: "2. Codex CLI 安装（你需要做）",
    prep2_intro:
      "Codex CLI 是 OpenAI 的开源终端编程助手，能直接读写文件、执行脚本、注册计划任务——它是这套系统的「手」。下面是完整的安装和配置步骤。",
    prep2_step1_title: "第 1 步：下载安装",
    prep2_step1_desc:
      "打开 <a href='https://github.com/anthropics/codex' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Codex CLI GitHub 仓库</a>，找到右侧的 <strong>Releases</strong> 链接，下载最新 Windows 版本（.msi 或 .exe），双击安装，一路 Next 即可。",
    prep2_step2_title: "第 2 步：验证安装",
    prep2_step2_desc:
      "打开终端（右键 Windows 开始按钮 → 终端），输入 <code>codex</code> 回车。看到 Codex 的对话界面就说明装好了：",
    prep2_caption: "▲ 终端里输入 codex 后进入对话界面，就说明 OK",
    prep2_step3_title: "第 3 步：首次配置",
    prep2_step3_desc:
      "Codex 首次运行会引导你选择认证方式和默认模型。如果你有 ChatGPT / OpenAI 账号，直接登录最简单；如果用的是第三方 API（比如国内的 DeepSeek、通义千问），可以在设置里配自定义 API endpoint 和 key——Codex 支持接入兼容 OpenAI 格式的任何 API。",

    prep2_alt_title: "其他玩法（这套系统不绑定单一工具）",
    prep2_alt_intro:
      "这套自动化系统的核心是 <code>rules.md</code> + Node.js 脚本 + Windows 计划任务——Codex CLI 是最方便的入口，但<strong>不是唯一入口</strong>。根据你自己的情况，至少有四种玩法：",
    prep2_alt1:
      "<strong>① Codex CLI（推荐）：</strong>终端里直接用，和 rules.md 深度集成。每次打开对话自动检查热点/Inbox/周月总结，该抓的抓、该提醒的提醒——本文后续所有内容都基于这个方案。",
    prep2_alt2:
      "<strong>② Codex 桌面端 / ChatGPT：</strong>在桌面应用里打开笔记库目录作为工作区，同样能读取和执行 rules.md。优势是有图形界面，适合不习惯终端的用户。Codex 桌面端支持接入 GPT-5-Codex 模型，代码能力更强。",
    prep2_alt3:
      "<strong>③ Claude Code：</strong>把 rules.md 的规则复制给 Claude Code，让它当规则执行。Claude Code 擅长理解和推理——跟它说「这是笔记库的自动化规则，帮我按规则检查一下该做什么」，它会逐条执行。如果你已经配好了 Claude Code（<a href='/blog/claude-code-mcp-setup' class='text-indigo-600 dark:text-indigo-400 hover:underline'>MCP 配置教程</a>、<a href='/blog/claude-code-statusline' class='text-indigo-600 dark:text-indigo-400 hover:underline'>状态栏教程</a>），这个方案没有任何额外安装成本。",
    prep2_alt4:
      "<strong>④ 手动 + 任意 AI：</strong>手动跑脚本（<code>node fetch_aihot.js daily</code>、<code>powershell -File remind_diary.ps1</code>），然后把 rules.md 贴给任意 AI（ChatGPT、Claude、Kimi……）让它帮你理解和修改规则。灵活性最高，代价是少了自动触发。",
    prep2_alt_note:
      "选哪种取决于你的习惯——用终端多就 CLI，习惯图形界面就桌面端，已经在用 Claude Code 就让它兼这个职。<strong>玩法可以很多，没必要局限于一种。</strong>包括后文的弹窗样式——如果你有新的想法（加提示音、换图标、放右下角），告诉 Codex 就行，它可以按你的审美改。",

    prep2_help_title: "实在装不上？",
    prep2_help_desc:
      "让 Claude Code 帮你。跟它说「帮我安装 Codex CLI」——它能搜 GitHub 找到最新版本、给出针对你系统的详细步骤、甚至帮你排查报错。如果之前已经配好了 Claude Code 的 MCP（GitHub + Filesystem + Playwright），它连下载链接都能直接找到。",
    prep2_help_link_text: "Claude Code MCP 配置教程 →",

    prep2_first_task:
      "Codex 装好之后，第一件事就是让它帮你搭环境。打开终端输入 <code>codex</code>，进入对话后说：<strong>「帮我在笔记库根目录建 .codex 文件夹和 scripts 子文件夹，然后建 rules.md」</strong>。你告诉它笔记库路径就行——它会在笔记库里建好 <code>.codex/</code>、<code>.codex/scripts/</code> 和 <code>.codex/rules.md</code>。rules.md 的具体内容后面「四条自动化线」那节会详细讲——现在让它建个空壳就行。",

    prep3_title: "3. Node.js 安装（你需要做）",
    prep3_desc:
      "脚本靠 Node.js 运行。去 <a href='https://nodejs.org/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a> 下载 <strong>LTS 版</strong>（左边绿色大按钮），一路 Next 装完。然后在终端输入 <code>node --version</code>——看到版本号（比如 v20.x）就 OK。国内下载慢可以换镜像：<code>npm config set registry https://registry.npmmirror.com</code>。",

    prep4_title: "4. 笔记库目录结构（Codex 会做）",
    prep4_desc:
      "建好 .codex 之后，告诉 Codex：<strong>「帮我建笔记库目录：0-Inbox、1-Daily、2-Projects、3-Areas、4-Resources、5-Summaries，还有 Templates」</strong>——它会在笔记库根目录下建好这些空文件夹。每个文件夹的用途在「笔记库设计」那节详细讲，现在先让它建好就行。",

    prep5_title: "5. Windows 任务计划程序（Codex 会注册）",
    prep5_desc:
      "自动化任务的定时执行靠 Windows 任务计划程序。你可以先按 Win 键搜索「任务计划程序」打开看一眼——能打开这个窗口就 OK，不需要做任何操作。后面把需求告诉 Codex 时，它会帮你注册好所有定时任务。",

    // ---- 笔记库设计 ----
    h2_design: "笔记库设计：为什么是 PARA + Summaries",
    design_intro:
      "自动化能跑起来的前提是结构稳定。如果今天把日记放这、明天放那，脚本根本不知道该往哪写。这套结构参考了 Tiago Forte 的 PARA 方法（Projects - Areas - Resources - Archives），并在前面加了 Inbox、后面加了 Summaries：",
    design_layer0: "<strong>0-Inbox</strong>（入口）——所有新想法、临时代码、未整理的东西先扔这里，定期清零。这是整个系统的「缓冲区」。",
    design_layer1: "<strong>1-Daily</strong>（日记）——按 <code>2026年8月/</code> 按月归档。每天自动生成，模板注入日期和标签。月末自动成型，不需要手动整理。",
    design_layer2: "<strong>2-Projects</strong>（项目）——有明确终点的任务：KernelSwift 算子大赛、VAE 图像彩色化、DeepSeek 余额监控。每个项目一个文件夹或 Markdown 文件。",
    design_layer3: "<strong>3-Areas</strong>（领域）——持续关注、没有终点的方向：Self-Initialization 研究、AGI 思考、德国读博规划、多模态识图。",
    design_layer4: "<strong>4-Resources</strong>（资料）——参考性质的内容：Linux 命令汇总、高数复习资料、深度学习入门。",
    design_layer5: "<strong>5-Summaries</strong>（汇总）——时间维度的总结：每日 AI 热点、周总结、月总结。按月份文件夹组织。",
    design_principles:
      "三个关键设计决策：<br /><strong>① Inbox 清零原则：</strong>一切新东西先落 0-Inbox，处理完必须归位。Codex 检测到 Inbox 堆积 ≥ 3 篇会自动提醒整理。<br /><strong>② 按月归档：</strong>日记和热点都按「2026年X月」分文件夹。想查「7 月发生了什么」就直接打开对应文件夹，不需要搜索。<br /><strong>③ 双向链接文化：</strong>每篇日记末尾自动挂上当天的 AI 热点链接和相关笔记。笔记库不是文件夹树，是一张图——双向链接让它从树变成网。",
    design_home:
      "除此之外，根目录还有一个 <code>Home.md</code>——它是整个笔记库的「主页」。里面有一张知识地图（VAE 体系 → 产品作品 → 参考资料 → 研究探索）、当前聚焦的学习方向和项目、今日热点链接、本周总结入口。打开 Obsidian 第一眼看到的就是它。Dataview 插件让它能自动更新——比如「最近修改」的笔记列表不需要手动维护。",

    // ---- 四条自动化线 ----
    h2_lines: "四条自动化线：rules.md 是宪法",
    lines_intro:
      "<code>.codex/rules.md</code> 是 Codex 在这个笔记库里的唯一行为规则源。每次你打开和 Codex 的对话，它会先读这个文件，然后按里面定义的触发条件检查该做什么。下面是四条自动化线的完整说明：",
    line1_title: "线 1：AI 热点推送",
    line1_desc:
      "<strong>触发条件：</strong>每次和 Codex 对话开始时，检查今天的 <code>AI热点-{日期}.md</code> 是否存在——不存在就立刻抓取，不做任何询问。或者你说「热点」「AI 热点」也能手动触发。<br /><strong>执行流程：</strong>① 调用 AI HOT 公开 API 拉取过去 24 小时精选 → ② 过滤掉 tip 类非核心内容，保留 6-8 条 → ③ 写成 Markdown（每条带标题、摘要、原文链接）→ ④ 存到 <code>5-Summaries/{月份}/AI热点-{日期}.md</code> → ⑤ 自动更新 Home.md 的「今日 AI 热点」链接 → ⑥ 在当天日记末尾追加热点链接。<br /><strong>数据源：</strong><a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>AI HOT</a>，一个每天精选 AI 领域热点的聚合站，有公开 API。",
    line2_title: "线 2：Inbox 自动整理",
    line2_desc:
      "<strong>触发条件：</strong>你说「整理 Inbox」，或者 Codex 检测到 <code>0-Inbox/</code> 累积 ≥ 3 个 .md 文件且你还没处理。<br /><strong>执行流程：</strong>① 扫描 Inbox → ② 逐个读取内容，AI 判断归属：有截止日期的任务 → 2-Projects，持续关注的研究话题 → 3-Areas，参考性质的内容 → 4-Resources → ③ 为每篇笔记添加 YAML 头（tags、status、area、created）→ ④ 在当天日记和关联笔记中补双向链接 → ⑤ 移动文件到目标目录 → ⑥ 汇报整理结果。",
    line3_title: "线 3：周总结",
    line3_desc:
      "<strong>触发条件：</strong>你说「周总结」，或者当前是周日且你开了新对话。<br /><strong>执行流程：</strong>① 拉取本周所有日记 → ② 扫描 2-Projects 和 3-Areas 本周新建/修改的笔记 → ③ 提取关键事件、新增想法、未闭环事项 → ④ 按 <code>Templates/weekly-review.md</code> 模板生成草稿（包含：本周日记、新知与想法、Codex 做了什么、未闭环、下周方向）→ ⑤ 更新 Home.md 的「本周总结」入口。",
    line4_title: "线 4：月总结",
    line4_desc:
      "<strong>触发条件：</strong>你说「月总结」，或者当前是每月 1 号。<br /><strong>执行流程：</strong>① 扫描本月所有周总结 → ② 合并提取月度高频标签、知识网增长点、项目进展 → ③ 对比上月（如有）→ ④ 生成 <code>5-Summaries/{月份}/月总结-{年份}-{月份}.md</code>。",
    lines_checklist:
      "每次会话启动时的自动检查清单（优先级从高到低）：<br />🔴 热点文件是否存在 → 不存在立刻抓取<br />🟡 Inbox 是否 ≥ 3 篇 → 提醒整理<br />🟢 当前是否周日 → 询问是否做周总结<br />🔵 当前是否 1 号 → 询问是否做月总结",

    // ---- 兴趣雷达 ----
    h2_radar: "兴趣雷达：只提醒你真正关心的",
    radar_problem:
      "四条自动化线让信息自动流入，但很快你会发现一个新问题——",
    radar_problem_detail:
      "每天 7 条热点，你真正关心的可能只有一两条。AGI、Self-Initialization、算子……每天都要打开文件从头翻到尾，就为了确认「今天有没有我关心的」。没命中时，这 7 条就只是 7 条标题，而你已经花了 5 分钟扫完。",
    radar_solution_title: "解决办法：关键词过滤器",
    radar_solution:
      "在热点抓取完成后，脚本自动扫描当天文件里的内容：<br /><strong>命中</strong>你订阅的主题 → 弹一个 Windows 弹窗（带实时倒计时和「打开笔记」按钮），告诉你命中了什么。<br /><strong>没命中</strong> → 安静地写一行日志，不打扰你。<br />就像聊天软件的「特别关心」——只有被标记的人才弹提醒。",
    radar_config_title: "关键词怎么配？",
    radar_config:
      "关键词不是一堆散词，而是更实用的<strong>「主题 + 别名」</strong>结构。举个例子：主题叫「AGI」，别名可以写「AGI」「通用人工智能」「artificial general intelligence」——脚本匹配到任意一个，都归入「AGI」这个主题。这样弹窗告诉你是<strong>「哪个主题命中」</strong>，而不是「哪个词命中」。",
    radar_config_file:
      "配置独立成一个 JSON 文件（见下方代码块）。脚本每次运行都会重新读取——<strong>改配置不用改代码</strong>，改完 JSON 下次运行就生效。",
    radar_config_tip:
      "不想手动编辑 JSON？告诉 Codex「帮我加一个 XX 主题，匹配词是 A、B、C」，它直接帮你改文件——一行代码都不用碰。",
    radar_pitfall_intro: "弹窗开发踩过的坑（都是真实发生过的）：",
    radar_pitfall1:
      "<strong>坑 1：系统通知被静默吞掉。</strong>第一版用的是 WinRT Toast 通知——代码调用成功、日志也写了，但屏幕上什么都没有。原因：Toast 需要注册过的 AppUserModelID，「裸 PowerShell 脚本」没有这个 ID，通知被系统静默丢弃。解决办法：不走系统通知，直接用 WPF 自己做窗口。",
    radar_pitfall2:
      "<strong>坑 2：按钮和倒计时没反应。</strong>用 PowerShell 直接写 WPF 窗口时，事件处理脚本需要运行空间有空闲，而 <code>Dispatcher.Run()</code> 把运行空间占死了，事件永远排不上队。解决办法：用 Codex 把弹窗逻辑编译成原生 C# 类（<code>Add-Type</code>），事件走 .NET 原生通道，立刻正常。",
    radar_pitfall3:
      "<strong>坑 3：窗口关了进程还卡着。</strong>直接 <code>Dispatcher.Run()</code> 不会因为窗口关闭而返回——进程一直挂着。解决办法：用 WPF 标准写法 <code>Application.Run(window)</code>，窗口一关进程就退出。",
    radar_pitfall4:
      "<strong>坑 4：中文乱码。</strong>PowerShell 5.1 读脚本默认按系统编码（Windows 中文版是 GBK），UTF-8 无 BOM 的中文脚本会乱码。把脚本文件存成 <strong>UTF-8 with BOM</strong> 即可解决。",

    // ---- 一天流程 ----
    h2_day: "一天的实际流程",
    day_intro: "系统跑起来之后，你的一天是这样的：",
    day_li1: "<strong>早上：</strong>打开 Obsidian，昨天的日记已经在 1-Daily 里，末尾带着昨天的 AI 热点链接。Home.md 告诉你当前有哪些活跃项目。",
    day_li2: "<strong>20:00：</strong>热点自动抓取，出现在 5-Summaries。命中你订阅的主题时弹窗提醒，没命中就安静。",
    day_li3: "<strong>晚上：</strong>写日记 → 喊一句「整理一下」→ Inbox 清空、日记归位、双向链接补全。",
    day_li4: "<strong>月底：</strong>当月文件夹自动成型，周总结已经写了好几篇——月度总结基本是「合并 + 微调」而不是「从零写」。",
    day_summary: "你需要做的，只剩读和想。系统负责让信息在正确的时间出现在正确的地方。",

    // ---- FAQ ----
    h2_faq: "常见问题",
    faq_intro: "搭这套系统最常被问到的问题，以及我自己踩过的：",
    faq_q1: "需要会写代码吗？",
    faq_a1: "不需要从零写。核心能力是把自己的需求描述清楚——什么时候触发、做什么、结果放哪。描述清楚了，Codex 生成脚本和配置，你验证结果。描述不清楚，Codex 也帮不了你。这套系统的瓶颈不在代码，在需求表达。",
    faq_q2: "Codex 没按我想的做怎么办？",
    faq_a2: "把它的输出贴回去，告诉它哪里不对（比如「热点文件放错文件夹了」「弹窗位置不对」），它会修正。它的能力边界在于你描述得清不清楚——如果描述不清楚，先用 Claude Code 帮你理清思路，再把清晰的方案交给 Codex 执行。这就是为什么两个工具都要用。",
    faq_q3: "怎么改执行时间？",
    faq_a3: "打开 Windows「任务计划程序」，找到对应任务，右键 → 属性 → 触发器 → 编辑时间。不需要改任何代码。",
    faq_q4: "出问题了怎么排查？",
    faq_a4: "脚本会往 <code>.codex/scripts/</code> 目录写日志（如 <code>aihot_keywords.log</code>）。把日志最后几行复制给 Codex 或 Claude Code，一般直接定位。也可以手动跑脚本：<code>node fetch_aihot.js daily</code>，看终端输出。",
    faq_q5: "不想用了怎么停？",
    faq_a5: "在任务计划程序里禁用对应任务即可。脚本和配置可以留着，哪天想恢复就重新启用。想彻底卸载就删脚本 + 删任务。",
    faq_q6: "为什么用两个 AI 工具而不是一个？",
    faq_a6: "因为目前没有一个工具能同时做好「思考设计」和「执行自动化」。Claude Code 擅长理解复杂需求和推理——让它设计笔记库结构、写 Dataview 查询、规划自动化流程，比让它逐行写 PowerShell 脚本合适。Codex 擅长直接操作系统——读写文件、执行脚本、注册计划任务，但让它设计架构容易「先干了再说」。分工不是噱头，是各取所长。",
    faq_q7: "Mac / Linux 能用吗？",
    faq_a7: "核心逻辑（脚本 + Obsidian + rules.md）跨平台都能跑。但 Windows 任务计划程序是 Windows 专属——Mac 用 launchd，Linux 用 cron/systemd timer。把需求告诉 Codex 时说明你的操作系统，它会用对应的调度工具。",

    // ---- 结尾 ----
    bottom_title: "最后",
    bottom_desc:
      "这套系统已经跑了快一个月。每天 20:00 的热点文件、月底自动成型的文件夹、弹窗里跳出的「AGI 主题命中」——这些自动化不是「设好就忘」的背景任务，而是我每天打开 Obsidian 时实实在在看到的反馈。它最重要的作用不是省了多少时间，而是<strong>降低了「开始」的门槛</strong>：日记模板让你不用面对空白文件，Inbox 清零让你不用纠结怎么分类，热点推送让你不用手动搜信息。工具替你做了「启动」，剩下的读和想才是你自己的。",
    bottom_tip: "期待看到你搭出自己的版本。如果这套结构启发了你，或者你改了点什么让它更适合自己——那就是这篇文章最好的结果。",
  },

  en: {
    intro_p1:
      "Imagine this: you open Obsidian each morning. Yesterday's diary is already in 1-Daily, with yesterday's AI news links appended at the bottom. At 8pm sharp, the day's AI news is automatically fetched, filtered, and written into 5-Summaries as Markdown — and if any topic you care about matches, a popup reminds you. In the evening, you write your diary, say \"organize it,\" and your Inbox clears, the diary files itself, and bidirectional links are filled in. All you have to do is read and think.",
    intro_p2:
      "The core of this system is <strong>Codex</strong> (executing automation) and <strong>Obsidian</strong> (hosting the knowledge graph). Claude Code assists with thinking and debugging when things get complex — it's a nice-to-have, not a requirement. This article is the complete build record — from plugin setup to four automation pipelines, from Dataview dashboards to WPF popup reminders.",

    h2_roles: "Who Does What: Lead vs. Supporting Roles",
    roles_intro:
      "Before we start, understand who does what — this keeps you from spending effort in the wrong places.",

    role1_title: "Codex — The Executor (Lead)",
    role1_desc:
      "Codex is the <strong>core engine</strong> of this system. Its <code>.codex/rules.md</code> defines four automation pipelines — news fetching, inbox sorting, weekly review, monthly review. Every time you start a conversation with it, it checks: is today's news file generated? Has the Inbox piled up past 3 items? It fetches what needs fetching and reminds what needs reminding. It doesn't need you to write code, but it does need clear rules: when to trigger, what to do, where results go. <code>rules.md</code> is your contract with it.",
    role1_detail:
      "Codex reads/writes vault files directly, executes Node.js and PowerShell scripts, and registers Windows scheduled tasks. Scripts can be long (the WPF popup is 200+ lines), but you don't write them — you describe what you want, Codex generates, you verify.",

    role2_title: "Obsidian — The Host (Platform)",
    role2_desc:
      "Obsidian is where knowledge ultimately lives. It provides the infrastructure that turns knowledge from \"a pile of files\" into \"a network\": <strong>bidirectional links</strong> connect notes, <strong>Dataview</strong> turns your vault into a queryable database, <strong>Templater</strong> auto-applies templates, <strong>Calendar</strong> gives you a calendar sidebar. Codex feeds information in; you read and think.",

    role3_title: "Claude Code — Supporting Role (Nice-to-Have)",
    role3_desc:
      "Claude Code is not required — <strong>this system runs perfectly with just Codex + Obsidian.</strong> But it shines in these moments: discussing vault designs, getting template suggestions, debugging script errors, refining WPF popup styles. Its core strength is understanding and reasoning — when you can't articulate a problem clearly, it helps you think it through.",
    role3_detail_p1:
      "Claude Code is embedded directly in Obsidian via the <strong>Claudian plugin</strong> — press a hotkey and it's there. Like the earlier ",
    role3_link1: "MCP setup guide",
    role3_link2: "statusline guide",
    role3_detail_p2:
      " posts, its strength is reasoning — not execution. That's Codex's job here.",
    roles_summary:
      "<strong>Codex is the engine, Obsidian is the chassis, Claude Code is the navigator.</strong> Engine + chassis gets the car moving; the navigator helps when you're lost. This article focuses on Codex and Obsidian — everything below revolves around them. Claude Code gets a shout-out where it's genuinely useful.",

    h2_prep: "Preparation",
    prep_intro: "Of the five items below, the first three you must do yourself (install software); the last two Codex handles for you (create folders, register tasks). Each is labeled — just follow along.",

    prep1_title: "1. Initialize Your Obsidian Vault (You Do This)",
    prep1_desc:
      "Download and install Obsidian (<a href='https://obsidian.md/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>obsidian.md</a>, completely free). Create a new vault — any name works; mine is called SecondBrain. If you can create and open a note, you're set.",
    prep1_plugins_intro: "Then install four community plugins. Path: Open Obsidian → gear icon bottom-left (Settings) → Community plugins → Browse (top-right), search and install each:",
    prep1_plugins:
      "<li><strong>Dataview</strong>: Treats your vault as a queryable database. The Dashboard board uses it to show active projects, Inbox backlog count, and recent changes.</li><li><strong>Calendar</strong>: A sidebar calendar view — which days have entries at a glance. Click a date to open or create that day's diary.</li><li><strong>Templater</strong>: Template engine. After installing, open its settings (Settings → Community plugins → gear icon on Templater), find the <strong>Folder Templates</strong> section, fill in <code>1-Daily</code> → <code>Templates/daily.md</code>; then enable <strong>Trigger Templater on new file creation</strong>. Effect: new files under 1-Daily auto-inject the daily template.</li><li><strong>Tag Wrangler</strong>: Batch-rename tags as your system grows, keeping conventions consistent.</li>",
    prep1_templater:
      "Then create <code>Templates/daily.md</code> in your vault (content below). Its job: auto-inject date and tags — you never start a diary from a blank file.",

    prep2_title: "2. Install Codex CLI (You Do This)",
    prep2_intro:
      "Codex CLI is OpenAI's open-source terminal coding agent — it reads/writes files, executes scripts, and registers scheduled tasks. It's the \"hands\" of this system. Here's the full install and setup guide.",
    prep2_step1_title: "Step 1: Download & Install",
    prep2_step1_desc:
      "Go to the <a href='https://github.com/anthropics/codex' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>Codex CLI GitHub repo</a>, find <strong>Releases</strong> on the right, download the latest Windows version (.msi or .exe), double-click to install, accept all defaults.",
    prep2_step2_title: "Step 2: Verify",
    prep2_step2_desc:
      "Open a terminal (right-click Windows Start → Terminal) and run <code>codex</code>. If you land in the conversation interface, it's installed:",
    prep2_caption: "▲ After running codex in the terminal, you should see this interface — you're good to go",
    prep2_step3_title: "Step 3: First-Time Setup",
    prep2_step3_desc:
      "Codex will guide you through authentication and model selection on first run. If you have a ChatGPT / OpenAI account, just sign in — that's the simplest path. If you use a third-party API (e.g., DeepSeek, Qwen, or any OpenAI-compatible endpoint), you can configure a custom API endpoint and key in settings — Codex supports any OpenAI-format API.",

    prep2_alt_title: "Other Approaches (This System Isn't Locked to One Tool)",
    prep2_alt_intro:
      "The core of this automation system is <code>rules.md</code> + Node.js scripts + Windows Task Scheduler. Codex CLI is the most convenient entry point, but <strong>it's not the only one</strong>. Depending on your setup, at least four paths work:",
    prep2_alt1:
      "<strong>① Codex CLI (recommended):</strong> Use it directly in the terminal, deeply integrated with rules.md. Every session auto-checks news/Inbox/weekly/monthly — fetches what's missing, reminds what needs attention. All subsequent content in this article assumes this approach.",
    prep2_alt2:
      "<strong>② Codex Desktop / ChatGPT:</strong> Open your vault directory as a workspace in the desktop app. It reads and executes rules.md just the same. The advantage: a GUI for those who prefer it over the terminal. The desktop app supports the GPT-5-Codex model with stronger coding capabilities.",
    prep2_alt3:
      "<strong>③ Claude Code:</strong> Copy the rules from rules.md to Claude Code and tell it: \"These are my vault's automation rules — check what needs doing.\" Claude Code excels at understanding and reasoning — it executes the rules step by step. If you've already set up Claude Code (<a href='/blog/claude-code-mcp-setup' class='text-indigo-600 dark:text-indigo-400 hover:underline'>MCP setup</a>, <a href='/blog/claude-code-statusline' class='text-indigo-600 dark:text-indigo-400 hover:underline'>statusline</a>), this path has zero additional install cost.",
    prep2_alt4:
      "<strong>④ Manual + Any AI:</strong> Run scripts manually (<code>node fetch_aihot.js daily</code>, <code>powershell -File remind_diary.ps1</code>), then paste rules.md to any AI (ChatGPT, Claude, Kimi…) when you need help understanding or modifying the rules. Maximum flexibility, at the cost of no automatic triggers.",
    prep2_alt_note:
      "Which you pick depends on your habits — CLI if you live in the terminal, desktop if you prefer a GUI, Claude Code if you're already using it. <strong>The system is flexible — don't feel locked into one path.</strong> Same goes for the popup design later — if you have new ideas (add a sound, change the icon, move it to the corner), just tell Codex and it'll adapt to your taste.",

    prep2_help_title: "Can't Get It Installed?",
    prep2_help_desc:
      "Ask Claude Code for help. Tell it \"help me install Codex CLI\" — it can search GitHub for the latest release, give you OS-specific step-by-step instructions, and even help troubleshoot errors. If you've already set up Claude Code's MCP (GitHub + Filesystem + Playwright), it can even find the download link directly.",
    prep2_help_link_text: "Claude Code MCP Setup Guide →",

    prep2_first_task:
      "Once Codex is installed, its first job is setting up the environment. Open a terminal, run <code>codex</code>, and say: <strong>\"Create a .codex folder, a scripts subfolder, and a rules.md file in my vault root.\"</strong> Tell it your vault path — it creates <code>.codex/</code>, <code>.codex/scripts/</code>, and <code>.codex/rules.md</code> for you. The actual rules.md content is covered in \"Four Automation Pipelines\" below — for now, an empty shell is fine.",

    prep3_title: "3. Install Node.js (You Do This)",
    prep3_desc:
      "Scripts run on Node.js. Go to <a href='https://nodejs.org/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a>, download the <strong>LTS version</strong> (big green button on the left), install with all defaults. Then run <code>node --version</code> in terminal — seeing a version number (e.g., v20.x) means it's installed. If downloads are slow, set a mirror: <code>npm config set registry https://registry.npmmirror.com</code>.",

    prep4_title: "4. Vault Folder Structure (Codex Does This)",
    prep4_desc:
      "After Codex creates the .codex folder, tell it: <strong>\"Create vault folders: 0-Inbox, 1-Daily, 2-Projects, 3-Areas, 4-Resources, 5-Summaries, and Templates.\"</strong> It creates them all in your vault root. Each folder's purpose is explained under \"Vault Design\" — for now, just let Codex scaffold them.",

    prep5_title: "5. Windows Task Scheduler (Codex Registers This)",
    prep5_desc:
      "Scheduled automation relies on Windows Task Scheduler. You can press the Win key and search \"Task Scheduler\" to peek — if the window opens, you're fine; don't touch anything. When you give Codex the full requirements later, it registers all the scheduled tasks for you.",

    h2_design: "Vault Design: Why PARA + Summaries",
    design_intro:
      "Automation needs a stable structure to run against. If you put diaries here today and there tomorrow, scripts can't know where to write. This structure follows Tiago Forte's PARA method (Projects - Areas - Resources - Archives), with an Inbox prepended and Summaries appended:",
    design_layer0: "<strong>0-Inbox</strong> (entry point) — all new ideas, temporary snippets, and unsorted items land here first. Cleared regularly. This is the system's buffer zone.",
    design_layer1: "<strong>1-Daily</strong> (diaries) — archived by month like <code>2026-08/</code>. Auto-generated daily, template injects date and tags. The month's folder shapes itself — no manual filing.",
    design_layer2: "<strong>2-Projects</strong> (projects) — tasks with clear endpoints: KernelSwift competition, VAE colorization, DeepSeek monitor. One folder or Markdown file per project.",
    design_layer3: "<strong>3-Areas</strong> (areas) — ongoing interests without endpoints: Self-Initialization research, AGI thinking, Germany PhD planning, multimodal vision.",
    design_layer4: "<strong>4-Resources</strong> (references) — reference material: Linux commands cheatsheet, advanced math review, deep learning intro.",
    design_layer5: "<strong>5-Summaries</strong> (summaries) — time-based reviews: daily AI news digests, weekly reviews, monthly reviews. Organized by month folder.",
    design_principles:
      "Three key design decisions:<br /><strong>① Inbox Zero:</strong> everything lands in 0-Inbox first. Once processed, it must move to its target layer. Codex detects Inbox buildup ≥ 3 items and reminds you to sort.<br /><strong>② Monthly Archiving:</strong> diaries and news are grouped by month folder. Want to see \"what happened in July\"? Open one folder — no searching required.<br /><strong>③ Bidirectional Link Culture:</strong> every diary gets today's AI news link and related notes appended. A vault isn't a folder tree; it's a graph — bidirectional links turn the tree into a network.",
    design_home:
      "Beyond the layers, there's a <code>Home.md</code> in the vault root — it's the \"homepage\" of the whole vault. It has a knowledge map (VAE system → products → references → research), current focus areas and projects, today's news link, and weekly review entries. It's the first thing you see when opening Obsidian. Dataview keeps it auto-updating — the \"recent changes\" list maintains itself.",

    h2_lines: "Four Automation Pipelines: rules.md Is the Constitution",
    lines_intro:
      "<code>.codex/rules.md</code> is Codex's single source of behavioral truth in this vault. Every time you start a conversation with Codex, it reads this file first, then checks what needs doing based on the trigger conditions defined inside. Here are the four pipelines:",
    line1_title: "Pipeline 1: AI News Digest",
    line1_desc:
      "<strong>Trigger:</strong> At every session start, Codex checks whether today's <code>AI热点-{date}.md</code> exists — if not, it fetches immediately, no questions asked. Or say \"news\" / \"AI news\" to trigger manually.<br /><strong>Flow:</strong> ① Call the AI HOT public API for the last 24 hours of curated items → ② Filter out tip-category filler, keep 6–8 core items → ③ Format as Markdown (each with title, summary, source link) → ④ Save to <code>5-Summaries/{month}/AI热点-{date}.md</code> → ⑤ Update Home.md's \"Today's AI News\" link → ⑥ Append the news link to today's diary.<br /><strong>Data source:</strong> <a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>AI HOT</a>, a curated AI news aggregator with a public API.",
    line2_title: "Pipeline 2: Inbox Auto-Sort",
    line2_desc:
      "<strong>Trigger:</strong> You say \"sort inbox,\" or Codex detects ≥ 3 .md files accumulated in <code>0-Inbox/</code> without your intervention.<br /><strong>Flow:</strong> ① Scan Inbox → ② Read each item, AI classifies: deadline-driven tasks → 2-Projects, ongoing research topics → 3-Areas, reference material → 4-Resources → ③ Add YAML frontmatter (tags, status, area, created) → ④ Fill in bidirectional links in today's diary and related notes → ⑤ Move files to target directories → ⑥ Report results.",
    line3_title: "Pipeline 3: Weekly Review",
    line3_desc:
      "<strong>Trigger:</strong> You say \"weekly review,\" or it's Sunday and you open a new conversation.<br /><strong>Flow:</strong> ① Pull all diary entries from this week → ② Scan 2-Projects and 3-Areas for new/modified notes this week → ③ Extract key events, new ideas, open loops → ④ Generate a draft following <code>Templates/weekly-review.md</code> (sections: diaries, new knowledge & ideas, what Codex did, open loops, next week's direction) → ⑤ Update Home.md's \"Weekly Review\" link.",
    line4_title: "Pipeline 4: Monthly Review",
    line4_desc:
      "<strong>Trigger:</strong> You say \"monthly review,\" or it's the 1st of the month.<br /><strong>Flow:</strong> ① Scan all weekly reviews from this month → ② Merge and extract: monthly top tags, knowledge graph growth points, project progress → ③ Compare with last month (if exists) → ④ Generate <code>5-Summaries/{month}/月总结-{year}-{month}.md</code>.",
    lines_checklist:
      "Session startup auto-check (priority order):<br />🔴 News file exists? → If not, fetch immediately<br />🟡 Inbox ≥ 3 items? → Remind to sort<br />🟢 Is it Sunday? → Ask about weekly review<br />🔵 Is it the 1st? → Ask about monthly review",

    h2_radar: "Interest Radar: Only Alert What You Care About",
    radar_problem:
      "Four pipelines keep information flowing in automatically — but soon you'll notice a new problem:",
    radar_problem_detail:
      "Of 7 daily news items, you probably only care about 1 or 2. AGI, Self-Initialization, operators… every day you'd open the file and skim top to bottom, just to check \"is there anything for me today?\" On days with no match, those 7 items are just 7 headlines — and you've already spent 5 minutes scanning.",
    radar_solution_title: "The Fix: A Keyword Filter",
    radar_solution:
      "After the news fetch, the script scans the day's file automatically:<br /><strong>Match</strong> on a subscribed topic → pop a Windows notification window (with a live countdown and \"Open note\" button), telling you what matched.<br /><strong>No match</strong> → quietly write one log line. No interruption.<br />Like \"close friends\" notifications in a chat app — only tagged people trigger an alert.",
    radar_config_title: "How to Configure Keywords",
    radar_config:
      "Keywords aren't loose words — they're a more practical <strong>\"topic + aliases\"</strong> structure. Example: a topic called \"AGI\" with aliases like \"AGI,\" \"artificial general intelligence,\" \"通用人工智能\" — the script matching any of them still counts as \"AGI.\" So the popup tells you <strong>\"which topic matched,\"</strong> not \"which word.\"",
    radar_config_file:
      "Configuration lives in its own JSON file (see code block below). The script re-reads it every run — <strong>change config without touching code.</strong> Edit the JSON, and the next run picks it up.",
    radar_config_tip:
      "Don't want to hand-edit JSON? Tell Codex \"add a topic for XX with keywords A, B, C\" — it edits the file for you. Zero manual JSON editing.",
    radar_pitfall_intro: "Real pitfalls from building the popup:",
    radar_pitfall1:
      "<strong>Pitfall 1: System toasts silently swallowed.</strong> The first version used WinRT Toast notifications — API calls succeeded, logs were written, but nothing appeared on screen. Cause: Toasts require a registered AppUserModelID, and a \"bare PowerShell script\" has none — the system silently discards them. Fix: skip system toasts entirely; build your own window with WPF.",
    radar_pitfall2:
      "<strong>Pitfall 2: Buttons and countdown unresponsive.</strong> When writing WPF directly in PowerShell, event handler scripts need a free runspace, but <code>Dispatcher.Run()</code> blocks the runspace — events never fire. Fix: have Codex compile the popup logic into a native C# class (<code>Add-Type</code>); events go through .NET directly and work immediately.",
    radar_pitfall3:
      "<strong>Pitfall 3: Process hangs after window closes.</strong> A bare <code>Dispatcher.Run()</code> doesn't return when the window closes — the process stays alive. Fix: use WPF's standard <code>Application.Run(window)</code>; when the window closes, the process exits.",
    radar_pitfall4:
      "<strong>Pitfall 4: Chinese text garbled.</strong> PowerShell 5.1 reads scripts with the system codepage (GBK on Chinese Windows); UTF-8 without BOM gets mangled. Fix: save scripts as <strong>UTF-8 with BOM</strong>.",

    h2_day: "A Day in the Life",
    day_intro: "Once the system runs, your day looks like this:",
    day_li1: "<strong>Morning:</strong> open Obsidian — yesterday's diary is already in 1-Daily, with yesterday's AI news link at the end. Home.md shows what projects are active.",
    day_li2: "<strong>8pm:</strong> news is fetched automatically into 5-Summaries. Matching your subscribed topics? Popup. No match? Silence.",
    day_li3: "<strong>Evening:</strong> write your diary → say \"organize it\" → Inbox clears, diary files itself, bidirectional links fill in.",
    day_li4: "<strong>End of month:</strong> the month's folder is already shaped, weekly reviews are written — the monthly review is mostly merge-and-polish, not write-from-scratch.",
    day_summary: "All you have to do is read and think. The system makes sure information appears in the right place at the right time.",

    h2_faq: "FAQ",
    faq_intro: "The questions readers ask most, plus my own pitfalls:",
    faq_q1: "Do I need to know how to code?",
    faq_a1: "Not from scratch. The core skill is clearly describing what you want — when to trigger, what to do, where results go. Describe it clearly and Codex generates scripts and configs; you verify. Describe it unclearly and even Codex can't help. The bottleneck in this system isn't code — it's requirements articulation.",
    faq_q2: "What if Codex doesn't do what I asked?",
    faq_a2: "Paste its output back and tell it what's wrong (\"the news file went to the wrong folder,\" \"the popup position is off\"). It will fix it. Its capability boundary is how clearly you describe the problem. If you can't articulate the issue clearly, use Claude Code first to reason through the problem, then hand the clarified plan to Codex for execution. That's why we use both.",
    faq_q3: "How do I change execution time?",
    faq_a3: "Open Windows Task Scheduler, find the task, right-click → Properties → Triggers → Edit the time. No code changes needed.",
    faq_q4: "How do I debug when something breaks?",
    faq_a4: "Scripts write logs to <code>.codex/scripts/</code> (e.g., <code>aihot_keywords.log</code>). Paste the last few lines to Codex or Claude Code — they usually pinpoint the issue. You can also run scripts manually: <code>node fetch_aihot.js daily</code>, check terminal output.",
    faq_q5: "How do I stop it?",
    faq_a5: "Disable the task in Task Scheduler. Scripts and config can stay — re-enable the task whenever. To fully uninstall, delete the scripts and tasks.",
    faq_q6: "Why two AI tools instead of one?",
    faq_a6: "Because no single tool today excels at both \"design thinking\" and \"automation execution.\" Claude Code is strong at understanding complex requirements and reasoning — it's better suited to designing vault structures, writing Dataview queries, and planning automation workflows than writing PowerShell scripts line by line. Codex is strong at direct system manipulation — reading/writing files, executing scripts, registering scheduled tasks — but when asked to design architecture, it tends to \"act first, think later.\" This division of labor isn't gimmickry; it's playing to each tool's strengths.",
    faq_q7: "Does this work on Mac / Linux?",
    faq_a7: "The core logic (scripts + Obsidian + rules.md) works cross-platform. But Windows Task Scheduler is Windows-only — Mac uses launchd, Linux uses cron/systemd timers. When you describe your requirements to Codex, tell it your OS, and it'll use the appropriate scheduler.",

    bottom_title: "Closing",
    bottom_desc:
      "This system has been running for nearly a month. The 8pm news files, the end-of-month folders that shape themselves, the popup that says \"AGI topic matched\" — these automations aren't \"set and forget\" background tasks. They're real feedback I see every time I open Obsidian. Their most important job isn't saving time — it's <strong>lowering the barrier to start</strong>: the diary template means no blank page, Inbox zero means no classification paralysis, news fetching means no manual searching. The tools handle the \"getting started\" part. The reading and thinking that follow — that's yours.",
    bottom_tip: "I hope to see the version you build. If this structure inspires you, or if you tweak it to fit yourself better — that's the best outcome this article could have.",
  },
} as const;

const codeBlocks = {
  vaultTree: {
    zh: `SecondBrain/
├── 0-Inbox/          # 入口：新想法、未整理的东西
├── 1-Daily/          # 日记（按 2026年8月/ 归档）
├── 2-Projects/       # 项目（有终点的任务）
├── 3-Areas/          # 领域（持续关注的方向）
├── 4-Resources/      # 资料收藏
├── 5-Summaries/      # 汇总：AI热点、周总结、月总结
├── Templates/        # 模板（daily.md, weekly-review.md…）
├── Home.md           # 笔记库主页 / 知识地图
└── .codex/
    ├── rules.md      # Codex 行为规则（四条自动化线）
    └── scripts/      # 自动化脚本`,
    en: `SecondBrain/
├── 0-Inbox/          # entry point: new ideas, unsorted
├── 1-Daily/          # diaries (archived by month)
├── 2-Projects/       # projects (tasks with endpoints)
├── 3-Areas/          # areas (ongoing interests)
├── 4-Resources/      # reference material
├── 5-Summaries/      # summaries: news, weekly, monthly
├── Templates/        # templates (daily.md, weekly-review.md…)
├── Home.md           # vault homepage / knowledge map
└── .codex/
    ├── rules.md      # Codex behavior rules (4 automation pipelines)
    └── scripts/      # automation scripts`,
  },
  dailyTemplate: {
    zh: `---
date: <% tp.date.now("YYYY-MM-DD") %>
tags: [日记]
---

<% tp.date.now("YYYY-MM-DD HH:mm:ss") %>`,
    en: `---
date: <% tp.date.now("YYYY-MM-DD") %>
tags: [diary]
---

<% tp.date.now("YYYY-MM-DD HH:mm:ss") %>`,
  },
  rulesExcerpt: {
    zh: `# Codex + SecondBrain 四条自动化线

## 线1：AI 热点推送
- 触发：每次对话开始时检查今日热点文件是否存在 → 不存在立刻抓取
- 流程：调 API → 过滤 6-8 条 → 写 Markdown → 更新 Home.md → 补日记链接

## 线2：Inbox 自动整理
- 触发：用户说"整理 Inbox" 或 Inbox 累积 >= 3 个文件
- 流程：扫描 → AI 判断归属 → 加 YAML 头 → 补双向链接 → 移动文件

## 线3：周总结
- 触发：用户说"周总结" 或周日新对话
- 流程：拉本周日记 → 扫描项目/领域 → 按模板生成草稿

## 线4：月总结
- 触发：用户说"月总结" 或每月 1 号
- 流程：扫描本月周总结 → 合并提取 → 对比上月 → 生成月总结

## 每次会话启动检查
- [ ] 热点是否存在 → 不存在立刻抓取（最高优先级）
- [ ] Inbox 是否 >= 3 篇 → 提醒整理
- [ ] 是否周日 → 询问周总结
- [ ] 是否 1 号 → 询问月总结`,
    en: `# Codex + SecondBrain: Four Automation Pipelines

## Pipeline 1: AI News Digest
- Trigger: check if today's news file exists at session start → fetch if missing
- Flow: call API → filter 6-8 items → write Markdown → update Home.md → append diary link

## Pipeline 2: Inbox Auto-Sort
- Trigger: user says "sort inbox" or Inbox >= 3 files
- Flow: scan → AI classify → add YAML → fill bidirectional links → move files

## Pipeline 3: Weekly Review
- Trigger: user says "weekly review" or Sunday new session
- Flow: pull week's diaries → scan projects/areas → generate from template

## Pipeline 4: Monthly Review
- Trigger: user says "monthly review" or 1st of month
- Flow: scan month's weekly reviews → merge & extract → compare with last month → generate

## Session Startup Checklist
- [ ] News file exists? → Fetch immediately if not (highest priority)
- [ ] Inbox >= 3 items? → Remind to sort
- [ ] Sunday? → Ask about weekly review
- [ ] 1st of month? → Ask about monthly review`,
  },
  keywordsJson: {
    zh: `{
  "topics": [
    { "name": "AGI",
      "keywords": ["AGI", "通用人工智能", "artificial general intelligence"] },
    { "name": "Self-Initialization / 注意力",
      "keywords": ["Self-Initialization", "attention", "注意力", "元认知"] },
    { "name": "算子 / 国产芯片",
      "keywords": ["算子", "国产芯片", "昇腾", "Triton"] },
    { "name": "VAE / 生成模型",
      "keywords": ["VAE", "变分自编码器", "扩散模型", "图像生成"] },
    { "name": "多模态",
      "keywords": ["多模态", "视频生成", "Sora", "Runway", "视觉理解"] }
  ]
}`,
    en: `{
  "topics": [
    { "name": "AGI",
      "keywords": ["AGI", "artificial general intelligence"] },
    { "name": "Self-Initialization / Attention",
      "keywords": ["Self-Initialization", "attention", "meta-cognition"] },
    { "name": "Operators / Domestic Chips",
      "keywords": ["operator", "domestic chip", "Ascend", "Triton"] },
    { "name": "VAE / Generative Models",
      "keywords": ["VAE", "variational autoencoder", "diffusion", "image generation"] },
    { "name": "Multimodal",
      "keywords": ["multimodal", "video generation", "Sora", "Runway", "visual understanding"] }
  ]
}`,
  },
  codexPrompt: {
    zh: `帮我搭一套 Obsidian 笔记库自动化系统：

1. 笔记库结构用 PARA + Summaries：
   0-Inbox、1-Daily、2-Projects、3-Areas、4-Resources、5-Summaries
   日记和热点按月归档（1-Daily/2026年8月/）

2. 四条自动化线，规则写在 .codex/rules.md：
   - 线1：每天自动抓 AI HOT 热点，写成 Markdown 存 5-Summaries
   - 线2：Inbox 堆积 >= 3 篇时提醒整理，AI 判断归属后自动归类
   - 线3：每周日生成周总结草稿
   - 线4：每月 1 号生成月总结

3. 兴趣雷达：热点抓完后扫描关键词（独立 JSON 配置），
   命中主题弹 WPF 窗口提醒，没命中静默

4. 脚本统一放 .codex/scripts/，每个脚本有日志
5. 注册 Windows 计划任务：热点 20:00、日记提醒 22:50`,
    en: `Build me an Obsidian vault automation system:

1. Vault structure: PARA + Summaries
   0-Inbox, 1-Daily, 2-Projects, 3-Areas, 4-Resources, 5-Summaries
   Diaries and news archived by month (1-Daily/2026-08/)

2. Four automation pipelines, rules in .codex/rules.md:
   - Pipeline 1: fetch AI HOT news daily, write Markdown to 5-Summaries
   - Pipeline 2: remind when Inbox >= 3 items, AI-classify and auto-sort
   - Pipeline 3: generate weekly review draft every Sunday
   - Pipeline 4: generate monthly review on the 1st

3. Interest radar: scan keywords after news fetch (separate JSON config),
   pop WPF window on topic match, stay silent otherwise

4. All scripts under .codex/scripts/, each with logging
5. Register Windows scheduled tasks: news at 8pm, diary reminder at 10:50pm`,
  },
};

export default function CodexObsidianWorkflowPage() {
  const { lang } = useLang();
  const t = (key: string) => {
    const section = content[lang as keyof typeof content] ?? content.zh;
    return (section as Record<string, string>)[key] ?? key;
  };
  const cb = (key: string) => {
    const section = codeBlocks[key as keyof typeof codeBlocks];
    return (section as Record<string, string>)[lang as keyof typeof section] ?? (section as Record<string, string>).zh;
  };

  return (
    <BlogPostLayout post={post}>
      {/* ===== 开头 ===== */}
      <p>{t("intro_p1")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("intro_p2") }} />

      {/* ===== 工具分工 ===== */}
      <h2 id="roles">{t("h2_roles")}</h2>
      <p>{t("roles_intro")}</p>

      {/* Codex — 主角 */}
      <div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
          <img src={`${BASE_PATH}/blog-images/codex-logo.svg`} alt="" className="w-9 h-9 inline-block mr-2 align-middle" />
          {t("role1_title")}
        </h3>
        <p className="text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("role1_desc") }} />
        <p className="mt-3 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300">{t("role1_detail")}</p>
      </div>

      {/* Obsidian — 平台 */}
      <div className="mt-6 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
          <img src={`${BASE_PATH}/blog-images/obsidian-logo.svg`} alt="" className="w-8 h-8 inline-block mr-2 align-middle" />
          {t("role2_title")}
        </h3>
        <p className="text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("role2_desc") }} />
      </div>

      {/* Claude Code — 辅助 */}
      <div className="mt-6 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
          <img src={`${BASE_PATH}/blog-images/claude-code-logo.svg`} alt="" className="w-8 h-8 inline-block mr-2 align-middle" />
          {t("role3_title")}
        </h3>
        <p className="text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("role3_desc") }} />
        <p className="mt-3 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300">
          <span dangerouslySetInnerHTML={{ __html: t("role3_detail_p1") }} />
          <Link href="/blog/claude-code-mcp-setup" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t("role3_link1")}</Link>
          {lang === "zh" ? "、" : ", "}
          <Link href="/blog/claude-code-statusline" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t("role3_link2")}</Link>
          <span dangerouslySetInnerHTML={{ __html: t("role3_detail_p2") }} />
        </p>
      </div>

      <div className="mt-4 px-5 py-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("roles_summary") }} />

      {/* ===== 准备工作 ===== */}
      <h2 id="prep">{t("h2_prep")}</h2>
      <p>{t("prep_intro")}</p>

      <h3>{t("prep1_title")}</h3>
      <p className="flex items-center gap-3 my-2">
        <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer" title="Obsidian">
          <img src={`${BASE_PATH}/blog-images/obsidian-logo.svg`} alt="Obsidian logo" className="w-9 h-9" />
        </a>
        <span className="text-[15px] text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "Obsidian 官网：" : "Official site:"} <a href="https://obsidian.md/" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">obsidian.md</a></span>
      </p>
      <p dangerouslySetInnerHTML={{ __html: t("prep1_desc") }} />
      <p className="mt-3">{t("prep1_plugins_intro")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]" dangerouslySetInnerHTML={{ __html: t("prep1_plugins") }} />
      <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("prep1_templater") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "Templates/daily.md：" : "Templates/daily.md:"}</p>
      <CodeBlock language="markdown">{cb("dailyTemplate")}</CodeBlock>

      <h3 className="mt-8">{t("prep2_title")}</h3>
      <p className="mt-2">{t("prep2_intro")}</p>

      <p className="mt-5 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t("prep2_step1_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep2_step1_desc") }} />

      <p className="mt-5 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t("prep2_step2_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep2_step2_desc") }} />

      <p className="mt-5 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t("prep2_step3_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep2_step3_desc") }} />

      {/* 其他玩法 */}
      <div className="mt-8 p-5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl">
        <p className="text-base font-semibold text-indigo-800 dark:text-indigo-200 mb-3">{t("prep2_alt_title")}</p>
        <p className="text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep2_alt_intro") }} />
        <ul className="list-disc pl-5 my-3 space-y-2 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300">
          <li dangerouslySetInnerHTML={{ __html: t("prep2_alt1") }} />
          <li dangerouslySetInnerHTML={{ __html: t("prep2_alt2") }} />
          <li dangerouslySetInnerHTML={{ __html: t("prep2_alt3") }} />
          <li dangerouslySetInnerHTML={{ __html: t("prep2_alt4") }} />
        </ul>
        <p className="mt-3 text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep2_alt_note") }} />
      </div>

      {/* 实在装不上？ */}
      <div className="mt-4">
        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">{t("prep2_help_title")}</p>
        <p className="mt-2 text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep2_help_desc") }} />
        <Link href="/blog/claude-code-mcp-setup" className="group inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md bg-zinc-50 dark:bg-zinc-900/50">
          <img src={`${BASE_PATH}/statusline-cover.png`} alt="" className="w-10 h-10 object-contain rounded" />
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:underline">{t("prep2_help_link_text")}</span>
          <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>

      <p className="mt-6"><strong>{lang === "zh" ? "装好后的第一件事：" : "First thing after install:"}</strong></p>
      <p dangerouslySetInnerHTML={{ __html: t("prep2_first_task") }} />

      <h3 className="mt-8">{t("prep3_title")}</h3>
      <p className="flex items-center gap-3 my-2">
        <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" title="Node.js">
          <img src={`${BASE_PATH}/blog-images/nodejs-logo.svg`} alt="Node.js logo" className="w-9 h-9" />
        </a>
        <span className="text-[15px] text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "Node.js 官网：" : "Official site:"} <a href="https://nodejs.org/" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">nodejs.org</a></span>
      </p>
      <p dangerouslySetInnerHTML={{ __html: t("prep3_desc") }} />

      <h3 className="mt-8">{t("prep4_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep4_desc") }} />

      <h3 className="mt-8">{t("prep5_title")}</h3>
      <p>{t("prep5_desc")}</p>

      {/* ===== 笔记库设计 ===== */}
      <h2 id="design">{t("h2_design")}</h2>
      <p>{t("design_intro")}</p>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "完整目录结构：" : "Full directory structure:"}</p>
      <CodeBlock language="text">{cb("vaultTree")}</CodeBlock>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("design_layer0") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_layer1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_layer2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_layer3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_layer4") }} />
        <li dangerouslySetInnerHTML={{ __html: t("design_layer5") }} />
      </ul>
      <div className="mt-4 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("design_principles") }} />
      <p dangerouslySetInnerHTML={{ __html: t("design_home") }} />

      {/* ===== 四条自动化线 ===== */}
      <h2 id="lines">{t("h2_lines")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("lines_intro") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "rules.md 核心内容：" : "rules.md core content:"}</p>
      <CodeBlock language="markdown">{cb("rulesExcerpt")}</CodeBlock>

      <h3>{t("line1_title")}</h3>
      <a href="https://aihot.virxact.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 my-2 group">
        <img src={`${BASE_PATH}/blog-images/aihot.ico`} alt="AI HOT icon" className="w-8 h-8 shrink-0" />
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">aihot.virxact.com</span>
      </a>
      <p dangerouslySetInnerHTML={{ __html: t("line1_desc") }} />

      <h3 className="mt-6">{t("line2_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("line2_desc") }} />

      <h3 className="mt-6">{t("line3_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("line3_desc") }} />

      <h3 className="mt-6">{t("line4_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("line4_desc") }} />

      <div className="mt-6 px-5 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("lines_checklist") }} />

      {/* ===== 告诉 Codex ===== */}
      <h2 id="tell">{lang === "zh" ? "告诉 Codex：一份需求，全部搞定" : "Tell Codex: One Prompt, Everything Built"}</h2>
      <p>{lang === "zh" ? "上面这些不需要你手动搭。把下面这份需求复制给 Codex，它会问你几个问题（笔记库路径、执行时间），然后自动帮你建目录、写脚本、注册计划任务。" : "You don't need to build any of this manually. Paste the prompt below to Codex. It'll ask a few questions (vault path, execution time), then build the directories, write the scripts, and register the scheduled tasks for you."}</p>
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "给 Codex 的需求描述（可以直接复制）：" : "Prompt for Codex (copy-paste ready):"}</p>
      <CodeBlock language="text">{cb("codexPrompt")}</CodeBlock>
      <div className="mt-4 px-5 py-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl text-[16px] leading-[1.8] text-amber-800 dark:text-amber-200">
        {lang === "zh"
          ? "💡 如果 Codex 没按你想的做——把它的输出贴回去，告诉它哪里不对。如果描述不清楚问题，先用 Claude Code 理清思路，再把清晰的方案交给 Codex 执行。"
          : "💡 If Codex doesn't do what you want — paste its output back and tell it what's wrong. If you can't articulate the issue clearly, use Claude Code first to reason through it, then hand the clarified plan to Codex."}
      </div>
      <div className="mt-4 px-5 py-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300">
        {lang === "zh" ? (
          <div className="space-y-2">
            <p>🔧 <strong>以上所有内容都是开放性的。</strong></p>
            <p>目录结构觉得不合适？<br />→ 告诉 Codex 换成你喜欢的组织方式。</p>
            <p>执行时间想改？<br />→ 告诉 Codex。</p>
            <p>弹窗样式不满意（太暗、太大、位置不对、想加提示音）？<br />→ 告诉 Codex，它都能按你的审美改。</p>
            <p className="mt-3">这套系统的设计原则：<strong>你描述需求，Codex 实现，你验证结果。</strong>不要觉得被本文的方案框住了——它只是我在用的版本。</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p>🔧 <strong>Everything above is open to customization.</strong></p>
            <p>Don't like the folder structure?<br />→ Tell Codex to reorganize it your way.</p>
            <p>Want a different execution time?<br />→ Tell Codex.</p>
            <p>Popup design not to your taste (too dark, too big, wrong position, want a sound)?<br />→ Tell Codex — it adapts to your preferences.</p>
            <p className="mt-3">The design principle of this system: <strong>you describe what you want, Codex implements, you verify.</strong> Don't feel locked into what's shown here — it's just my version.</p>
          </div>
        )}
      </div>

      {/* ===== 兴趣雷达 ===== */}
      <h2 id="radar">{t("h2_radar")}</h2>
      <p className="text-zinc-700 dark:text-zinc-300">{t("radar_problem")}</p>
      <p className="mt-2 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300">{t("radar_problem_detail")}</p>

      <h3 className="mt-6">{t("radar_solution_title")}</h3>
      <p className="text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("radar_solution") }} />

      <h3 className="mt-6">{t("radar_config_title")}</h3>
      <p className="text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("radar_config") }} />
      <p className="mt-2 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("radar_config_file") }} />
      <p className="my-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === "zh" ? "aihot_keywords.json：" : "aihot_keywords.json:"}</p>
      <CodeBlock language="json">{cb("keywordsJson")}</CodeBlock>
      <p className="mt-2 text-[16px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("radar_config_tip") }} />

      <figure className="my-8">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-lg mx-auto">
          <img src={`${BASE_PATH}/aihot-popup.png`} alt="Interest radar popup" className="w-full" />
        </div>
        <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          {lang === "zh" ? "▲ 命中主题时的弹窗：标签、命中标题、倒计时、一键打开笔记" : "▲ The popup on a match: topic chips, matched headline, countdown, one-click open"}
        </figcaption>
      </figure>

      <div className="mt-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">{t("radar_pitfall_intro")}</p>
        <div className="space-y-3 text-[16px] leading-[1.8] text-zinc-700 dark:text-zinc-300">
          <p dangerouslySetInnerHTML={{ __html: t("radar_pitfall1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("radar_pitfall2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("radar_pitfall3") }} />
          <p dangerouslySetInnerHTML={{ __html: t("radar_pitfall4") }} />
        </div>
      </div>

      {/* ===== 一天流程 ===== */}
      <h2 id="day">{t("h2_day")}</h2>
      <p>{t("day_intro")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("day_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("day_li4") }} />
      </ul>
      <p className="text-zinc-700 dark:text-zinc-300 font-semibold">{t("day_summary")}</p>

      {/* ===== FAQ ===== */}
      <h2 id="faq">{t("h2_faq")}</h2>
      <p>{t("faq_intro")}</p>
      <CollapsibleCard title={t("faq_q1")}><p>{t("faq_a1")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q2")}><p>{t("faq_a2")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q3")}><p>{t("faq_a3")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q4")}><p dangerouslySetInnerHTML={{ __html: t("faq_a4") }} /></CollapsibleCard>
      <CollapsibleCard title={t("faq_q5")}><p>{t("faq_a5")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q6")}><p>{t("faq_a6")}</p></CollapsibleCard>
      <CollapsibleCard title={t("faq_q7")}><p>{t("faq_a7")}</p></CollapsibleCard>

      {/* ===== 相关资源 ===== */}
      <h2 id="ref">{lang === "zh" ? "相关资源" : "Related Resources"}</h2>
      <div className="mt-6 space-y-3">
        {([
          { img: `${BASE_PATH}/mcp-cover.png`, title: lang === "zh" ? "Claude Code MCP 配置" : "Claude Code MCP Setup", desc: lang === "zh" ? "像 USB 一样给 Claude Code 接上外设" : "Give Claude Code USB-like plug-and-play powers", href: "/blog/claude-code-mcp-setup", external: false },
          { img: `${BASE_PATH}/statusline-cover.png`, title: lang === "zh" ? "Claude Code 状态栏" : "Claude Code Statusline", desc: lang === "zh" ? "一行命令让终端活起来" : "One command to bring your terminal to life", href: "/blog/claude-code-statusline", external: false },
          { img: `${BASE_PATH}/agi-era-cover.png`, title: lang === "zh" ? "AGI 之后：从「会什么」到「你是谁」" : "After AGI: From Capability to Identity", desc: lang === "zh" ? "Codex 与 Claude Code 的三方深夜对话" : "A three-way late-night dialogue with Codex and Claude Code", href: "/blog/agi-era-thoughts", external: false },
          { img: `${BASE_PATH}/blog-images/aihot.ico`, title: "AI HOT", desc: lang === "zh" ? "每天 20:00 抓取的热点来源" : "The curated news source fetched at 8pm daily", href: "https://aihot.virxact.com/", external: true },
          { img: `${BASE_PATH}/blog-images/github-logo.svg`, title: lang === "zh" ? "本站仓库" : "Site Repository", desc: lang === "zh" ? "博客与脚本的源码都在 GitHub" : "Source code for this blog and its scripts", href: "https://github.com/Muanyan-mjq/muanyan-portfolio", external: true },
        ] as const).map((item, i) => {
          const cardClass = "group flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5";
          const inner = (
            <>
              <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{item.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              </div>
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </>
          );
          return item.external ? (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={cardClass}>{inner}</a>
          ) : (
            <Link key={i} href={item.href} className={cardClass}>{inner}</Link>
          );
        })}
      </div>

      {/* ===== 结尾 ===== */}
      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{t("bottom_tip")}</p>
      </div>
    </BlogPostLayout>
  );
}
