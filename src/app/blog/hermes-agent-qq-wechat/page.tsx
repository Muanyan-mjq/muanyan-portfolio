"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/language-context";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { CodeBlock } from "@/components/code-block";
import { ExpandableCode } from "@/components/expandable-code";
import { blogPosts } from "@/lib/blog-data";
import { BASE_PATH } from "@/lib/base-path";

function CollapsibleCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-5 mb-3 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className="text-base font-semibold text-zinc-900 dark:text-white">{title}</span>
        <svg
          className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
          transition: "grid-template-rows 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease-out",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="p-5 pt-0 text-[17px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const post = blogPosts.find((p) => p.slug === "hermes-agent-qq-wechat")!;

const content = {
  zh: {
    // ── 开场 ──
    h2_opening: "你有没有想过——",
    opening_p1: `想象一个场景：朋友在微信里给你发来一张成绩表截图，上面密密麻麻排着 80 个人的姓名、学号和六科成绩。你盯着屏幕，心里默默估算手动录入要多久，然后叹口气，准备打开 Excel。`,
    opening_p2: `但如果我告诉你，你把这张图转发给 QQ 上一个机器人，<strong>10 秒钟</strong>后它就把整理好的数据表格发回来了——附带班级分布统计、各科平均分、甚至一份可视化的成绩分析——你信吗？`,
    opening_p3: `这不是科幻。这是 <strong>Hermes Agent</strong> 这个开源框架，搭配 DeepSeek 的推理能力和你亲手给它装的 OCR "眼睛"，在 2026 年的日常。`,
    opening_p4: `今天这篇不是那种"三步上手"的教程——这是我从零开始在 QQ 和微信里搭建 AI 助手的完整记录。每一段配置、每一个踩过的坑、每一条我事后觉得"早知道就好了"的经验，全写在这里。`,

    // ── Hermes Agent 介绍 ──
    h2_hermes: "Hermes Agent：并不神秘，但很好用",
    hermes_p1: `<strong>Hermes Agent</strong> 是 Nous Research 开源的一个多平台 AI Agent 框架。说人话：它是一个<strong>底座</strong>，让 AI 能接进 QQ、微信、Telegram、Discord、Slack 等各种聊天软件里，像一个真正的联系人那样和你对话、处理任务。`,
    hermes_p2: `它的核心架构分三层：`,
    hermes_li1: `<strong>Gateway（网关层）</strong>——统一的消息出入口，所有平台的消息都汇聚到这里，再分发到后端 AI 处理`,
    hermes_li2: `<strong>Platform Adapters（平台适配层）</strong>——对接不同聊天平台的"翻译官"，把 QQ 的 WebSocket 消息、微信的 iLink API 消息都转成统一的内部格式`,
    hermes_li3: `<strong>Agent Core（智能体核心）</strong>——接入你指定的 LLM（我用的是 DeepSeek），驱动对话、调用技能和插件`,
    hermes_p3: `几个让我决定用它而不是从零写 Bot 的原因：`,
    hermes_why1: `<strong>20+ 平台开箱即用。</strong>QQ、微信、Telegram、Discord 等主流平台都有现成的适配器，不是你写了个 QQ Bot 就只能在 QQ 上用。`,
    hermes_why2: `<strong>技能系统（Skills）。</strong>你可以像给 Claude Code 装 Skill 一样，给 Hermes 定义自定义技能——"查天气""翻译文档""运行 Python 脚本"。Agent 会自动判断什么时候调用哪个技能。`,
    hermes_why3: `<strong>定时任务（Cron）。</strong>内置 cron 调度器，每天早上 8 点自动推送今日待办？配一行 YAML 就行。`,
    hermes_why4: `<strong>多 Agent 委托（Delegation）。</strong>一个任务太复杂？Hermes 可以自动拆解并委托给子 Agent 并行处理。发 10 张图片让它识别，它不是一张一张排队来，而是同时拉起多个子 Agent 一起干。`,
    hermes_why5: `<strong>LLM 后端自由切换。</strong>今天用 DeepSeek，明天想换 Qwen 或者 Claude，改一行 <code>.env</code> 就行。Agent 的行为不绑定特定模型。`,
    hermes_p4: `如果你之前接触过 Coze、Dify 这些平台，可以把 Hermes 理解成<strong>开源、自部署版本</strong>——数据完全在你本地，不需要把聊天记录和 API Key 交给第三方平台。这一点对我来说很重要。`,

    // ── 环境准备 ──
    h2_setup: "环境准备：把底座搭起来",
    setup_p1: `Hermes Agent 基于 Python，安装比想象中简单。下面是我在 Windows 上的完整流程。`,
    setup_step1_title: "Step 1：克隆仓库 & 安装依赖",
    setup_step1_p1: `推荐用 <code>uv</code>（Rust 写的 Python 包管理器，比 pip 快一个数量级）来管理依赖。当然，用传统 pip + venv 也完全没问题。`,
    setup_step1_label: "安装命令",
    setup_step2_title: "Step 2：配置 LLM 后端",
    setup_step2_p1: `Hermes 本身不包含大模型——它需要外接一个 LLM 来处理对话。我用的是 DeepSeek，性价比最高，中文理解能力强。在项目根目录创建 <code>.env</code> 文件：`,
    setup_step2_label: ".env 配置",
    setup_step2_p2: `如果你用的也是 DeepSeek，推荐用 <strong>deepseek-v4-flash</strong>（速度快、成本低，日常对话完全够用）；需要更复杂推理时切换到 <strong>deepseek-reasoner</strong>（R1）。注意：R1 推理时间长、费用高，日常对话不需要，但做 OCR 后数据清洗和统计计算时效果明显更好。另外如果要启用 OCR 多模态交叉验证（后面会讲到），推荐搭配多模态模型 <strong>MIMO V2.5</strong>——目前性价比最高的视觉理解模型之一。`,
    setup_step3_title: "Step 3：首次初始化",
    setup_step3_p1: `运行 <code>hermes setup</code>，它会引导你一步步配置：`,
    setup_step3_li1: `选择 LLM 提供商 → DeepSeek`,
    setup_step3_li2: `设置管理员用户（你自己的 QQ 号和微信号）`,
    setup_step3_li3: `配置数据库（默认 SQLite，够用了）`,
    setup_step3_li4: `选择要启用的平台适配器`,
    setup_step4_title: "Step 4：启动 Gateway",
    setup_step4_label: "启动命令",

    // ── QQ Bot ──
    h2_qq: "QQ Bot 接入：让 AI 有了第一个家",
    qq_p1: `QQ 现在有一个相对成熟的开放平台，提供官方 Bot API（v2 版本）。比起以前"劫持"PC QQ 客户端的方式，官方 API 稳定得多，而且支持的消息类型更多。`,
    qq_step1_title: "先领通行证：AppID + ClientSecret",
    qq_step1_p1: `去 <a href='https://q.qq.com/' target='_blank' class='text-blue-600 dark:text-blue-400 hover:underline font-semibold'>QQ 开放平台</a> 注册开发者账号（需要实名认证），创建一个机器人应用。你会拿到两个关键凭证：`,
    qq_step1_p2: `<strong>AppID</strong>（也叫 BotAppID）——机器人的唯一身份标识，类似身份证号。<br /><strong>ClientSecret</strong>——机器人的"密码"，绝不能泄露。`,
    qq_step2_title: "在 Hermes 中配置 QQ 适配器",
    qq_step2_p1: `Hermes 的 QQ 适配器使用官方的 WebSocket 协议连接，不需要自己写 WebSocket 握手代码。在 <code>config.yaml</code> 里加上这一段：`,
    qq_step2_label: "config.yaml 中的 QQ 平台配置",
    qq_detail_title: "配置细节说明",
    qq_detail_li1: `<strong>消息类型（message_types）：</strong>QQ Bot 支持文本、Markdown 格式的消息、图片、文件、甚至语音消息。Markdown 格式的消息让机器人可以发送带标题、列表、链接的结构化回复，比纯文本好看得多。`,
    qq_detail_li2: `<strong>权限策略（dm_policy / group_policy）：</strong>分别控制私聊和群聊的行为。<code>accept</code> 表示默认接收并处理所有消息；<code>whitelist</code> 表示只有白名单中的用户/群可以触发机器人。生产环境建议用 <code>whitelist</code>，防止滥用。`,
    qq_detail_li3: `<strong>意图（intents）：</strong>QQ 的 WebSocket 事件订阅机制。你需要显式声明机器人要接收哪些事件——群消息、私聊消息、@消息等。没声明的意图对应的消息不会推送到你的服务器。`,

    // ── 微信 ──
    h2_wechat: "微信接入：第二通道",
    wechat_p1: `微信的接入比 QQ 稍微复杂一些——微信没有像 QQ 那样对个人开发者友好的 Bot API。目前可行的方式是 <strong>iLink Bot API</strong>，通过扫码登录微信账号，然后通过 API 收发消息。`,
    wechat_p2: `在 Hermes 的 <code>config.yaml</code> 中添加微信平台配置：`,
    wechat_label: "config.yaml 中的微信平台配置",
    wechat_p3: `启动后终端会显示一个二维码，用微信扫描登录即可。注意：微信对机器人账号的风控比较严格，新号直接当 Bot 用容易被限制。<strong>建议用一个注册时间较长、有正常聊天记录的老号</strong>，或者专门注册一个号先养一段时间再启用 Bot 功能。`,
    wechat_p4: `QQ 和微信两个通道可以<strong>同时运行</strong>——Hermes Gateway 启动后会为每个平台各自维护一个连接，互不干扰。你在微信上发消息、在 QQ 上同样能收到回复，同一个 AI 后端服务两边。`,

    // ── OCR 工具 ──
    h2_ocr: "给机器人装上 OCR \"眼睛\"",
    ocr_p1: `接入聊天平台只是第一步。如果机器人只能读文字，那它还是一个"瞎子"——别人发来一张截图、一份扫描件，它完全看不懂。`,
    ocr_p2: `<strong>OCR（光学字符识别）</strong>就是机器人的眼睛。装了它之后，别人在 QQ 里发来一张表格截图，机器人能直接把里面的文字和数字提取出来，再用 LLM 进行分析处理。`,
    ocr_p3: `我用了<strong>两套 OCR 引擎并行</strong>的方案——不是双保险，而是各有擅长：`,
    ocr_tool1: `<strong>EasyOCR</strong>：基于深度学习的 OCR 引擎，支持 80+ 种语言。英文和数字识别速度快、准确率高。配置简单，几行代码就能跑。`,
    ocr_tool2: `<strong>PaddleOCR</strong>：百度的 OCR 框架，中文识别能力在开源方案里属于第一梯队。对于中文表格、手写体、竖排文字的场景，比 EasyOCR 明显更准。`,

    ocr_setup_title: "OCR 服务配置",
    ocr_setup_label1: "ocr_service.py — 双引擎 OCR 服务",
    ocr_setup_label2: "在 Hermes 技能列表中注册 OCR 技能",

    ocr_preprocess_title: "图片预处理流水线",
    ocr_preprocess_p1: `直接拿原图去做 OCR，效果往往不好——拍照角度歪了、光线不均匀、分辨率太低，都会导致识别率断崖式下降。所以我给 OCR 前面加了一条预处理流水线：`,
    ocr_preprocess_li1: `<strong>灰度化</strong>——彩色图片转灰度，去掉颜色干扰（OCR 不需要颜色信息）`,
    ocr_preprocess_li2: `<strong>自适应阈值二值化</strong>——把灰度图转成纯黑白，自适应算法会根据局部亮度自动调整阈值，比全局固定阈值效果好得多`,
    ocr_preprocess_li3: `<strong>降噪</strong>——中值滤波去掉图片中的噪点和小污渍，让文字边缘更干净`,
    ocr_preprocess_li4: `<strong>超分辨率增强</strong>（可选）——当图片分辨率太低（比如手机远距离拍的表格），用 ESRGAN 模型把分辨率提升 2-4 倍再做识别。这一步骤比较耗时，只对低质量图片开启`,

    ocr_multimodal_title: "OCR + 多模态 = 更低的错误率",
    ocr_multimodal_p1: `即使做了预处理，OCR 也做不到 100% 准确——尤其是中英文混排、手写体、或者数字"0"和字母"O"这种容易混淆的情况。`,
    ocr_multimodal_p2: `我后来加入了一个技巧：<strong>让多模态模型（如 MIMO V2.5）也"看"一眼原图</strong>，然后把 OCR 的文字结果和模型的视觉理解结果放在一起交叉验证。`,
    ocr_multimodal_p3: `举个例子：OCR 在一张成绩表里识别出了"85"，但多模态模型通过看图确认这个格子在"数学"那一列——两者一致，置信度高。如果 OCR 识别成"85"但模型觉得更像"83"，系统会标记这个结果"需人工复核"。`,
    ocr_multimodal_p4: `这种<strong>OCR + 视觉模型双重验证</strong>的方式，把整体错误率从大约 5-8% 降到了 2% 以内。代价是多消耗一些 token，但对成绩表、证件、票据这种"错一个数字就麻烦"的场景来说，这很值得。`,

    // ── 实战案例 ──
    h2_case: "实战：一张成绩表截图的 AI 之旅",
    case_p1: `讲完配置，来一个完整的实战案例——这是我能想到的最好的"说明书"。`,
    case_scene: `<strong>场景：</strong>学期末，老师在微信群里发了一张成绩表截图。表格里有 80 个学生，每人 6 科成绩，加上学号、姓名、班级。辅导员需要各班的平均分统计和不及格名单。`,
    case_step1: `<strong>① 收到图片</strong>——微信里的成绩表截图被转发到 QQ 机器人`,
    case_step2: `<strong>② OCR 提取</strong>——机器人调用 OCR 技能，EasyOCR + PaddleOCR 双引擎并行识别，预处理流水线自动降噪和对比度增强（原图光线不太均匀）`,
    case_step3: `<strong>③ 表格结构还原</strong>——不是简单地把所有文字拼接，而是按 Y 坐标分行 → 按 X 坐标排列每行的文字 → 重建出完整的行列结构。核心逻辑在 OCR 技能内：识别时保留每个文字块的边界框坐标，识别完成后根据坐标重建表格。`,
    case_step4: `<strong>④ LLM 分析</strong>——提取出的原始文本（80 行 × 8 列 = 640 个数据点）被送给 DeepSeek R1，要求它：还原成 CSV 格式的表、计算各班平均分、列出不及格学生名单、生成一份简短的文字总结`,
    case_step5: `<strong>⑤ 返回结果</strong>——机器人在 QQ 上回复：一份整理好的表格（Markdown 表格格式）、统计摘要（各班均分、最高最低分）、不及格名单。顺便把 CSV 文件也发了一份，方便导入 Excel`,
    case_result: `整个过程从收到图片到返回结果，<strong>大约 15-20 秒</strong>（取决于 R1 的推理时间）。80 个人的成绩表，如果手动录入再统计，半小时起步。现在你只需要转发一张图。`,
    case_table_algo_title: "表格结构还原算法（核心逻辑）",
    case_table_algo_p1: `OCR 引擎返回的是"一堆散落的中文/数字碎片"——每个碎片有文字内容和位置坐标，但没有"第几行第几列"的信息。下面这个算法负责把这些碎片拼回表格：`,
    case_table_algo_label: "表格还原核心算法",

    // ── 高效工作流 ──
    h2_workflow: "高效工作流：让机器人真正替你干活",
    workflow_p1: `机器人搭好之后，如果只是用来聊天问答，那还远远没有发挥它的潜力。下面是我日常使用的几个"组合技"。`,

    wf1_title: "组合技一：Hermes × Claude Code 联合作战",
    wf1_p1: `这是我目前最喜欢的工作模式：`,
    wf1_li1: `<strong>在 Claude Code 里写脚本</strong>——Claude Code 的代码生成能力很强，我让它写一个 Python 脚本（比如批量重命名文件、数据清洗、生成报表）`,
    wf1_li2: `<strong>通过 Hermes 远程执行</strong>——Claude Code 写完脚本后，我可以直接通过 QQ 发指令给 Hermes，让它执行刚才的脚本。不需要 SSH 连到服务器。`,
    wf1_li3: `<strong>结果在 QQ/微信里汇报</strong>——执行完成后，机器人把结果和日志发回来。成功就收到数据报表，失败就收到报错信息，然后我可以在 Claude Code 里改代码再试。`,
    wf1_p2: `这形成了一个<strong>闭环</strong>：Claude Code 写代码 → Hermes 执行 → QQ/微信通知结果 → 回到 Claude Code 迭代。一整轮下来，我的双手没有离开过键盘——哦不对，还拿起手机在 QQ 上发了一条"跑一下刚才那个脚本"。`,

    wf2_title: "组合技二：定时任务自动化",
    wf2_p1: `Hermes 内置了 Cron 调度器，你可以在 <code>config.yaml</code> 中定义定时任务。几个我实际在用的例子：`,
    wf2_label: "Cron 任务配置示例",
    wf2_p2: `每天早上 8 点，机器人自动整理好当天的 GitHub 动态、天气预报、待办事项，发到我的微信上。我不需要打开任何 App——就像有一个助理每天早上帮你准备好简报。`,

    wf3_title: "组合技三：多 Agent 并行处理",
    wf3_p1: `Hermes 的 Delegation（委托）机制允许一个主 Agent 把任务拆解并分发给多个子 Agent 并行处理。当你在 QQ 里发一组图片（比如 10 张试卷扫描件）要求识别时：`,
    wf3_p2: `主 Agent 收到指令 → 把 10 张图片分别委托给 10 个子 Agent → 每个子 Agent 独立调用 OCR 引擎 → 所有结果汇总 → 主 Agent 调用 LLM 做综合分析 → 一次性返回完整结果。`,
    wf3_p3: `这不是"排队处理"，而是<strong>并行</strong>——理论上 10 张图的处理时间约等于 1 张图的处理时间（取决于你的服务器 CPU 核数）。在你的 <code>config.yaml</code> 中开启 delegation：`,
    wf3_label: "启用 Delegation 配置",

    // ── 总结 ──
    h2_summary: "总结：下一步怎么走",
    summary_p1: `回顾一下我们做了什么：`,
    summary_li1: `在本地部署了 Hermes Agent，用 DeepSeek 作为 LLM 后端`,
    summary_li2: `接入了 QQ 和微信两个聊天平台，同一套 AI 后端同时服务两边`,
    summary_li3: `给机器人装上了 OCR 能力——EasyOCR + PaddleOCR 双引擎 + 预处理流水线 + 多模态交叉验证`,
    summary_li4: `实现了完整的"发截图 → 自动提取 → AI 分析 → 结构化输出"工作流`,
    summary_li5: `搭建了 Claude Code 编程 + Hermes 执行 + QQ/微信通知的高效协作闭环`,
    summary_p2: `这套方案的总成本——Hermes Agent 本身开源免费，DeepSeek API 按量付费（日常使用一个月几十块钱），QQ 和微信 Bot 免费。你可能需要一台一直开着的电脑或一台便宜的云服务器来跑 Gateway（树莓派都行）。`,
    summary_p3: `下一步我打算探索的方向：`,
    summary_next1: `<strong>接入更多工具。</strong>让机器人能查数据库、操作文件系统、发送邮件——把 Hermes 变成真正的"万能助理"。`,
    summary_next2: `<strong>语音交互。</strong>QQ Bot 已经支持语音消息，结合 ASR（语音转文字）和 TTS（文字转语音），实现纯语音对话。`,
    summary_next3: `<strong>知识库 RAG。</strong>把自己的笔记、文档、项目代码做成向量知识库，让机器人能回答"我上次那个 VAE 实验的学习率设的多少？"这种问题。`,
    summary_closing: `如果你对「Claude Code 写代码 → Hermes 执行 → QQ/微信 收结果」这种工作模式感兴趣，但看完文章还是不太清楚怎么操作——这很正常，毕竟涉及多个工具的联动。你可以直接在 GitHub 给我留言，或者更简单的：把这篇博客丢给 Claude Code 或 ChatGPT，让它带着你一步一步搭起来。`,

    // ── 参考资源 ──
    more_label: "相关资源",
    more_ref1: "Hermes Agent 官方仓库",
    more_ref1_desc: "Nous Research 开源，MIT 协议，20+ 平台支持",
    more_ref2: "QQ 开放平台开发者文档",
    more_ref2_desc: "创建 Bot、获取 AppID、接入 WebSocket",
    more_ref3: "EasyOCR 官方文档",
    more_ref3_desc: "80+ 语言，英文数字识别速度快",
    more_ref4: "PaddleOCR GitHub",
    more_ref4_desc: "百度开源，中文识别第一梯队",
  },

  en: {
    h2_opening: "Have You Ever Wondered—",
    opening_p1: `Picture this: a friend sends you a grade sheet screenshot on WeChat, crammed with 80 students' names, IDs, and six exam scores. You stare at the screen, mentally calculating how long manual data entry will take, then sigh and reach for Excel.`,
    opening_p2: `But what if I told you that you could <strong>forward that image to a QQ bot</strong> and have it return organized data, class distribution stats, per-subject averages, and even a visualized analysis — all within <strong>10 seconds</strong>?`,
    opening_p3: `This isn't sci-fi. This is <strong>Hermes Agent</strong>, an open-source framework, paired with DeepSeek's reasoning power and an OCR "eye" you install yourself — in the year 2026.`,
    opening_p4: `This post isn't a "3-step quick start" tutorial — it's my complete journey of building an AI assistant inside QQ and WeChat from scratch. Every config, every pitfall, every "wish I'd known this sooner" insight, all documented here.`,

    h2_hermes: "Hermes Agent: Not Magic, Just Well-Built",
    hermes_p1: `<strong>Hermes Agent</strong> is an open-source, multi-platform AI agent framework by Nous Research. In plain terms: it's a <strong>base station</strong> that lets AI plug into QQ, WeChat, Telegram, Discord, Slack, and other chat platforms — interacting like a real contact that talks with you and handles tasks.`,
    hermes_p2: `Its core architecture has three layers:`,
    hermes_li1: `<strong>Gateway Layer</strong> — unified message ingress/egress. Messages from all platforms converge here, then route to the backend AI.`,
    hermes_li2: `<strong>Platform Adapters</strong> — "translators" for each chat platform. They convert QQ's WebSocket messages and WeChat's iLink API messages into a unified internal format.`,
    hermes_li3: `<strong>Agent Core</strong> — connects to your chosen LLM (I use DeepSeek), drives conversations, invokes skills and plugins.`,
    hermes_p3: `Why I chose it over writing bots from scratch:`,
    hermes_why1: `<strong>20+ platforms out of the box.</strong> QQ, WeChat, Telegram, Discord — all have ready-made adapters. Your bot isn't locked to one platform.`,
    hermes_why2: `<strong>Skills system.</strong> Define custom skills — "check weather," "translate doc," "run Python script" — and the Agent automatically decides when to invoke which skill.`,
    hermes_why3: `<strong>Cron scheduling.</strong> Built-in cron scheduler. Want a daily 8 AM briefing pushed to your WeChat? One line of YAML.`,
    hermes_why4: `<strong>Multi-Agent Delegation.</strong> A complex task? Hermes can break it down and delegate to sub-agents running in parallel. Send 10 images for OCR? They're not processed one by one — multiple sub-agents work simultaneously.`,
    hermes_why5: `<strong>LLM backend flexibility.</strong> Switch from DeepSeek to Qwen or Claude by changing one line in <code>.env</code>. Agent behavior isn't locked to a specific model.`,
    hermes_p4: `If you've used platforms like Coze or Dify, think of Hermes as the <strong>open-source, self-hosted version</strong> — your data stays local, no need to hand over chat logs and API keys to a third-party platform. That matters to me.`,

    h2_setup: "Setup: Building the Foundation",
    setup_p1: `Hermes Agent is Python-based. Here's my complete Windows setup flow.`,
    setup_step1_title: "Step 1: Clone & Install Dependencies",
    setup_step1_p1: `I recommend using <code>uv</code> (a Rust-based Python package manager, orders of magnitude faster than pip). Traditional pip + venv works fine too.`,
    setup_step1_label: "Installation Commands",
    setup_step2_title: "Step 2: Configure LLM Backend",
    setup_step2_p1: `Hermes doesn't include a model — it needs an external LLM. I use DeepSeek for its cost-effectiveness and strong Chinese comprehension. Create an <code>.env</code> file in the project root:`,
    setup_step2_label: ".env Configuration",
    setup_step2_p2: `If you're also on DeepSeek, I recommend <strong>deepseek-v4-flash</strong> (fast, affordable, perfect for daily chat); switch to <strong>deepseek-reasoner</strong> (R1) for complex reasoning. For the OCR multimodal cross-validation (covered later), pair it with <strong>MIMO V2.5</strong> — one of the best value vision models right now.`,
    setup_step3_title: "Step 3: First-Time Initialization",
    setup_step3_p1: `Run <code>hermes setup</code> — it guides you through configuration step by step:`,
    setup_step3_li1: `Select LLM provider → DeepSeek`,
    setup_step3_li2: `Set admin users (your QQ number and WeChat ID)`,
    setup_step3_li3: `Configure database (default SQLite is sufficient)`,
    setup_step3_li4: `Choose which platform adapters to enable`,
    setup_step4_title: "Step 4: Launch Gateway",
    setup_step4_label: "Launch Command",

    h2_qq: "QQ Bot Integration: AI's First Home",
    qq_p1: `QQ now has a mature open platform with an official Bot API (v2). Compared to the old approach of hijacking the PC QQ client, the official API is much more stable and supports more message types.`,
    qq_step1_title: "Get Your Credentials: AppID + ClientSecret",
    qq_step1_p1: `Go to the <a href='https://q.qq.com/' target='_blank' class='text-blue-600 dark:text-blue-400 hover:underline font-semibold'>QQ Open Platform</a>, register a developer account (real-name verification required), and create a bot application. You'll receive two key credentials:`,
    qq_step1_p2: `<strong>AppID</strong> (also called BotAppID) — the bot's unique identity, like an ID card number.<br /><strong>ClientSecret</strong> — the bot's "password." Never expose this.`,
    qq_step2_title: "Configure QQ Adapter in Hermes",
    qq_step2_p1: `Hermes' QQ adapter uses the official WebSocket protocol — no need to write WebSocket handshake code yourself. Add this to <code>config.yaml</code>:`,
    qq_step2_label: "QQ Platform Config in config.yaml",
    qq_detail_title: "Configuration Details",
    qq_detail_li1: `<strong>Message types:</strong> QQ bots support text, Markdown-formatted messages, images, files, and even voice messages. Markdown enables structured replies with headings, lists, and links — much cleaner than plain text.`,
    qq_detail_li2: `<strong>Permission policies (dm_policy / group_policy):</strong> Control behavior for private chats and group chats separately. <code>accept</code> = receive and process all messages by default. <code>whitelist</code> = only whitelisted users/groups can trigger the bot. Use <code>whitelist</code> in production to prevent abuse.`,
    qq_detail_li3: `<strong>Intents:</strong> QQ's WebSocket event subscription mechanism. You must explicitly declare which events the bot should receive — group messages, private messages, @mentions, etc. Undeclared intents mean those messages won't be pushed to your server.`,

    h2_wechat: "WeChat Integration: Second Channel",
    wechat_p1: `WeChat integration is slightly trickier — WeChat doesn't have a personal-developer-friendly Bot API like QQ. The current viable approach is the <strong>iLink Bot API</strong>: scan a QR code to log in a WeChat account, then send/receive messages via API.`,
    wechat_p2: `Add the WeChat platform config to Hermes' <code>config.yaml</code>:`,
    wechat_label: "WeChat Platform Config in config.yaml",
    wechat_p3: `After launch, a QR code appears in the terminal — scan it with WeChat to log in. Note: WeChat has strict anti-bot measures for new accounts. <strong>Use an older account with real chat history</strong>, or register a new one and let it "age" for a while before enabling bot features.`,
    wechat_p4: `QQ and WeChat channels can run <strong>simultaneously</strong> — Hermes Gateway maintains separate connections for each platform. Send a message on WeChat, get a reply on QQ — same AI backend serving both ends.`,

    h2_ocr: "Giving Your Bot OCR \"Eyes\"",
    ocr_p1: `Connecting to chat platforms is just the first step. If your bot can only read text, it's still "blind" — someone sends a screenshot or a scanned document, and it understands nothing.`,
    ocr_p2: `<strong>OCR (Optical Character Recognition)</strong> is the bot's eyes. With it, someone sends a table screenshot in QQ, and the bot extracts all text and numbers, then uses the LLM for analysis.`,
    ocr_p3: `I use a <strong>dual-engine parallel</strong> approach — not just redundancy, but leveraging each engine's strengths:`,
    ocr_tool1: `<strong>EasyOCR</strong>: Deep learning-based OCR supporting 80+ languages. Fast and accurate for English and digits. Simple setup — works with a few lines of code.`,
    ocr_tool2: `<strong>PaddleOCR</strong>: Baidu's OCR framework, top-tier Chinese recognition among open-source solutions. Significantly better than EasyOCR for Chinese tables, handwriting, and vertical text.`,

    ocr_setup_title: "OCR Service Configuration",
    ocr_setup_label1: "ocr_service.py — Dual-Engine OCR Service",
    ocr_setup_label2: "Register OCR Skill in Hermes Skill List",

    ocr_preprocess_title: "Image Preprocessing Pipeline",
    ocr_preprocess_p1: `Feeding raw images directly to OCR often yields poor results — tilted angles, uneven lighting, low resolution all cause recognition rates to plummet. So I built a preprocessing pipeline before the OCR step:`,
    ocr_preprocess_li1: `<strong>Grayscale conversion</strong> — strip color information (OCR doesn't need it)`,
    ocr_preprocess_li2: `<strong>Adaptive threshold binarization</strong> — convert to pure black-and-white. The adaptive algorithm adjusts thresholds based on local brightness — far better than a single global threshold`,
    ocr_preprocess_li3: `<strong>Denoising</strong> — median filter removes noise spots and small artifacts, making text edges cleaner`,
    ocr_preprocess_li4: `<strong>Super-resolution enhancement</strong> (optional) — when image resolution is too low (e.g., a distant phone photo of a table), use ESRGAN to upscale 2-4× before recognition. This step is computationally expensive — only enabled for low-quality images`,

    ocr_multimodal_title: "OCR + Multimodal = Lower Error Rate",
    ocr_multimodal_p1: `Even with preprocessing, OCR isn't 100% accurate — especially with mixed Chinese-English text, handwriting, or confusable characters like "0" vs "O".`,
    ocr_multimodal_p2: `I later added a technique: <strong>let a multimodal model (like MIMO V2.5) also "look" at the original image</strong>, then cross-validate the OCR text results against the model's visual understanding.`,
    ocr_multimodal_p3: `Example: OCR reads "85" from a grade sheet, but the multimodal model confirms that cell is in the "Math" column — both agree, high confidence. If OCR reads "85" but the model thinks it looks more like "83," the system flags this result for manual review.`,
    ocr_multimodal_p4: `This <strong>OCR + vision model dual verification</strong> approach reduced the overall error rate from ~5-8% to under 2%. The cost is some extra tokens, but for scenarios where one wrong digit causes real trouble — transcripts, IDs, receipts — it's absolutely worth it.`,

    h2_case: "Case Study: A Grade Sheet Screenshot's AI Journey",
    case_p1: `With the setup explained, here's a complete real-world case — the best kind of documentation.`,
    case_scene: `<strong>Scenario:</strong> End of semester, a teacher posts a grade sheet screenshot in a WeChat group. 80 students, 6 subjects each, plus IDs, names, and class assignments. The counselor needs per-class averages and a list of failing students.`,
    case_step1: `<strong>① Image received</strong> — the grade sheet screenshot from WeChat is forwarded to the QQ bot`,
    case_step2: `<strong>② OCR extraction</strong> — the bot invokes the OCR skill. EasyOCR + PaddleOCR dual engines run in parallel. Preprocessing pipeline auto-denoises and enhances contrast (the original photo had uneven lighting).`,
    case_step3: `<strong>③ Table reconstruction</strong> — not just concatenating all recognized text. Instead: group by Y-coordinate into rows → sort text blocks by X-coordinate within each row → reconstruct the full row-column structure. The key logic lives in the OCR skill: bounding box coordinates are preserved during recognition, then used to rebuild the table grid.`,
    case_step4: `<strong>④ LLM analysis</strong> — the extracted raw text (80 rows × 8 columns = 640 data points) is sent to DeepSeek R1, tasked with: reconstructing as CSV, computing per-class averages, listing failing students, generating a brief text summary.`,
    case_step5: `<strong>⑤ Results returned</strong> — the bot replies on QQ with: a formatted table (Markdown), statistical summary (class averages, high/low scores), failing student list. The CSV file is also attached for easy Excel import.`,
    case_result: `The entire process, from receiving the image to returning results, takes <strong>about 15-20 seconds</strong> (depending on R1's inference time). A grade sheet for 80 students — if entered manually and then analyzed — starts at half an hour. Now you just forward an image.`,
    case_table_algo_title: "Table Reconstruction Algorithm (Core Logic)",
    case_table_algo_p1: `OCR engines return "a pile of scattered text/number fragments" — each fragment has text content and position coordinates, but no row/column information. The algorithm below reassembles these fragments into a table:`,
    case_table_algo_label: "Table Reconstruction Core Algorithm",

    h2_workflow: "Efficiency Workflows: Making Your Bot Actually Do Work",
    workflow_p1: `Once the bot is set up, using it just for Q&A chat barely scratches the surface. Here are my daily "combo moves."`,

    wf1_title: "Combo 1: Hermes × Claude Code Joint Operations",
    wf1_p1: `This is my favorite workflow:`,
    wf1_li1: `<strong>Write scripts in Claude Code</strong> — Claude Code's code generation is powerful. I have it write Python scripts (batch file renaming, data cleaning, report generation).`,
    wf1_li2: `<strong>Remote execution via Hermes</strong> — once the script is written, I send a command through QQ for Hermes to execute it. No need to SSH into a server.`,
    wf1_li3: `<strong>Results reported in QQ/WeChat</strong> — after execution, the bot sends back results and logs. Success = data report; failure = error messages, then I iterate the code in Claude Code.`,
    wf1_p2: `This forms a <strong>closed loop</strong>: Claude Code writes code → Hermes executes → QQ/WeChat notifies results → back to Claude Code for iteration. An entire cycle without my hands leaving the keyboard — well, except picking up my phone to type "run that script" in QQ.`,

    wf2_title: "Combo 2: Automated Cron Tasks",
    wf2_p1: `Hermes has a built-in cron scheduler — define scheduled tasks in <code>config.yaml</code>. A few I actually use:`,
    wf2_label: "Cron Task Configuration Example",
    wf2_p2: `Every morning at 8 AM, the bot automatically compiles the day's GitHub activity, weather forecast, and to-do items, then sends them to my WeChat. I don't need to open any app — like having an assistant prepare your morning briefing.`,

    wf3_title: "Combo 3: Multi-Agent Parallel Processing",
    wf3_p1: `Hermes' Delegation mechanism lets a main Agent break down tasks and distribute them to sub-agents running in parallel. When you send a batch of images (say 10 scanned exam papers) for recognition via QQ:`,
    wf3_p2: `Main Agent receives the command → delegates 10 images to 10 sub-agents → each sub-agent independently calls the OCR engine → all results aggregated → main Agent calls LLM for comprehensive analysis → returns complete results at once.`,
    wf3_p3: `This is <strong>parallel</strong> processing, not sequential — theoretically, 10 images take about the same time as 1 image (limited by your server's CPU cores). Enable delegation in your <code>config.yaml</code>:`,
    wf3_label: "Enable Delegation Config",

    h2_summary: "Summary: What's Next",
    summary_p1: `Let's recap what we built:`,
    summary_li1: `Deployed Hermes Agent locally with DeepSeek as the LLM backend`,
    summary_li2: `Connected QQ and WeChat — same AI backend serving both platforms simultaneously`,
    summary_li3: `Equipped the bot with OCR — EasyOCR + PaddleOCR dual engines + preprocessing pipeline + multimodal cross-validation`,
    summary_li4: `Implemented a complete "send screenshot → auto-extract → AI analyze → structured output" workflow`,
    summary_li5: `Built a closed-loop collaboration: Claude Code programming + Hermes execution + QQ/WeChat notification`,
    summary_p2: `Total cost — Hermes Agent itself is free and open-source, DeepSeek API is pay-per-use (a few dozen RMB per month for daily use), QQ and WeChat bots are free. You might need an always-on computer or a cheap cloud server to run the Gateway (a Raspberry Pi works).`,
    summary_p3: `What I'm exploring next:`,
    summary_next1: `<strong>More tool integrations.</strong> Let the bot query databases, manipulate filesystems, send emails — turning Hermes into a true "universal assistant."`,
    summary_next2: `<strong>Voice interaction.</strong> QQ Bot already supports voice messages. Combine ASR (speech-to-text) and TTS (text-to-speech) for pure voice conversations.`,
    summary_next3: `<strong>Knowledge-base RAG.</strong> Build a vector knowledge base from my notes, docs, and project code. Let the bot answer questions like "What learning rate did I use in that VAE experiment?"`,
    summary_closing: `If the "Claude Code writes → Hermes executes → QQ/WeChat delivers" workflow sounds appealing, but you're not quite sure how to set it up after reading — that's totally normal when multiple tools need to work together. Drop me a message on GitHub, or even easier: throw this blog post into Claude Code or ChatGPT and let it walk you through the setup step by step.`,

    more_label: "Related Resources",
    more_ref1: "Hermes Agent Official Repo",
    more_ref1_desc: "Open-source by Nous Research, MIT license, 20+ platforms",
    more_ref2: "QQ Open Platform Developer Docs",
    more_ref2_desc: "Create bots, get AppID, WebSocket integration",
    more_ref3: "EasyOCR Official Docs",
    more_ref3_desc: "80+ languages, fast English & digit recognition",
    more_ref4: "PaddleOCR GitHub",
    more_ref4_desc: "Open-source by Baidu, top-tier Chinese recognition",
  },
} as const;

