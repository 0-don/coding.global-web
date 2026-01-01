import { cn } from "@/lib/utils";

export function Chat({
  children,
  className,
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/chat flex h-full flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
