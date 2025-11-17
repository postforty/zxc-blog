import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 프로덕션에서 소스맵 제거 (보안 강화)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