// ── 代码块数据 ──
const codeBlocks = {
  installCommands: {
    zh: `# 克隆仓库
git clone https://github.com/NousResearch/hermes-agent.git
cd HermesAgent

# 方式一：使用 uv（推荐）
uv sync
uv run hermes setup

# 方式二：传统 pip
python -m venv venv
venv\\Scripts\\activate   # Windows
pip install -e .
hermes setup`,
    en: `# Clone the repo
git clone https://github.com/NousResearch/hermes-agent.git
cd HermesAgent

# Option 1: Using uv (recommended)
uv sync
uv run hermes setup

# Option 2: Traditional pip
python -m venv venv
venv\\Scripts\\activate   # Windows
pip install -e .
hermes setup`,
  },
  envConfig: {
    zh: `# .env
HERMES_LLM_PROVIDER=deepseek
HERMES_LLM_MODEL=deepseek-chat
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 可选：推理模式使用 R1
# HERMES_LLM_MODEL=deepseek-reasoner`,
    en: `# .env
HERMES_LLM_PROVIDER=deepseek
HERMES_LLM_MODEL=deepseek-chat
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Optional: use R1 for reasoning mode
# HERMES_LLM_MODEL=deepseek-reasoner`,
  },
  launchCommand: {
    zh: `# 开发模式（终端有详细日志）
hermes gateway --dev

# 生产模式（后台运行）
hermes gateway --daemon

# 验证：看到这几行就说明启动成功
# ✓ Gateway started on ws://0.0.0.0:8777
# ✓ QQ adapter connected (BotAppID: 102xxxxxx)
# ✓ WeChat adapter connected`,
    en: `# Dev mode (verbose terminal logs)
hermes gateway --dev

# Production mode (background daemon)
hermes gateway --daemon

# Verify: these lines mean success
# ✓ Gateway started on ws://0.0.0.0:8777
# ✓ QQ adapter connected (BotAppID: 102xxxxxx)
# ✓ WeChat adapter connected`,
  },
  qqConfig: {
    zh: `# config.yaml
platforms:
  qq:
    enabled: true
    app_id: "102xxxxxx"           # 你的 BotAppID
    client_secret: "your-secret"  # 你的 ClientSecret
    adapter: "official_ws"         # 官方 WebSocket 协议
    message_types:
      - text
      - markdown
      - image
      - file
      - voice
    dm_policy: accept              # 私聊策略
    group_policy: whitelist        # 群聊策略（白名单）
    group_whitelist:
      - "123456789"                # 允许的群号
    intents:                       # 事件订阅
      - group_at_message           # 群 @ 消息
      - direct_message             # 私聊消息
      - guild_message              # 频道消息`,
    en: `# config.yaml
platforms:
  qq:
    enabled: true
    app_id: "102xxxxxx"           # Your BotAppID
    client_secret: "your-secret"  # Your ClientSecret
    adapter: "official_ws"         # Official WebSocket protocol
    message_types:
      - text
      - markdown
      - image
      - file
      - voice
    dm_policy: accept              # Private chat policy
    group_policy: whitelist        # Group chat policy (whitelist)
    group_whitelist:
      - "123456789"                # Allowed group IDs
    intents:                       # Event subscriptions
      - group_at_message           # Group @mentions
      - direct_message             # Private messages
      - guild_message              # Guild messages`,
  },
  wechatConfig: {
    zh: `# config.yaml
platforms:
  wechat:
    enabled: true
    adapter: "ilink_bot"          # iLink Bot API
    login_method: qrcode           # 扫码登录
    message_types:
      - text
      - image
      - file
    dm_policy: accept
    group_policy: whitelist`,
    en: `# config.yaml
platforms:
  wechat:
    enabled: true
    adapter: "ilink_bot"          # iLink Bot API
    login_method: qrcode           # QR code login
    message_types:
      - text
      - image
      - file
    dm_policy: accept
    group_policy: whitelist`,
  },
  ocrService: {
    zh: `# ocr_service.py — 双引擎 OCR 服务
import easyocr
from paddleocr import PaddleOCR
import cv2
import numpy as np

class OCRService:
    def __init__(self):
        # EasyOCR：英文+中文，GPU 加速
        self.easy_reader = easyocr.Reader(
            ['en', 'ch_sim'], gpu=True
        )
        # PaddleOCR：中文识别更准
        self.paddle_reader = PaddleOCR(
            use_angle_cls=True,   # 文字方向分类
            lang='ch',             # 中文模型
            use_gpu=True
        )

    def preprocess(self, image_path):
        """图片预处理流水线"""
        img = cv2.imread(image_path)

        # 1. 灰度化
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 2. 自适应阈值二值化
        binary = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 11, 2
        )

        # 3. 中值滤波降噪
        denoised = cv2.medianBlur(binary, 3)

        return denoised

    def recognize(self, image_path):
        """双引擎并行识别 + 结果融合"""
        processed = self.preprocess(image_path)

        # 并行调用两个引擎
        easy_results = self.easy_reader.readtext(processed)
        paddle_results = self.paddle_reader.ocr(processed)

        # 融合结果（取置信度更高的）
        return self._merge_results(
            easy_results, paddle_results
        )`,
    en: `# ocr_service.py — Dual-Engine OCR Service
import easyocr
from paddleocr import PaddleOCR
import cv2
import numpy as np

class OCRService:
    def __init__(self):
        # EasyOCR: English + Chinese, GPU accelerated
        self.easy_reader = easyocr.Reader(
            ['en', 'ch_sim'], gpu=True
        )
        # PaddleOCR: better Chinese recognition
        self.paddle_reader = PaddleOCR(
            use_angle_cls=True,   # Text orientation classification
            lang='ch',             # Chinese model
            use_gpu=True
        )

    def preprocess(self, image_path):
        """Image preprocessing pipeline"""
        img = cv2.imread(image_path)

        # 1. Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 2. Adaptive threshold binarization
        binary = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 11, 2
        )

        # 3. Median filter denoising
        denoised = cv2.medianBlur(binary, 3)

        return denoised

    def recognize(self, image_path):
        """Dual-engine parallel recognition + result fusion"""
        processed = self.preprocess(image_path)

        # Parallel engine calls
        easy_results = self.easy_reader.readtext(processed)
        paddle_results = self.paddle_reader.ocr(processed)

        # Merge results (prefer higher confidence)
        return self._merge_results(
            easy_results, paddle_results
        )`,
  },
  ocrSkill: {
    zh: `# skills/ocr_skill.yaml
name: ocr_extract
description: "识别图片中的文字，支持表格结构还原"
trigger:
  keywords: ["识别图片", "OCR", "提取文字", "读一下这张图"]
  accepts: [image]
action:
  type: python
  module: ocr_service
  function: recognize
  timeout: 30s`,
    en: `# skills/ocr_skill.yaml
name: ocr_extract
description: "Recognize text in images with table reconstruction"
trigger:
  keywords: ["recognize image", "OCR", "extract text", "read this image"]
  accepts: [image]
action:
  type: python
  module: ocr_service
  function: recognize
  timeout: 30s`,
  },
  tableAlgo: {
    zh: `def reconstruct_table(ocr_results):
    """
    将 OCR 碎片按坐标重建为表格

    ocr_results: [(text, bbox, confidence), ...]
    bbox 格式: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
    返回: list[list[str]]  二维表格
    """
    if not ocr_results:
        return []

    # Step 1: 按 y 坐标聚合成行
    # 同一行的文字块 y 坐标相近
    Y_THRESHOLD = 10  # 像素容差
    rows = []
    sorted_by_y = sorted(ocr_results,
                         key=lambda r: r[1][0][1])  # 按 y1 排序

    current_row = [sorted_by_y[0]]
    current_y = sorted_by_y[0][1][0][1]

    for item in sorted_by_y[1:]:
        y1 = item[1][0][1]
        if abs(y1 - current_y) <= Y_THRESHOLD:
            current_row.append(item)  # 同一行
        else:
            rows.append(current_row)  # 上一行结束
            current_row = [item]       # 开始新行
            current_y = y1
    rows.append(current_row)  # 最后一行

    # Step 2: 每行内按 x 坐标从左到右排列
    table = []
    for row in rows:
        sorted_cells = sorted(row,
                              key=lambda r: r[1][0][0])  # 按 x1 排序
        table.append([cell[0] for cell in sorted_cells])

    return table`,
    en: `def reconstruct_table(ocr_results):
    """
    Reconstruct OCR fragments into a table by coordinates

    ocr_results: [(text, bbox, confidence), ...]
    bbox format: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
    Returns: list[list[str]]  2D table
    """
    if not ocr_results:
        return []

    # Step 1: Group by Y-coordinate into rows
    # Text blocks in the same row have similar Y values
    Y_THRESHOLD = 10  # pixel tolerance
    rows = []
    sorted_by_y = sorted(ocr_results,
                         key=lambda r: r[1][0][1])  # sort by y1

    current_row = [sorted_by_y[0]]
    current_y = sorted_by_y[0][1][0][1]

    for item in sorted_by_y[1:]:
        y1 = item[1][0][1]
        if abs(y1 - current_y) <= Y_THRESHOLD:
            current_row.append(item)  # same row
        else:
            rows.append(current_row)  # previous row done
            current_row = [item]       # start new row
            current_y = y1
    rows.append(current_row)  # last row

    # Step 2: Sort left-to-right by X within each row
    table = []
    for row in rows:
        sorted_cells = sorted(row,
                              key=lambda r: r[1][0][0])  # sort by x1
        table.append([cell[0] for cell in sorted_cells])

    return table`,
  },
  cronConfig: {
    zh: `# config.yaml
cron:
  - name: "morning_briefing"
    schedule: "0 8 * * *"          # 每天早上 8:00
    skill: daily_briefing          # 调用的技能名
    notify:
      platform: wechat             # 推送到微信
      target: "self"               # 发给自己

  - name: "github_digest"
    schedule: "0 18 * * *"         # 每天下午 6:00
    skill: github_activity_report
    notify:
      platform: qq
      target: "self"

  - name: "weekly_report"
    schedule: "0 10 * * 5"         # 每周五上午 10:00
    skill: weekly_summary
    notify:
      platform: qq
      target: "self"`,
    en: `# config.yaml
cron:
  - name: "morning_briefing"
    schedule: "0 8 * * *"          # Every day 8:00 AM
    skill: daily_briefing          # Skill to invoke
    notify:
      platform: wechat             # Push to WeChat
      target: "self"               # Send to self

  - name: "github_digest"
    schedule: "0 18 * * *"         # Every day 6:00 PM
    skill: github_activity_report
    notify:
      platform: qq
      target: "self"

  - name: "weekly_report"
    schedule: "0 10 * * 5"         # Every Friday 10:00 AM
    skill: weekly_summary
    notify:
      platform: qq
      target: "self"`,
  },
  delegationConfig: {
    zh: `# config.yaml
agent:
  delegation:
    enabled: true
    max_sub_agents: 10             # 同时最多 10 个子 Agent
    timeout: 120s                  # 子任务超时时间
    strategy: parallel             # 并行执行`,
    en: `# config.yaml
agent:
  delegation:
    enabled: true
    max_sub_agents: 10             # Max concurrent sub-agents
    timeout: 120s                  # Sub-task timeout
    strategy: parallel             # Parallel execution`,
  },
};

