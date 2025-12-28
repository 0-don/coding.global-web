import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { IconType } from "react-icons/lib";

interface BoardListSkeletonProps {
  title: string;
  icon: IconType;
  itemCount?: number;
}

export function BoardListSkeleton({
  title,
  icon: Icon,
  itemCount = 6,
}: BoardListSkeletonProps) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <Icon className="text-3xl" />
          <h1 className="text-3xl font-bold">
            {title}
            <span className="text-muted-foreground ml-2 text-lg font-normal">
              <Skeleton className="inline-block h-5 w-8" />
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Search Input */}
      <div className="pb-6">
        <Input type="text" disabled placeholder="" className="opacity-50" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4">
      {/* Header with avatar and title */}
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Tags */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
