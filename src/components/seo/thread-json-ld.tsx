import { buildDiscussionForumPostingSchema } from "@/lib/structured-data";
import {
  GetApiByGuildIdThreadByThreadTypeByThreadId200,
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem,
} from "@/openapi";

interface ThreadJsonLdProps {
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200;
  messages: GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem[];
  pageUrl: string;
}

export function ThreadJsonLd(props: ThreadJsonLdProps) {
  const data = buildDiscussionForumPostingSchema(
    props.thread,
    props.messages,
    props.pageUrl,
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
