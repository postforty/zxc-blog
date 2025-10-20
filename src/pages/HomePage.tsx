import PostList from "@/components/posts/PostList";

export default function HomePage() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Posts</h2>
      <PostList />
    </section>
  );
}
