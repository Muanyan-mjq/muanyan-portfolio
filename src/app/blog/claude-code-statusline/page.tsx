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
const post = blogPosts.find((p) => p.slug === "claude-code-statusline")!;

const content = {
  zh: {
    h2_prep: "准备工作",
    prep_p1: "下面两个检查，每项都配了对照截图和安装教程。没装过的点开折叠按钮跟着做就行。",
    prep_check1: "检查 1：Claude Code 能启动吗？",
    prep_check1_desc: "打开终端，输入 <code>claude</code> 回车。看到类似下面的界面就说明 OK：",
    prep_check1_install: "没有安装 Claude Code？点这里看教程",
    prep_install_intro: "安装 Claude Code 之前需要先有 <strong>Node.js</strong>（npm 是 Node.js 自带的包管理器）。下面分三步：",
    prep_install_node_title: "第 1 步：装 Node.js",
    prep_install_node_desc: "打开 <code>https://nodejs.org</code>，下载 <strong>LTS 版本</strong>（左边那个绿色的），一路点 Next 安装。装完验证：",
    prep_install_claude_title: "第 2 步：装 Claude Code",
    prep_install_claude_vpn: "有 VPN / 能访问外网：",
    prep_install_claude_novpn: "国内网络 / 无法访问 npm 官方源：先换淘宝镜像，再安装",
    prep_install_claude_verify: "第 3 步：验证 — 装完后新开一个终端，输入 <code>claude</code> 回车，出现交互界面就成功了",
    prep_check2: "检查 2：Python 装了吗？",
    prep_check2_desc: "终端输入 <code>python --version</code> 回车，显示版本号就行：",
    prep_check2_install: "没有安装 Python？点这里看教程",
    prep_install_py_intro: "三种安装方式，推荐第 1 种（最快最省事）：",
    prep_install_py_way1: "<strong>方式一：微软商店（推荐）</strong><br />打开 Microsoft Store，搜索「Python 3.12」，点安装就行。自动配好 PATH，不用任何额外设置。",
    prep_install_py_way2: "<strong>方式二：官网安装包</strong><br />去 <code>python.org</code> 下载，安装时<strong>一定要勾选底部「Add Python to PATH」</strong>，不然终端里找不到 python 命令。",
    prep_install_py_way3: "<strong>方式三：国内镜像（下载快）</strong><br />清华镜像 <code>https://mirrors.tuna.tsinghua.edu.cn/python/</code> 或华为云 <code>https://mirrors.huaweicloud.com/python/</code>，下载后同样勾选 Add to PATH。",
    prep_install_py_verify: "装完后关掉终端重新打开，输入 <code>python --version</code> 验证。如果提示「找不到命令」，说明 PATH 没配好，卸载重装勾选 Add to PATH。",

    config_explain_title: "settings.json 新增了什么",
    config_explain_p1: "Claude 会帮你写好这些配置。下面是每一项的含义，了解即可：",
    config_explain_type: "<code>type</code> 设为 <code>\"command\"</code>，意思是状态栏内容由外部命令生成。脚本的 stdout 输出什么，底部就显示什么。",
    config_explain_command: "<code>command</code> 是实际执行的命令。<br />Windows 用户注意：<code>bash</code> 要写 Git 自带的绝对路径 <code>D:/Git/usr/bin/bash.exe</code>，因为 cmd.exe 的 PATH 里没有 bash。",
    config_explain_refresh: "<code>refreshInterval</code> 设成 <code>1</code>，表示每 1 秒调一次脚本，数据实时更新。",
    config_explain_padding: "<code>padding</code> 设成 <code>1</code>，状态栏上方留 1 行空白，和上面的对话文字区分开。",

    h2_how: "第一步：告诉 Claude 你想要什么",
    how_p1: "在 Claude Code 里输入这个命令：",
    how_p2: "回车之后 Claude 会问你几个问题（喜欢什么颜色、想显示几行、要不要加载条），你只管回答，剩下的代码、配置、路径 Claude 全部帮你搞定。",

    h2_result: "你会得到什么",
    result_p1: "做完之后，Claude Code 底部会出现这样一个三行状态栏：",
    result_p2: "每 1 秒自动刷新。CTX 加载条会跟着会话用量实时涨，低用量蓝色，超过 75% 变黄，超过 90% 变红提醒你该压缩上下文了。",
    result_lines_title: "三行分别显示：",
    result_li1: "<strong>第 1 行：模型 · Effort · Git 分支 · 版本号 · 时间</strong><br /><span style=\"color:#78787a\">当前用的什么模型、在哪个分支、代码有没有未提交</span>",
    result_li2: "<strong>第 2 行：当前目录 + 会话耗时</strong><br /><span style=\"color:#78787a\">开了多久、忘了关也一目了然</span>",
    result_li3: "<strong>第 3 行：CTX 加载条 + 百分比 + 窗口大小</strong><br /><span style=\"color:#78787a\">离 token 上限还有多远，75% 变黄、90% 变红</span>",

    h2_more: "状态栏还能加什么",
    more_p1: "上面的三行只是起点。状态栏能显示的远不止这些——Claude Code 会把整个会话信息以 JSON 格式传给脚本，里面信息很全。下面是一些可以加进去的东西，挑你感兴趣的告诉 Claude 就行：",
    more_li1: "<strong>API 费用</strong><br /><span style=\"color:#78787a\">每次对话花了多少钱，<code>cost.total_cost_usd</code> 字段有实时数据</span>",
    more_li2: "<strong>token 速度</strong><br /><span style=\"color:#78787a\">每秒处理多少 token，方便评估模型响应</span>",
    more_li3: "<strong>剩余额度</strong><br /><span style=\"color:#78787a\">按量付费的 API 显示今日剩余调用次数</span>",
    more_li4: "<strong>网络延迟</strong><br /><span style=\"color:#78787a\">API 响应耗时，网络不好时一眼发现</span>",
    more_li5: "<strong>CPU / 内存占用</strong><br /><span style=\"color:#78787a\">本地推理时很有用</span>",
    more_li6: "<strong>自定义问候语</strong><br /><span style=\"color:#78787a\">早上显示「早上好」，深夜显示「早点休息」</span>",
    more_p2: "想看完整的可用数据字段，运行这个命令：",

    h2_config: "技术细节：settings.json 里加了什么",
    config_p1: "好奇的话可以看一眼，这些是 Claude 帮你写到配置文件里的内容。不需要手动改。",

    h2_faq: "常见问题",
    faq_intro: "点击展开查看详细解决方案：",

    faq_q1: "状态栏完全不显示，底部什么都没有",
    faq_a1: "<p>按顺序排查，90% 的情况在第三步之前就能解决：</p><ol><li><strong>看错误日志</strong>：<code>cat ~/.claude/statusline_error.log</code>。如果有报错，把错误信息复制给 Claude 让它帮你分析。</li><li><strong>手动跑脚本</strong>：<code>cat ~/.claude/statusline_dump.json | python ~/.claude/statusline.py</code>。如果正常输出三行彩色文字，说明脚本没问题，是配置层面的问题。如果没有输出或报错，说明脚本有问题。</li><li><strong>检查路径</strong>：<code>ls -la D:/Git/usr/bin/bash.exe</code> 和 <code>python --version</code>。卸载 Git 或升级 Python 后路径可能变了，去 settings.json 更新 <code>command</code> 里的路径。</li><li><strong>检查配置</strong>：打开 <code>~/.claude/settings.json</code>，搜索 <code>statusLine</code>，确认这个段还在且格式完整（没有多余的逗号或括号）。</li><li><strong>重启 Claude Code</strong>：配置改了之后必须重启才能生效。</li></ol>",

    faq_q2: "CTX 加载条一直 ?% 不变",
    faq_a2: "<p>说明脚本拿不到上下文用量数据。两步检查：</p><ol><li>看 <code>~/.claude/statusline_dump.json</code> 里有没有 <code>context_window</code> 这个字段。没有的话，你的 Claude Code 版本可能太旧，升级到最新版（<code>npm update -g @anthropic-ai/claude-code</code>）。</li><li>如果有 <code>context_window</code> 但 <code>used_percentage</code> 一直为 0：发几条长消息后再看，如果还是 0，说明你用的 API 后端没有报告这个值。脚本会自动 fallback 到 transcript 文件估算——确认 <code>transcript_path</code> 指向的文件存在且不为空。</li></ol>",

    faq_q3: "CTX 加载条一直 0%，不会涨",
    faq_a3: "<p>0% 比 ?% 好，至少说明数据通路是通的。<code>used_percentage</code> 可能是真实的 0——刚开会话或刚压缩完上下文时就是 0。发几条消息后再看，应该会涨。如果发了十几条还是 0，去看 dump.json 里的 <code>total_input_tokens</code> 是不是也一直是 0——如果是，说明 API 后端完全不报告 token 数，依赖 transcript 文件估算来兜底。</p>",

    faq_q4: "改完脚本保存了但状态栏没变化",
    faq_a4: "<p>状态栏脚本是被 Claude Code 定期调用的，不会自动热加载。你需要<strong>重启 Claude Code</strong>（完全退出再重新打开）才能用上新脚本。如果重启后还是旧内容，确认改的是正确的文件路径（<code>~/.claude/statusline.py</code>），不要改到其他目录的同名文件去了。</p>",

    faq_q5: "Git 分支信息不显示或显示错误",
    faq_a5: "<p>状态栏只在当前目录是 Git 仓库时才显示分支信息。确认两件事：1) <code>git status</code> 在当前目录能正常执行；2) Git 已加入系统 PATH。如果显示的分支名不对，检查是不是在子目录——脚本用 <code>git -C</code> 指定了 Claude Code 的当前工作目录。</p>",

    faq_q6: "Windows 终端颜色显示乱码或颜色不对",
    faq_a6: "<p>三个检查：1) 用 <strong>Windows Terminal</strong> 而非旧版 cmd.exe（旧版不支持 24-bit 颜色）；2) 脚本第一行有 <code>sys.stdout.reconfigure(encoding='utf-8')</code>，确保 Unicode 字符能正常输出；3) 如果颜色能显示但色值不对，去脚本顶部改 RGB 值（搜「RGB color picker」在线调色）。</p>",

    faq_q7: "状态栏刷新太慢或太频繁",
    faq_a7: "<p>改 settings.json 里的 <code>refreshInterval</code>：设成 <code>2</code> 每 2 秒刷新，<code>5</code> 每 5 秒。注意：间隔不能小于脚本的执行时间——对话越长 transcript 文件越大，极端情况下脚本可能跑超过 1 秒，导致实际刷新率降低。CPU 占用敏感的话设成 3 秒比较合适。</p>",

    faq_q8: "换电脑怎么迁移",
    faq_a8: "<p>三样东西复制到新电脑：1) <code>~/.claude/statusline.py</code> 脚本文件；2) settings.json 里的 <code>statusLine</code> 段；3) 如果新电脑 Python 或 bash 安装路径不同，更新 <code>command</code> 里的绝对路径。装好 Python 和 Git Bash 后把文件放到对应位置，重启 Claude Code 就行。</p>",

    faq_q9: "能用别的语言写吗？",
    faq_a9: "<p>可以。<code>type: \"command\"</code> 不限制语言——任何能从 stdin 读 JSON、往 stdout 写文本的程序都能用。Node.js、Ruby、甚至一个 shell 脚本都可以。Python 只是因为字符串处理方便、跨平台兼容好才被选作示例。</p>",

    h2_code: "完整代码参考",
    code_p1: "下面是完整的状态栏脚本，放在文章最后作为参考。不需要逐行看懂——Claude 会帮你写好。想了解细节的话，代码里的中文注释说明了每个函数的作用。",
    code_py_label: "statusline.py（点击展开）",

    // FAQ 分类标题
    faq_cat1: "🖥️ 显示异常（不显示 / ?% / 乱码）",
    faq_cat2: "⚙️ 修改与配置（改了不生效 / 刷新 / 恢复）",
    faq_cat3: "🔧 环境与工具（Git / 路径 / 迁移 / 缺模块）",
    faq_cat4: "💡 其他问题",

    // FAQ 子标题
    faq_s1: "状态栏底部什么都没有",
    faq_s2: "CTX 加载条显示 ?%",
    faq_s3: "CTX 加载条一直 0%，不会涨",
    faq_s4: "颜色乱码或显示不对",
    faq_s5: "改了脚本但状态栏没变化",
    faq_s6: "调整刷新频率（太快太慢都不好）",
    faq_s7: "想临时关掉状态栏，但不删配置",
    faq_s8: "状态栏文字太长，终端里折行了",
    faq_s9: "settings.json 改坏了，Claude Code 启动报错",
    faq_s10: "Git 分支信息不显示",
    faq_s11: "找不到 bash.exe 的路径",
    faq_s12: "Python 报错「No module named xxx」",
    faq_s13: "换电脑 / 重装系统后怎么迁移",
    faq_s14: "能用 Python 以外的语言写吗？",
    faq_s15: "状态栏占太多终端空间了，能缩小吗？",

    // 还能加什么
    more_h3_1: "示例 1：显示 API 费用",
    more_h3_2: "示例 2：显示 API 响应延迟",
    more_h3_3: "示例 3：显示 token 处理速度",
    more_h3_more: "更多创意",
    faq_detail_1: "<p>状态栏完全空白通常不是脚本逻辑问题，而是<strong>配置链路断了</strong>——Claude Code 没找到你的脚本、脚本执行失败、或者输出没被正确读取。按下面顺序逐项排查，每做完一步就检查状态栏有没有恢复：</p>",

    faq_step_1_title: "第 1 步 · 看错误日志（30 秒）",
    faq_step_1_desc: "脚本里内置了错误捕获——每次崩溃都会把报错写到日志文件。这是最快定位问题的方式，不用猜：",
    faq_step_1_result: "<strong>有输出：</strong>把报错内容复制给 Claude Code，让它帮你分析修复。90% 的情况在这一步就能定位到具体问题。<br /><strong>文件不存在或为空：</strong>说明脚本根本没执行，跳下一步。",

    faq_step_2_title: "第 2 步 · 手动跑脚本（1 分钟）",
    faq_step_2_desc: "绕过 Claude Code，直接在终端里模拟它调用脚本。Claude Code 每次调脚本前会把会话数据写成 JSON 通过 stdin 传进去：",
    faq_step_2_result: "<strong>输出了三行彩色文字：</strong>脚本完全正常！问题在 settings.json 的 statusLine 配置或路径上 → 跳第 3 步。<br /><strong>报错或没输出：</strong>脚本本身有问题。把终端里的报错信息复制给 Claude Code 让它修。<br /><strong>提示 python 命令找不到：</strong>Python 没装或没加入 PATH → 回到文章开头的<a href='#prep'>准备工作</a>重新安装。",

    faq_step_3_title: "第 3 步 · 检查命令路径（1 分钟）",
    faq_step_3_desc: "settings.json 里的 <code>command</code> 写了 bash.exe 和 python 的绝对路径。这两个路径任一失效，状态栏就调不起来。逐一验证：",
    faq_step_3_result: "<strong>任一命令报「No such file」：</strong>卸载 Git 或升级 Python 后路径变了。<br />找到新路径：<code>where.exe bash</code> 找 Git Bash，<code>where.exe python</code> 找 Python。<br />然后把新路径更新到 settings.json 的 <code>command</code> 字段里。",

    faq_step_4_title: "第 4 步 · 配置完整性检查 + 重启",
    faq_step_4_desc: "打开 <code>~/.claude/settings.json</code>，搜索 <code>'statusLine'</code>。确认 JSON 格式完整——没有多余逗号、引号配对正确、花括号闭合。<br /><strong>改完任何配置后必须完全退出 Claude Code 再重开</strong>，否则修改不生效。配置加载只在启动时发生一次。",

    faq_detail_2: "<p><code>?%</code> 说明脚本的<strong>所有数据路径都失败了</strong>——既拿不到 Claude Code 报告的 <code>used_percentage</code>，也读不到 transcript 文件做估算。最可能的原因有两个：</p>",
    faq_2_root: "问题根源",
    faq_2_solution: "解决方案",
    faq_2_case_a: "<strong>情况 A：dump.json 里没有 context_window 字段</strong>",
    faq_2_case_a_desc: "你的 Claude Code 版本太旧，还没加入上下文用量报告功能。运行以下命令升级到最新版：",
    faq_2_case_b: "<strong>情况 B：有 context_window 但 transcript_path 指向的文件不存在</strong>",
    faq_2_case_b_desc: "打开 <code>cat ~/.claude/statusline_dump.json</code>，找到 <code>transcript_path</code> 字段，确认它指向的文件确实存在。如果文件路径错误（比如磁盘满了、权限问题），脚本最后的兜底路径也会失败。发几条消息让对话文件增长后再试。",

    faq_detail_3: "<p><strong>真 0%：</strong>数据通路正常，<code>used_percentage</code> 确实是 0——刚开会话、刚压缩完上下文时就是 0%。发几条长消息后数值会涨。<br /><strong>假 0%：</strong>发了十几条还是 0，<code>total_input_tokens</code> 也一直是 0——API 后端完全不报告 token 数，靠 transcript 估算兜底。</p>",
    faq_3_verify: "验证方法",

    faq_detail_4_title: "1. 终端程序不兼容",
    faq_detail_4_1: "Windows 自带的旧版 <strong>cmd.exe 不支持 24-bit 真彩色 ANSI</strong>，必须用 <strong>Windows Terminal</strong>（Microsoft Store 免费下载）。看窗口标题栏：写着「Windows PowerShell」或「Command Prompt」就是旧的，写着「Windows Terminal」就是对的。",
    faq_detail_4_title2: "2. Unicode 编码没配",
    faq_detail_4_2: "CTX 加载条用了 Unicode 1/8 分块字符（▏▎▍▌▋▊▉█），需要 UTF-8 编码才能正常输出。确认脚本开头有这行：",
    faq_detail_4_title3: "3. 颜色值需要微调",
    faq_detail_4_3: "颜色能显示但不好看？脚本顶部 RGB 常量可以随意调。每个颜色格式为 <code>\\033[38;2;R;G;Bm</code>（R/G/B 各自 0-255）。在线搜「RGB color picker」调好替换，重启生效。",

    faq_detail_5_root: "原因",
    faq_detail_5_why: "Claude Code<strong>只在启动时加载一次 statusLine 配置和脚本</strong>，之后每秒只是重复执行同一个已加载的命令。修改脚本或配置不会自动热更新。",
    faq_detail_5_fix: "解决",
    faq_detail_5_fix_text: "<strong>完全退出 Claude Code</strong>（不是切到后台），然后重新打开。如果重启后还是旧内容：",
    faq_detail_5_check: "确认修改时间是你刚才操作的时间。如果时间不对，说明改到了另一个同名文件。Windows 上 <code>~</code> 代表 <code>C:\\Users\\你的用户名</code>。",

    faq_detail_6_how: "怎么改",
    faq_detail_6_how_text: "改 settings.json 里 <code>refreshInterval</code> 的数字（单位：秒）：",
    faq_detail_6_rec: "<strong>推荐值：</strong><br />- <code>1</code> — 最实时，CPU 占用稍高<br />- <code>2</code> — 体感和 1 秒差不多，功耗减半<br />- <code>3</code> — 功耗和流畅度的平衡点（推荐）<br />- <code>5</code> — 省资源",
    faq_detail_6_note: "<strong>注意：</strong>间隔不能小于脚本实际执行时间。对话越长 transcript 越大，极端情况可能跑超过 1 秒，此时设 1 秒也没用。",

    faq_detail_7_text: "把 <code>type</code> 改成空字符串，状态栏立即关闭。改回 <code>command</code> 恢复。或者把 <code>refreshInterval</code> 设成 <code>3600</code>（1 小时），状态栏在但不怎么刷新。",

    faq_detail_8_why: "为什么会折行",
    faq_detail_8_why_text: "三行信息的总宽度超过了终端窗口的列数。最常见的原因是<strong>目录路径太深太长</strong>。",
    faq_detail_8_fix: "三种处理方式",
    faq_detail_8_fix_text: "<strong>1.</strong> 让 Claude 改脚本，路径只显示最后两级目录名 — 最有效<br /><strong>2.</strong> 去掉不重要的字段给路径腾空间<br /><strong>3.</strong> 在 Windows Terminal 设置里把字体调小一号",

    faq_detail_9_prevent: "预防：改前先备份",
    faq_detail_9_errors: "JSON 最常见的两个错误",
    faq_detail_9_errors_text: "JSON 不允许最后一个元素后面加逗号。多一个或少一个花括号都会导致整个文件解析失败。",
    faq_detail_9_tip: "不确定哪里错了就把 settings.json 的内容复制给 Claude Code，让它帮你检查格式。",
    faq_detail_9_last: "最后手段",
    faq_detail_9_last_text: "删掉 settings.json，Claude Code 下次启动会自动生成新的默认配置。<strong>对话记录不会丢失</strong>——那是存在别的文件里的。然后把 statusLine 段加回新配置就行。",

    faq_detail_10_req: "两个前提条件",
    faq_detail_10_req_text: "<strong>1.</strong> Claude Code 当前工作目录必须是一个 Git 仓库（有 <code>.git</code> 文件夹）。<br /><strong>2.</strong> Git 必须已加入系统 PATH。验证：",
    faq_detail_10_tip: "如果提示命令找不到，说明 Git 没装或没加入 PATH。去 <code>git-scm.com</code> 下载安装，选「Git from the command line and also from 3rd-party software」。",

    faq_detail_11_title: "Git Bash 到底装在哪",
    faq_detail_11_text: "Windows 上 Git Bash 的安装位置取决于你安装 Git 时选的选项，常见的有三个：",
    faq_detail_11_tip: "三条命令挨个试，哪个不报错就把那个路径填到 settings.json 里。如果三条都报错，说明<strong>没装 Git for Windows</strong>——去 <code>https://git-scm.com</code> 下载安装。",
    faq_detail_11_alt: "不想装 Git？",
    faq_detail_11_alt_text: "可以直接用 Python，绕过 bash。缺点：cmd.exe 的编码处理可能导致 Unicode 分块字符显示乱码。",

    faq_detail_12_why: "为什么报这个错",
    faq_detail_12_why_text: "原始脚本<strong>只用 Python 标准库</strong>（json, os, re, sys, subprocess, traceback, datetime），不需要 pip install。如果你修改脚本加了第三方库：",
    faq_detail_12_tip: "不知道缺哪个包？把完整的报错信息复制给 Claude Code，它会告诉你该装什么。建议尽量用标准库实现功能。",

    faq_detail_13_list: "迁移清单（按顺序）",
    faq_detail_13_1: "<strong>1.</strong> 新电脑上装好 Python 3 和 Git for Windows",
    faq_detail_13_2: "<strong>2.</strong> 把旧电脑的 <code>~/.claude/statusline.py</code> 复制到新电脑相同路径",
    faq_detail_13_3: "<strong>3.</strong> 把旧电脑 settings.json 里的 <code>statusLine</code> 段复制到新电脑",
    faq_detail_13_4: "<strong>4.</strong> 更新 <code>command</code> 里的路径，运行 <code>where.exe python</code> 和 <code>where.exe bash</code> 找到新路径",
    faq_detail_13_5: "<strong>5.</strong> 重启 Claude Code，检查状态栏是否正常显示",

    faq_detail_14_text: "完全可以。<code>type: command</code> 对语言没有任何限制。只要能从 stdin 读 JSON、往 stdout 写文本就行。Node.js、Ruby、Shell 都行。Python 只是因为字符串处理方便、跨平台兼容好。",

    faq_detail_15_text: "三行信息占了 3 行终端空间。如果屏幕小：<br /><strong>1.</strong> 让 Claude 把三行合并成一行<br /><strong>2.</strong> 设 <code>padding: 0</code> 去掉上方空行<br /><strong>3.</strong> 只保留最重要的 CTX 加载条",
    // 更多字段标签
    more_label: "想看完整的可用数据字段？运行这个命令：",
    more_tip: "把输出复制给 Claude，告诉它你想加什么，Claude 会帮你改脚本。",

  },
  en: {
    h2_prep: "Before You Start",
    prep_p1: "Two checks below, each with a screenshot and install guide. Never done this before? Click the expand button and follow along.",
    prep_check1: "Check 1: Does Claude Code launch?",
    prep_check1_desc: "Open your terminal, type <code>claude</code>, hit Enter. You should see something like this:",
    prep_check1_install: "Don't have Claude Code? Click here for the guide",
    prep_install_intro: "You need <strong>Node.js</strong> first (npm comes with Node.js). Three steps:",
    prep_install_node_title: "Step 1: Install Node.js",
    prep_install_node_desc: "Go to <code>https://nodejs.org</code>, download the <strong>LTS version</strong> (green button on the left), Next → Next → Finish. Verify:",
    prep_install_claude_title: "Step 2: Install Claude Code",
    prep_install_claude_vpn: "With VPN access:",
    prep_install_claude_novpn: "If npmjs.org is slow or blocked: use mirror first, then install",
    prep_install_claude_verify: "Step 3: Verify — close and reopen terminal, type <code>claude</code>. You should see the interactive interface.",
    prep_check2: "Check 2: Is Python installed?",
    prep_check2_desc: "Type <code>python --version</code> and hit Enter. Any version number means you're good:",
    prep_check2_install: "Don't have Python? Click here for the guide",
    prep_install_py_intro: "Three ways to install. Option 1 is the easiest:",
    prep_install_py_way1: "<strong>Option 1: Microsoft Store (easiest)</strong><br />Open Microsoft Store, search \"Python 3.12\", click Install. Everything is set up automatically.",
    prep_install_py_way2: "<strong>Option 2: Official installer</strong><br />Download from <code>python.org</code>. During install, <strong>IMPORTANT: check the box \"Add Python to PATH\"</strong> at the bottom of the installer window.",
    prep_install_py_way3: "<strong>Option 3: Mirror sites (faster in some regions)</strong><br />Tsinghua mirror: <code>https://mirrors.tuna.tsinghua.edu.cn/python/</code> or Huawei mirror: <code>https://mirrors.huaweicloud.com/python/</code>. Remember to check \"Add Python to PATH\".",
    prep_install_py_verify: "After install, close and reopen terminal. Type <code>python --version</code> to verify. If you get \"command not found\", the PATH wasn't set — reinstall and make sure to check that box.",

    config_explain_title: "What Gets Added to settings.json",
    config_explain_p1: "Claude writes this config for you. Here's what each field means (for the curious):",
    config_explain_type: "<code>type</code> set to <code>\"command\"</code> means the status bar content comes from an external command. Whatever the script prints to stdout shows up at the bottom.",
    config_explain_command: "<code>command</code> is the actual command to run. Windows users: <code>bash</code> must use Git's absolute path <code>D:/Git/usr/bin/bash.exe</code> because cmd.exe doesn't have bash on its PATH.",
    config_explain_refresh: "<code>refreshInterval</code> set to <code>1</code> means the script is called every 1 second for real-time updates.",
    config_explain_padding: "<code>padding</code> set to <code>1</code> leaves 1 blank line above the status bar to separate it from the conversation above.",

    h2_how: "Step 1: Tell Claude What You Want",
    how_p1: "Type this command in Claude Code:",
    how_p2: "Claude will ask you a few questions (colors, number of lines, want a loading bar?), you just answer. Claude handles all the code, config, and path setup for you.",

    h2_result: "What You'll Get",
    result_p1: "Once done, you'll have a three-line status bar at the bottom of Claude Code:",
    result_p2: "Auto-refreshes every second. The CTX bar grows with your conversation — blue at low usage, yellow above 75%, red above 90% to remind you to compact.",
    result_lines_title: "The three lines show:",
    result_li1: "<strong>Line 1: Model · Effort · Git branch · Version · Time</strong><br /><span style=\"color:#78787a\">Which model, which branch, any uncommitted changes</span>",
    result_li2: "<strong>Line 2: Working directory + Session duration</strong><br /><span style=\"color:#78787a\">How long you've been working, even if left open all day</span>",
    result_li3: "<strong>Line 3: CTX bar + percentage + window size</strong><br /><span style=\"color:#78787a\">How close to the token limit, yellow at 75%, red at 90%</span>",

    h2_more: "What Else Can You Add?",
    more_p1: "The three lines above are just the start. Claude Code passes the full session info as JSON to the script — there's a lot more data available. Here are ideas you can ask Claude to add:",
    more_li1: "<strong>API cost</strong><br /><span style=\"color:#78787a\">How much each session costs, from <code>cost.total_cost_usd</code></span>",
    more_li2: "<strong>Token speed</strong><br /><span style=\"color:#78787a\">Tokens per second, good for evaluating model responsiveness</span>",
    more_li3: "<strong>Remaining quota</strong><br /><span style=\"color:#78787a\">Today's remaining calls for pay-as-you-go APIs</span>",
    more_li4: "<strong>Network latency</strong><br /><span style=\"color:#78787a\">API response time, noticeable when network is slow</span>",
    more_li5: "<strong>CPU / Memory usage</strong><br /><span style=\"color:#78787a\">Useful for local inference</span>",
    more_li6: "<strong>Custom greeting</strong><br /><span style=\"color:#78787a\">\"Good morning\" in the AM, \"Good night\" late at night</span>",
    more_p2: "To see all available data fields, run this command:",

    h2_config: "Technical Detail: What Goes into settings.json",
    config_p1: "Curious? Here's what Claude writes to your config. No need to touch this manually.",

    h2_faq: "FAQ",
    faq_intro: "Click to expand for detailed solutions:",

    faq_q1: "Status bar shows nothing at all",
    faq_a1: "<p>Check in order — 90% of cases are solved by step 3:</p><ol><li><strong>Check error log</strong>: <code>cat ~/.claude/statusline_error.log</code>. Copy any errors to Claude for analysis.</li><li><strong>Run script manually</strong>: <code>cat ~/.claude/statusline_dump.json | python ~/.claude/statusline.py</code>. If it outputs three colored lines, the script is fine — it's a config issue. If nothing or an error, the script is broken.</li><li><strong>Verify paths</strong>: <code>ls -la D:/Git/usr/bin/bash.exe</code> and <code>python --version</code>. Uninstalling Git or upgrading Python can change paths — update the <code>command</code> in settings.json.</li><li><strong>Check config</strong>: Open <code>~/.claude/settings.json</code>, search for <code>statusLine</code>, make sure it's intact with no extra commas or brackets.</li><li><strong>Restart Claude Code</strong>: Config changes require a restart to take effect.</li></ol>",

    faq_q2: "CTX bar always shows ?%",
    faq_a2: "<p>The script can't get context usage data. Two checks:</p><ol><li>Open <code>~/.claude/statusline_dump.json</code> — is there a <code>context_window</code> section? If not, your Claude Code version may be too old. Upgrade: <code>npm update -g @anthropic-ai/claude-code</code>.</li><li>If <code>context_window</code> exists but <code>used_percentage</code> stays 0: your API backend may not report this value. The script falls back to transcript file estimation — verify the file at <code>transcript_path</code> exists and is not empty.</li></ol>",

    faq_q3: "CTX bar stays at 0%",
    faq_a3: "<p>0% is better than ?% — the data path is working. <code>used_percentage</code> may genuinely be 0 right after starting a session or compacting context. Send a few messages and check again. If it's still 0 after 10+ messages, check if <code>total_input_tokens</code> in dump.json is also stuck at 0 — your API backend may not report token counts at all, relying entirely on transcript estimation.</p>",

    faq_q4: "I saved my script changes but the status bar hasn't updated",
    faq_a4: "<p>The status bar script is called periodically — it won't hot-reload. You need to <strong>restart Claude Code</strong> (fully quit and reopen). If it still shows old content, check you edited the right file (<code>~/.claude/statusline.py</code>), not a copy in another directory.</p>",

    faq_q5: "Git branch info doesn't show",
    faq_a5: "<p>The status bar only shows branch info when the current directory is a Git repo. Verify: 1) <code>git status</code> works in the current directory; 2) Git is on your system PATH. If the branch name is wrong, check if you're in a subdirectory — the script uses <code>git -C</code> with Claude Code's working directory.</p>",

    faq_q6: "Colors are broken or garbled on Windows",
    faq_a6: "<p>Three checks: 1) Use <strong>Windows Terminal</strong>, not legacy cmd.exe (no 24-bit color support); 2) The script has <code>sys.stdout.reconfigure(encoding='utf-8')</code> at the top; 3) If colors show but look wrong, tweak the RGB values at the top of the script (search 'RGB color picker' online).</p>",

    faq_q7: "Status bar refreshes too slowly or too fast",
    faq_a7: "<p>Adjust <code>refreshInterval</code> in settings.json: <code>2</code> for every 2 seconds, <code>5</code> for every 5. Note: the interval can't be shorter than the script's execution time — longer conversations mean larger transcript files. For CPU-sensitive setups, 3 seconds is a good balance.</p>",

    faq_q8: "How to migrate to another computer",
    faq_a8: "<p>Copy three things: 1) <code>~/.claude/statusline.py</code>; 2) the <code>statusLine</code> section from settings.json; 3) update absolute paths in <code>command</code> if Python or bash locations differ. After installing Python and Git Bash on the new machine, place the files and restart Claude Code.</p>",

    faq_q9: "Can I write it in another language?",
    faq_a9: "<p>Yes. <code>type: \"command\"</code> doesn't care about language — anything that reads JSON from stdin and writes text to stdout works. Node.js, Ruby, even a shell script. Python is used here for convenience and cross-platform compatibility.</p>",

    h2_code: "Complete Code Reference",
    code_p1: "The full status bar script, placed here for reference. You don't need to understand it — Claude writes it for you. The inline comments explain each function if you're curious.",
    code_py_label: "statusline.py (click to expand)",

    // FAQ category titles
    faq_cat1: "🖥️ Display Issues (Blank / ?% / Garbled)",
    faq_cat2: "⚙️ Config & Editing (Not Updating / Refresh / Restore)",
    faq_cat3: "🔧 Environment & Tools (Git / Paths / Migration / Modules)",
    faq_cat4: "💡 Other Questions",

    // FAQ sub-titles
    faq_s1: "Status bar shows nothing at all",
    faq_s2: "CTX bar shows ?%",
    faq_s3: "CTX bar stays at 0%",
    faq_s4: "Colors are garbled or wrong",
    faq_s5: "Changed the script but status bar didn't update",
    faq_s6: "Adjust refresh interval (too fast or too slow)",
    faq_s7: "Temporarily disable status bar without deleting config",
    faq_s8: "Status bar text is too long, wrapping in terminal",
    faq_s9: "settings.json is broken, Claude Code won't start",
    faq_s10: "Git branch info not showing",
    faq_s11: "Can't find bash.exe path",
    faq_s12: "Python error: No module named xxx",
    faq_s13: "How to migrate to another computer",
    faq_s14: "Can I use a language other than Python?",
    faq_s15: "Status bar takes too much terminal space",

    // What else
    more_h3_1: "Example 1: Show API Cost",
    more_h3_2: "Example 2: Show API Latency",
    more_h3_3: "Example 3: Show Token Speed",
    more_h3_more: "More Ideas",
    faq_detail_1: "<p>A blank status bar usually isn't a script bug — it means the <strong>config pipeline is broken</strong>: Claude Code can't find your script, it failed to run, or the output wasn't captured. Check each step below, testing the status bar after each one:</p>",

    faq_step_1_title: "Step 1 · Check Error Log (30 sec)",
    faq_step_1_desc: "The script has built-in error catching — every crash writes details to a log file. This is the fastest way to find the issue:",
    faq_step_1_result: "<strong>Has output:</strong> Copy the error to Claude Code and it will analyze and fix it. 90% of issues are solved here.<br /><strong>File missing or empty:</strong> The script never ran — skip to the next step.",

    faq_step_2_title: "Step 2 · Run Script Manually (1 min)",
    faq_step_2_desc: "Bypass Claude Code and directly simulate how it calls the script. Claude Code passes session data as JSON via stdin each time:",
    faq_step_2_result: "<strong>Three colored lines appear:</strong> Script is perfect! The issue is in settings.json config or paths → go to Step 3.<br /><strong>Error or no output:</strong> Script has a bug. Copy the error to Claude Code to fix it.<br /><strong>python: command not found:</strong> Python isn't installed or not in PATH → go back to <a href='#prep'>Setup</a>.",

    faq_step_3_title: "Step 3 · Verify Command Paths (1 min)",
    faq_step_3_desc: "The <code>command</code> in settings.json has absolute paths for bash.exe and python. If either is wrong, the status bar won't start. Verify both:",
    faq_step_3_result: "<strong>Any 'No such file' error:</strong> Paths changed after uninstalling Git or upgrading Python.<br />Find the new paths: <code>where.exe bash</code> for Git Bash, <code>where.exe python</code> for Python.<br />Then update the <code>command</code> field in settings.json.",

    faq_step_4_title: "Step 4 · Config Check + Restart",
    faq_step_4_desc: "Open <code>~/.claude/settings.json</code>, search for <code>'statusLine'</code>. Verify the JSON is valid — no extra commas, quotes match, braces balance.<br /><strong>After any config change, fully quit and restart Claude Code</strong>. Config is only loaded once at startup.",

    // FAQ Q2: CTX bar shows ?%
    faq_detail_2: "<p><code>?%</code> means the script's <strong>all data paths have failed</strong> — it can get neither the <code>used_percentage</code> reported by Claude Code, nor read the transcript file for estimation. Two most likely causes:</p>",
    faq_2_root: "Root Cause",
    faq_2_solution: "Solution",
    faq_2_case_a: "<strong>Case A: No context_window field in dump.json</strong>",
    faq_2_case_a_desc: "Your Claude Code version is too old and doesn't include context usage reporting. Upgrade to the latest version:",
    faq_2_case_b: "<strong>Case B: context_window exists but transcript_path file is missing</strong>",
    faq_2_case_b_desc: "Open <code>cat ~/.claude/statusline_dump.json</code>, find the <code>transcript_path</code> field, and verify the file it points to actually exists. If the path is wrong (e.g., disk full, permission issues), the last fallback path will also fail. Send a few messages to grow the conversation file, then check again.",

    // FAQ Q3: CTX bar stays at 0%
    faq_detail_3: "<p><strong>True 0%:</strong> Data path is working — <code>used_percentage</code> genuinely is 0 right after starting a session or compacting context. Send a few messages and the value will rise.<br /><strong>Fake 0%:</strong> Still 0 after 10+ messages, and <code>total_input_tokens</code> is also stuck at 0 — your API backend simply doesn't report token counts, relying entirely on transcript estimation.</p>",
    faq_3_verify: "How to Verify",

    // FAQ Q4: Color issues
    faq_detail_4_title: "1. Incompatible terminal app",
    faq_detail_4_1: "Windows' legacy <strong>cmd.exe doesn't support 24-bit true color ANSI</strong>. You must use <strong>Windows Terminal</strong> (free on Microsoft Store). Check the title bar: \"Windows PowerShell\" or \"Command Prompt\" = old; \"Windows Terminal\" = correct.",
    faq_detail_4_title2: "2. Unicode encoding not configured",
    faq_detail_4_2: "The CTX bar uses Unicode 1/8 block characters (▏▎▍▌▋▊▉█) that require UTF-8 encoding. Make sure the script starts with this line:",
    faq_detail_4_title3: "3. Color values need tweaking",
    faq_detail_4_3: "Colors show but look off? The RGB constants at the top of the script are adjustable. Each color format is <code>\\\\033[38;2;R;G;Bm</code> (R/G/B each 0-255). Search \"RGB color picker\" online, adjust the values, restart to apply.",

    // FAQ Q5: Script changes not reflected
    faq_detail_5_root: "Root Cause",
    faq_detail_5_why: "Claude Code <strong>loads the statusLine config and script only once at startup</strong>. After that, it only re-executes the already-loaded command every second. Modifying the script or config does not hot-reload.",
    faq_detail_5_fix: "Fix",
    faq_detail_5_fix_text: "<strong>Fully quit Claude Code</strong> (don't just switch to background), then reopen. If it still shows old content after restart:",
    faq_detail_5_check: "Verify the modification time matches when you edited. If not, you edited a different file with the same name. On Windows, <code>~</code> means <code>C:\\\\Users\\\\YourName</code>.",

    // FAQ Q6: Refresh interval
    faq_detail_6_how: "How to Adjust",
    faq_detail_6_how_text: "Change the <code>refreshInterval</code> number in settings.json (unit: seconds):",
    faq_detail_6_rec: "<strong>Recommended values:</strong><br />- <code>1</code> — Most real-time, slightly higher CPU usage<br />- <code>2</code> — Feels the same as 1s, half the overhead<br />- <code>3</code> — Sweet spot between responsiveness and efficiency (recommended)<br />- <code>5</code> — Power saver",
    faq_detail_6_note: "<strong>Note:</strong> The interval can't be shorter than the script's actual execution time. Longer conversations mean larger transcript files — in extreme cases the script may take over 1 second to run, making a 1s interval pointless.",

    // FAQ Q7: Temporarily disable
    faq_detail_7_text: "Set <code>type</code> to an empty string to instantly disable the status bar. Change back to <code>command</code> to restore. Alternatively, set <code>refreshInterval</code> to <code>3600</code> (1 hour) — the bar stays but hardly refreshes.",

    // FAQ Q8: Text too long / wrapping
    faq_detail_8_why: "Why It Wraps",
    faq_detail_8_why_text: "The three lines are wider than your terminal window. The most common cause: <strong>directory paths that are too deep and long</strong>.",
    faq_detail_8_fix: "Three Solutions",
    faq_detail_8_fix_text: "<strong>1.</strong> Ask Claude to show only the last 2 directory levels — most effective fix<br /><strong>2.</strong> Remove less important fields to free up space<br /><strong>3.</strong> Reduce font size by one notch in Windows Terminal settings",

    // FAQ Q9: settings.json broken
    faq_detail_9_prevent: "Prevention: Backup Before Editing",
    faq_detail_9_errors: "The Two Most Common JSON Mistakes",
    faq_detail_9_errors_text: "JSON doesn't allow trailing commas after the last element. One extra or missing curly brace will break the entire file and prevent Claude Code from starting.",
    faq_detail_9_tip: "Not sure what went wrong? Copy your settings.json content into Claude Code and ask it to check the format for you.",
    faq_detail_9_last: "Last Resort",
    faq_detail_9_last_text: "Delete settings.json — Claude Code will auto-generate a fresh default config on next launch. <strong>Your conversation history won't be lost</strong> — that's stored in separate files. Then add the statusLine section back to the new config.",

    // FAQ Q10: Git branch not showing
    faq_detail_10_req: "Two Prerequisites",
    faq_detail_10_req_text: "<strong>1.</strong> Claude Code's current working directory must be a Git repository (has a <code>.git</code> folder).<br /><strong>2.</strong> Git must be on your system PATH. Verify:",
    faq_detail_10_tip: "If you get \"command not found\", Git isn't installed or not in PATH. Download from <code>git-scm.com</code> and select \"Git from the command line and also from 3rd-party software\" during installation.",

    // FAQ Q11: bash.exe path
    faq_detail_11_title: "Where Is Git Bash Installed?",
    faq_detail_11_text: "On Windows, Git Bash's install location depends on the option you chose during Git installation. The three most common paths are:",
    faq_detail_11_tip: "Try all three commands — whichever doesn't error is your path. Put it in settings.json. If all three error, <strong>you haven't installed Git for Windows</strong> — download from <code>https://git-scm.com</code>.",
    faq_detail_11_alt: "Don't Want to Install Git?",
    faq_detail_11_alt_text: "You can use Python directly, bypassing bash. Downside: cmd.exe encoding quirks may cause Unicode block characters to display as garbled text.",

    // FAQ Q12: Python module error
    faq_detail_12_why: "Why This Error",
    faq_detail_12_why_text: "The original script <strong>uses only Python standard library</strong> (json, os, re, sys, subprocess, traceback, datetime) — no pip install needed. If you modified the script to use third-party libraries:",
    faq_detail_12_tip: "Not sure which package is missing? Copy the full error message into Claude Code and it will tell you what to install. Pro tip: stick to standard library when possible.",

    // FAQ Q13: Migration
    faq_detail_13_list: "Migration Checklist (In Order)",
    faq_detail_13_1: "<strong>1.</strong> Install Python 3 and Git for Windows on the new machine",
    faq_detail_13_2: "<strong>2.</strong> Copy <code>~/.claude/statusline.py</code> from the old machine to the same path on the new machine",
    faq_detail_13_3: "<strong>3.</strong> Copy the <code>statusLine</code> section from the old settings.json to the new settings.json",
    faq_detail_13_4: "<strong>4.</strong> Update paths in <code>command</code> — run <code>where.exe python</code> and <code>where.exe bash</code> to find the new paths",
    faq_detail_13_5: "<strong>5.</strong> Restart Claude Code and verify the status bar appears",

    // FAQ Q14: Other languages
    faq_detail_14_text: "Absolutely. <code>type: command</code> doesn't care about language at all. Anything that reads JSON from stdin and writes text to stdout works — Node.js, Ruby, even a shell script. Python is used here simply because it's convenient for string handling and cross-platform compatibility.",

    // FAQ Q15: Too much space
    faq_detail_15_text: "Three lines take up 3 rows of terminal space. If your screen is small:<br /><strong>1.</strong> Ask Claude to merge three lines into one<br /><strong>2.</strong> Set <code>padding: 0</code> to remove the top blank line<br /><strong>3.</strong> Keep only the CTX bar — the most important piece",

    // More section labels
    more_label: "To see all available data fields, run this command:",
    more_tip: "Copy the output to Claude and tell it what you want to add. Claude will update the script for you.",
  },
} as const;

