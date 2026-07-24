---
name: blog-design
description: Design and write technical blog articles with polished layout, clear typography, and professional code presentation. Use when creating or modifying blog posts, article layouts, or content styling in Next.js projects.
---

This skill guides the design and writing of technical blog articles with focus on readability, visual hierarchy, and professional presentation.

## Article Layout

### Paper Effect
文章区域使用纸张效果，让内容像写在纸上：
```tsx
<div className="blog-content prose prose-xl prose-zinc dark:prose-invert max-w-none
  bg-white dark:bg-zinc-900
  rounded-2xl
  shadow-[0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)]
  border border-zinc-100 dark:border-zinc-800/50
  px-10 py-12 md:px-14 md:py-16">
```

### Typography
- 正文：`text-[19px] leading-[1.9]`，颜色 `text-zinc-700 dark:text-zinc-300`
- h2 大标题：`text-4xl`，左侧紫色渐变竖条装饰，底部 2px 分隔线
- h3 小标题：`text-[22px]`，左侧紫色圆点 + 淡紫色背景
- 重点内容：用 `<strong>` 标签，颜色 `prose-strong:text-indigo-700 dark:prose-strong:text-indigo-300 prose-strong:font-bold`

### Title Styling (CSS)
```css
.blog-content h2 {
  position: relative;
  padding-left: 1rem;
}
.blog-content h2::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 6px;
  background: linear-gradient(to bottom, #6366f1, #a855f7);
  border-radius: 3px;
}
.blog-content h3 {
  position: relative;
  padding-left: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.05), transparent);
  border-radius: 0 8px 8px 0;
}
.blog-content h3::before {
  content: "";
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 10px; height: 10px;
  background: #6366f1;
  border-radius: 50%;
}
```

## Code Blocks

代码块跟随系统明暗主题切换：
- 暗色模式：深色背景 `#282c34` + `one-dark-pro` 语法高亮
- 亮色模式：纯白背景 + `github-light` 语法高亮

顶部栏有三个彩色圆点（macOS 风格）和语言标签。

## Math Formulas

数学公式使用 KaTeX 渲染，带渐变背景让它更显眼：
```tsx
<div className="my-8 py-6 px-8 
  bg-gradient-to-r from-indigo-50 to-purple-50 
  dark:from-indigo-950/30 dark:to-purple-950/30 
  rounded-xl border border-indigo-200/50 dark:border-indigo-800/30"
  style={{ fontSize: '1.3em' }}>
```

## Collapsible Cards

可折叠卡片用于局限性、扩展内容等，使用 grid-template-rows 实现丝滑动画：
```tsx
function CollapsibleCard({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900/50">
        <span className="text-lg font-semibold">{title}</span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}>...</svg>
      </button>
      <div style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        opacity: isOpen ? 1 : 0,
        transition: "grid-template-rows 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease-out",
      }}>
        <div style={{ overflow: "hidden" }}>
          <div className="p-5 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

> ⚠️ 不要用 `max-h-[2000px]` 方案，动画时长与实际内容高度不匹配，展开/折叠会有延迟感。`grid-template-rows: 0fr→1fr` 精确匹配内容高度。

## Content Cards (Info Boxes)

深入理解等补充内容使用统一的灰色卡片：
```tsx
<div className="mt-8 mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
  <p className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">标题</p>
  <p className="text-[19px] leading-[1.9] text-zinc-800 dark:text-zinc-200">内容</p>
</div>
```

## Next Steps Cards

下一步学习方向使用 2x2 网格卡片，hover 有动画效果：
```tsx
<div className="grid md:grid-cols-2 gap-4">
  {items.map((item) => (
    <Link className="group p-5 rounded-xl border hover:border-indigo-400 
      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <span className="text-3xl group-hover:scale-110">{icon}</span>
      <h4 className="font-bold group-hover:text-indigo-600">{title}</h4>
      <p className="text-sm text-zinc-600">{desc}</p>
    </Link>
  ))}
</div>
```

## References Section

参考资源使用独立卡片，每个有图标：
```tsx
<a className="flex items-center gap-4 p-4 rounded-xl border 
  hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all">
  <span className="text-2xl">{icon}</span>
  <div>
    <p className="font-semibold group-hover:text-indigo-600">{title}</p>
    <p className="text-sm text-zinc-500">{desc}</p>
  </div>
</a>
```

## Writing Style

### Blog vs Q&A
博客文章用流畅的叙述风格，不要用问答格式：
- ❌ "为什么需要归一化？因为..."
- ✅ "归一化的必要性在于..."

### Bold Key Concepts
重点内容必须加粗，使用 `<strong>` 标签。注意：如果文字内容包含 HTML 标签，必须用 `dangerouslySetInnerHTML` 渲染，否则标签会显示为纯文本。

### Image Placement
图片紧跟相关的说明文字，不要堆在一起：
- Loss 曲线图 → 损失函数章节开头
- 重建对比图 → 训练过程章节开头
- 生成样本图 → 训练结果章节

## TOC (Table of Contents)

目录使用 IntersectionObserver 高亮当前标题：
```tsx
const observer = new IntersectionObserver(callback, {
  rootMargin: "-60px 0px -70% 0px",
  threshold: 0
});
```
