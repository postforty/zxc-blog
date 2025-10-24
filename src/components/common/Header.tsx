import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";

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
          <Button onClick={() => changeLanguage('en')}>English</Button>
          <Button onClick={() => changeLanguage('ko')}>한국어</Button>
          <Button asChild variant="ghost">
            <Link to="/profile">Profile</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/admin">Admin</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/editor">{t('new_post')}</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