// ── 代码块数据 ──
const codeExamples = {
  cost: {
    zh: `# 从 JSON 数据里取出费用字段，没有就默认 0
cost_usd = data.get("cost", {}).get("total_cost_usd", 0)
if cost_usd:  # 有费用数据才显示，避免浪费空间
    line1.append(f"{YELLOW}$ {cost_usd:.2f}{R}")  # 保留两位小数`,
    en: `# Pull the cost field from JSON data, default to 0
cost_usd = data.get("cost", {}).get("total_cost_usd", 0)
if cost_usd:  # Only show when data exists, avoid wasting space
    line1.append(f"{YELLOW}$ {cost_usd:.2f}{R}")  # Keep two decimal places`,
  },
  latency: {
    zh: `# 取 API 响应耗时（毫秒），没有就默认 0
api_ms = data.get("cost", {}).get("total_api_duration_ms", 0)
if api_ms:  # 有数据才显示
    line1.append(f"{CYAN}{api_ms}ms{R}")  # 青色显示延迟毫秒数`,
    en: `# Get API response time (ms), default to 0
api_ms = data.get("cost", {}).get("total_api_duration_ms", 0)
if api_ms:  # Only show when data exists
    line1.append(f"{CYAN}{api_ms}ms{R}")  # Cyan for latency in ms`,
  },
  tokSpeed: {
    zh: `# 取输入 token 数和 API 耗时
total_in = ctx.get("total_input_tokens", 0)   # 总输入 token
dur_ms = cost.get("total_api_duration_ms", 0)  # API 耗时（毫秒）
# 两个值都有且大于 0 才计算，避免除以 0
if total_in > 0 and dur_ms > 0:
    tok_per_sec = total_in / dur_ms * 1000  # 换算成每秒 token
    line1.append(f"{GREEN}{tok_per_sec:.0f} tok/s{R}")  # 绿色显示`,
    en: `# Get total input tokens and API duration
total_in = ctx.get("total_input_tokens", 0)   # Total input tokens
dur_ms = cost.get("total_api_duration_ms", 0)  # API duration (ms)
# Only calculate when both exist and > 0, avoid division by zero
if total_in > 0 and dur_ms > 0:
    tok_per_sec = total_in / dur_ms * 1000  # Convert to tokens per second
    line1.append(f"{GREEN}{tok_per_sec:.0f} tok/s{R}")  # Green display`,
  },
  cpu: {
    zh: `import psutil
cpu = psutil.cpu_percent()         # CPU 占用百分比
mem = psutil.virtual_memory().percent  # 内存占用百分比
line2.append(f"{PINK}CPU {cpu}% MEM {mem}%{R}")`,
    en: `import psutil
cpu = psutil.cpu_percent()         # CPU usage percentage
mem = psutil.virtual_memory().percent  # Memory usage percentage
line2.append(f"{PINK}CPU {cpu}% MEM {mem}%{R}")`,
  },
  greeting: {
    zh: `from datetime import datetime
hour = datetime.now().hour
greeting = "早上好 \u{1f305}" if 6 <= hour < 12 else \\
           "下午好 \u{2600}\u{fe0f}" if 12 <= hour < 18 else \\
           "晚上好 \u{1f319}" if 18 <= hour < 23 else "早点休息 \u{1f634}"
line1.insert(0, f"{CYAN}{greeting}{R}")`,
    en: `from datetime import datetime
hour = datetime.now().hour
greeting = "Good morning \u{1f305}" if 6 <= hour < 12 else \\
           "Good afternoon \u{2600}\u{fe0f}" if 12 <= hour < 18 else \\
           "Good evening \u{1f319}" if 18 <= hour < 23 else "Good night \u{1f634}"
line1.insert(0, f"{CYAN}{greeting}{R}")`,
  },
  countdown: {
    zh: `from datetime import date
deadline = date(2026, 7, 15)       # 设置你的截止日期
days_left = (deadline - date.today()).days
line2.append(f"{YELLOW}距截止 {days_left} 天{R}")`,
    en: `from datetime import date
deadline = date(2026, 7, 15)       # Set your deadline
days_left = (deadline - date.today()).days
line2.append(f"{YELLOW}{days_left} days left{R}")`,
  },
};

