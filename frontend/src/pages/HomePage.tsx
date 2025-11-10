import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // Import Helmet
import PostList from "@/components/posts/PostList";
import TagList from "@/components/posts/TagList";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomePage() {
  const { t } = useTranslation();
  const { posts } = useLoaderData() as { posts: any[] }; // Assuming posts is an array of any type
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <section>
      <Helmet>
        <title>{t('home_page_title')}</title>
        <meta name="description" content={t('home_page_description')} />
      </Helmet>
      <div className="mb-8 max-w-md">
        <Input
          type="text"
          placeholder={t("search_posts")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <TagList selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <PostList posts={posts} selectedTag={selectedTag} searchQuery={debouncedSearchQuery} />
    </section>
  );
}
