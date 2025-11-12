"use client";

import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { usePost } from "../../../hooks/usePost";
import PostEditor from "../../../components/posts/PostEditor";

export default function EditorPageClient() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;
  const { post, isLoading, error } = usePost(id);

  if (id && isLoading) {
    return <div>Loading post...</div>;
  }

  if (id && error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">
        {id ? t("edit_post") : t("write_new_post")}
      </h2>
      <PostEditor post={post} />
    </section>
  );
}
