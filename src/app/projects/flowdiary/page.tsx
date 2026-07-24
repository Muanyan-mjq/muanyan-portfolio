"use client";

import { useRef, useState, useEffect } from "react";
import { useLang } from "@/components/language-context";
import { BASE_PATH } from "@/lib/base-path";

const S = (n: string) => `${BASE_PATH}/flowdiary/${n}`;

// ── 滚动入场 ──────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.06 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── 下载按钮 ────────────────────────────────────────
function DownloadButtons({ lang }: { lang: "zh" | "en" }) {
  const labels = { zh: { apk: "Android APK", ipa: "iOS IPA" }, en: { apk: "Android APK", ipa: "iOS IPA" } };
  const t = labels[lang];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href="https://github.com/Muanyan-mjq/Flowdiary/releases/latest/download/app-release.apk" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 text-base">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h-2v2H8v-2H6v2zm5-1.5V5.5h2v11l3.5-3.5 1.5 1.5-6 6-6-6 1.5-1.5 3.5 3.5z"/></svg>
        {t.apk}
      </a>
      <a href="https://github.com/Muanyan-mjq/Flowdiary/releases/latest/download/sui_xin_ye_unsigned.ipa" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl text-base">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.82-.91.65.03 2.49.26 3.67 1.98-.1.05-2.18 1.28-2.16 3.82.02 3.01 2.65 4.01 2.68 4.02-.02.07-.42 1.44-1.41 2.84zM13 3.5c.73-.88 1.93-1.54 2.93-1.57.14 1.29-.37 2.6-1.11 3.52-.78.88-2.06 1.57-3.3 1.49-.15-1.26.44-2.54 1.48-3.44z"/></svg>
        {t.ipa}
      </a>
    </div>
  );
}

// ── 分割线 ────────────────────────────────────────────
function Divider() {
  return <div className="max-w-7xl mx-auto px-6 md:px-12"><div className="h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-800 to-transparent" /></div>;
}

// ── 区块标签 ──────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return <span className="inline-block px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full mb-4 tracking-wide">{children}</span>;
}

