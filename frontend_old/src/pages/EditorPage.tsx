import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePost } from "@/hooks/usePost";
import PostEditor from "@/components/posts/PostEditor";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">{id ? t('edit_post') : t('write_new_post')}</h2>
      <PostEditor post={post} />
    </section>
  );
}
