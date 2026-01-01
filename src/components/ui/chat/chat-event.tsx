import { cn } from "@/lib/utils";

export function ChatEvent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2 px-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventAddon({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-1 w-10 shrink-0 @md/chat:w-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatEventBody({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-1 flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-sm @md/chat:text-base", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatEventTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm font-medium @md/chat:text-base", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatEventDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-muted-foreground text-xs", className)} {...props}>
      {children}
    </div>
  );
}
