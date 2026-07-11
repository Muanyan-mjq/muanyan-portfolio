"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/components/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { BASE_PATH } from "@/lib/base-path";

const navText = {
  zh: {
    links: [
      { href: "/projects", label: "项目", key: "projects-entered" },
      { href: "/blog", label: "博客", key: "blog-entered" },
      { href: "/research", label: "研究" },
      { href: "/qa", label: "问答" },
    ],
  },
  en: {
    links: [
      { href: "/projects", label: "Projects", key: "projects-entered" },
      { href: "/blog", label: "Blog", key: "blog-entered" },
      { href: "/research", label: "Research" },
      { href: "/qa", label: "Q&A" },
    ],
  },
} as const;

export function Navbar() {
  const { lang } = useLang();
  const links = navText[lang].links;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-4 md:py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          <Image
            src={`${BASE_PATH}/avatar.png`}
            alt="avatar"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm object-cover"
          />
          Muanyan
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { if ("key" in link) sessionStorage.removeItem(link.key); }}
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

        {/* Mobile hamburger + toggles */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-1 w-10 h-10 flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => { setMenuOpen(false); if ("key" in link) sessionStorage.removeItem(link.key); }}
                className="block px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 rounded-xl hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
