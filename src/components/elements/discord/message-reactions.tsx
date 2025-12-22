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
            className="border-accent-foreground/10 bg-accent/40 hover:bg-accent/60 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs transition-colors"
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="text-muted-foreground text-[11px] font-medium">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
