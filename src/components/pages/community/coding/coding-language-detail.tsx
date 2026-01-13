"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useThreadMessagesInfiniteQuery,
  useThreadQuery,
} from "@/hook/bot-hook";
import { useRouter } from "@/i18n/navigation";
import { ProgrammingThreadType } from "@/lib/types";
import { useTranslations } from "next-intl";
import { FiHome } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

interface CodingLanguageDetailProps {
  threadType: ProgrammingThreadType;
  threadId: string;
}

export function CodingLanguageDetail(props: CodingLanguageDetailProps) {
  const t = useTranslations();
  const router = useRouter();
  const boardThread = useThreadQuery(props.threadType, props.threadId);
  const boardThreadMessages = useThreadMessagesInfiniteQuery(
    props.threadType,
    props.threadId,
  );

  const thread = boardThread.data;
  const messages =
    boardThreadMessages.data?.pages.flatMap((page) => page?.messages ?? []) ??
    [];

  if (!thread) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <LuSearch className="text-muted-foreground h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-semibold">
              {t("CODING.EMPTY.THREAD_NOT_FOUND")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              {t("CODING.EMPTY.THREAD_NOT_FOUND_DESCRIPTION")}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                {t("MAIN.ACTIONS.GO_BACK")}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <FiHome className="h-4 w-4" />
                {t("MAIN.ACTIONS.GO_HOME")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <ThreadHeader thread={thread} />
      <ThreadReplies
        messages={messages}
        parentThread={thread}
        hasNextPage={boardThreadMessages.hasNextPage}
        isFetchingNextPage={boardThreadMessages.isFetchingNextPage}
        fetchNextPage={boardThreadMessages.fetchNextPage}
      />
    </div>
  );
}