const moreExamples = {
  zh: [
    {
      h3: "示例 1：显示 API 费用",
      desc: "Claude Code 的 JSON 数据里已经包含了费用信息，直接取值就行。把这个需求告诉 Claude：",
      prompt: "帮我在状态栏第 1 行末尾加一个费用显示，数据来自 cost.total_cost_usd，保留两位小数",
      codeNote: "Claude 会在脚本里加类似这样的代码：",
      codeKey: "cost" as const,
      result: '效果：第 1 行末尾显示 <code>$ 0.36</code>，实时更新。',
    },
    {
      h3: "示例 2：显示 API 延迟",
      desc: "想知道每次回复有多快？加个延迟显示。告诉 Claude：",
      prompt: "帮我在状态栏显示 API 延迟，数据来自 cost.total_api_duration_ms，单位毫秒",
      codeNote: "Claude 会加上：",
      codeKey: "latency" as const,
    },
    {
      h3: "示例 3：显示 token 速度",
      desc: "看模型跑得有多快。告诉 Claude：",
      prompt: "帮我在状态栏显示 token 速度 = total_input_tokens / total_api_duration_ms * 1000，单位 tok/s",
      codeNote: "生成的代码大概这样：",
      codeKey: "tokSpeed" as const,
    },
  ],
  en: [
    {
      h3: "Example 1: Show API Cost",
      desc: "Claude Code's JSON data already includes cost information — just pull the value. Tell Claude:",
      prompt: "Add a cost display at the end of status bar line 1, data from cost.total_cost_usd, with two decimal places",
      codeNote: "Claude will add code like this:",
      codeKey: "cost" as const,
      result: 'Result: the end of line 1 shows <code>$ 0.36</code>, updating in real time.',
    },
    {
      h3: "Example 2: Show API Latency",
      desc: "Want to know how fast each response is? Add a latency display. Tell Claude:",
      prompt: "Show API latency on the status bar, data from cost.total_api_duration_ms, in milliseconds",
      codeNote: "Claude will add:",
      codeKey: "latency" as const,
    },
    {
      h3: "Example 3: Show Token Speed",
      desc: "See how fast the model runs. Tell Claude:",
      prompt: "Show token speed on the status bar, calculated as total_input_tokens / total_api_duration_ms * 1000, unit: tok/s",
      codeNote: "The generated code looks like:",
      codeKey: "tokSpeed" as const,
    },
  ],
};

