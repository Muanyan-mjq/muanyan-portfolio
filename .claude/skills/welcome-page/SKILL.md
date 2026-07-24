---
name: welcome-page
description: Design immersive welcome/landing pages with floating background text, typewriter effect, and polished button interactions. Use when creating or modifying welcome pages, splash screens, or landing pages.
---

This skill captures the design patterns used in blog and project welcome pages, inspired by the travel-space project.

## Core Architecture

欢迎页面由 `WelcomeLayout` 组件提供共享布局，各页面传入自己的内容和背景词。

```
WelcomeLayout (共享)
├── 浮动背景文字（网格分布 + 随机偏移）
├── 左上角座右铭
└── 居中内容区（各页面自定义）
    ├── 小标题（welcome-pre）
    ├── 主标题（welcome-h1 + TypewriterText）
    ├── 英文副标题（welcome-en）
    └── 进入按钮（welcome-btn）
```

## Background Floating Text

背景文字用 JS 动态生成，网格分布 + 轻微随机偏移，既有规律又不死板：

```tsx
// 6列网格均匀分布
const cols = 6;
const rows = Math.ceil(words.length / cols);
const col = i % cols;
const row = Math.floor(i / cols);
const baseX = (col / cols) * 100 + 100 / cols / 2;
const baseY = (row / rows) * 100 + 100 / rows / 2;
span.style.left = `${baseX + (Math.random() - 0.5) * 10}%`;
span.style.top = `${baseY + (Math.random() - 0.5) * 8}%`;
```

CSS 样式：
```css
.bg-texts span {
  position: absolute;
  font-style: italic;
  font-weight: 300;
  color: #2563eb;
  white-space: nowrap;
  animation: float-text 12s ease-in-out infinite;
  user-select: none;
}
@keyframes float-text {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}
```

## Typewriter Effect

`TypewriterText` 组件实现逐字打字 + 闪烁光标：

```tsx
function useTypewriter(text, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, delay]);
  return { displayed, done };
}
```

光标用 `blink` 动画（1秒闪烁），通过 CSS 实现：
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

## Button Design

胶囊按钮，hover 有渐变翻转 + 箭头滑动效果：

```css
.welcome-btn {
  position: relative;
  padding: 18px 56px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
/* hover 时渐变方向翻转 */
.welcome-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  opacity: 0;
  transition: opacity 0.4s;
}
.welcome-btn:hover::before { opacity: 1; }
/* 箭头 hover 右滑 */
.welcome-btn:hover .arrow {
  transform: translateX(6px);
}
```

按钮内容用 `<span>` 包裹确保在 `::before` 之上：
```tsx
<button className="welcome-btn">
  <span>欢 迎 进 入<span className="arrow">→</span></span>
</button>
```

## State Persistence

用 localStorage 持久化进入状态，刷新不回退欢迎页：

```tsx
const [entered, setEntered] = useState(() => {
  if (typeof window !== "undefined") return localStorage.getItem("xxx-entered") === "true";
  return false;
});

// 进入时
onEnter={() => { localStorage.setItem("xxx-entered", "true"); setEntered(true); }}
```

## Background Gradient

与 travel-space 一致的蓝紫渐变背景：
```css
background: linear-gradient(180deg, #dce4ff 0%, #f3f6ff 30%, #fafaf9 60%, #e8eeff 100%) fixed;
```

## Typography

字体：Inter + Noto Sans SC
```css
font-family: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;
```

标题层级：
- 小标题 `.welcome-pre`：13px, letter-spacing: 6px, 蓝色
- 主标题 `.welcome-h1`：64px, font-weight: 800
- 英文副标题 `.welcome-en`：20px, 灰色, font-weight: 300

## Corner Motto

左上角座右铭，衬线字体 + 斜体：
```css
.quote-tl {
  position: fixed;
  top: 36px; left: 40px;
  font-size: 20px;
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-style: italic;
  text-shadow: 0 2px 12px rgba(37, 99, 235, 0.15);
}
```

## Responsive

手机端缩小标题和按钮：
```css
@media (max-width: 768px) {
  .welcome-h1 { font-size: 38px; }
  .welcome-en { font-size: 15px; }
  .welcome-btn { padding: 14px 40px; font-size: 16px; }
}
```
