"use client";

import { useEffect } from "react";
import { useLang } from "@/components/language-context";

/**
 * 同步 <html lang> 属性到当前语言，确保无障碍和 SEO 正确。
 * 在 LanguageProvider 内部使用。
 */
export function HtmlLangSync() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
