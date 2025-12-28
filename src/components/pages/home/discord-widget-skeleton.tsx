import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DiscordWidgetSkeletonProps {
  className?: string;
}

export function DiscordWidgetSkeleton(props: DiscordWidgetSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden pt-0", props.className)}>
      <CardHeader className="relative border-b py-0">
        <div className="relative z-10 mt-5 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32" />
            <div className="mt-2 flex items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto p-3 pr-0">
        <Skeleton className="mb-2 h-3 w-24" />
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
