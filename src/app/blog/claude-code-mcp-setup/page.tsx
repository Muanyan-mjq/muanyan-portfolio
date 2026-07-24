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
    <div className="mt-4 mb-3 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className="text-[15px] font-semibold text-zinc-900 dark:text-white">{title}</span>
        <svg className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const post = blogPosts.find((p) => p.slug === "claude-code-mcp-setup")!;

const content = {
  zh: {
    h2_prep: "准备工作",
    prep_p1: "配 MCP 之前，确认这四样东西：",
    prep_check0: "Claude Code 能用吗？",
    prep_check0_desc: "打开终端，输入 <code>claude</code>，能进入下面的对话界面就说明装好了：",
    prep_check0_caption: "输入 claude 之后看到这个界面，就可以继续了 ↓",
    prep_check0_fallback: "如果还没装或打不开，参考这篇安装教程：",
    prep_check0_link_text: "Claude Code 安装与配置教程 →",
    prep_check1: "Node.js 已安装",
    prep_check1_desc: "打开终端，输入 <code>node --version</code>，能看到版本号就行。MCP 服务器通过 <code>npx</code> 启动，npx 随 Node.js 自带。如果没有，去 <a href='https://nodejs.org' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a> 下 LTS 版。",
    prep_check2: "GitHub Personal Access Token（Classic）",
    prep_check2_intro: "GitHub MCP 需要一个 Token 来调用 GitHub API。下面是完整的从 0 到 1 教程，跟着做就行：",
    prep_check2_step1_title: "第 1 步：打开 GitHub Token 创建页面",
    prep_check2_step1_desc: "点击这个链接：<a href='https://github.com/settings/tokens' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline font-semibold'>github.com/settings/tokens</a> → 登录你的 GitHub 账号 → 点击 <strong>「Generate new token」</strong> → 选择 <strong>「Generate new token (classic)」</strong>。",
    prep_check2_step2_title: "第 2 步：设置 Token 权限",
    prep_check2_step2_desc: "在创建页面：<br />① <strong>Note</strong> 填一个名字，比如「Claude Code MCP」，方便以后认出这个 token 是干什么的<br />② <strong>Expiration</strong> 选一个过期时间，建议选「No expiration」（不会过期）<br />③ 在 <strong>Select scopes</strong> 区域，勾选这三个权限：<ul className='list-disc pl-5 my-2 space-y-1'><li><code>repo</code>（所有仓库相关操作）</li><li><code>read:org</code>（读取组织信息）</li><li><code>read:user</code>（读取用户信息）</li></ul>④ 点击页面底部的 <strong>「Generate token」</strong> 按钮。",
    prep_check2_step3_title: "第 3 步：复制 Token 并设为环境变量",
    prep_check2_step3_desc: "生成后页面会显示一串以 <code>ghp_</code> 开头的字符——<strong>这就是你的 token，只显示这一次！</strong>立刻复制它。然后<strong>以管理员身份打开 PowerShell</strong>（右键 PowerShell → 以管理员身份运行），粘贴运行下面的命令（把 <code>ghp_你的token</code> 替换成你刚复制的）：",
    prep_check2_step4_title: "第 4 步：验证是否设置成功",
    prep_check2_step4_desc: "在同一个 PowerShell 窗口运行 <code>$env:GITHUB_PERSONAL_ACCESS_TOKEN</code>，如果终端打印出你的 token 就说明设置成功了。如果没有输出，说明环境变量没设上，重新做第 3 步。",
    prep_check3: "知道 .mcp.json 放哪",
    prep_check3_desc: "用文本编辑器（记事本、VS Code 都行）打开或新建 <code>C:\\Users\\你的用户名\\.mcp.json</code>。所有 MCP 服务器配置都写在这个文件里。如果文件不存在，新建一个空文件，粘贴下面的内容就行。",
    h2_what: "MCP 是什么？能干什么？",
    what_p1: "MCP（Model Context Protocol）是 Anthropic 制定的开放协议，相当于<strong>「AI 的 USB 接口」</strong>。一个 MCP 服务器就是一套工具——装上之后，Claude Code 就能直接调用，不需要你复制粘贴。",
    what_use: "配上本文的三个 MCP 服务器之后，Claude 能做的事：",
    what_li1: "<strong>GitHub MCP：</strong>搜索仓库、读代码、建 Issue、审 PR，全程不离开终端",
    what_li2: "<strong>Playwright MCP：</strong>打开网页、截图、填表单、提取内容，相当于内置浏览器",
    what_li3: "<strong>Filesystem MCP：</strong>在指定目录范围内读写文件，比内置文件工具有更细的权限控制",
    h2_config: "配置三个 MCP 服务器",
    config_intro: "打开 <code>.mcp.json</code>，把下面的配置逐条加进去。每配好一个就可以验证，不需要三个一起配完。",
    config_howto: "怎么做：复制下面的代码 → 粘贴到 <code>.mcp.json</code> 的 <code>\"mcpServers\"</code> 大括号里 → 保存 → 重启 Claude Code。",
    h3_github: "1. GitHub MCP — 操作仓库",
    github_desc: "装上后 Claude 可以搜仓库、读文件、建 Issue。这篇文档就是用它查的 hello-agents 项目信息。",
    github_step1: "第 1 步：把下面这段加到 <code>.mcp.json</code> 的 <code>\"mcpServers\": { }</code> 里面：",
    github_step2: "第 2 步：确认环境变量 <code>GITHUB_PERSONAL_ACCESS_TOKEN</code> 已经设好（准备工作第 3 步），然后保存文件，重启 Claude Code。GitHub MCP 服务器会自动读取这个环境变量来认证。",
    github_verify: "验证：在 Claude Code 里说「帮我搜一下 datawhalechina/hello-agents 这个仓库」，返回搜索结果就通了。",
    h3_playwright: "2. Playwright MCP — 浏览器自动化",
    playwright_desc: "装上后 Claude 能打开网页、截图、点按钮、提取内容。<code>--headless</code> 表示浏览器在后台运行，不弹出窗口。本文用它打开的 <a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>AI HOT</a>，截图和内容提取全自动。",
    playwright_step1: "把下面这段加到 <code>.mcp.json</code> 的 <code>\"mcpServers\": { }</code> 里面（和 GitHub 配置并列，用逗号隔开）：",
    playwright_note: "首次运行会自动下载 Chromium（约 150MB），之后不再下载。注意：Playwright MCP 使用 SSE 传输协议，如果你的 Claude Code 版本遇到连接问题，可以先跳过这一步，不影响 GitHub 和 Filesystem 的使用。",
    playwright_verify: "验证：在 Claude Code 里说「打开 https://aihot.virxact.com/ 看看首页有什么」，它会自动截图提取。",
    h3_filesystem: "3. Filesystem MCP — 文件系统访问",
    filesystem_desc: "Claude Code 自带的文件工具已经很方便了，但 Filesystem MCP 可以<strong>限制 Claude 只能访问指定目录</strong>——适合在敏感项目里加一层安全边界。",
    filesystem_step1: "把下面这段加到 <code>.mcp.json</code> 里，记得把路径改成你自己的目录：",
    filesystem_note: "<code>args</code> 数组末尾列出允许访问的目录，可以写多个。不在列表里的路径一律拒绝。",
    filesystem_verify: "验证：让 Claude 「列出 D 盘 DeepLearning_Code 下面有哪些文件夹」，正确返回就通了。",
    config_help_line1: "💡 如果还是不会操作，把上面的代码直接复制粘贴给 Claude Code，告诉它「帮我把这些 MCP 服务器配好」，",
    config_help_line2: "它会帮你一步步完成。",
    h2_verify: "怎么确认配好了",
    verify_1: "<strong>方法 1（最靠谱）：</strong>直接让 Claude 干活。说「搜 GitHub 上的 xxx 项目」「打开这个网页」「列出某个目录的文件」。终端出现绿色 <code>mcp__</code> 前缀的工具调用，就说明通了。",
    verify_2: "<strong>方法 2：</strong>重启 Claude Code 时看终端有没有黄色 MCP 警告。有警告说明配置有问题。",
    verify_3: "<strong>方法 3：</strong>用 <code>claude --mcp-debug</code> 启动，可以看到每个 MCP 服务器的连接状态。",
    h2_faq: "常见问题",
    faq_intro: "配 MCP 最常见就这几个问题，展开看解决方案：",
    faq_q1: "npx 命令找不到 / 一直卡在下载",
    faq_a1: "首先 <code>node --version</code> 确认 Node.js 已装。如果下载很慢（国内），设镜像：<code>npm config set registry https://registry.npmmirror.com</code>。再不行就 <code>npm cache clean --force</code> 清缓存重试。",
    faq_q2: "启动报错 Failed to connect",
    faq_a2: "三种可能：1) 命令写错了——在终端手动跑一遍 <code>.mcp.json</code> 里的 command+args 看能否启动；2) HTTP 型 MCP 的 token 过期或环境变量名写错；3) 网络不通，检查代理或 VPN。",
    faq_q3: "改了 .mcp.json 但没生效",
    faq_a3: "MCP 配置只在 Claude Code <strong>启动时加载一次</strong>。改完 <code>.mcp.json</code> 后需要完全退出 Claude Code 再重新打开。",
    faq_q4: "Claude 有时候不调用 MCP 工具",
    faq_a4: "正常。Claude 会判断当前任务是否需要 MCP——问「1+1 等于几」不会去调 GitHub。想让它调用，需求里明确提到外部操作就行：「搜 GitHub 上的 xxx」「打开这个网页」。第一次用某个 MCP 服务器时可能会弹权限确认，点允许。",
    faq_q5: "怎么卸载某个 MCP 服务器",
    faq_a5: "从 <code>.mcp.json</code> 里删掉对应的条目，如果 <code>settings.local.json</code> 的 <code>enabledMcpjsonServers</code> 里有它，也删掉。重启就行。",
    h2_more: "还可以装什么",
    more_p1: "配好上面三个，基本够用了。还想加的话，这几个比较实用：",
    more_li1: "<strong>Tavily Search：</strong>联网搜索最新信息，需要 Tavily API key（免费 1000 次/月）",
    more_li2: "<strong>Context7：</strong>让 Claude 查阅最新文档，写 React/Next.js/Python 时不会用过时的 API",
    more_li3: "<strong>Memory：</strong>跨会话记忆，Claude 能记住项目规范和历史决策",
    more_li4: "<strong>SQLite：</strong>直接查 SQLite 数据库，适合数据分析场景",
    more_p2_label: "更多 MCP 服务器去官方仓库找：",
    more_repo_url: "github.com/modelcontextprotocol/servers",
    more_tip: "卡住了把报错复制给 Claude Code，它会帮你排查。",
    h2_code: "完整配置参考",
    code_p1: "三个服务器配完之后，你的 <code>.mcp.json</code> 长这样（可以对照检查）：",
    bottom_title: "这篇文章是怎么写的",
    bottom_desc: "本文全程使用 Claude Code 撰写，并通过刚刚配好的 GitHub MCP 和 Playwright MCP 完成资料搜集与页面验证——搜仓库、读文档、打开网页截图，全在终端里完成。配好 MCP 之后，你也能这样做。",
    bottom_tip: "卡住了把报错复制给 Claude Code，它会帮你排查。",
  },
  en: {
    h2_prep: "Prerequisites",
    prep_p1: "Before configuring MCP, make sure you have these four things:",
    prep_check0: "Is Claude Code working?",
    prep_check0_desc: "Open a terminal and type <code>claude</code>. If you see the interface below, you're good to go:",
    prep_check0_caption: "If you see this screen after running claude, you're all set ↓",
    prep_check0_fallback: "If not installed or not working, check out this setup guide:",
    prep_check0_link_text: "Claude Code Setup Guide →",
    prep_check1: "Node.js installed",
    prep_check1_desc: "Run <code>node --version</code> in terminal. MCP servers launch via <code>npx</code>, which comes with Node.js. If not installed, get the LTS version from <a href='https://nodejs.org' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>nodejs.org</a>.",
    prep_check2: "GitHub Personal Access Token (Classic)",
    prep_check2_intro: "GitHub MCP needs a token to call the GitHub API. Here's the complete step-by-step guide:",
    prep_check2_step1_title: "Step 1: Open the GitHub Token creation page",
    prep_check2_step1_desc: "Click this link: <a href='https://github.com/settings/tokens' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline font-semibold'>github.com/settings/tokens</a> → log in to your GitHub account → click <strong>Generate new token</strong> → select <strong>Generate new token (classic)</strong>.",
    prep_check2_step2_title: "Step 2: Set token permissions",
    prep_check2_step2_desc: "On the creation page:<br />① <strong>Note</strong> — enter a name like \"Claude Code MCP\" so you remember what it's for<br />② <strong>Expiration</strong> — choose an expiry; \"No expiration\" is recommended<br />③ Under <strong>Select scopes</strong>, check these three permissions:<ul className='list-disc pl-5 my-2 space-y-1'><li><code>repo</code> (all repository operations)</li><li><code>read:org</code> (read org info)</li><li><code>read:user</code> (read user info)</li></ul>④ Click <strong>Generate token</strong> at the bottom of the page.",
    prep_check2_step3_title: "Step 3: Copy the token and set it as an environment variable",
    prep_check2_step3_desc: "After generating, you'll see a string starting with <code>ghp_</code> — <strong>this is your token, and it's only shown once!</strong> Copy it immediately. Then <strong>open PowerShell as Administrator</strong> (right-click PowerShell → Run as Administrator) and run the command below (replace <code>ghp_yourToken</code> with your actual token):",
    prep_check2_step4_title: "Step 4: Verify it worked",
    prep_check2_step4_desc: "In the same PowerShell window, run <code>$env:GITHUB_PERSONAL_ACCESS_TOKEN</code>. If it prints your token, you're all set. If nothing shows, redo Step 3.",
    prep_check3: "Know where .mcp.json goes",
    prep_check3_desc: "Open or create <code>C:\\Users\\YourName\\.mcp.json</code> with any text editor (Notepad, VS Code, etc.). All MCP server configs go in this file. If it doesn't exist yet, create a new empty file and paste the content below.",
    h2_what: "What is MCP? What Can It Do?",
    what_p1: "MCP (Model Context Protocol) is an open standard by Anthropic — think of it as <strong>\"USB for AI\"</strong>. Each MCP server provides a set of tools. Once configured, Claude Code can call them directly — no copy-paste needed.",
    what_use: "With the three MCP servers in this guide, Claude can:",
    what_li1: "<strong>GitHub MCP:</strong> Search repos, read code, create issues, review PRs — all from the terminal",
    what_li2: "<strong>Playwright MCP:</strong> Open web pages, take screenshots, fill forms, extract content — a built-in browser",
    what_li3: "<strong>Filesystem MCP:</strong> Read and write files within allowed directories, with finer-grained access control",
    h2_config: "Configuring Three MCP Servers",
    config_intro: "Open <code>.mcp.json</code> and add the configs below one by one. You can verify each one as you go — no need to set up all three at once.",
    config_howto: "How to: Copy the code below → paste it inside the <code>\"mcpServers\"</code> braces → save → restart Claude Code.",
    h3_github: "1. GitHub MCP — Repo Operations",
    github_desc: "Once set up, Claude can search repos, read files, create issues. I used it to look up the hello-agents project while writing this post.",
    github_step1: "Step 1: Add the following to <code>.mcp.json</code> inside <code>\"mcpServers\": { }</code>:",
    github_step2: "Step 2: Make sure <code>GITHUB_PERSONAL_ACCESS_TOKEN</code> is set (see Prerequisites step 3), then save the file and restart Claude Code. The GitHub MCP server reads this environment variable automatically for authentication.",
    github_verify: "Verify: In Claude Code, say \"search for the datawhalechina/hello-agents repo\". Search results mean it's working.",
    h3_playwright: "2. Playwright MCP — Browser Automation",
    playwright_desc: "Claude can open web pages, take screenshots, click buttons, extract content. <code>--headless</code> runs the browser in the background without a visible window. I used it to open <a href='https://aihot.virxact.com/' target='_blank' class='text-indigo-600 dark:text-indigo-400 hover:underline'>AI HOT</a> — fully automated.",
    playwright_step1: "Add the following to <code>.mcp.json</code> inside <code>\"mcpServers\": { }</code> (alongside the GitHub config, separated by a comma):",
    playwright_note: "First run downloads Chromium (~150MB). Subsequent runs skip the download. Note: Playwright MCP uses SSE transport. If your Claude Code version has connection issues, skip this step — GitHub and Filesystem MCP will still work fine.",
    playwright_verify: "Verify: In Claude Code, say \"open https://aihot.virxact.com/ and tell me what's on the homepage.\" It will screenshot and extract content automatically.",
    h3_filesystem: "3. Filesystem MCP — Filesystem Access",
    filesystem_desc: "Claude Code's built-in file tools are already solid, but Filesystem MCP lets you <strong>restrict Claude to specific directories</strong> — useful for sensitive projects.",
    filesystem_step1: "Add the following to <code>.mcp.json</code>. Remember to change the paths to your own directories:",
    filesystem_note: "List allowed directories at the end of <code>args</code>. Claude can only access directories in the list; everything else is denied.",
    filesystem_verify: "Verify: Ask Claude to \"list all folders under D:\\DeepLearning_Code.\" A correct listing means it works.",
    config_help_line1: "💡 Stuck? Just copy the code above and paste it to Claude Code —",
    config_help_line2: "say \"help me set up these MCP servers\" and it will walk you through step by step.",
    h2_verify: "How to Confirm It's Working",
    verify_1: "<strong>Method 1 (most reliable):</strong> Just ask Claude to do something. Say \"search GitHub for project X,\" \"open this webpage,\" or \"list files in a directory.\" If you see green <code>mcp__</code> tool calls in the terminal, it works.",
    verify_2: "<strong>Method 2:</strong> Restart Claude Code and look for yellow MCP warnings. Warnings mean something is wrong with the config.",
    verify_3: "<strong>Method 3:</strong> Launch with <code>claude --mcp-debug</code> to see each MCP server's connection status.",
    h2_faq: "FAQ",
    faq_intro: "Most common issues when setting up MCP — click to expand:",
    faq_q1: "npx command not found / stuck downloading",
    faq_a1: "First, verify Node.js is installed: <code>node --version</code>. If downloads are slow, try <code>npm cache clean --force</code> and retry.",
    faq_q2: "Failed to connect error on startup",
    faq_a2: "Three common causes: 1) Wrong command — manually run the command+args from <code>.mcp.json</code> in your terminal to test it; 2) Expired token or wrong env var name for HTTP-type MCP; 3) Network issues — check proxy/VPN settings.",
    faq_q3: "Edited .mcp.json but nothing changed",
    faq_a3: "MCP config is <strong>only loaded once at startup</strong>. Fully quit Claude Code and restart for changes to take effect.",
    faq_q4: "Claude doesn't always call MCP tools",
    faq_a4: "This is expected. Claude decides whether MCP tools are needed — asking \"what's 1+1\" won't trigger GitHub. Mention external actions explicitly: \"search GitHub for X,\" \"open this webpage.\" First use of a new MCP server may trigger a permission prompt — approve it.",
    faq_q5: "How to uninstall an MCP server",
    faq_a5: "Remove its entry from <code>.mcp.json</code>. If it's listed in <code>settings.local.json</code> under <code>enabledMcpjsonServers</code>, remove it there too. Then restart.",
    h2_more: "What Else Can You Add",
    more_p1: "The three above cover most needs. If you want more, these are practical:",
    more_li1: "<strong>Tavily Search:</strong> Web search with real-time results. Needs a Tavily API key (free tier: 1000/month)",
    more_li2: "<strong>Context7:</strong> Access up-to-date library docs — Claude won't use outdated APIs for React/Next.js/Python",
    more_li3: "<strong>Memory:</strong> Persistent cross-session memory — Claude remembers project conventions and decisions",
    more_li4: "<strong>SQLite:</strong> Query SQLite databases directly — great for data analysis workflows",
    more_p2_label: "Browse more at the official MCP servers repo: ",
    more_repo_url: "github.com/modelcontextprotocol/servers",
    more_tip: "If you get stuck, paste the error message to Claude Code — it will help troubleshoot.",
    h2_code: "Complete Configuration Reference",
    code_p1: "Once all three are set up, your <code>.mcp.json</code> should look like this (use it to double-check):",
    bottom_title: "How This Article Was Written",
    bottom_desc: "This entire article was written with Claude Code, using the very GitHub MCP and Playwright MCP we just configured — searching repos, reading docs, opening web pages for screenshots, all from the terminal. Once your MCP servers are set up, you can do the same.",
    bottom_tip: "If you get stuck, paste the error message to Claude Code — it will help troubleshoot.",
  },
} as const;

