import { useParams } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";
import PostEditor from "@/components/posts/PostEditor";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { posts } = usePosts();
  const postToEdit = id ? posts.find((p) => p.id === id) : undefined;

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{id ? '게시물 수정' : '새 게시물 작성'}</h2>
      <PostEditor post={postToEdit} />
    </section>
  );
}