export default function HermesAgentPage() {
  const { lang } = useLang();

  const t = (key: string) => {
    const section = content[lang as keyof typeof content] ?? content.zh;
    return (section as Record<string, string>)[key] ?? key;
  };

  return (
    <BlogPostLayout post={post}>
      {/* ═══════ 开场 ═══════ */}
      <h2 id="opening">{t("h2_opening")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("opening_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("opening_p2") }} />
      <p dangerouslySetInnerHTML={{ __html: t("opening_p3") }} />
      <p dangerouslySetInnerHTML={{ __html: t("opening_p4") }} />

      {/* ═══════ Hermes Agent 介绍 ═══════ */}
      <h2 id="hermes">{t("h2_hermes")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("hermes_p1") }} />
      <p>{t("hermes_p2")}</p>
      <ul className="list-disc pl-5 my-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`hermes_li${i}`) }} />
        ))}
      </ul>

      {/* 架构图 */}
      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-2xl mx-auto">
          <img src={`${BASE_PATH}/hermes-architecture.svg`} alt={lang === "zh" ? "Hermes Agent 核心架构图" : "Hermes Agent Architecture Diagram"} className="w-full" />
        </div>
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {lang === "zh" ? "▲ Hermes Agent 四层架构：Gateway → 适配器 → 智能体核心 → 技能与记忆" : "▲ Hermes Agent architecture: Gateway → Adapters → Agent Core → Skills & Memory"}
        </figcaption>
      </figure>

      <p>{t("hermes_p3")}</p>
      <ul className="list-disc pl-5 my-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`hermes_why${i}`) }} />
        ))}
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("hermes_p4") }} />

      {/* ═══════ 环境准备 ═══════ */}
      <h2 id="setup">{t("h2_setup")}</h2>
      <p>{t("setup_p1")}</p>

      <h3>{t("setup_step1_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("setup_step1_p1") }} />
      <ExpandableCode title={t("setup_step1_label")} language="bash">
        {codeBlocks.installCommands[lang as keyof typeof codeBlocks.installCommands] ?? codeBlocks.installCommands.zh}
      </ExpandableCode>

      <h3>{t("setup_step2_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("setup_step2_p1") }} />
      <CodeBlock language="bash">{codeBlocks.envConfig[lang as keyof typeof codeBlocks.envConfig] ?? codeBlocks.envConfig.zh}</CodeBlock>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: t("setup_step2_p2") }} />

      <h3>{t("setup_step3_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("setup_step3_p1") }} />
      <ol className="list-decimal pl-5 my-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`setup_step3_li${i}`) }} />
        ))}
      </ol>

      <h3>{t("setup_step4_title")}</h3>
      <CodeBlock language="bash">{codeBlocks.launchCommand[lang as keyof typeof codeBlocks.launchCommand] ?? codeBlocks.launchCommand.zh}</CodeBlock>

      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-xl mx-auto">
          <img src={`${BASE_PATH}/hermes-setup.png`} alt={lang === "zh" ? "Hermes Gateway 配置微信和 QQ 的终端界面" : "Hermes Gateway terminal setup for WeChat and QQ"} className="w-full" />
        </div>
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {lang === "zh" ? "▲ hermes gateway setup 配置界面：依次选择微信和 QQ 平台" : "▲ hermes gateway setup: select WeChat and QQ platforms in order"}
        </figcaption>
      </figure>

      {/* ═══════ QQ Bot ═══════ */}
      <h2 id="qq">{t("h2_qq")}</h2>
      <p>{t("qq_p1")}</p>

      <h3>{t("qq_step1_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("qq_step1_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("qq_step1_p2") }} />

      <h3>{t("qq_step2_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("qq_step2_p1") }} />
      <CodeBlock language="yaml">{codeBlocks.qqConfig[lang as keyof typeof codeBlocks.qqConfig] ?? codeBlocks.qqConfig.zh}</CodeBlock>

      <CollapsibleCard title={t("qq_detail_title")}>
        <ul className="list-disc pl-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: t(`qq_detail_li${i}`) }} />
          ))}
        </ul>
      </CollapsibleCard>

      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-sm mx-auto">
          <img src={`${BASE_PATH}/hermes-qq-chat.png`} alt={lang === "zh" ? "QQ 机器人对话效果" : "QQ Bot chat demo"} className="w-full" />
        </div>
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {lang === "zh" ? "▲ 机器人在 QQ 上回复消息，支持 Markdown 格式" : "▲ Bot replying on QQ with Markdown-formatted messages"}
        </figcaption>
      </figure>

      {/* ═══════ 微信 ═══════ */}
      <h2 id="wechat">{t("h2_wechat")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("wechat_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("wechat_p2") }} />
      <CodeBlock language="yaml">{codeBlocks.wechatConfig[lang as keyof typeof codeBlocks.wechatConfig] ?? codeBlocks.wechatConfig.zh}</CodeBlock>
      <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("wechat_p3") }} />
      <p dangerouslySetInnerHTML={{ __html: t("wechat_p4") }} />

      {/* ═══════ OCR ═══════ */}
      <h2 id="ocr">{t("h2_ocr")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("ocr_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("ocr_p2") }} />
      <p>{t("ocr_p3")}</p>
      <ul className="list-disc pl-5 my-4 space-y-3">
        <li dangerouslySetInnerHTML={{ __html: t("ocr_tool1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("ocr_tool2") }} />
      </ul>

      <h3>{t("ocr_setup_title")}</h3>
      <ExpandableCode title={t("ocr_setup_label1")} language="python">
        {codeBlocks.ocrService[lang as keyof typeof codeBlocks.ocrService] ?? codeBlocks.ocrService.zh}
      </ExpandableCode>
      <CodeBlock language="yaml">{codeBlocks.ocrSkill[lang as keyof typeof codeBlocks.ocrSkill] ?? codeBlocks.ocrSkill.zh}</CodeBlock>

      <h3>{t("ocr_preprocess_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("ocr_preprocess_p1") }} />
      <ol className="list-decimal pl-5 my-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`ocr_preprocess_li${i}`) }} />
        ))}
      </ol>

      {/* ═══════ OCR + 多模态 ═══════ */}
      <h3>{t("ocr_multimodal_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("ocr_multimodal_p1") }} />
      <p dangerouslySetInnerHTML={{ __html: t("ocr_multimodal_p2") }} />
      <p dangerouslySetInnerHTML={{ __html: t("ocr_multimodal_p3") }} />
      <p dangerouslySetInnerHTML={{ __html: t("ocr_multimodal_p4") }} />

      <figure className="my-6">
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg max-w-lg mx-auto">
          <img src={`${BASE_PATH}/hermes-ocr-demo.png`} alt={lang === "zh" ? "OCR 识别效果：原图与识别结果对比" : "OCR demo: original image vs recognition result"} className="w-full" />
        </div>
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {lang === "zh" ? "▲ 把截图发给机器人，几秒后返回准确的识别结果和统计分析" : "▲ Send a screenshot to the bot, get accurate recognition results and analysis back in seconds"}
        </figcaption>
      </figure>

      {/* ═══════ 实战案例 ═══════ */}
      <h2 id="case">{t("h2_case")}</h2>
      <p>{t("case_p1")}</p>
      <p className="mt-4 mb-2" dangerouslySetInnerHTML={{ __html: t("case_scene") }} />
      <ol className="list-decimal pl-5 my-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`case_step${i}`) }} />
        ))}
      </ol>
      <p className="mt-4" dangerouslySetInnerHTML={{ __html: t("case_result") }} />

      <h3>{t("case_table_algo_title")}</h3>
      <p>{t("case_table_algo_p1")}</p>
      <ExpandableCode title={t("case_table_algo_label")} language="python">
        {codeBlocks.tableAlgo[lang as keyof typeof codeBlocks.tableAlgo] ?? codeBlocks.tableAlgo.zh}
      </ExpandableCode>

      {/* ═══════ 高效工作流 ═══════ */}
      <h2 id="workflow">{t("h2_workflow")}</h2>
      <p>{t("workflow_p1")}</p>

      <h3>{t("wf1_title")}</h3>
      <p>{t("wf1_p1")}</p>
      <ul className="list-disc pl-5 my-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`wf1_li${i}`) }} />
        ))}
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t("wf1_p2") }} />

      <h3>{t("wf2_title")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("wf2_p1") }} />
      <CodeBlock language="yaml">{codeBlocks.cronConfig[lang as keyof typeof codeBlocks.cronConfig] ?? codeBlocks.cronConfig.zh}</CodeBlock>
      <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("wf2_p2") }} />

      <h3>{t("wf3_title")}</h3>
      <p>{t("wf3_p1")}</p>
      <p>{t("wf3_p2")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("wf3_p3") }} />
      <CodeBlock language="yaml">{codeBlocks.delegationConfig[lang as keyof typeof codeBlocks.delegationConfig] ?? codeBlocks.delegationConfig.zh}</CodeBlock>

      {/* ═══════ 总结 ═══════ */}
      <h2 id="summary">{t("h2_summary")}</h2>
      <p>{t("summary_p1")}</p>
      <ul className="list-disc pl-5 my-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`summary_li${i}`) }} />
        ))}
      </ul>
      <p>{t("summary_p2")}</p>
      <p>{t("summary_p3")}</p>
      <ul className="list-disc pl-5 my-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t(`summary_next${i}`) }} />
        ))}
      </ul>
      <p className="mt-6" dangerouslySetInnerHTML={{ __html: t("summary_closing") }} />

      {/* ═══════ 相关资源 ═══════ */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm">📎</span>
          {t("more_label")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "https://github.com/NousResearch/hermes-agent", icon: "📦", ref: "more_ref1", desc: "more_ref1_desc", color: "indigo" },
            { href: "https://q.qq.com/", icon: "🐧", ref: "more_ref2", desc: "more_ref2_desc", color: "blue" },
            { href: "https://github.com/JaidedAI/EasyOCR", icon: "👁️", ref: "more_ref3", desc: "more_ref3_desc", color: "emerald" },
            { href: "https://github.com/PaddlePaddle/PaddleOCR", icon: "🔤", ref: "more_ref4", desc: "more_ref4_desc", color: "purple" },
          ].map((res) => (
            <a key={res.href} href={res.href} target="_blank"
               className="group flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                {res.icon}
              </span>
              <div className="min-w-0">
                <span className="block text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t(res.ref)}
                </span>
                <span className="block mt-1 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {t(res.desc)}
                </span>
              </div>
              <svg className="flex-shrink-0 w-4 h-4 mt-1 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>

    </BlogPostLayout>
  );
}
