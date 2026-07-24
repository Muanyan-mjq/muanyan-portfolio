import type { Metadata } from "next";

const siteUrl = "https://muanyan-mjq.github.io/muanyan-portfolio";

export const metadata: Metadata = {
  title: "About | Muanyan",
  description:
    "马佳祺 — 湖北理工学院计算机科学与技术专业学生，专注于生成模型与强化学习研究。CS student at Hubei Polytechnic University, focused on generative models and reinforcement learning.",
  openGraph: {
    title: "About | Muanyan",
    description:
      "马佳祺 — 湖北理工学院计算机科学与技术专业学生，专注于生成模型与强化学习研究。",
    url: `${siteUrl}/about`,
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "About | Muanyan",
    description:
      "马佳祺 — 湖北理工学院计算机科学与技术专业学生，专注于生成模型与强化学习研究。",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
