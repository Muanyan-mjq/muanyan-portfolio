import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // GitHub Pages 静态导出配置
  output: "export",
  // 项目站点路径：https://muanyan-mjq.github.io/muanyan-portfolio/
  basePath: isProduction ? "/muanyan-portfolio" : "",
  // 静态资源（图片等）也加上 basePath
  assetPrefix: isProduction ? "/muanyan-portfolio" : "",
  // 禁止 Next.js 优化图片（静态导出不支持）
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
