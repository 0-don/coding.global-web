import { Skeleton } from "@/components/ui/skeleton";
import { ImNewspaper } from "react-icons/im";

interface NewsSkeletonProps {
  title: string;
}

export function NewsSkeleton({ title }: NewsSkeletonProps) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <ImNewspaper className="text-3xl" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
