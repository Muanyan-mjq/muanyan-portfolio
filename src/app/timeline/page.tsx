"use client";

import { useLang } from "@/components/language-context";

const translations = {
  zh: {
    section: "时间线",
    title: "时间线",
    events: [
      {
        date: "2025",
        title: "进入湖北理工学院",
        description: "计算机科学与技术（卓越工程师试点班）",
      },
      {
        date: "2026",
        title: "第19届中国大学生计算机设计大赛",
        description: "中南赛区 · 湖北省一等奖",
      },
    ],
  },
  en: {
    section: "Timeline",
    title: "Timeline",
    events: [
      {
        date: "2025",
        title: "Enrolled at Hubei Polytechnic University",
        description: "Computer Science and Technology (Outstanding Engineer Pilot Class)",
      },
      {
        date: "2026",
        title: "19th Chinese Collegiate Computing Design Competition",
        description: "Central-South Division · Hubei Province First Prize",
      },
    ],
  },
};

export default function Timeline() {
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
      <div className="mt-10 relative">
        {/* Vertical line */}
        <div className="absolute left-[39px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-10">
          {t.events.map((event) => (
            <div key={event.date + event.title} className="flex gap-6 relative">
              <div className="w-20 shrink-0 text-right">
                <span className="text-sm font-semibold text-primary">
                  {event.date}
                </span>
              </div>
              <div className="w-3 h-3 rounded-full bg-primary border-4 border-background shadow-sm relative z-10 mt-1" />
              <div className="bg-card rounded-xl p-5 border border-border flex-1">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <p className="text-sm text-muted mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
