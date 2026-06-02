"use client";

import Link from "next/link";
import { useLang } from "@/components/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

const navText = {
  zh: {
    links: [
      { href: "/projects", label: "项目" },
      { href: "/blog", label: "博客" },
      { href: "/research", label: "研究" },
      { href: "/qa", label: "问答" },
    ],
  },
  en: {
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/research", label: "Research" },
      { href: "/qa", label: "Q&A" },
    ],
  },
} as const;

export function Navbar() {
  const { lang } = useLang();
  const links = navText[lang].links;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
      <nav className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          Muanyan
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 rounded-xl hover:text-zinc-900 dark:hover:text-white transition-all duration-200 group"
            >
              {link.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
          <div className="ml-2 pl-2 border-l border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
