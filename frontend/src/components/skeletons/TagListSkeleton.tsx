import { Skeleton } from "@/components/ui/skeleton";

export default function TagListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20" />
      ))}
    </div>
  );
}
