"use client";

import { useLang } from "@/components/language-context";

const translations = {
  zh: {
    section: "联系方式",
    title: "联系方式",
    subtitle: "欢迎通过以下方式联系我。",
  },
  en: {
    section: "Contact",
    title: "Contact",
    subtitle: "Feel free to reach out through the following channels.",
  },
};

export default function Contact() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div className="max-w-2xl pt-12 pb-24 px-8 md:px-16 lg:px-24">
      <p className="text-sm font-medium text-primary tracking-wide uppercase">
        {t.section}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
        {t.title}
      </h1>
      <p className="mt-4 text-muted">
        {t.subtitle}
      </p>

      <div className="mt-10 space-y-4">
        <a
          href="https://github.com/Muanyan-mjq"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border card-hover"
        >
          <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              GitHub
            </p>
            <p className="text-sm text-muted mt-0.5">
              github.com/Muanyan-mjq
            </p>
          </div>
          <span className="text-muted group-hover:text-primary transition-colors">→</span>
        </a>

        <a
          href="mailto:muanyan7@gmail.com"
          className="group flex items-center gap-4 bg-card rounded-xl p-5 border border-border card-hover"
        >
          <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Email
            </p>
            <p className="text-sm text-muted mt-0.5">
              muanyan7@gmail.com
            </p>
          </div>
          <span className="text-muted group-hover:text-primary transition-colors">→</span>
        </a>
      </div>
    </div>
  );
}
