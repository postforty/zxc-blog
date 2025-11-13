import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <div className="flex items-start gap-2">
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-6 w-16 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-48" />
            <div className="flex justify-between w-full">
              <div className="flex gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
