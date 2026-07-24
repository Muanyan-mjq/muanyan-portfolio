"use client";

import { useState, useEffect } from "react";

// 丝滑打字机效果 hook
function useTypewriter(text: string, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      timer = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setDone(true);
        }
      }, speed);
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, speed, delay]);

  return { displayed, done };
}

export function TypewriterText({ text, speed = 80, delay = 0, className = "", cursor = true }: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}) {
  const { displayed, done } = useTypewriter(text, speed, delay);

  // 纯打字效果，带闪烁光标
  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <span className="inline-block w-[2px] h-[0.9em] bg-current ml-0.5 align-middle" style={{ animation: "blink 1s step-end infinite" }} />
      )}
    </span>
  );
}
