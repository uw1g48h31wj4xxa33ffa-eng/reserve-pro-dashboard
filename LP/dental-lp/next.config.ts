import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackがワークスペースのルートを誤認識してVercelで404になるのを防ぐ
  experimental: {
    // 構成によっては turbopack: { root: '.' } などを指定
  },
};

export default nextConfig;
