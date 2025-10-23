import { useState } from "react";
import { useTranslation } from "react-i18next";
import PostList from "@/components/posts/PostList";
import TagList from "@/components/posts/TagList";

export default function HomePage() {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{t('posts_heading')}</h2>
      <TagList selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <PostList selectedTag={selectedTag} />
    </section>
  );
}