const codeBlocks = {
  mcpJson: {
    zh: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp", "--headless"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--",
        "D:\\\\DeepLearning_Code",
        "C:\\\\Users\\\\darli\\\\Desktop"
      ]
    }
  }
}`,
    en: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp", "--headless"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--",
        "D:\\\\DeepLearning_Code",
        "C:\\\\Users\\\\darli\\\\Desktop"
      ]
    }
  }
}`,
  },
  githubConfig: {
    zh: `"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"]
}`,
    en: `"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"]
}`,
  },
  tokenEnv: {
    zh: `[Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_你的token", "User")`,
    en: `[Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "ghp_yourToken", "User")`,
  },
  playwrightConfig: {
    zh: `"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp", "--headless"]
}`,
    en: `"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp", "--headless"]
}`,
  },
  filesystemConfig: {
    zh: `"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "--",
    "D:\\\\你的项目目录",
    "C:\\\\Users\\\\你的用户名\\\\Desktop"
  ]
}`,
    en: `"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "--",
    "D:\\\\YourProjectDir",
    "C:\\\\Users\\\\YourName\\\\Desktop"
  ]
}`,
  },
  configStructure: {
    zh: `{
  "mcpServers": {
    "服务器名字": {
      "type": "command",
      "command": "npx",
      "args": ["包名", "参数"]
    }
  }
}`,
    en: `{
  "mcpServers": {
    "serverName": {
      "type": "command",
      "command": "npx",
      "args": ["package", "arg"]
    }
  }
}`,
  },
};

