import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, User, Settings, PlusSquare } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="py-4 border-b mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:no-underline">My Blog</Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/admin"><Settings className="mr-2 h-4 w-4" />Admin</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/editor"><PlusSquare className="mr-2 h-4 w-4" />{t('new_post')}</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ko')}>
                한국어
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
