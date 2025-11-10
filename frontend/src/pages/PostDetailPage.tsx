import { useLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async"; // Import Helmet
import PostView from "@/components/posts/PostView";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import PostNavigationBar from "@/components/posts/PostNavigationBar";

export default function PostDetailPage() {
  const { t } = useTranslation();
  const { post } = useLoaderData() as { post: any }; // Assuming post is of any type

  if (!post) {
    return <div>{t('post_not_found')}</div>;
  }

  // TODO: Implement logic for prevPost and nextPost based on fetched post data
  const prevPost = undefined;
  const nextPost = undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title.ko,
    "description": post.content.ko.substring(0, 150),
    "image": post.thumbnail || "https://example.com/default-image.jpg", // Replace with actual thumbnail or default
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.username // Assuming author has a username
    },
    "publisher": {
      "@type": "Organization",
      "name": t('blog_name'),
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png" // Replace with actual blog logo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://example.com/posts/${post.id}` // Replace with actual domain
    }
  };

  return (
    <div>
      <Helmet>
        <title>{post.title.ko} | {t('blog_name')}</title>
        <meta name="description" content={post.content.ko.substring(0, 150)} />
        {/* Add Open Graph tags for social media sharing */}
        <meta property="og:title" content={post.title.ko} />
        <meta property="og:description" content={post.content.ko.substring(0, 150)} />
        <meta property="og:type" content="article" />
        {/* Add canonical URL */}
        <link rel="canonical" href={`/posts/${post.id}`} />
        {/* Add JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <PostView post={post} />
      <PostNavigationBar prevPost={prevPost} nextPost={nextPost} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} />
    </div>
  );
}