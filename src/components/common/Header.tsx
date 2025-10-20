import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="py-4 border-b mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:no-underline">My Blog</Link>
        <div className="flex items-center gap-4">
          <Link to="/editor" className="text-sm font-medium hover:underline">새 글 작성</Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
