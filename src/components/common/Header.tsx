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
import zxcvbLogo from "@/assets/zxcvb_logo_t.png";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="py-2 border-b mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:no-underline">
          <div className="flex items-center gap-2">
            <div className="h-16 overflow-hidden">
              <img
                src={zxcvbLogo}
                alt="zxcvb blog logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="rotate-[-10deg] origin-bottom-left"><span className="text-sm">log</span></div>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/editor">
              <PlusSquare className="mr-2 h-4 w-4" />
              {t("new_post")}
            </Link>
          </Button>
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
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="text-2xl">Profile</Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="text-2xl">Admin</Link>
          <Link to="/editor" onClick={() => setIsOpen(false)} className="text-2xl">{t("new_post")}</Link>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => { changeLanguage('en'); setIsOpen(false); }}>English</Button>
            <Button variant="ghost" onClick={() => { changeLanguage('ko'); setIsOpen(false); }}>한국어</Button>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => { setTheme('light'); setIsOpen(false); }}>Light</Button>
            <Button variant="ghost" onClick={() => { setTheme('dark'); setIsOpen(false); }}>Dark</Button>
          </div>
        </div>
      )}
    </header>
  );
}
