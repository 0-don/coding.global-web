import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DiscordWidgetSkeletonProps {
  className?: string;
}

export function DiscordWidgetSkeleton({
  className,
}: DiscordWidgetSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32" />
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Separator orientation="vertical" className="h-3" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto p-3">
        <Skeleton className="mb-2 h-4 w-24" />
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-md px-2 py-2"
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
