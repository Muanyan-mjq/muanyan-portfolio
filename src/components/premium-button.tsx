"use client";

import { useState } from "react";

// 高级按钮组件 - 带涟漪效果
export function PremiumButton({ onClick, children, className = "", style }: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
    onClick();
  };

  return (
    <button onClick={handleClick} className={`relative overflow-hidden group ${className}`} style={style}>
      {/* 光晕效果 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: style?.background || 'linear-gradient(to right, #3A5BFF, #7D3CFF)' }} />
      {/* 涟漪 */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute bg-white/20 rounded-full animate-ping"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