const moreIdeas = {
  zh: [
    {
      title: "剩余额度",
      desc: "按量付费的 API 账号，显示今日剩余调用次数。需要对接 API 提供商的接口。",
      tellClaude: '告诉 Claude：<code>帮我在状态栏显示 API 剩余额度，数据来源是环境变量 API_QUOTA</code>',
    },
    {
      title: "CPU / 内存占用",
      desc: "本地推理时很有用。<code>psutil</code> 库一行代码就能拿到占用率。",
      code: "cpu" as const,
      codeLang: "python" as const,
    },
    {
      title: "自定义问候语",
      desc: "根据时间段显示不同问候——早上「早上好 🌅」，深夜「早点休息 🌙」。",
      code: "greeting" as const,
      codeLang: "python" as const,
    },
    {
      title: "天气",
      desc: "对接免费天气 API（如 <code>wttr.in</code>），一行命令拿数据：",
      codeBlock: 'curl "wttr.in/Beijing?format=3"',
      codeLang: "bash" as const,
      extra: "让 Claude 帮你把天气信息加到状态栏第 1 行。",
    },
    {
      title: "倒数日",
      desc: "离考试/项目截止还有多少天。告诉 Claude 日期，它会写计算逻辑。",
      code: "countdown" as const,
      codeLang: "python" as const,
    },
    {
      title: "当前歌曲 / 播放状态",
      desc: "Windows 上通过读取媒体控制信息，显示正在播放的歌曲名。让 Claude 帮你实现。",
    },
    {
      title: "自定义短句",
      desc: "随机显示一句鼓励的话、名言、或者你的座右铭。写个列表让脚本每次随机挑。",
    },
  ],
  en: [
    {
      title: "Remaining Quota",
      desc: "For pay-as-you-go API accounts, show today's remaining call count. Requires integration with the API provider.",
      tellClaude: 'Tell Claude: <code>Show remaining API quota on the status bar, data source from environment variable API_QUOTA</code>',
    },
    {
      title: "CPU / Memory Usage",
      desc: "Useful for local inference. <code>psutil</code> library can get usage in one line.",
      code: "cpu" as const,
      codeLang: "python" as const,
    },
    {
      title: "Custom Greeting",
      desc: 'Show different greetings by time — "Good morning" in the AM, "Good night" late at night.',
      code: "greeting" as const,
      codeLang: "python" as const,
    },
    {
      title: "Weather",
      desc: "Use a free weather API (like <code>wttr.in</code>), one command to get data:",
      codeBlock: 'curl "wttr.in/Beijing?format=3"',
      codeLang: "bash" as const,
      extra: "Ask Claude to add weather info to status bar line 1.",
    },
    {
      title: "Countdown",
      desc: "Days remaining until an exam or project deadline. Tell Claude the date and it will write the calculation logic.",
      code: "countdown" as const,
      codeLang: "python" as const,
    },
    {
      title: "Now Playing",
      desc: "On Windows, read media control info to show the currently playing song. Ask Claude to implement it.",
    },
    {
      title: "Custom Quote",
      desc: "Randomly display an encouraging message, quote, or your motto. Write a list and let the script pick randomly each time.",
    },
  ],
};