// ── 更多功能：简洁双列卡片 ─────────────────────────────
function MoreFeatures({ items }: { items: readonly { name: string; desc: string }[] }) {
  const bgColors = [
    "bg-teal-50 dark:bg-teal-950/20", "bg-cyan-50 dark:bg-cyan-950/20",
    "bg-sky-50 dark:bg-sky-950/20", "bg-blue-50 dark:bg-blue-950/20",
    "bg-indigo-50 dark:bg-indigo-950/20", "bg-emerald-50 dark:bg-emerald-950/20",
    "bg-teal-100 dark:bg-teal-950/20", "bg-cyan-100 dark:bg-cyan-950/20",
    "bg-sky-100 dark:bg-sky-950/20", "bg-blue-100 dark:bg-blue-950/20",
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={item.name} className={`group p-5 rounded-2xl ${bgColors[i]} hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500`}>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">{item.name}</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 翻译
// ═══════════════════════════════════════════════════════
const T = {
  zh: {
    appName: "随心耶",
    appNameEn: "Flowdiary",
    tagline: "一只萨摩耶陪你写日记",
    heroDesc: "温暖治愈的日记 App。Markdown 写作、语音输入、塔罗星座、番茄专注、等级养成。记录生活，随心而动。",
    heroBtnGitHub: "GitHub",

    downloadTitle: "下载安装",
    androidTitle: "Android 安装",
    androidSteps: ["点击上方「Android APK」按钮下载", "打开 APK 文件点击安装", "如提示未知应用，在设置中允许即可"],
    iosTitle: "iOS 安装（免费，需电脑辅助一次）",
    iosSteps: ["电脑装 AltServer → 连 iPhone → Install AltStore", "IPA 传到手机文件 App（隔空投送/微信/网盘）", "打开 AltStore → My Apps → + → 选 IPA → 完成", "每 7 天同 WiFi 自动续签"],

    // 设计理念
    philosophyTitle: "设计理念",
    whySamoye: "为什么是萨摩耶",
    whySamoyeDesc: "萨摩耶以「微笑天使」著称，温暖、治愈、忠诚。App 里这只白色小狗不是吉祥物贴图——7 种天气（晴/多云/阴/雨/雪）× 7 个时段（深夜/清晨/早上/上午/中午/下午/傍晚/晚上），形象动态切换。22 张萨摩耶插画覆盖所有场景组合，写日记不再是一个人的孤单行为。",
    firstLetter: "给用户的第一封信",
    firstLetterDesc: "首页「感谢相遇」卡片，点击后以日记详情的格式展示开发者写给用户的一封长信——关于重读纪德《窄门》的感悟。信里写道：\"两个虔诚的灵魂在通往天国的窄门前相遇，却发现那扇门窄到一次只能容一人通过。我越爱你，越不知如何与你相处。靠近你就靠近了痛苦，远离你就远离了幸福。\" 信的结尾说：\"记忆不一定会一直准确，但是文字或许可以帮助我们保存很久。\" 这封信以 DiaryEntry 格式存储，复用日记详情页渲染。",
    levelTitle: "等级养成，不靠付费",
    levelDesc: "没有广告、没有付费。唯一「货币」是坚持写日记——写 5 篇升 Lv2，50 篇升 Lv4，200 篇成为 Lv6「耶中之王」。每级有专属配色，轻量游戏化激励持续记录。",

    // 日记书写
    journalLabel: "核心功能",
    journalTitle: "日记书写",
    journalDesc: "PageView 卡片流首页（viewportFraction 0.80，两侧露出预览），横向滑动：新笔记入口 → 最近 3 篇日记 → 萨摩耶来信。打开 App 自动获取 GPS 定位 + 和风天气实时数据，四步引导式写作带你从天气、心情、事件标签一直走到 Markdown 自由书写。",
    journalStep1: "① 天气",
    journalStep2: "② 心情",
    journalStep3: "③ 事件",
    journalStep4: "④ 写作",
    journalStep1Desc: "晴天/多云/阴/雨/雪，小狗换对应场景装扮",
    journalStep2Desc: "16 种细腻心情：开心/平静/兴奋/难过/生气/温暖/骄傲/茫然/疲惫/甜蜜/委屈/尴尬/逃避/孤独/满足/烦躁",
    journalStep3Desc: "标记你在做什么——看书、听歌、购物、拍照、玩偶、睡觉",
    journalStep4Desc: "自研 Markdown 渲染器实时预览，6 种写作背景色 + 5 档字号调节 + 撤销/重做",
    journalItems: [
      { title: "卡片流首页", desc: "PageView viewportFraction 0.80，两侧露出卡片边缘预览。三页：新笔记入口 → 最近 3 篇日记摘要 → 萨摩耶来信（感谢相遇卡片）" },
      { title: "动态小狗", desc: "深夜看星星 → 清晨起床 → 早上吃早餐 → 上午学习/工作 → 中午午休 → 下午喝咖啡 → 傍晚散步 → 晚上看电影，7 个时段自动换装" },
      { title: "语音输入", desc: "speech_to_text 调用 iOS Siri / Android Google Speech，中文语音实时转文字，说话就能写日记" },
      { title: "添加配图", desc: "image_picker 调用系统相机拍照或从相册选取，图片插入日记正文中。详情页横向滚动浏览所有配图" },
      { title: "草稿自动保存", desc: "离开写作页自动保存当前内容到 SharedPreferences，草稿箱独立管理。首页红点提醒有未完成日记" },
      { title: "日期跳转", desc: "首页标题点击弹出 Material DatePicker，选择日期后自动查找当天的日记并跳转到详情页" },
    ],

    // 月度卡片
    showcaseTitle: "12 张月度卡片",
    showcaseDesc: "每月一张限定插画，用视觉记录时间的温度。",

    // 日签墙
    signLabel: "日签墙",
    signTitle: "软木板上的便签诗",
    signDesc: "软木板质感背景，把你的心情写成便签钉在墙上。每日签到收集来自文学世界的句子——李白的月光、海子的麦田、木心的雪夜，都在这面墙上。",
    signQuotes: [
      "面朝大海\n春暖花开",
      "醉后不知天在水\n满船清梦压星河",
      "每一个不曾起舞的日子\n都是对生命的辜负",
      "满地都是六便士\n他却抬头看见了月亮",
      "生如夏花之绚烂\n死如秋叶之静美",
      "世上只有一种英雄主义\n就是认清生活的真相后依然热爱它",
    ],
    signQuoteAuthors: ["海子", "唐温如", "尼采", "毛姆", "泰戈尔", "罗曼·罗兰"],
    signCheckinLabel: "连续签到",
    signBtnLabel: "立即签到",
    signColors: "6 色暖调便签纸：鹅黄 / 米白 / 暖橙 / 奶白 / 象牙 / 贝壳",
    signShareTitle: "生成分享卡片",
    signShareModes: "便签风 / 简约风 双模式",
    signShareActions: "保存至相册 + 一键分享",
    signStickyTitle: "独立便签",
    profileNickname: "萨摩耶",
    profileBio: "用萨摩耶的方式，记录每一天 🐾",
    profileLevelLabel: "萨摩耶等级",
    profileLevelProgress: "3 / 6 · 耶之行者",
    privacyDecoyBullets: ["两个密码入口", "5 篇伪装日记", "假导航栏完全一致"],
    privacyLockBullets: ["指纹 / Face ID", "密码验证", "bcrypt 哈希，不存明文"],
    privacyEncryptBullets: ["iOS Keychain", "Android Keystore"],

    // 回忆隧道
    discoverLabel: "发现",
    discoverTitle: "回忆隧道",
    discoverDesc: "StatsStorage 追踪三项数据：累计日记篇数（每写完一篇 +1）、记录天数（首次使用日期到今天的天数差 +1）、总字数（每次写完累加 wordCount，≥1000 显示为 k，≥10000 显示为 w）。随机回忆用 DateTime 日期种子从全部日记中随机抽取一篇，同一天内结果不变。时间线按「年+月」分组，每月日记数独立存储（SharedPreferences 键：diary_2026_06）。",
    discoverStats: [
      { icon: "📖", label: "累计日记", value: "12 篇" },
      { icon: "📅", label: "记录天数", value: "8 天" },
      { icon: "✏️", label: "总字数", value: "3.2k" },
    ],
    discoverMemoryTitle: "今日回忆",
    discoverMemoryDesc: "每天从你的历史日记中随机抽取一篇推送到首页。可能是上周的一个想法、上月的一段心情，或者是去年今天的记录。像翻到一张旧照片。",
    discoverTimelineTitle: "时间线",
    discoverTimelineDesc: "全部日记按「年+月」分组，滑动浏览。可以快速定位到任意月份的记录，看回自己的成长轨迹。",

    // 专注
    focusLabel: "效率工具",
    focusTitle: "专注 & 待办",
    focusDesc: "根据当前时间自动问候（凌晨→夜深了，6-9→早安，9-12→上午好，12-14→中午好，14-18→下午好，18-22→晚上好）。待办卡片每张独立渐变色背景，支持 ReorderableListView 拖拽排序，长按编辑，点击计时器图标进入番茄钟页面。全部完成时弹出夸夸文案，部分完成显示进度百分比。",
    focusItems: [
      { title: "待办打卡", desc: "FocusTask 模型包含：名称、sortOrder 排序权重、bgColors 渐变色、isDoneToday 打卡状态、completedToday 完成次数、modeLabel 模式标签。每张卡片独立配色，长按编辑，拖拽重排。" },
      { title: "番茄钟", desc: "圆形进度动画计时器，完成任务后自动导航回待办列表。TimerScreen 独立页面，支持自定义专注时长。" },
      { title: "完成激励", desc: "全部完成弹出「🎉 全部完成，今天超棒！」。部分完成显示「🔥 已完成 n/总数，继续加油」。无任务时显示「💪 新的一天，从第一个专注开始」" },
    ],

    // 我的
    profileLabel: "个人主页",
    profileTitle: "我的",
    profileDesc: "萨摩耶头像 + 昵称签名 + 数据统计 + 功能入口。",
    profileStats: ["日记", "记录天数", "总字数", "连续签到"],
    profileMenu: ["心情日历", "日签墙", "草稿箱", "云端同步", "收藏", "主题色", "意见反馈", "关于"],
    profileExtra: "萨摩耶等级养成：Lv1 萌新出窝 → Lv2 小耶出窝 → Lv3 耶之行者 → Lv4 耶中之霸 → Lv5 耶之传奇 → Lv6 耶中之王。每级专属配色，写越多等级越高。",

    // 安全隐私
    privacyLabel: "安全",
    privacyTitle: "安全隐私",
    privacyDesc: "你的日记只属于你。",
    privacyItems: [
      {
        title: "伪装密码",
        desc: "设置两个密码——一个进真实日记，一个进完整伪装的假日记空间。伪装空间展示 5 篇预设普通日记（图书馆、高数课、操场跑步……），底部导航栏和真 App 一模一样。点击其他标签弹出「退出伪装模式」确认框——窥探者完全察觉不到。",
      },
      { title: "应用锁", desc: "指纹 / 面容识别 + 密码验证，bcrypt 哈希，不存明文" },
      { title: "本地加密", desc: "FlutterSecureStorage（iOS Keychain / Android Keystore）加密存储" },
    ],

    // 更多功能
    otherTitle: "更多功能",
    otherItems: [
      { name: "云端备份与同步", desc: "Supabase Auth + PostgreSQL。登录后日记自动上传到云端，换手机也能恢复。未登录时所有功能本地可用。" },
      { name: "全局搜索", desc: "搜索全部日记内容，关键词高亮显示匹配结果。支持按日期范围筛选。" },
      { name: "日记配图画廊", desc: "横向滑动浏览所有日记中的配图，点击放大查看原图，支持保存到相册。" },
      { name: "收藏功能", desc: "收藏喜欢的日记和日签，独立收藏页查看。日签收藏使用内容+作者哈希去重。" },
      { name: "意见反馈", desc: "Formspree 在线提交反馈 → 发送到开发者邮箱。无网络时自动保存到本地 SharedPreferences。" },
      { name: "主题色自定义", desc: "6 种预设主题色（天空蓝/樱花粉/薄荷绿等）+ flutter_colorpicker HSV 取色器，完全自定义。" },
      { name: "天气集成", desc: "和风天气 API + geolocator GPS 自动定位。获取实时天气和城市名，写日记时自动填入。" },
      { name: "草稿箱", desc: "离开写作页自动保存草稿，草稿箱独立管理页。首页有红点提醒未完成的日记。" },
      { name: "农历显示", desc: "内置 chinese_calendar 农历转换。日记详情页显示农历日期和传统节日（春节/中秋等）。" },
      { name: "中英双语", desc: "flutter_localizations 跟随系统语言自动切换中英文。Material Design 组件全局适配。" },
    ],

    // 技术栈
    techTitle: "技术栈",
    techSub: "Flutter 3.x · Dart 3.x · Material Design · Android & iOS",
    techCards: [
      { cat: "Flutter 框架", desc: "Flutter 3.x + Dart 3.x，Google 的跨平台 UI 工具包。一套 Dart 代码同时编译为 Android（ARM 原生 APK）和 iOS（ARM64 原生 IPA）。使用 Material Design 组件库，flutter_localizations 实现中英双语跟随系统语言切换。", items: ["Flutter 3.x", "Dart 3.x", "Material Design", "flutter_localizations"] },
      { cat: "存储与安全", desc: "SharedPreferences 存用户偏好和签名（轻量键值对）。FlutterSecureStorage 存密码哈希和 Token，底层调用 iOS Keychain / Android Keystore 硬件级加密。bcrypt（Blowfish 算法）对密码加盐哈希，不存明文。local_auth 调用系统指纹和 Face ID 验证身份。", items: ["SharedPreferences", "FlutterSecureStorage", "bcrypt", "local_auth"] },
      { cat: "后端服务", desc: "Supabase 提供 PostgreSQL 数据库 + Auth 认证，实现云端日记同步和跨设备备份，未登录时全部本地功能照常可用。Formspree 作为无服务器邮件后端，接收用户反馈并发到开发者邮箱。和风天气 API 根据 GPS 坐标返回实时天气数据，写日记时自动填入。", items: ["Supabase", "Formspree", "和风天气 API"] },
      { cat: "核心依赖", desc: "speech_to_text 调用系统语音引擎实时转文字。Lottie 播放 AE 导出的 JSON 动画。自研 Markdown 渲染器用正则解析标题/粗体/斜体/引用/待办/列表为富文本。share_plus 调系统分享面板，qr_flutter 生成二维码，image_gallery_saver 保存分享卡片到相册。", items: ["speech_to_text", "Lottie", "自研 Markdown", "share_plus"] },
    ],
    techDescs: [
      "Flutter 3.x + Dart 3.x：Google 的 UI 工具包，一套 Dart 代码同时编译为 Android（ARM 原生）和 iOS（ARM64 原生）应用。使用 Material Design 组件库 + flutter_localizations 实现中英双语跟随系统语言。",
      "SharedPreferences 存用户偏好和签名（轻量键值对）。FlutterSecureStorage 存密码哈希和 token，底层调用 iOS Keychain / Android Keystore 硬件加密。path_provider 管理日记 JSON 文件和应用缓存路径。",
      "bcrypt 对密码做加盐哈希（Blowfish 算法），不存明文。local_auth 调用系统指纹 / Face ID 验证。crypto 提供 AES 等基础加密原语。",
      "Supabase 提供 PostgreSQL 数据库 + Auth 认证，实现云端日记同步和跨设备备份。Formspree 作为无服务器邮件后端，接收用户反馈并发送到开发者邮箱。和风天气 API 根据 GPS 坐标返回实时天气数据。",
      "speech_to_text 调用系统语音识别引擎（iOS Siri / Android Google Speech），实时将中文语音转为文字插入日记。geolocator 通过 GPS + 基站 + WiFi 混合定位获取经纬度，传给天气 API。image_picker 调用系统相机和相册，支持拍照和选图。",
      "自研轻量 Markdown 渲染器：正则解析标题/粗体/斜体/引用/待办/列表/分割线，输出富文本 Widget。Lottie 播放 After Effects 导出的 JSON 动画（登录狗、完成勾）。timelines_plus 实现回忆隧道的时间线滑动。flutter_colorpicker 提供 HSV 取色器，用户可自选主题色。",
      "share_plus 调用系统分享面板（微信/QQ/隔空投送/邮件等），分享日记和日签卡片。qr_flutter 在分享卡片上生成二维码，扫码即可访问个人主页。image_gallery_saver 将生成的分享卡片 PNG 保存到系统相册。",
    ],
    techGroups: [
      { cat: "框架", items: ["Flutter 3.x", "Dart 3.x", "flutter_localizations"] },
      { cat: "本地存储", items: ["SharedPreferences", "FlutterSecureStorage", "path_provider"] },
      { cat: "认证安全", items: ["bcrypt", "local_auth", "crypto"] },
      { cat: "后端", items: ["Supabase", "Formspree", "和风天气 API"] },
      { cat: "传感器", items: ["speech_to_text", "geolocator", "image_picker"] },
      { cat: "UI 动画", items: ["自研 Markdown", "Lottie", "timelines_plus", "flutter_colorpicker"] },
      { cat: "分享", items: ["share_plus", "qr_flutter", "image_gallery_saver"] },
    ],

    ctaTitle: "准备好开始记录了吗？",
    ctaDesc: "免费下载，无需注册即可使用全部本地功能。",
    footer: "MIT 开源协议 · 由慕安延用 Flutter 构建",
  },
  en: {
    appName: "Flowdiary",
    appNameEn: "随心耶",
    tagline: "Journal With a Samoyed",
    heroDesc: "A warm, healing diary app with Markdown writing, voice input, Tarot & Zodiac, Pomodoro focus, and level progression. Record life, follow your heart.",
    heroBtnGitHub: "GitHub",

    downloadTitle: "Download & Install",
    androidTitle: "Android",
    androidSteps: ["Tap 'Android APK' above to download", "Open the APK file and install", "Allow unknown sources in Settings if prompted"],
    iosTitle: "iOS (free, requires a computer once)",
    iosSteps: ["Install AltServer on PC → connect iPhone → Install AltStore", "Transfer IPA to iPhone Files (AirDrop / WeChat)", "AltStore → My Apps → + → select IPA → done", "Auto-refreshes every 7 days on same WiFi"],

    philosophyTitle: "Design Philosophy",
    whySamoye: "Why a Samoyed",
    whySamoyeDesc: "Samoyeds are known as 'smiling angels' — warm, healing, and loyal. The mascot isn't a static sticker: 7 weather types × 7 time slots (night, dawn, morning, noon, afternoon, evening), with 22 original illustrations covering every scene combination.",
    firstLetter: "A Letter to the User",
    firstLetterDesc: "Tap the 'Thank You for Being Here' card to read a personal letter from the developer, rendered as a diary entry. It reflects on André Gide's 'Strait is the Gate': \"Two devout souls meet before the narrow gate to heaven, only to find it fits but one at a time. The more I love you, the less I know how to be with you.\" The letter concludes: \"Memories may not always be accurate, but words help us hold onto moments for a long time.\" Stored as a DiaryEntry model and rendered in the diary detail screen.",
    levelTitle: "Level Up, Not Pay Up",
    levelDesc: "No ads, no paywalls. The only currency is consistency — 5 entries for Lv2, 50 for Lv4, 200 for Lv6 'King of the Samoyeds'. Each level has unique colors. Light gamification rewards persistence, not payment.",

    journalLabel: "Core Feature",
    journalTitle: "Journal",
    journalDesc: "PageView card-flow home (viewportFraction 0.80, cards peek from both sides). Swipe horizontally: new entry → latest 3 diaries → Samoyed letter. Auto-fetches GPS location and HeFeng real-time weather on launch. A guided 4-step flow takes you from weather and mood to event tags and Markdown free writing.",
    journalStep1: "① Weather",
    journalStep2: "② Mood",
    journalStep3: "③ Event",
    journalStep4: "④ Write",
    journalStep1Desc: "Sunny, cloudy, overcast, rain, or snow — the mascot changes outfits to match",
    journalStep2Desc: "16 nuanced moods — happy, calm, excited, sad, angry, warm, proud, lost, tired, sweet, wronged, awkward, escaping, lonely, fulfilled, irritated",
    journalStep3Desc: "Tag what you're doing — reading, music, shopping, taking photos, toys, sleeping",
    journalStep4Desc: "Custom Markdown renderer with live preview, 6 background colors, 5 font sizes, undo & redo",
    journalItems: [
      { title: "Card Home", desc: "PageView viewportFraction 0.80 with card peek. 3 pages: new entry → recent 3 diary summaries → Samoyed letter" },
      { title: "Dynamic Mascot", desc: "Night→dawn→morning→noon→afternoon→evening, 7 time slots with different Samoyed illustrations" },
      { title: "Voice Input", desc: "speech_to_text invokes iOS Siri / Android Google Speech for real-time Chinese voice-to-text" },
      { title: "Photo Attachments", desc: "image_picker: camera capture or gallery selection. Horizontal image gallery in detail view" },
      { title: "Auto-save Drafts", desc: "Auto-saves to SharedPreferences on leaving editor. Dedicated drafts manager with red dot notification" },
      { title: "Date Jump", desc: "Tap homepage title → Material DatePicker → auto-finds and navigates to that date's diary entry" },
    ],

    showcaseTitle: "12 Monthly Cards",
    showcaseDesc: "One exclusive illustration each month, capturing the seasons through art.",

    signLabel: "Daily Sign Wall",
    signTitle: "Poetry Pinned on a Corkboard",
    signDesc: "A corkboard where you pin your thoughts like sticky notes. Daily check-in collects beautiful lines from world literature — verses from Neruda, Tagore, Nietzsche, and more, all on this wall.",
    signQuotes: [
      "Facing the sea\nwith spring flowers blooming",
      "Drunk, unaware the sky\nlies in the water; a boat\nfull of clear dreams weighs down the galaxy",
      "Every day without dancing\nis a day lost",
      "The world has kissed my soul\nwith its pain, asking for its return in songs",
      "Let life be beautiful\nlike summer flowers\nand death like autumn leaves",
      "The only heroism:\nto see the world as it is\nand to love it",
    ],
    signQuoteAuthors: ["Haizi", "Tang Wenru", "Nietzsche", "Tagore", "Tagore", "Romain Rolland"],
    signCheckinLabel: "Streak",
    signBtnLabel: "Check In",
    signColors: "6 warm paper tones: cream, ivory, beige, eggshell, vanilla, seashell",
    signShareTitle: "Generate Share Card",
    signShareModes: "Sticky Note & Minimal modes",
    signShareActions: "Save to Gallery + One-Tap Share",
    signStickyTitle: "Sticky Notes",
    profileNickname: "Samoyed",
    profileBio: "Recording every day, the Samoyed way 🐾",
    profileLevelLabel: "Samoyed Level",
    profileLevelProgress: "3 / 6 · Walker",
    privacyDecoyBullets: ["Two password entries", "5 preset decoy entries", "Fake nav bar identical to real"],
    privacyLockBullets: ["Fingerprint / Face ID", "Passcode verification", "bcrypt hashed, no plaintext"],
    privacyEncryptBullets: ["iOS Keychain", "Android Keystore"],

    discoverLabel: "Discover",
    discoverTitle: "Memory Tunnel",
    discoverDesc: "StatsStorage tracks three metrics: total entries (+1 per completion), active days (days since first use + 1), total word count (accumulated per entry, ≥1000 shown as k, ≥10000 as w). Random memory uses DateTime day-seed to pick one entry randomly — same result all day. Timeline groups entries by year+month, each month's count stored independently (SharedPreferences key: diary_2026_06).",
    discoverStats: [
      { icon: "📖", label: "Total Entries", value: "12" },
      { icon: "📅", label: "Active Days", value: "8" },
      { icon: "✏️", label: "Total Words", value: "3.2k" },
    ],
    discoverMemoryTitle: "Today's Memory",
    discoverMemoryDesc: "One random entry from your history is pushed to the homepage each day. Could be an idea from last week, a mood from last month, or a record from this day last year. Like flipping through an old photo album.",
    discoverTimelineTitle: "Timeline",
    discoverTimelineDesc: "All entries grouped by year + month in a scrollable timeline. Quickly jump to any month's records and trace your growth over time.",

    focusLabel: "Productivity",
    focusTitle: "Focus & Tasks",
    focusDesc: "Time-based greetings that change throughout the day (late night, good morning, afternoon, evening). Each task card has a unique gradient background. Supports drag-to-reorder via ReorderableListView, long-press to edit, tap timer icon to start a Pomodoro session. Praise message on full completion, progress percentage when partially done.",
    focusItems: [
      { title: "Task Checklist", desc: "FocusTask model includes: name, sortOrder, bgColors gradient, isDoneToday status, completedToday count, and modeLabel. Each card uniquely colored, long-press to edit, drag to reorder." },
      { title: "Pomodoro Timer", desc: "Circular progress animation timer on a dedicated TimerScreen with customizable duration. Auto-navigates back to the task list on completion." },
      { title: "Completion Praise", desc: "All done: '🎉 All done, you're amazing today!' — Partial: '🔥 n/total done, keep going' — Empty: '💪 A new day, start with your first focus session'" },
    ],

    profileLabel: "Profile",
    profileTitle: "My Space",
    profileDesc: "Avatar, nickname, bio, stats dashboard, and quick-access feature menu.",
    profileStats: ["Entries", "Active Days", "Total Words", "Streak"],
    profileMenu: ["Mood Calendar", "Daily Sign", "Drafts", "Cloud Sync", "Favorites", "Themes", "Feedback", "About"],
    profileExtra: "Samoyed level system: Lv1 Puppy → Lv2 Explorer → Lv3 Walker → Lv4 Alpha → Lv5 Legend → Lv6 King. Each level features unique colors. The more you write, the higher you climb.",

    privacyLabel: "Security",
    privacyTitle: "Privacy",
    privacyDesc: "Your diary belongs to you, and only you.",
    privacyItems: [
      {
        title: "Decoy Password",
        desc: "Set two passwords — one opens your real diary, the other opens a fully functional fake space. The decoy displays 5 preset entries (library study, math class, jogging…) with a bottom nav bar identical to the real app. Tapping other tabs prompts 'Exit decoy mode?' — intruders will never suspect hidden content exists.",
      },
      { title: "App Lock", desc: "Fingerprint / Face ID authentication plus passcode verification. Passwords are bcrypt-hashed, never stored in plaintext." },
      { title: "Local Encryption", desc: "Sensitive data is stored via FlutterSecureStorage, backed by iOS Keychain and Android Keystore hardware-level encryption." },
    ],

    otherTitle: "More Features",
    otherItems: [
      { name: "Cloud Backup & Sync", desc: "Supabase Auth + PostgreSQL. Entries auto-upload to the cloud, restore on any new device. All local features work fully without logging in." },
      { name: "Global Search", desc: "Search across all diary entries with keyword highlighting. Filter results by date range." },
      { name: "Photo Gallery", desc: "Horizontal scroll through all attached images. Tap to zoom, long-press to save to gallery." },
      { name: "Favorites", desc: "Bookmark favorite entries and daily signs, all collected in a dedicated favorites view. Sign deduplication via content hash." },
      { name: "Feedback", desc: "Formspree online submission goes straight to the developer's inbox. Offline submissions auto-save to SharedPreferences." },
      { name: "Custom Themes", desc: "6 preset themes (Sky Blue, Sakura Pink, Mint Green, and more) plus an HSV color picker for full customization." },
      { name: "Weather Integration", desc: "HeFeng Weather API + geolocator GPS. Real-time weather and city name are auto-filled when you start writing." },
      { name: "Drafts", desc: "Auto-save on leaving the editor. A dedicated drafts manager with a red dot reminder on the homepage." },
      { name: "Lunar Calendar", desc: "Built-in chinese_calendar conversion shows lunar dates and traditional holidays on entry details." },
      { name: "Bilingual", desc: "flutter_localizations follows the system language setting. All Material Design components switch seamlessly." },
    ],

    techTitle: "Tech Stack",
    techSub: "Flutter 3.x · Dart 3.x · Material Design · Android & iOS",
    techCards: [
      { cat: "Flutter Framework", desc: "Flutter 3.x + Dart 3.x, Google's cross-platform UI toolkit. One codebase compiles to native Android (ARM APK) and iOS (ARM64 IPA). Built with Material Design and flutter_localizations for bilingual support that follows the system language.", items: ["Flutter 3.x", "Dart 3.x", "Material Design", "flutter_localizations"] },
      { cat: "Storage & Security", desc: "SharedPreferences for lightweight user preferences and signatures. FlutterSecureStorage for password hashes and tokens, backed by iOS Keychain and Android Keystore hardware encryption. bcrypt (Blowfish) salts and hashes passwords — never stored in plaintext. local_auth for system fingerprint and Face ID.", items: ["SharedPreferences", "FlutterSecureStorage", "bcrypt", "local_auth"] },
      { cat: "Backend Services", desc: "Supabase provides PostgreSQL + Auth for cloud sync and cross-device backup. All local features work without login. Formspree serves as a serverless email backend for user feedback. HeFeng Weather API delivers real-time weather data via GPS coordinates.", items: ["Supabase", "Formspree", "HeFeng Weather API"] },
      { cat: "Core Dependencies", desc: "speech_to_text invokes the system speech engine for real-time voice input. Lottie renders AE-exported JSON animations. A custom Markdown renderer uses regex to parse headings, bold, italic, quotes, todos, and lists into rich text. share_plus for the system share sheet, qr_flutter for QR codes, image_gallery_saver for saving cards to the gallery.", items: ["speech_to_text", "Lottie", "Custom Markdown", "share_plus"] },
    ],
    techDescs: [
      "Flutter 3.x + Dart 3.x: Google's UI toolkit. A single Dart codebase compiles to native Android and iOS apps. Uses Material Design + flutter_localizations for bilingual support following system language.",
      "SharedPreferences for user preferences and signatures. FlutterSecureStorage for password hashes and tokens via iOS Keychain / Android Keystore hardware encryption. path_provider manages diary JSON file paths and app cache directories.",
      "bcrypt salts and hashes passwords (Blowfish algorithm), never stored in plaintext. local_auth invokes system fingerprint / Face ID. crypto provides AES and other fundamental encryption primitives.",
      "Supabase provides PostgreSQL + Auth for cloud diary sync and cross-device backup. Formspree as a serverless email backend for user feedback. HeFeng Weather API returns real-time weather via GPS coordinates.",
      "speech_to_text invokes system speech recognition (iOS Siri / Android Google Speech), converting Chinese speech to text in real time. geolocator uses GPS + cell + WiFi hybrid positioning. image_picker invokes system camera and gallery.",
      "Custom lightweight Markdown renderer: regex-parses headings/bold/italic/quotes/todos/lists/dividers into rich text widgets. Lottie plays AE-exported JSON animations. timelines_plus powers the memory tunnel timeline. flutter_colorpicker provides HSV picker for custom theme colors.",
      "share_plus invokes the system share sheet (WeChat/QQ/AirDrop/email) to share entries and daily sign cards. qr_flutter generates QR codes on share cards. image_gallery_saver saves share card PNGs to the system photo gallery.",
    ],

    ctaTitle: "Ready to Start Journaling?",
    ctaDesc: "Free download. All features work without an account.",
    footer: "MIT License · Built with Flutter by Muanyan",
  },
} as const;

// ── 色板 ──────────────────────────────────────────────
const chipColors = [
  "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];

// ═══════════════════════════════════════════════════════
// 主页面
// ═══════════════════════════════════════════════════════
export default function FlowdiaryPage() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ═══ 1. Hero ═══ */}
      <section className="relative pt-14 md:pt-24 pb-12 md:pb-16 px-6 md:px-12">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-14 items-center">
            <div className="md:pl-6 lg:pl-10">
              <Reveal>
                <div className="flex items-center gap-5 mb-6">
                  <img src={S("flowdiary-icon.png")} alt="随心耶" className="w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-lg shrink-0 hover:scale-110 hover:rotate-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer" />
                  <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-extrabold text-zinc-900 dark:text-white leading-[0.9] tracking-tight"
                    style={{ fontFamily: "'Noto Serif SC', 'Georgia', serif" }}>
                    {t.appName}
                  </h1>
                </div>
                <p className="text-xl md:text-2xl text-amber-600 dark:text-amber-400 font-medium -mt-2 mb-5">{t.tagline}</p>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mb-6 leading-relaxed">{t.heroDesc}</p>
              </Reveal>
              <Reveal delay={120}>
                <div className="flex flex-wrap items-center gap-3">
                  <DownloadButtons lang={lang as "zh" | "en"} />
                  <a href="https://github.com/Muanyan-mjq/Flowdiary" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                    GitHub
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={100} className="w-full md:w-[380px] lg:w-[460px] shrink-0">
              <img src={S("samoye_letter.png")} alt="萨摩耶来信" className="w-full rounded-[2.5rem] hover:scale-[1.02] transition-all duration-700" style={{ mixBlendMode: "multiply" }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 2. 下载说明 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">{t.downloadTitle}</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            <Reveal delay={80}>
              <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-500">
                <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white mb-3">
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h-2v2H8v-2H6v2zm5-1.5V5.5h2v11l3.5-3.5 1.5 1.5-6 6-6-6 1.5-1.5 3.5 3.5z"/></svg>
                  {t.androidTitle}
                </h3>
                <ol className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {t.androidSteps.map((s, i) => (<li key={i} className="flex gap-2"><span className="font-bold text-zinc-400">{i + 1}.</span> {s}</li>))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-500">
                <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white mb-3">
                  <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.82-.91.65.03 2.49.26 3.67 1.98-.1.05-2.18 1.28-2.16 3.82.02 3.01 2.65 4.01 2.68 4.02-.02.07-.42 1.44-1.41 2.84zM13 3.5c.73-.88 1.93-1.54 2.93-1.57.14 1.29-.37 2.6-1.11 3.52-.78.88-2.06 1.57-3.3 1.49-.15-1.26.44-2.54 1.48-3.44z"/></svg>
                  {t.iosTitle}
                </h3>
                <ol className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {t.iosSteps.map((s, i) => (<li key={i} className="flex gap-2"><span className="font-bold text-zinc-400">{i + 1}.</span> {s}</li>))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 3. 设计理念 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-16 tracking-tight">{t.philosophyTitle}</h2>
          </Reveal>
          <div className="space-y-20">
            <Reveal>
              <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center">
                <div className="w-40 h-40 md:w-48 md:h-48 shrink-0">
                  <img src={S("samoye_avatar.png")} alt="萨摩耶" className="w-full h-full rounded-[2rem] object-cover shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500" style={{ mixBlendMode: "multiply" }} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.whySamoye}</h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.whySamoyeDesc}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-14 items-center">
                <div className="w-40 h-40 md:w-48 md:h-48 shrink-0">
                  <img src={S("samoye_letter.png")} alt="第一封信" className="w-full h-full rounded-[2rem] object-cover shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500" style={{ mixBlendMode: "multiply" }} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.firstLetter}</h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.firstLetterDesc}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center">
                <div className="shrink-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 mb-3 justify-center flex-wrap">
                      {[
                        { lv: 1, label: "萌新出窝", active: true },
                        { lv: 2, label: "小耶出窝", active: true },
                        { lv: 3, label: "耶之行者", active: true },
                        { lv: 4, label: "耶中之霸", active: false },
                        { lv: 5, label: "耶之传奇", active: false },
                        { lv: 6, label: "耶中之王", active: false },
                      ].map((l) => (
                        <div key={l.lv} className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ${l.active ? "bg-amber-500 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30" : "bg-zinc-200 dark:bg-zinc-700"}`}>{l.lv}</div>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400">5 篇 → 50 篇 → 200 篇</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2">{t.levelTitle}</h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.levelDesc}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 4. 日记书写 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-14">
              <SectionLabel>{t.journalLabel}</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{t.journalTitle}</h2>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">{t.journalDesc}</p>
            </div>
          </Reveal>
          {/* 四步流程 */}
          <Reveal delay={80}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14 items-start">
              {[
                { label: t.journalStep1, desc: t.journalStep1Desc, img: "time_morning.jpg", color: "amber" },
                { label: t.journalStep2, desc: t.journalStep2Desc, img: "mood_happy.png", color: "rose", isIcon: true },
                { label: t.journalStep3, desc: t.journalStep3Desc, img: "mascot_reading.jpg", color: "sky" },
                { label: t.journalStep4, desc: t.journalStep4Desc, img: "letter_soft.png", color: "purple" },
              ].map((step) => (
                <div key={step.label} className="text-center group">
                  <div className="relative mb-3">
                    {step.isIcon ? (
                      <div className="w-full aspect-square rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900 shadow-md p-3 grid grid-cols-4 gap-0.5 group-hover:shadow-lg transition-shadow">
                        {["happy", "excited", "calm", "sweet", "proud", "warm", "sad", "angry", "dreamy", "lonely", "tired", "awkward", "fulfilled", "escaping", "lost", "irritated"].map((m) => (
                          <img key={m} src={S(`mood_${m}.png`)} alt={m} className="w-full aspect-square object-contain" />
                        ))}
                      </div>
                    ) : (
                      <img src={S(step.img)} alt={step.label} className="w-full aspect-square object-cover rounded-[1.5rem] shadow-md group-hover:shadow-xl group-hover:scale-[1.03] group-hover:-translate-y-1 transition-all duration-500" style={{ mixBlendMode: "multiply" }} />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-0.5">{step.label}</h4>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {/* 功能卡片 */}
          <Reveal delay={120}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {t.journalItems.map((item) => (
                <div key={item.title} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500">
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-1 text-sm">{item.title}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ═══ 5. 月度卡片 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{t.showcaseTitle}</h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">{t.showcaseDesc}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <img key={i} src={S(`monthly_${String(i + 1).padStart(2, "0")}.jpg`)} alt={`${i + 1}月`}
                  className="w-full aspect-[3/4] object-cover rounded-xl shadow-md hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 hover:scale-[1.05] hover:rotate-1 transition-all duration-500 cursor-pointer" />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ═══ 6. 日签墙 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10">
              <SectionLabel>{t.signLabel}</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{t.signTitle}</h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">{t.signDesc}</p>
            </div>
          </Reveal>

          {/* 分享卡片 + 独立便签 */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* 分享卡片 */}
            <Reveal delay={80}>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                  {t.signShareTitle}
                </h3>
                <div className="rounded-2xl shadow-lg overflow-hidden border border-amber-200/50 dark:border-amber-800/30 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-500">
                  <div className="bg-[#FFFEF0] p-6 md:p-8 relative">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8B5E3C]" style={{ boxShadow: "1px 2px 3px rgba(0,0,0,0.3)" }} />
                    <div className="text-center mt-2">
                      <div className="text-6xl font-light text-[#D4A574]/25 leading-none">"</div>
                      <div className="text-xl leading-relaxed font-medium text-[#4A3728] mt-1 whitespace-pre-line">{t.signQuotes[0]}</div>
                      <div className="flex items-center justify-center gap-3 mt-5">
                        <div className="flex-1 h-px bg-[#D4A574]/30" />
                        <svg className="w-3.5 h-3.5 text-[#D4A574]/40" viewBox="0 0 24 24" fill="currentColor"><path d="M19.46 8l-.79-1.75L17 5.46 12 4v2.92L18.54 8zM12 2L2 6.46l2.54 1L12 5l7.46 2.46L22 6.46 12 2z"/></svg>
                        <div className="flex-1 h-px bg-[#D4A574]/30" />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-sm font-semibold text-[#A09080]">— {t.signQuoteAuthors[0]}</div>
                          <div className="text-[11px] text-[#C0B0A0] mt-0.5">2026.6.19 星期五</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-[#B8956A] font-semibold bg-[#F5ECD7] border border-[#E8D5B0] px-2.5 py-1 rounded-lg">随心耶</span>
                          <div className="w-10 h-10 bg-white rounded-md border border-[#E8D5B0] flex items-center justify-center">
                            <div className="w-7 h-7 bg-[#8B7355] rounded-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                    <span>{t.signShareModes}</span>
                    <span>{t.signShareActions}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 独立便签 — 分开展示 */}
            <Reveal delay={120}>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">{t.signStickyTitle}</h3>
                <div className="space-y-5">
                  {(() => {
                    const paperColors = ["#FFFEF0", "#FFF3E0", "#FFFAF0"];
                    const rots = [-1.5, 1, -0.8];
                    return [3, 4, 5].map((qi, i) => (
                      <div key={i} className="rounded-lg p-4 pt-5 relative shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group" style={{ backgroundColor: paperColors[i], transform: `rotate(${rots[i]}deg)`, maxWidth: "280px", marginLeft: i % 2 === 0 ? "0" : "auto" }}>
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8B5E3C]" style={{ boxShadow: "1px 1px 2px rgba(0,0,0,0.3)" }} />
                        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#4A3728" }}>{t.signQuotes[qi]}</div>
                        <div className="text-xs mt-2 flex items-center justify-between">
                          <span style={{ color: "#A09080" }}>— {t.signQuoteAuthors[qi]}</span>
                          <span className="text-amber-400">★</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <p className="text-[11px] text-zinc-400 mt-5 text-center">{t.signColors}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 7. 专注 & 待办 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <div className="space-y-3">
                {[
                  { bg: "#A8D8EA", name: "阅读 30 分钟", done: true, info: "番茄钟 · 已完成 1 次" },
                  { bg: "#FFD3B6", name: "写日记", done: false, info: "番茄钟 · 待完成" },
                  { bg: "#D4A5A5", name: "运动 20 分钟", done: true, info: "番茄钟 · 已完成 2 次" },
                ].map((task) => (
                  <div key={task.name} className="p-4 rounded-2xl flex items-center gap-3 shadow-md hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-500 cursor-pointer" style={{ backgroundColor: task.bg }}>
                    {task.done && <svg className="w-5 h-5 shrink-0 text-white/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                    <div className={task.done ? "opacity-50" : ""}>
                      <div className="text-white font-semibold text-sm">{task.name}</div>
                      <div className="text-white/55 text-[11px]">{task.info}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div>
                <SectionLabel>{t.focusLabel}</SectionLabel>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{t.focusTitle}</h2>
                <p className="text-base text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">{t.focusDesc}</p>
                <div className="space-y-3">
                  {t.focusItems.map((item) => (
                    <div key={item.title} className="text-sm">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</span>
                      <span className="text-zinc-500 dark:text-zinc-400 ml-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 8. 我的 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 左侧：文字介绍 */}
            <Reveal>
              <div>
                <SectionLabel>{t.profileLabel}</SectionLabel>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{t.profileTitle}</h2>
                <p className="text-base text-zinc-500 dark:text-zinc-400 mb-6">{t.profileDesc}</p>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">{t.profileExtra}</p>
              </div>
            </Reveal>
            {/* 右侧：Profile 界面展示 */}
            <Reveal delay={100}>
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="p-5 space-y-4">
                  {/* 头像 + 昵称 */}
                  <div className="flex items-center gap-4">
                    <img src={S("default_avatar.png")} alt="" className="w-14 h-14 rounded-full object-cover hover:scale-110 transition-all duration-500" style={{ mixBlendMode: "multiply" }} />
                    <div className="flex-1">
                      <div className="font-bold text-zinc-900 dark:text-white">{t.profileNickname}</div>
                      <div className="text-sm text-zinc-400 mt-0.5">{t.profileBio}</div>
                    </div>
                    <span className="text-xl font-extrabold text-amber-500" style={{ fontFamily: "'Noto Serif SC', serif" }}>Lv.3</span>
                  </div>
                  {/* 统计 */}
                  <div className="flex gap-8 py-3 border-y border-zinc-100 dark:border-zinc-800">
                    {t.profileStats.map((label, i) => (
                      <div key={label}>
                        <div className="text-xl font-bold text-zinc-900 dark:text-white">{[12, 8, "3.2k", 4][i]}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                  {/* 等级条 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t.profileLevelLabel}</span>
                      <span className="text-[11px] text-zinc-400">{t.profileLevelProgress}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                    </div>
                  </div>
                  {/* 功能入口 */}
                  <div className="flex flex-wrap gap-2">
                    {t.profileMenu.map((item, i) => (
                      <span key={item} className={`px-3 py-1.5 rounded-full text-xs font-medium ${i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 10. 安全隐私 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10">
              <SectionLabel>{t.privacyLabel}</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{t.privacyTitle}</h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400">{t.privacyDesc}</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "🎭", title: t.privacyItems[0].title, desc: t.privacyItems[0].desc, bullets: t.privacyDecoyBullets, color: "amber" },
              { icon: "🔐", title: t.privacyItems[1].title, desc: t.privacyItems[1].desc, bullets: t.privacyLockBullets, color: "sky" },
              { icon: "🔒", title: t.privacyItems[2].title, desc: t.privacyItems[2].desc, bullets: t.privacyEncryptBullets, color: "emerald" },
            ].map((item, i) => {
              const colorMap: Record<string, { bg: string; iconBg: string; check: string }> = {
                amber: { bg: "from-amber-50/50 to-white dark:from-amber-950/10 dark:to-zinc-900", iconBg: "bg-amber-100 dark:bg-amber-900/30", check: "text-amber-500" },
                sky: { bg: "from-sky-50/50 to-white dark:from-sky-950/10 dark:to-zinc-900", iconBg: "bg-sky-100 dark:bg-sky-900/30", check: "text-sky-500" },
                emerald: { bg: "from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-zinc-900", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", check: "text-emerald-500" },
              };
              const c = colorMap[item.color];
              return (
              <Reveal key={item.title} delay={80 + i * 40}>
                <div className={`rounded-2xl bg-gradient-to-b ${c.bg} border border-zinc-100 dark:border-zinc-800 overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500`}>
                  <div className="p-6 flex-1">
                    <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-4`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{item.desc}</p>
                    <div className="space-y-1.5">
                      {item.bullets.map((b) => (
                        <div key={b} className="flex items-center gap-2 text-sm text-zinc-500">
                          <svg className={`w-3.5 h-3.5 ${c.check} shrink-0`} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            )})}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ 11. 更多功能 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">{t.otherTitle}</h2>
          </Reveal>
          <Reveal delay={80}>
            <MoreFeatures items={t.otherItems} />
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ═══ 12. 技术栈 ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{t.techTitle}</h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400">{t.techSub}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.techCards.map((group, gi) => (
                <div key={group.cat} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">{group.cat}</h4>
                  <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{group.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((tech, ti) => (
                      <span key={tech} className={`px-2.5 py-1 text-[11px] font-medium rounded-lg ${chipColors[(gi * 3 + ti) % chipColors.length]}`}>{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 13. CTA ═══ */}
      <section className="py-28 md:py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <img src={S("flowdiary-icon.png")} alt="" className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] mb-8 hover:scale-110 hover:rotate-6 transition-all duration-500 shadow-xl" />
              <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-5 tracking-tight" style={{ fontFamily: "'Noto Serif SC', 'Georgia', serif" }}>
                {t.ctaTitle}
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12">{t.ctaDesc}</p>
              <DownloadButtons lang={lang as "zh" | "en"} />
              <p className="text-base text-zinc-400 mt-16">{t.footer}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
