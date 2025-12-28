import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiTeamFill } from "react-icons/ri";

interface TeamSkeletonProps {
  title: string;
}

export function TeamSkeleton({ title }: TeamSkeletonProps) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <RiTeamFill className="text-3xl" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="gap-0 p-0">
              <Skeleton className="h-48 w-full rounded-t-xl" />
              <div className="space-y-2 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
