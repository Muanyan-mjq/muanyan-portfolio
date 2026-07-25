import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";
import { HtmlLangSync } from "@/components/html-lang-sync";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

// KaTeX 数学公式样式
const katexCSS = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://muanyan-mjq.github.io/muanyan-portfolio";

export const metadata: Metadata = {
  title: "Muanyan | AI Engineering & Research",
  description:
    "马佳祺 - AI Engineering & Research Portfolio. CS student focused on generative models (VAE) and reinforcement learning (Q-Learning).",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Muanyan | AI Engineering & Research",
    description:
      "马佳祺 - AI Engineering & Research Portfolio. CS student focused on generative models (VAE) and reinforcement learning (Q-Learning).",
    url: siteUrl,
    siteName: "Muanyan Portfolio",
    images: [
      {
        url: `${siteUrl}/avatar.png`,
        width: 256,
        height: 256,
        alt: "Muanyan Avatar",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Muanyan | AI Engineering & Research",
    description:
      "马佳祺 - AI Engineering & Research Portfolio. CS student focused on generative models (VAE) and reinforcement learning (Q-Learning).",
    images: [`${siteUrl}/avatar.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={katexCSS} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@200;300;400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <ThemeProvider>
          <LanguageProvider>
            <HtmlLangSync />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
