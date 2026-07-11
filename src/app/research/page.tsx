"use client";

import Link from "next/link";
import { useLang } from "@/components/language-context";

const translations = {
  zh: {
    section: "研究笔记",
    title: "研究笔记",
    subtitle: "学习笔记与研究记录。",
    empty: "暂无内容",
    qaNotePrefix: "问答记录已移至",
    qaLink: "Q&A 页面",
  },
  en: {
    section: "Research Notes",
    title: "Research Notes",
    subtitle: "Learning notes and research records.",
    empty: "No content yet",
    qaNotePrefix: "Q&A records have been moved to",
    qaLink: "Q&A page",
  },
};

export default function ResearchNotes() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div className="pt-12 pb-24 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-[0.4em]">
              {t.section}
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
            {t.subtitle}
          </p>
        </div>

        <div className="text-center py-20">
          <p className="text-xl text-zinc-500 dark:text-zinc-400">
            {t.empty}
          </p>
          <p className="mt-2 text-zinc-400 dark:text-zinc-500">
            {t.qaNotePrefix} <Link href="/qa" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t.qaLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
