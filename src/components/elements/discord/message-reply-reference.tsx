import { Badge } from "@/components/ui/badge";
import { GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItemReference } from "@/openapi";
import { Reply } from "lucide-react";

interface ReferencedMessageData {
  id: string;
  author?: {
    displayName?: string | null;
    username?: string;
  };
  content?: string;
  createdAt: string;
  isParentThread: boolean;
}

interface MessageReplyReferenceProps {
  reference: GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItemReference;
  referencedMessage: ReferencedMessageData | undefined;
  onClickReference?: (messageId: string, isParentThread: boolean) => void;
}

export function MessageReplyReference({
  reference,
  referencedMessage,
  onClickReference,
}: MessageReplyReferenceProps) {
  if (!reference || !referencedMessage) {
    return (
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Reply className="h-3 w-3" />
        <span className="italic">Message not found</span>
      </div>
    );
  }

  const authorName =
    referencedMessage.author?.displayName ||
    referencedMessage.author?.username ||
    "Unknown User";
  const truncatedContent = referencedMessage.content?.slice(0, 50) || "";
  const contentPreview =
    truncatedContent.length === 50
      ? truncatedContent + "..."
      : truncatedContent;

  const handleClick = () => {
    if (onClickReference) {
      onClickReference(referencedMessage.id, referencedMessage.isParentThread);
    }
  };

  return (
    <div
      className="mb-1 flex cursor-pointer items-start gap-2 border-l-2 border-muted-foreground/30 pl-1 transition-colors hover:border-muted-foreground/50 hover:bg-accent/30"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Reply className="mt-0.5 h-3 w-3 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-muted-foreground/80">
            {authorName}
          </span>
          {referencedMessage.isParentThread && (
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              Original Post
            </Badge>
          )}
        </div>
        <div className="truncate text-xs text-muted-foreground/70">
          {contentPreview || <em>No content</em>}
        </div>
      </div>
    </div>
  );
}
