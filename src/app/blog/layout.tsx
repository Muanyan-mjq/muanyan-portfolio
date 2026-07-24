import type { Metadata } from "next";

const siteUrl = "https://muanyan-mjq.github.io/muanyan-portfolio";

export const metadata: Metadata = {
  title: "Blog | Muanyan",
  description:
    "技术博客与学习笔记 — VAE 学习系列、深度学习、生成模型等研究笔记。Tech blog and learning notes on VAE, deep learning, and generative models.",
  openGraph: {
    title: "Blog | Muanyan",
    description:
      "技术博客与学习笔记 — VAE 学习系列、深度学习、生成模型等研究笔记。",
    url: `${siteUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Muanyan",
    description:
      "技术博客与学习笔记 — VAE 学习系列、深度学习、生成模型等研究笔记。",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
