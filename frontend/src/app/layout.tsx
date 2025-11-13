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
  title: "ZXCVB Blog",
  description: "A modern blog built with Next.js and React 19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
