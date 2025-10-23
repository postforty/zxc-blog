import { usePosts } from "@/contexts/PostContext";
import { Button } from "@/components/ui/button";

interface TagListProps {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagList({ selectedTag, setSelectedTag }: TagListProps) {
  const { posts } = usePosts();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={selectedTag === null ? "default" : "outline"}
        onClick={() => setSelectedTag(null)}
      >
        All
      </Button>
      {allTags.map(tag => (
        <Button
          key={tag}
          variant={selectedTag === tag ? "default" : "outline"}
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
