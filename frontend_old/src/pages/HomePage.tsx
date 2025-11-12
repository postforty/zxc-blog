import { useState } from "react";
import { useTranslation } from "react-i18next";
import PostList from "@/components/posts/PostList";
import TagList from "@/components/posts/TagList";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomePage() {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <section>
      <div className="mb-8 max-w-md">
        <Input
          type="text"
          placeholder={t("search_posts")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <TagList selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <PostList selectedTag={selectedTag} searchQuery={debouncedSearchQuery} />
    </section>
  );
}
