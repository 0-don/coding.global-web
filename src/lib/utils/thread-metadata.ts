import { getPageMetadata } from "@/lib/config/metadata";
import { rpc } from "@/lib/rpc";
import {
  GetApiByGuildIdBoardByBoardType200ItemBoardType as ApiBoardType,
  GetApiByGuildIdBoardByBoardTypeByThreadId200,
} from "@/openapi";
import { BoardType, MarketplaceBoardType } from "@/lib/types";

type ThreadResult = {
  thread: GetApiByGuildIdBoardByBoardTypeByThreadId200;
  boardType: MarketplaceBoardType;
} | null;

export async function getThread(
  threadId: string,
  boardType: BoardType,
): Promise<GetApiByGuildIdBoardByBoardTypeByThreadId200 | null> {
  try {
    const response = await rpc.api.bot.board({ boardType })({ threadId }).get();
    if (response.status === 200) {
      return response.data;
    }
  } catch {
    // Fall back to default metadata
  }
  return null;
}

export async function detectThreadWithType(
  threadId: string,
): Promise<ThreadResult> {
  const results = await Promise.all([
    rpc.api.bot
      .board({ boardType: "job-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, boardType: "job-board" as const }
          : null,
      )
      .catch(() => null),
    rpc.api.bot
      .board({ boardType: "dev-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, boardType: "dev-board" as const }
          : null,
      )
      .catch(() => null),
  ]);

  return results.find((r) => r !== null) ?? null;
}

type MetadataKeys = {
  title: string;
  description: string;
  keywords: string;
};

export async function getThreadPageMetadata(
  thread: GetApiByGuildIdBoardByBoardTypeByThreadId200 | null,
  locale: string,
  fallback: MetadataKeys,
) {
  if (thread) {
    const tagNames = thread.tags?.map((tag) => tag.name).join(", ") || "";
    const keywords = tagNames
      ? `${tagNames}, ${fallback.keywords}`
      : fallback.keywords;

    return getPageMetadata({
      locale,
      title: `${thread.name} - Coding Global`,
      description: thread.name || fallback.description,
      keywords,
    });
  }

  return getPageMetadata({
    locale,
    title: fallback.title,
    description: fallback.description,
    keywords: fallback.keywords,
  });
}
