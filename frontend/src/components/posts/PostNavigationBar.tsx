import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";

interface PostNavigationBarProps {
  prevPost?: Post;
  nextPost?: Post;
}

export default function PostNavigationBar({ prevPost, nextPost }: PostNavigationBarProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ko') ? 'ko' : 'en';

  return (
    <div className="flex justify-between my-8 gap-4">
      {nextPost ? (
        <Link to={`/posts/${nextPost.id}`} className="w-1/2">
          <Button variant="outline" className="w-full h-full">
            <div className="truncate">
              <div>다음 글</div>
              <div className="text-lg font-semibold truncate">{nextPost.title[lang] || nextPost.title.ko}</div>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="w-1/2" />
      )}
      {prevPost ? (
        <Link to={`/posts/${prevPost.id}`} className="w-1/2">
          <Button variant="outline" className="w-full h-full">
            <div className="truncate">
              <div>이전 글</div>
              <div className="text-lg font-semibold truncate">{prevPost.title[lang] || prevPost.title.ko}</div>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="w-1/2" />
      )}
    </div>
  );
}
