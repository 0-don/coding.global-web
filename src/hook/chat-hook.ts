import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import {
  commentInsertSchema,
  Comments,
} from "@/lib/db-schema/comment-db-schema";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { handleError } from "@/lib/utils/client";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useChatsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: queryKeys.chats(),
    queryFn: async ({ pageParam }) => {
      const response = await rpc.api.chat.get({
        query: { cursor: pageParam, limit: PAGEABLE_LIMIT },
      });

      if (response.error) throw response.error;
      return response.data || [];
    },
    initialPageParam: null as string | undefined | null,
    getNextPageParam: (lastPage) => {
      // Cursor for older messages: last item is oldest in newest-first order
      const oldestItem = lastPage[lastPage.length - 1];
      return oldestItem?.createdAt
        ? new Date(oldestItem.createdAt).toISOString()
        : null;
    },
  });
}

export function useChatAddMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: typeof commentInsertSchema.static) =>
      handleElysia(await rpc.api.chat.post(args))!,
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        queryKeys.chats(),
        (
          oldData: InfiniteData<Comments[]> | undefined,
        ): InfiniteData<Comments[]> | undefined => {
          if (!oldData?.pages) return oldData;
          // Add new message to start of first page (newest-first order)
          const [firstPage = [], ...restPages] = oldData.pages;
          return {
            pages: [[newComment, ...firstPage], ...restPages],
            pageParams: oldData.pageParams,
          };
        },
      );
      toast.success(t("CHAT.SUCCESS.COMMENT_ADD"));
    },
    onError: (e) => handleError(e, t),
  });
}

export function useChatDeleteMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      handleElysia(await rpc.api.chat({ id }).delete()),
    onSuccess: (deletedComment) => {
      queryClient.setQueryData(
        queryKeys.chats(),
        (
          oldData: InfiniteData<Comments[]> | undefined,
        ): InfiniteData<Comments[]> | undefined => {
          if (!oldData?.pages) return oldData;
          // Remove the deleted message from all pages
          return {
            pages: oldData.pages.map((page) =>
              page.filter((comment) => comment.id !== deletedComment?.id),
            ),
            pageParams: oldData.pageParams,
          };
        },
      );
      toast.error(t("CHAT.INFO.COMMENT_DELETED"));
    },
    onError: (e) => handleError(e, t),
  });
}

