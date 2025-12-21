import { GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItemReactionsItem } from "@/openapi";

interface MessageReactionsProps {
  reactions: GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItemReactionsItem[];
}

export function MessageReactions({ reactions }: MessageReactionsProps) {
  if (!reactions || reactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {reactions.map((reaction, idx) => {
        const emoji = reaction.emoji.name || "";
        const count = reaction.count;

        return (
          <div
            key={idx}
            className="inline-flex items-center gap-1 rounded-md border border-accent-foreground/10 bg-accent/40 px-1.5 py-0.5 text-xs transition-colors hover:bg-accent/60"
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
