import { commentInsertSchema, Comments } from "@/lib/db/comment-db-schema";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { COMMENTS_KEY } from "~/utils/cache/keys";
import { handleError } from "~/utils/client";

export function useCommentsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: [COMMENTS_KEY],
    queryFn: async ({ pageParam }) => [] as Comments[],
    initialPageParam: null as string | undefined | null,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt
        ? new Date(lastItem.createdAt).toISOString()
        : null;
    },
  });
}

export function useCommentAddMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: typeof commentInsertSchema.static) =>
      ({}) as Comments,
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        [COMMENTS_KEY],
        (
          oldData: InfiniteData<Comments[]> | undefined,
        ): InfiniteData<Comments[]> | undefined => {
          if (!oldData?.pages) return oldData;

          return {
            pages: [...oldData.pages, [newComment]],
            pageParams: [new Date().toISOString(), ...oldData.pageParams],
          };
        },
      );
      toast.success(t("CHAT.SUCCESS.COMMENT_ADD"));
    },
    onError: (e) => handleError(e, t),
  });
}

export function useCommentDeleteMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => serverFnCommentDelete(id),
    onSuccess: (c) => {
      queryClient.setQueryData<Comments[]>(
        [COMMENTS_KEY],
        (oldQueryData = []) =>
          oldQueryData.filter((comment) => comment.id !== c?.id),
      );
      toast.error(t("CHAT.INFO.COMMENT_DELETED"));
    },
    onError: (e) => handleError(e, t),
  });
}
