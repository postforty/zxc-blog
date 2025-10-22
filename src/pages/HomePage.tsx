import { useTranslation } from "react-i18next";
import PostList from "@/components/posts/PostList";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{t('posts_heading')}</h2>
      <PostList />
    </section>
  );
}