const startPrompt = `帮我给 Claude Code 做一个自定义状态栏，显示在终端底部。

我要三行信息：
第1行 — 模型名称 + Effort等级 + Git分支 + 版本号 + 时间
第2行 — 当前目录 + 会话耗时
第3行 — CTX上下文用量加载条 + 百分比 + 窗口大小

- 用 Python 写脚本，ANSI 真彩色
- CTX 加载条用 Unicode 1/8 分块字符，每 1% 都能看到变化
- 用量超过 75% 变黄，90% 变红
- 配置到 settings.json，每 1 秒刷新
- Windows 系统，Python 默认路径，Git Bash 可用`;

const dumpCommand = `cat ~/.claude/statusline_dump.json | python ~/.claude/statusline.py`;

const configJson = {
  zh: `{
  "statusLine": {
    // 类型："command" 表示由外部命令生成状态栏内容
    "type": "command",

    // 实际执行的命令（Windows 必须用 bash 绝对路径，cmd.exe 找不到 bash）
    "command": "D:/Git/usr/bin/bash.exe -c 'PYTHONIOENCODING=utf-8 python ~/.claude/statusline.py'",

    // 刷新间隔（秒）：1 = 每秒调一次脚本
    "refreshInterval": 1,

    // 状态栏上方留空行数，和对话内容区分
    "padding": 1
  }
}`,
  en: `{
  "statusLine": {
    // type: "command" means the status bar content comes from an external command
    "type": "command",

    // The actual command to run (Windows must use bash absolute path, cmd.exe can't find bash)
    "command": "D:/Git/usr/bin/bash.exe -c 'PYTHONIOENCODING=utf-8 python ~/.claude/statusline.py'",

    // Refresh interval (seconds): 1 = call the script every second
    "refreshInterval": 1,

    // Blank lines above the status bar, to separate from conversation
    "padding": 1
  }
}`,
};

