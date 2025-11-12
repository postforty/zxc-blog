"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "Admin")) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {t("loading")}
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "Admin") {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname?.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `block p-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${
      isActive(path) ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold">{t("admin.title")}</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className={navLinkClass("/admin/dashboard")}
              >
                {t("admin.dashboard")}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/posts"
                className={navLinkClass("/admin/posts")}
              >
                {t("admin.posts")}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/comments"
                className={navLinkClass("/admin/comments")}
              >
                {t("admin.comments")}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={navLinkClass("/admin/users")}
              >
                {t("admin.users")}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={navLinkClass("/admin/settings")}
              >
                {t("admin.settings")}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Home className="h-4 w-4" />
            {t("admin.goToBlog")}
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
