import { query } from "@solidjs/router";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/solid-query";
import { toast } from "solid-sonner";
import { rpc } from "~/lib/rpc";
import { commentInsertSchema, Comments } from "~/lib/schema/comment";
import { Pageable } from "~/lib/typebox/pageable";
import { handleEden } from "~/utils/base";
import {
  COMMENTS_ADD_KEY,
  COMMENTS_DELETE_KEY,
  COMMENTS_KEY,
} from "~/utils/cache/keys";
import { handleError } from "~/utils/client";
import { setCookies } from "~/utils/server";
import { useLanguage } from "../provider/language-provider";

export const serverFnComments = query(async ($query: Pageable = {}) => {
  "use server";
  return handleEden(await rpc.api.comment.get({ $query }))!;
}, COMMENTS_KEY);

export const serverFnCommentAdd = query(
  async (args: typeof commentInsertSchema.static) => {
    "use server";
    return handleEden(
      await rpc.api.comment.post({ ...args, ...setCookies() }),
    )!;
  },
  COMMENTS_ADD_KEY,
);

export const serverFnCommentDelete = query(async (id: string) => {
  "use server";
  return (await rpc.api.comment[id].delete(setCookies())).data!;
}, COMMENTS_DELETE_KEY);

export const ChatHook = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const commentsInfiniteQuery = useInfiniteQuery(() => ({
    queryKey: [COMMENTS_KEY],
    queryFn: async ({ pageParam }) =>
      await serverFnComments({ cursor: pageParam, limit: 30 }),
    initialPageParam: null as string | undefined | null,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt
        ? new Date(lastItem.createdAt).toISOString()
        : null;
    },
  }));

  const commentAdd = useMutation(() => ({
    mutationFn: async (args: typeof commentInsertSchema.static) =>
      serverFnCommentAdd(args),
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        [COMMENTS_KEY],
        (oldData: InfiniteData<Comments[]>): InfiniteData<Comments[]> => {
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
  }));

  const commentDelete = useMutation(() => ({
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
  }));

  return { commentsInfiniteQuery, commentAdd, commentDelete };
};
