import type { Metadata } from "next";

const siteUrl = "https://muanyan-mjq.github.io/muanyan-portfolio";

export const metadata: Metadata = {
  title: "Projects | Muanyan",
  description:
    "个人项目与实验作品 — VAE 原理学习与可视化、彩色图像优化、Flask 智能课表助手。Personal projects including VAE visualization, color image optimization, and Flask smart timetable.",
  openGraph: {
    title: "Projects | Muanyan",
    description:
      "个人项目与实验作品 — VAE 原理学习与可视化、彩色图像优化、Flask 智能课表助手。",
    url: `${siteUrl}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Projects | Muanyan",
    description:
      "个人项目与实验作品 — VAE 原理学习与可视化、彩色图像优化、Flask 智能课表助手。",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
