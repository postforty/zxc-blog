import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePosts } from "@/contexts/PostContext";
import PostEditor from "@/components/posts/PostEditor";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { posts } = usePosts();
  const postToEdit = id ? posts.find((p) => p.id === id) : undefined;

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{id ? t('edit_post') : t('write_new_post')}</h2>
      <PostEditor post={postToEdit} />
    </section>
  );
}
