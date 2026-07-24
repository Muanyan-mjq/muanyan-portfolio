import type { Metadata } from "next";

const siteUrl = "https://muanyan-mjq.github.io/muanyan-portfolio";

export const metadata: Metadata = {
  title: "Contact | Muanyan",
  description:
    "联系方式 — GitHub、Email。欢迎联系我讨论深度学习、生成模型、强化学习等话题。Feel free to reach out about deep learning, generative models, and reinforcement learning.",
  openGraph: {
    title: "Contact | Muanyan",
    description:
      "联系方式 — 欢迎联系我讨论深度学习、生成模型、强化学习等话题。",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact | Muanyan",
    description:
      "联系方式 — 欢迎联系我讨论深度学习、生成模型、强化学习等话题。",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
