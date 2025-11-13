import { useTags } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";
import TagListSkeleton from "@/components/skeletons/TagListSkeleton";
import { useTranslation } from "react-i18next";

interface TagListProps {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagList({ selectedTag, setSelectedTag }: TagListProps) {
  const { tags, isLoading, error } = useTags();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ko") ? "ko" : "en";

  if (isLoading) {
    return <TagListSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter tags that have content in the current language
  const filteredTags = tags.filter((tag) => {
    const tagName = typeof tag.name === "object" ? tag.name[lang] : tag.name;
    return tagName && tagName.trim() !== "";
  });

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button onClick={() => setSelectedTag(null)} className="cursor-pointer">
        <Badge variant={selectedTag === null ? "default" : "outline"}>
          All
        </Badge>
      </button>
      {filteredTags.map((tag) => {
        const tagName =
          typeof tag.name === "object" ? tag.name[lang] : tag.name;
        return (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tagName)}
            className="cursor-pointer"
          >
            <Badge variant={selectedTag === tagName ? "default" : "outline"}>
              {tagName}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
