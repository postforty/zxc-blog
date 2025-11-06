import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, User, Settings, PlusSquare, Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/common/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import zxcvbLogoLight from "@/assets/zxcvb_logo_light.png";
import zxcvbLogoDark from "@/assets/zxcvb_logo_dark.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="py-2 mb-8 border-b">
      <div className="container flex items-center justify-between px-4 mx-auto sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold hover:no-underline">
          <div className="flex items-center gap-2">
            <div className="h-16 overflow-hidden">
              <img
                src={theme === "dark" ? zxcvbLogoDark : zxcvbLogoLight}
                alt="zxcvb blog logo"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="rotate-[-10deg] origin-bottom-left">
              <span className="text-sm">log</span>
            </div>
          </div>
        </Link>
        <div className="items-center hidden gap-4 sm:flex">
          <Button asChild variant="ghost">
            <Link to="/profile">
              <User className="w-4 h-4 mr-2" />
              {t("profile")}
            </Link>
          </Button>
          {!isLoading && user?.role === 'Admin' && (
            <Button asChild variant="ghost">
              <Link to="/admin">
                <Settings className="w-4 h-4 mr-2" />
                {t("admin")}
              </Link>
            </Button>
          )}
          {!isLoading && user?.role === 'Admin' && (
            <Button asChild variant="ghost">
              <Link to="/editor">
                <PlusSquare className="w-4 h-4 mr-2" />
                {t("new_post")}
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("ko")}>
                한국어
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 sm:hidden bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Close menu</span>
          </Button>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="text-2xl"
          >
            {t("profile")}
          </Link>
          {!isLoading && user?.role === 'Admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-2xl"
            >
              {t("admin")}
            </Link>
          )}
          {!isLoading && user?.role === 'Admin' && (
            <Link
              to="/editor"
              onClick={() => setIsOpen(false)}
              className="text-2xl"
            >
              {t("new_post")}
            </Link>
          )}
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                changeLanguage("en");
                setIsOpen(false);
              }}
            >
              English
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                changeLanguage("ko");
                setIsOpen(false);
              }}
            >
              한국어
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
            >
              Light
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
            >
              Dark
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
