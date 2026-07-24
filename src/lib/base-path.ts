/**
 * GitHub Pages 部署时的 basePath。
 * 本地开发时为空字符串，生产构建时为 "/muanyan-portfolio"。
 * 用于 <img> 标签等 Next.js 不会自动加 basePath 的硬编码路径。
 */
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/muanyan-portfolio" : "";
