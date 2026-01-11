import { Badge } from "@/components/ui/badge";
import {
  GetApiByGuildIdNews200Item,
  GetApiByGuildIdNews200ItemReference,
} from "@/openapi";
import { Reply } from "lucide-react";
import { useTranslations } from "next-intl";

export type ReferencedMessageData = Pick<
  GetApiByGuildIdNews200Item,
  "id" | "author" | "content" | "createdAt"
> & {
  isParentThread: boolean;
};

interface MessageReplyReferenceProps {
  reference: GetApiByGuildIdNews200ItemReference;
  referencedMessage: ReferencedMessageData | undefined;
  onClickReference?: (messageId: string, isParentThread: boolean) => void;
}

export function MessageReplyReference({
  reference,
  referencedMessage,
  onClickReference,
}: MessageReplyReferenceProps) {
  const t = useTranslations();

  if (!reference || !referencedMessage) {
    return (
      <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
        <Reply className="h-3 w-3" />
        <span className="italic">
          {t("SHOWCASE.MESSAGE_REPLY.MESSAGE_NOT_FOUND")}
        </span>
      </div>
    );
  }

  const authorName =
    referencedMessage.author?.displayName ||
    referencedMessage.author?.username ||
    t("SHOWCASE.MESSAGE_REPLY.UNKNOWN_USER");
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
      className="border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-accent/30 mb-1 flex cursor-pointer items-start gap-2 border-l-2 pl-1 transition-colors"
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
      <Reply className="text-muted-foreground/60 mt-0.5 h-3 w-3" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground/80 text-xs font-medium">
            {authorName}
          </span>
          {referencedMessage.isParentThread && (
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              {t("SHOWCASE.MESSAGE_REPLY.ORIGINAL_POST")}
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground/70 truncate text-xs">
          {contentPreview || <em>{t("SHOWCASE.MESSAGE_REPLY.NO_CONTENT")}</em>}
        </div>
      </div>
    </div>
  );
}
