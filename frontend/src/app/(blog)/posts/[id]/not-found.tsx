import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-3xl font-bold mb-4">게시글을 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8">
        요청하신 게시글이 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
