import { useTags } from "@/hooks/useTags";
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagList({ selectedTag, setSelectedTag }: TagListProps) {
  const { tags, isLoading, error } = useTags();

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button onClick={() => setSelectedTag(null)} className="cursor-pointer">
        <Badge variant={selectedTag === null ? "default" : "outline"}>All</Badge>
      </button>
      {tags.map(tag => (
        <button key={tag.id} onClick={() => setSelectedTag(tag.name)} className="cursor-pointer">
          <Badge variant={selectedTag === tag.name ? "default" : "outline"}>{tag.name}</Badge>
        </button>
      ))}
    </div>
  );
}
