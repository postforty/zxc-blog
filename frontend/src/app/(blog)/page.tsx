import { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "ZXCVB Blog - 홈",
  description: "최신 기술 블로그 글과 개발 인사이트를 공유합니다.",
  openGraph: {
    title: "ZXCVB Blog",
    description: "최신 기술 블로그 글과 개발 인사이트를 공유합니다.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
