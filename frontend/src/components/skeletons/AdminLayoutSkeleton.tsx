import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-4">
          <Skeleton className="h-7 w-32" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="p-4">
                <Skeleton className="h-5 w-full" />
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </main>
    </div>
  );
}
