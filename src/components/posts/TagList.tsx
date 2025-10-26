import { usePosts } from "@/contexts/PostContext";
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagList({ selectedTag, setSelectedTag }: TagListProps) {
  const { posts } = usePosts();
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button onClick={() => setSelectedTag(null)} className="cursor-pointer">
        <Badge variant={selectedTag === null ? "default" : "outline"}>All</Badge>
      </button>
      {allTags.map(tag => (
        <button key={tag} onClick={() => setSelectedTag(tag)} className="cursor-pointer">
          <Badge variant={selectedTag === tag ? "default" : "outline"}>{tag}</Badge>
        </button>
      ))}
    </div>
  );
}
