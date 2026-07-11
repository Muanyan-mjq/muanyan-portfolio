"use client";

import { useLang } from "@/components/language-context";

const translations = {
  zh: {
    name: "马佳祺",
    nameEn: "Muanyan",
    section: "关于",
    education: "教育背景",
    school: "学校",
    schoolName: "湖北理工学院",
    major: "专业",
    majorName: "计算机科学与技术（卓越工程师试点班）",
    graduationYear: "毕业年份",
    graduationYearValue: "2029",
    skills: "技能",
    awards: "获奖经历",
    awardName: "第19届中国大学生计算机设计大赛",
    awardDetail: "2026 · 中南赛区 · 湖北省一等奖",
  },
  en: {
    name: "Ma Jiaqi",
    nameEn: "Muanyan",
    section: "About",
    education: "Education",
    school: "School",
    schoolName: "Hubei Polytechnic University",
    major: "Major",
    majorName: "Computer Science and Technology (Outstanding Engineer Pilot Class)",
    graduationYear: "Graduation",
    graduationYearValue: "2029",
    skills: "Skills",
    awards: "Awards",
    awardName: "19th Chinese Collegiate Computing Design Competition",
    awardDetail: "2026 · Central-South Division · Hubei Province First Prize",
  },
};

export default function About() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div className="max-w-2xl space-y-12 pt-12 pb-24 px-8 md:px-16 lg:px-24">
      <div>
        <p className="text-sm font-medium text-primary tracking-wide uppercase">
          {t.section}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          {t.name}
        </h1>
        <p className="mt-2 text-lg text-muted font-light">{t.nameEn}</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t.education}
        </h2>
        <div className="mt-4 bg-card rounded-xl p-6 space-y-3">
          <div className="flex items-baseline gap-4">
            <dt className="text-sm text-muted w-24 shrink-0">{t.school}</dt>
            <dd className="font-medium">{t.schoolName}</dd>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-baseline gap-4">
            <dt className="text-sm text-muted w-24 shrink-0">{t.major}</dt>
            <dd className="font-medium">{t.majorName}</dd>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-baseline gap-4">
            <dt className="text-sm text-muted w-24 shrink-0">{t.graduationYear}</dt>
            <dd className="font-medium">{t.graduationYearValue}</dd>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t.skills}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Python",
            "C",
            "C++",
            "HTML",
            "CSS",
            "Flask",
            "PyTorch",
            "VAE",
            "AI Agent",
            "Ollama",
            "Git",
            "Linux",
            "OpenCode",
          ].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 text-sm font-medium bg-card text-foreground rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t.awards}
        </h2>
        <div className="mt-4 bg-card rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary text-sm">★</span>
            </div>
            <div>
              <p className="font-medium">{t.awardName}</p>
              <p className="text-sm text-muted mt-1">
                {t.awardDetail}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
