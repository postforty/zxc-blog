"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        console.error("Authentication error:", error);
        router.replace("/login?error=" + error);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // 사용자 정보 로드 및 토큰 저장
          await login(accessToken, refreshToken);

          // 홈으로 리다이렉트
          router.replace("/");
        } catch (error) {
          console.error("Failed to process authentication:", error);
          router.replace("/login?error=processing_failed");
        }
      } else {
        router.replace("/login?error=missing_tokens");
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          로그인 처리 중...
        </p>
      </div>
    </div>
  );
}