const fullPy = `#!/usr/bin/env python3
"""Claude Code statusLine — 三行布局：模型/Git/时间 | 目录/耗时 | CTX 加载条"""
import json, os, re, sys, subprocess, traceback
from datetime import datetime

# ═══════════════════════════════════════════════════════════
# ANSI 颜色常量 — \\033[38;2;R;G;Bm 设置 24-bit 前景色
# \\033[0m 重置所有样式，\\033[1m 加粗
# ═══════════════════════════════════════════════════════════
R = "\\033[0m"                      # 重置
B = "\\033[1m"                      # 加粗
CYAN   = "\\033[38;2;60;190;200m"   # Effort 等级、耗时
GREEN  = "\\033[38;2;100;220;120m"  # Git 干净分支
YELLOW = "\\033[38;2;240;200;80m"   # Git 脏分支（有未提交改动）
PURPLE = "\\033[38;2;170;130;255m"  # [CTX] 标签
GRAY   = "\\033[38;2;140;150;165m"  # 错误提示
WHITE  = "\\033[38;2;230;235;240m"  # 目录路径、时间
PINK   = "\\033[38;2;255;140;180m"  # 版本号
BAR_FILLED  = "\\033[38;2;100;200;255m"  # CTX 条 ≤75%（蓝）
BAR_EMPTY   = "\\033[38;2;100;105;115m"  # CTX 条空位（灰）
BAR_WARN    = "\\033[38;2;255;180;60m"   # CTX 条 75-90%（黄）
BAR_DANGER  = "\\033[38;2;255;80;80m"    # CTX 条 >90%（红）
SIZE_C      = "\\033[38;2;200;255;100m"  # 窗口大小数字

# Effort 等级映射 — 把英文缩写转成可读标签
EFFORT_LABELS = {"low":"Low","medium":"Medium","high":"High","xhigh":"XHigh","max":"Max"}

# 错误日志路径 — 记录脚本崩溃信息，方便排查
ERROR_LOG = os.path.expanduser("~/.claude/statusline_error.log")

def log_error(msg):
    """静默写入错误日志，不影响状态栏正常显示"""
    try:
        with open(ERROR_LOG, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now().isoformat()}] {msg}\\n")
    except Exception:
        pass  # 日志写失败也不能让脚本崩溃

# ── transcript 文件缓存 ──
# 避免每秒重读整个对话文件（对话长了可能几百 MB）
_transcript_cache = {"path": "", "mtime": 0, "est_tokens": 0}

# ═══════════════════════════════════════════════════════════
# Git 工具函数
# ═══════════════════════════════════════════════════════════

def get_git_branch(cwd):
    """获取当前 Git 分支名，不是 Git 仓库返回空字符串"""
    try:
        r = subprocess.run(
            ["git","-C",cwd,"--no-optional-locks","symbolic-ref","--short","HEAD"],
            capture_output=True, text=True, timeout=3  # 3 秒超时，防止卡死
        )
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()  # 返回如 "main"、"feature/xxx"
    except Exception:
        pass
    return ""

def get_git_dirty(cwd):
    """检查是否有未提交的改动（工作区或暂存区），有为 True"""
    try:
        # diff --quiet：工作区 vs HEAD，有差异返回 1
        # diff --cached --quiet：暂存区 vs HEAD，有差异返回 1
        for args in (["diff","--quiet"], ["diff","--cached","--quiet"]):
            if subprocess.run(
                ["git","-C",cwd,"--no-optional-locks"] + args,
                capture_output=True, timeout=3
            ).returncode == 1:
                return True  # 有未提交改动
    except Exception:
        pass
    return False

# ═══════════════════════════════════════════════════════════
# 格式化工具
# ═══════════════════════════════════════════════════════════

def fmt_duration(ms):
    """毫秒 → 可读时间格式（M:SS 或 H:MM:SS）"""
    s = int(ms / 1000) if ms else 0
    if s < 3600:
        return f"{s // 60}:{s % 60:02d}"                        # 3:06
    return f"{s // 3600}:{(s % 3600) // 60:02d}:{s % 60:02d}"  # 1:23:03

def model_display(raw):
    """模型名美化：去掉 [1m]/[128k] 等后缀，首字母大写"""
    s = str(raw)
    s = re.sub(r'\\[\\d+[mk]\\]', '', s).strip()  # deepseek-v4-pro[1m] → deepseek-v4-pro
    return "-".join(p.capitalize() for p in s.split("-"))  # Deepseek-V4-Pro

def model_color(model_id):
    """不同模型不同颜色，一眼就能区分在用哪个"""
    mid = str(model_id).lower()
    if "deepseek" in mid:  return "\\033[38;2;80;180;255m"   # 亮蓝
    if "claude" in mid:    return "\\033[38;2;255;140;60m"   # 橙红
    if "gpt" in mid or "o1" in mid or "o3" in mid or "o4" in mid:
                           return "\\033[38;2;80;230;130m"   # 翠绿
    if "gemini" in mid:    return "\\033[38;2;190;120;255m"  # 亮紫
    if "qwen" in mid:      return "\\033[38;2;50;180;230m"   # 海蓝
    return "\\033[38;2;80;180;255m"                          # 默认蓝

# ═══════════════════════════════════════════════════════════
# 已知模型 context window 尺寸表
# 数据来源：各厂商官方 API docs（2026-06 核实）
# 当 API 不报告 context_window_size 时用它兜底
# ═══════════════════════════════════════════════════════════
KNOWN_MODEL_SIZES = {
    # DeepSeek（api-docs.deepseek.com）
    "deepseek-v4-pro": 1_048_576, "deepseek-v4-flash": 1_048_576,
    "deepseek-v3.2": 131_072, "deepseek-v3": 131_072,
    "deepseek-r1-0528": 163_840, "deepseek-r1": 131_072,
    # Claude（docs.anthropic.com）
    "claude-fable-5": 200_000, "claude-opus-4-8": 200_000,
    "claude-sonnet-4-6": 200_000, "claude-haiku-4-5": 200_000,
    # GPT / OpenAI（platform.openai.com）
    "gpt-4.1": 1_048_576, "gpt-4.1-mini": 1_048_576,
    "gpt-4o": 131_072, "o3": 200_000, "o4-mini": 200_000,
    # Gemini（ai.google.dev）
    "gemini-2.5-pro": 1_048_576, "gemini-2.5-flash": 1_048_576,
    # GLM / 智谱（docs.bigmodel.cn）
    "glm-5.2": 1_048_576, "glm-5": 200_000,
    # Qwen / 通义千问（help.aliyun.com）
    "qwen3.7-max": 1_048_576, "qwen3": 131_072,
    # Kimi / 月之暗面（platform.moonshot.cn）
    "kimi-k2.7-code": 262_144, "kimi-k2": 262_144,
}

def parse_model_size(raw_model_id):
    """从模型名后缀 [1m]/[128k] 或已知表解析 context window size"""
    mid = str(raw_model_id)
    # 方式 1：模型名后缀直接标注了大小，如 deepseek-v4-pro[1m]
    m = re.search(r'\\[(\\d+\\\\.?\\\\d*)\\\\s*([mk])\\]', mid, re.IGNORECASE)
    if m:
        num = float(m.group(1))
        unit = m.group(2).lower()
        return int(num * 1_048_576) if unit == "m" else int(num * 1024)
    # 方式 2：去掉后缀后从已知表匹配
    clean = re.sub(r'\\[\\d+[mk]\\]', '', mid).strip().lower()
    for key, size in KNOWN_MODEL_SIZES.items():
        if clean == key or clean.startswith(key):
            return size
    return None  # 完全未知的模型，size 显示 ?

# ═══════════════════════════════════════════════════════════
# 上下文用量计算 — 5 条路径逐级 fallback
# ═══════════════════════════════════════════════════════════

def get_pct_used(data, ctx_size):
    """多路径获取上下文用量百分比，返回 0-99 或 None"""
    ctx = data.get("context_window", {})

    # 路径 1：used_percentage — Claude Code 直接算好，始终可信（含 0%）
    direct_pct = ctx.get("used_percentage")
    if direct_pct is not None:
        try:
            return min(99, float(direct_pct))  # 上限 99%，给状态栏留点呼吸空间
        except (TypeError, ValueError):
            pass

    # 路径 2：total_input_tokens / window_size（跳过 0，部分后端不报告 token）
    total_in = ctx.get("total_input_tokens")
    if total_in is not None and total_in > 0 and ctx_size > 0:
        try:
            return min(99, float(total_in) / ctx_size * 100)
        except (TypeError, ValueError):
            pass

    # 路径 3：current_usage（部分后端的另一种字段名）
    current_usage = ctx.get("current_usage")
    if current_usage is not None and current_usage > 0 and ctx_size > 0:
        try:
            return min(99, float(current_usage) / ctx_size * 100)
        except (TypeError, ValueError):
            pass

    # 路径 4：transcript 文件估算（最可靠的兜底，带 mtime 缓存）
    # 原理：英文约 4 字符/token，代码约 3 字符/token，取 3 偏保守
    transcript = data.get("transcript_path", "")
    if transcript and ctx_size > 0:
        try:
            mtime = os.path.getmtime(transcript)  # 文件修改时间
            # 缓存命中：文件没变过，直接用上次估算结果
            if _transcript_cache["path"] == transcript and _transcript_cache["mtime"] == mtime:
                est_tokens = _transcript_cache["est_tokens"]
            else:
                # 缓存失效：重新读取文件并估算
                with open(transcript, "r", encoding="utf-8", errors="ignore") as f:
                    chars = sum(len(line) for line in f)  # 统计总字符数
                est_tokens = int(chars / 3.0)  # 字符 ÷ 3 ≈ token 数
                _transcript_cache["path"] = transcript
                _transcript_cache["mtime"] = mtime
                _transcript_cache["est_tokens"] = est_tokens
            if est_tokens > 0:
                return min(99, est_tokens / ctx_size * 100)
        except Exception:
            pass

    return None  # 所有路径都失败

# ═══════════════════════════════════════════════════════════
# CTX 加载条渲染 — 1/8 Unicode 分块，192 级精度
# ═══════════════════════════════════════════════════════════

def ctx_bar(pct_used, width=24):
    """渲染上下文用量加载条 — 每 0.52% 一个变化"""
    # 1/8 分块字符：从 1/8 到 7/8 逐渐填满
    EIGHTHS = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉"]

    if pct_used is None:
        # 所有数据路径都失败 → 显示灰色空条 + ?
        return f"{GRAY}[{'░' * width}] ?%{R}"

    # 计算需要多少个 1/8 块：百分比 ÷ 100 × 24 格 × 8 级 = 总 1/8 块数
    total_eighths = int(pct_used / 100 * width * 8)
    full = total_eighths // 8      # 完整格数（█）
    partial = total_eighths % 8    # 不满一格的零头（▏~▉）
    empty = width - full - (1 if partial > 0 else 0)  # 剩余空格（░）

    # 颜色分级：正常蓝 → 警告黄 → 危险红
    if pct_used > 90:
        fill_c = BAR_DANGER   # 红 — 马上要爆了
    elif pct_used > 75:
        fill_c = BAR_WARN     # 黄 — 过半了，注意
    else:
        fill_c = BAR_FILLED   # 蓝 — 正常范围

    # 拼接：完整格 + 零头格 + 空位格
    bar = f"{fill_c}{B}{'█' * full}{R}"
    if partial > 0:
        bar += f"{fill_c}{EIGHTHS[partial]}{R}"
    bar += f"{BAR_EMPTY}{'░' * empty}{R}"
    return f"[{bar}] {pct_used:.0f}%"

# ═══════════════════════════════════════════════════════════
# 主逻辑 — 从 stdin 读 JSON，输出三行状态信息
# ═══════════════════════════════════════════════════════════

def main():
    try:
        # Windows 终端默认编码可能不是 UTF-8，主动设置避免 Unicode 乱码
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")

        # 从 stdin 读取 Claude Code 传来的 JSON 数据
        data = json.loads(sys.stdin.read() or "{}")

        cwd = data.get("cwd", os.getcwd())      # 当前工作目录
        ctx = data.get("context_window", {})     # 上下文窗口信息
        cost = data.get("cost", {})              # 费用和耗时信息

        # ==== 第 1 行：模型 | Effort | Git | 版本 | 时间 ====
        raw_model = data.get("model", {}).get("display_name", "?")
        model_id  = data.get("model", {}).get("id", raw_model)
        mc = model_color(model_id)  # 根据模型名选颜色
        line1 = [f"{mc}{B}{model_display(raw_model)}{R}"]

        eff = data.get("effort", {}).get("level", "")
        if eff:
            eff_label = EFFORT_LABELS.get(eff.lower(), eff.capitalize())
            line1.append(f"{CYAN}Effort:{eff_label}{R}")

        branch = get_git_branch(cwd)
        if branch:
            dirty = get_git_dirty(cwd)
            c = YELLOW if dirty else GREEN  # 有未提交改动显示黄色
            m = "*" if dirty else ""        # 脏标记
            line1.append(f"{c}git:{branch}{m}{R}")

        ver = data.get("version", "")
        if ver:
            line1.append(f"{PINK}v{ver}{R}")

        line1.append(f"{WHITE}{datetime.now().strftime('%H:%M:%S')}{R}")

        # ==== 第 2 行：目录 | 会话耗时 ====
        line2 = [f"{WHITE}{cwd}{R}"]
        dur_ms = cost.get("total_duration_ms", 0)
        if dur_ms:
            line2.append(f"{CYAN}{fmt_duration(dur_ms)}{R}")

        # ==== 第 3 行：[CTX] | 加载条 | size ====
        ctx_size = ctx.get("context_window_size", 0)
        if ctx_size <= 0:
            # API 没报告窗口大小 → 从模型名 / 已知表解析
            ctx_size = parse_model_size(model_id) or 0

        pct_used = get_pct_used(data, ctx_size)

        # 把窗口大小转成可读格式（1.0M / 200k / ?）
        if ctx_size >= 1_000_000:
            size_str = f"{ctx_size / 1_000_000:.1f}M"
        elif ctx_size >= 1000:
            size_str = f"{ctx_size // 1000}k"
        elif ctx_size > 0:
            size_str = str(ctx_size)
        else:
            size_str = "?"

        line3 = f"{PURPLE}{B}[CTX]{R} | {ctx_bar(pct_used)} | {SIZE_C}size:{size_str}{R}"

        # ==== 输出三行 ====
        sys.stdout.write(" | ".join(line1) + "\\n")
        sys.stdout.write(" | ".join(line2) + "\\n")
        sys.stdout.write(line3 + "\\n")
        try:
            sys.stdout.flush()  # 确保立即输出
        except OSError:
            pass  # Windows：管道可能已被关闭，静默忽略

    except Exception:
        # 全局兜底：任何异常都不让状态栏彻底消失
        log_error(traceback.format_exc())
        try:
            sys.stdout.write(f"{GRAY}statusline err, check ~/.claude/statusline_error.log{R}\\n")
            sys.stdout.flush()
        except (OSError, Exception):
            pass

# 入口：作为脚本直接运行时执行 main()
if __name__ == "__main__":
    main()`;

