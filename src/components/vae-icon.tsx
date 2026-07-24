"use client";

import { BASE_PATH } from "@/lib/base-path";

interface VAEIconProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  rounded?: boolean;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
  "2xl": "w-36 h-36",
};

/**
 * VAE 专用图标组件
 * 使用 public/vae-images/vae-icon.png
 */
export function VAEIcon({ size = "md", className = "", rounded = true }: VAEIconProps) {
  return (
    <img
      src={`${BASE_PATH}/vae-images/vae-icon.png`}
      alt="VAE"
      className={`${sizeMap[size]} object-contain group-hover:scale-110 transition-transform duration-500 ${
        rounded ? "rounded-xl" : ""
      } ${className}`}
    />
  );
}