export default function ClaudeCodeMcpSetupPage() {
  const { lang } = useLang();
  const t = (key: string) => {
    const section = content[lang as keyof typeof content] ?? content.zh;
    return (section as Record<string, string>)[key] ?? key;
  };

  return (
    <BlogPostLayout post={post}>
      <h2 id="prep">{t("h2_prep")}</h2>
      <p>{t("prep_p1")}</p>

      <h3>{t("prep_check0")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check0_desc") }} />
      <p className="mt-3 mb-2 text-sm text-zinc-500 dark:text-zinc-400 italic">{t("prep_check0_caption")}</p>
      <img src={`${BASE_PATH}/claude-startup.png`} alt="Claude Code startup screen" className="w-full max-w-2xl rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg my-3" />
      <p className="mt-5">{t("prep_check0_fallback")}</p>
      <Link href="/blog/claude-code-statusline" className="group inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md bg-zinc-50 dark:bg-zinc-900/50">
        <img src={`${BASE_PATH}/statusline-cover.png`} alt="" className="w-10 h-10 object-contain rounded" />
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:underline">{t("prep_check0_link_text")}</span>
        <svg className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Link>

      <h3 className="mt-8">{t("prep_check1")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check1_desc") }} />

      <h3 className="mt-8">{t("prep_check2")}</h3>
      <p>{t("prep_check2_intro")}</p>
      <p className="mt-5 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t("prep_check2_step1_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_step1_desc") }} />
      <p className="mt-5 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t("prep_check2_step2_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_step2_desc") }} />
      <p className="mt-5 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t("prep_check2_step3_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_step3_desc") }} />
      <CodeBlock language="powershell">{codeBlocks.tokenEnv[lang as keyof typeof codeBlocks.tokenEnv] ?? codeBlocks.tokenEnv.zh}</CodeBlock>
      <p className="mt-5 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t("prep_check2_step4_title")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check2_step4_desc") }} />

      <h3 className="mt-8">{t("prep_check3")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("prep_check3_desc") }} />
      <p className="my-3 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-mono text-zinc-700 dark:text-zinc-300">{lang === "zh" ? "配置文件结构预览：" : "Config structure preview:"}</p>
      <CodeBlock language="json">{codeBlocks.configStructure[lang as keyof typeof codeBlocks.configStructure] ?? codeBlocks.configStructure.zh}</CodeBlock>

      <h2 id="what">{t("h2_what")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("what_p1") }} />
      <p>{t("what_use")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("what_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("what_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("what_li3") }} />
      </ul>

      <h2 id="config">{t("h2_config")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("config_intro") }} />
      <p className="mt-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-lg text-sm text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: t("config_howto") }} />

      <h3 id="github">{t("h3_github")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("github_desc") }} />
      <p className="mt-4 mb-2 font-medium text-zinc-800 dark:text-zinc-200">{t("github_step1")}</p>
      <CodeBlock language="json">{codeBlocks.githubConfig[lang as keyof typeof codeBlocks.githubConfig] ?? codeBlocks.githubConfig.zh}</CodeBlock>
      <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("github_step2") }} />
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic" dangerouslySetInnerHTML={{ __html: t("github_verify") }} />

      <h3 id="playwright">{t("h3_playwright")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("playwright_desc") }} />
      <p className="mt-4 mb-2 font-medium text-zinc-800 dark:text-zinc-200">{t("playwright_step1")}</p>
      <CodeBlock language="json">{codeBlocks.playwrightConfig[lang as keyof typeof codeBlocks.playwrightConfig] ?? codeBlocks.playwrightConfig.zh}</CodeBlock>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("playwright_note")}</p>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic" dangerouslySetInnerHTML={{ __html: t("playwright_verify") }} />

      <h3 id="filesystem">{t("h3_filesystem")}</h3>
      <p dangerouslySetInnerHTML={{ __html: t("filesystem_desc") }} />
      <p className="mt-4 mb-2 font-medium text-zinc-800 dark:text-zinc-200">{t("filesystem_step1")}</p>
      <CodeBlock language="json">{codeBlocks.filesystemConfig[lang as keyof typeof codeBlocks.filesystemConfig] ?? codeBlocks.filesystemConfig.zh}</CodeBlock>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: t("filesystem_note") }} />
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic" dangerouslySetInnerHTML={{ __html: t("filesystem_verify") }} />

      <div className="mt-6 px-6 py-5 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/50 rounded-xl text-center">
        <p className="text-[16px] font-semibold text-amber-800 dark:text-amber-200">{t("config_help_line1")}</p>
        <p className="text-[16px] font-semibold text-amber-800 dark:text-amber-200">{t("config_help_line2")}</p>
      </div>

      <h2 id="verify">{t("h2_verify")}</h2>
      <ol className="list-decimal pl-5 my-4 space-y-3 text-[17px] leading-[1.9]">
        <li dangerouslySetInnerHTML={{ __html: t("verify_1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("verify_2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("verify_3") }} />
      </ol>

      <h2 id="faq">{t("h2_faq")}</h2>
      <p>{t("faq_intro")}</p>
      <CollapsibleCard title={t("faq_q1")}><p dangerouslySetInnerHTML={{ __html: t("faq_a1") }} /></CollapsibleCard>
      <CollapsibleCard title={t("faq_q2")}><p dangerouslySetInnerHTML={{ __html: t("faq_a2") }} /></CollapsibleCard>
      <CollapsibleCard title={t("faq_q3")}><p dangerouslySetInnerHTML={{ __html: t("faq_a3") }} /></CollapsibleCard>
      <CollapsibleCard title={t("faq_q4")}><p dangerouslySetInnerHTML={{ __html: t("faq_a4") }} /></CollapsibleCard>
      <CollapsibleCard title={t("faq_q5")}><p dangerouslySetInnerHTML={{ __html: t("faq_a5") }} /></CollapsibleCard>

      <h2 id="more">{t("h2_more")}</h2>
      <p>{t("more_p1")}</p>
      <ul className="list-disc pl-5 my-3 space-y-2 text-[16px] leading-[1.8]">
        <li dangerouslySetInnerHTML={{ __html: t("more_li1") }} />
        <li dangerouslySetInnerHTML={{ __html: t("more_li2") }} />
        <li dangerouslySetInnerHTML={{ __html: t("more_li3") }} />
        <li dangerouslySetInnerHTML={{ __html: t("more_li4") }} />
      </ul>
      <div className="mt-5 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{t("more_p2_label")}<a href="https://github.com/modelcontextprotocol/servers" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">{t("more_repo_url")}</a></p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("more_tip")}</p>
      </div>

      <h2 id="code">{t("h2_code")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("code_p1") }} />
      <ExpandableCode language="json">{codeBlocks.mcpJson[lang as keyof typeof codeBlocks.mcpJson] ?? codeBlocks.mcpJson.zh}</ExpandableCode>

      <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("bottom_title")}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("bottom_desc")}</p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{t("bottom_tip")}</p>
      </div>
    </BlogPostLayout>
  );
}
