"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { CommentProvider } from "../contexts/CommentContext";
import { PostProvider } from "../contexts/PostContext";
import { I18nProvider } from "./i18n-provider"; // Import I18nProvider

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider> {/* Wrap with I18nProvider */}
      <AuthProvider>
        <CommentProvider>
          <PostProvider>
            {children}
          </PostProvider>
        </CommentProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
