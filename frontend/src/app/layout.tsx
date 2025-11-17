import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ScrollToTopBottom from "../components/common/ScrollToTopBottom";
import { ThemeProvider } from "../components/common/theme-provider";
import { Providers } from "./providers"; // Import Providers

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ZXCVB Blog",
    template: "%s | ZXCVB Blog",
  },
  description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  keywords: ["블로그", "개발", "기술", "Next.js", "React"],
  authors: [{ name: "ZXCVB" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://zxcvb-blog.com",
    siteName: "ZXCVB Blog",
    title: "ZXCVB Blog",
    description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZXCVB Blog",
    description: "Next.js와 React 19로 구축된 현대적인 기술 블로그",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