export default function ClaudeCodeStatuslinePage() {
  const { lang } = useLang();

  const t = (key: string) => {
    const section = content[lang as keyof typeof content] ?? content.zh;
    return (section as Record<string, string>)[key] ?? key;
  };

  return (
    <BlogPostLayout post={post}>
      {/* ═══════ 准备工作 ═══════ */}
      <h2 id="prep">{t("h2_prep")}</h2>
      <p className="mb-6" dangerouslySetInnerHTML={{ __html: t("prep_p1") }} />

      {/* 检查 1：Claude Code */}
      <h3>{t("prep_check1")}</h3>
      <p className="mb-2" dangerouslySetInnerHTML={{ __html: t("prep_check1_desc") }} />
      <div className="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
        <img src={`${BASE_PATH}/claude-startup.png`} alt={lang === "zh" ? "Claude Code 启动界面" : "Claude Code startup screen"} className="w-full" />
      </div>
      {/* 安装教程 */}
      <CollapsibleCard title={t("prep_check1_install")}>
        <p className="mb-4 text-[17px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep_install_intro") }} />
        <h4 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{t("prep_install_node_title")}</h4>
        <p className="mb-3 text-[16px] leading-[1.8] text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: t("prep_install_node_desc") }} />
        <CodeBlock language="bash">node --version</CodeBlock>
        <p className="mt-1 text-sm text-zinc-500">{lang === "zh" ? "显示版本号（如 v20.11.0）就说明装好了" : "A version number (e.g. v20.11.0) means it's installed"}</p>
        <h4 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-2 mt-5">{t("prep_install_claude_title")}</h4>
        <p className="mb-2 text-[16px] text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: t("prep_install_claude_vpn") }} />
        <CodeBlock language="bash">npm install -g @anthropic-ai/claude-code</CodeBlock>
        <p className="mt-4 mb-2 text-[16px] text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: t("prep_install_claude_novpn") }} />
        <CodeBlock language="bash">{`npm config set registry https://registry.npmmirror.com
npm install -g @anthropic-ai/claude-code`}</CodeBlock>
        <p className="mt-2 text-sm text-zinc-500">{lang === "zh" ? "装完后可以改回来：" : "You can switch back after:"} <code>npm config set registry https://registry.npmjs.org</code></p>
        <p className="mt-5 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[16px] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep_install_claude_verify") }} />
      </CollapsibleCard>

      {/* 检查 2：Python */}
      <h3 className="mt-6">{t("prep_check2")}</h3>
      <p className="mb-2" dangerouslySetInnerHTML={{ __html: t("prep_check2_desc") }} />
      <div className="my-4 rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] text-zinc-400 font-mono">Terminal</span>
        </div>
        <div className="bg-[#0d1017] px-5 py-4 font-mono text-sm leading-6">
          <div><span className="text-emerald-400 font-bold">$</span> <span className="text-white">python --version</span></div>
          <div className="text-zinc-300 mt-2">Python 3.12.7</div>
          <div className="text-zinc-500 mt-3"><span className="text-emerald-400 font-bold">$</span> <span className="animate-pulse">▍</span></div>
        </div>
      </div>
      <CollapsibleCard title={t("prep_check2_install")}>
        <p className="mb-4 text-[17px] leading-[1.9] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep_install_py_intro") }} />
        <ol className="space-y-4 text-[16px] leading-[1.8] text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
          <li dangerouslySetInnerHTML={{ __html: t("prep_install_py_way1") }} />
          <li dangerouslySetInnerHTML={{ __html: t("prep_install_py_way2") }} />
          <li dangerouslySetInnerHTML={{ __html: t("prep_install_py_way3") }} />
        </ol>
        <p className="mt-5 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-[16px] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("prep_install_py_verify") }} />
      </CollapsibleCard>

      {/* ═══════ 第一步 ═══════ */}
      <h2 id="how">{t("h2_how")}</h2>
      <p className="mb-2" dangerouslySetInnerHTML={{ __html: t("how_p1") }} />
      <CodeBlock language="bash">/statusline</CodeBlock>
      <p className="mt-4" dangerouslySetInnerHTML={{ __html: t("how_p2") }} />

      {/* ═══════ 你会得到什么 ═══════ */}
      <h2 id="result">{t("h2_result")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("result_p1") }} />

      <div className="my-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
        <img src={`${BASE_PATH}/statusline-preview.png`} alt={lang === "zh" ? "Claude Code 状态栏效果" : "Claude Code status bar preview"} className="w-full" />
      </div>

      <p className="mt-4" dangerouslySetInnerHTML={{ __html: t("result_p2") }} />
      <p className="mt-3 font-semibold">{t("result_lines_title")}</p>
      <ul className="space-y-2 text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">
        <li dangerouslySetInnerHTML={{ __html: t("result_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("result_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("result_li3") }} />
      </ul>

      {/* ═══════ FAQ ═══════ */}
      <h2 id="faq">{t("h2_faq")}</h2>
      <p className="text-[19px] leading-[1.9] text-zinc-700 dark:text-zinc-300 mb-6" dangerouslySetInnerHTML={{ __html: t("faq_intro") }} />

      {/* 分类 1：显示异常 */}
      <CollapsibleCard title={t("faq_cat1")}>
        <div className="space-y-3">

          <CollapsibleCard title={t("faq_s1")}>
            <p className="mb-4 text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_1") }} />

            <div className="mb-5 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_step_1_title") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_step_1_desc") }} />
              <CodeBlock language="bash">cat ~/.claude/statusline_error.log</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_step_1_result") }} />
            </div>

            <div className="mb-5 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_step_2_title") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_step_2_desc") }} />
              <CodeBlock language="bash">cat ~/.claude/statusline_dump.json | python ~/.claude/statusline.py</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_step_2_result") }} />
            </div>

            <div className="mb-5 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_step_3_title") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_step_3_desc") }} />
              <CodeBlock language="bash">{`ls -la D:/Git/usr/bin/bash.exe
python --version`}</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_step_3_result") }} />
            </div>

            <div className="pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_step_4_title") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_step_4_desc") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s2")}>
            <div className="pl-4 border-l-2 border-amber-300 dark:border-amber-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_2_root") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_2") }} />
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_2_solution") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: t("faq_2_case_a") }} />
              <p className="text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_2_case_a_desc") }} />
              <CodeBlock language="bash">npm update -g @anthropic-ai/claude-code</CodeBlock>
              <p className="mt-3 text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: t("faq_2_case_b") }} />
              <p className="text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_2_case_b_desc") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s3")}>
            <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2">{lang === "zh" ? "先判断：是真 0% 还是假 0%" : "First: True 0% or Fake 0%"}</p>
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_3") }} />
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_3_verify") }} />
              <CodeBlock language="bash">cat ~/.claude/statusline_dump.json | grep -E "used_percentage|total_input_tokens"</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed">{lang === "zh" ? "如果 <code>used_percentage</code> 和 <code>total_input_tokens</code> 都是 0，但你确定已经聊了很多条，就是假 0%——API 问题，不用纠结。" : "If both are 0 after many messages, it is a fake 0% -- API limitation, don't worry about it."}</p>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s4")}>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
                <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_title") }} />
                <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_1") }} />
              </div>
              <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
                <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_title2") }} />
                <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_2") }} />
                <CodeBlock language="python">sys.stdout.reconfigure(encoding='utf-8', errors='replace')</CodeBlock>
              </div>
              <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
                <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_title3") }} />
                <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_4_3") }} />
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </CollapsibleCard>

      {/* 分类 2：修改与配置 */}
      <CollapsibleCard title={t("faq_cat2")}>
        <div className="space-y-3">

          <CollapsibleCard title={t("faq_s5")}>
            <div className="pl-4 border-l-2 border-amber-300 dark:border-amber-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_5_root") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_5_why") }} />
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_5_fix") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_5_fix_text") }} />
              <CodeBlock language="bash">ls -la ~/.claude/statusline.py</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_5_check") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s6")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_6_how") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_6_how_text") }} />
              <CodeBlock language="json">{`"refreshInterval": 3`}</CodeBlock>
              <p className="mt-3 text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_6_rec") }} />
              <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_6_note") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s7")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_7_text") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s8")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_8_why") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_8_why_text") }} />
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_8_fix") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_8_fix_text") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s9")}>
            <div className="pl-4 border-l-2 border-red-300 dark:border-red-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_prevent") }} />
              <CodeBlock language="bash">cp ~/.claude/settings.json ~/.claude/settings.json.bak</CodeBlock>

              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2 mt-4" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_errors") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_errors_text") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_tip") }} />

              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-bold text-red-700 dark:text-red-400 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_last") }} />
                <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_9_last_text") }} />
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </CollapsibleCard>

      {/* 分类 3：环境与工具 */}
      <CollapsibleCard title={t("faq_cat3")}>
        <div className="space-y-3">

          <CollapsibleCard title={t("faq_s10")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_10_req") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_10_req_text") }} />
              <CodeBlock language="bash">git status</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_10_tip") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s11")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_11_title") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_11_text") }} />
              <CodeBlock language="bash">{`ls "D:/Git/usr/bin/bash.exe"
ls "C:/Program Files/Git/usr/bin/bash.exe"
ls "C:/Program Files (x86)/Git/usr/bin/bash.exe"`}</CodeBlock>
              <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_11_tip") }} />
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-1" dangerouslySetInnerHTML={{ __html: t("faq_detail_11_alt") }} />
                <p className="text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_11_alt_text") }} />
                <CodeBlock language="json">{`"command": "python ~/.claude/statusline.py"`}</CodeBlock>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s12")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_12_why") }} />
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: t("faq_detail_12_why_text") }} />
              <CodeBlock language="bash">{lang === "zh" ? "pip install 缺少的包名" : "pip install <missing-package-name>"}</CodeBlock>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_12_tip") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s13")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="font-bold text-zinc-800 dark:text-zinc-100 mb-2" dangerouslySetInnerHTML={{ __html: t("faq_detail_13_list") }} />
              <div className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed space-y-3">
                <p dangerouslySetInnerHTML={{ __html: t("faq_detail_13_1") }} />
                <p dangerouslySetInnerHTML={{ __html: t("faq_detail_13_2") }} />
                <p dangerouslySetInnerHTML={{ __html: t("faq_detail_13_3") }} />
                <p dangerouslySetInnerHTML={{ __html: t("faq_detail_13_4") }} />
                <p dangerouslySetInnerHTML={{ __html: t("faq_detail_13_5") }} />
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </CollapsibleCard>

      {/* 分类 4：其他 */}
      <CollapsibleCard title={t("faq_cat4")}>
        <div className="space-y-3">
          <CollapsibleCard title={t("faq_s14")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_14_text") }} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title={t("faq_s15")}>
            <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
              <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: t("faq_detail_15_text") }} />
            </div>
          </CollapsibleCard>
        </div>
      </CollapsibleCard>

            {/* ═══════ 还能加什么 ═══════ */}
      <h2 id="more">{t("h2_more")}</h2>
      <p className="mb-6" dangerouslySetInnerHTML={{ __html: t("more_p1") }} />

      {moreExamples[lang].map((ex, i) => (
        <div key={ex.codeKey}>
          {i === 0 ? <h3>{ex.h3}</h3> : <h3 className="mt-8">{ex.h3}</h3>}
          <p className="mb-3">{ex.desc}</p>
          <CodeBlock language="text">{ex.prompt}</CodeBlock>
          <p className="mt-3 mb-2">{ex.codeNote}</p>
          <CodeBlock language="python">{codeExamples[ex.codeKey][lang]}</CodeBlock>
          {ex.result && <p className="mt-2 text-sm text-zinc-500" dangerouslySetInnerHTML={{ __html: ex.result }} />}
        </div>
      ))}

      {/* 更多创意 */}
      <h3 className="mt-8">{t("more_h3_more")}</h3>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("more_p1") }} />
      <div className="space-y-3">
        {moreIdeas[lang].map((idea, i) => (
          <div key={i} className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{idea.title}</p>
            <p className="text-zinc-500" dangerouslySetInnerHTML={{ __html: idea.desc }} />
            {idea.tellClaude && (
              <p className="mt-1 text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: idea.tellClaude }} />
            )}
            {idea.code && codeExamples[idea.code] && (
              <CodeBlock language={idea.codeLang ?? "python"}>{codeExamples[idea.code][lang]}</CodeBlock>
            )}
            {idea.codeBlock && (
              <CodeBlock language={idea.codeLang ?? "bash"}>{idea.codeBlock}</CodeBlock>
            )}
            {idea.extra && (
              <p className="mt-2 text-zinc-500">{idea.extra}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 mb-2" dangerouslySetInnerHTML={{ __html: t("more_label") }} />
      <CodeBlock language="bash">{dumpCommand}</CodeBlock>
      <p className="mt-3 text-sm text-zinc-500" dangerouslySetInnerHTML={{ __html: t("more_tip") }} />

{/* ═══════ 配置参考 ═══════ */}
      <h2 id="config">{t("h2_config")}</h2>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("config_explain_p1") }} />

      {/* 配置 JSON */}
      <CodeBlock language="json">{configJson[lang]}</CodeBlock>

      {/* 逐字段解释 — 卡片式布局 */}
      <div className="mt-5 space-y-3">
        <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-800 dark:text-zinc-100 text-[17px] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t("config_explain_type") }} />
        </div>
        <div className="pl-4 border-l-2 border-amber-200 dark:border-amber-800">
          <p className="text-zinc-800 dark:text-zinc-100 text-[17px] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t("config_explain_command") }} />
        </div>
        <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-800 dark:text-zinc-100 text-[17px] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t("config_explain_refresh") }} />
        </div>
        <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-800 dark:text-zinc-100 text-[17px] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t("config_explain_padding") }} />
        </div>
      </div>

      {/* ═══════ 完整代码（最后，默认折叠） ═══════ */}
      <h2 id="code">{t("h2_code")}</h2>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("code_p1") }} />
      <CollapsibleCard title={t("code_py_label")}>
        <ExpandableCode language="python">{fullPy}</ExpandableCode>
      </CollapsibleCard>
    </BlogPostLayout>
  );
}
