import { useVisitorStats } from '@/hooks/useVisitorStats';

export default function VisitorCounter() {
  const stats = useVisitorStats();

  return (
    <div className="text-sm text-muted-foreground flex gap-4">
      <span>오늘 방문자: {stats.dailyVisitors}</span>
      <span>전체 방문자: {stats.totalVisitors}</span>
    </div>
  );
}
