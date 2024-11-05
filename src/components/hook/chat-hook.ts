import { query } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { toast } from "solid-sonner";
import { rpc } from "~/lib/rpc";
import { commentInsertSchema } from "~/lib/schema/comment";
import { handleEden } from "~/utils/base";
import { COMMENTS_DELETE_KEY, COMMENTS_KEY } from "~/utils/cache/keys";
import { handleError } from "~/utils/client";
import { setCookies } from "~/utils/server";
import { useLanguage } from "../provider/language-provider";

export const serverFnComments = query(async () => {
  "use server";
  return (await rpc.api.comment.get()).data!;
}, COMMENTS_KEY);

export const serverFnCommentDelete = query(async (id: string) => {
  "use server";
  return (await rpc.api.comment[id].delete(setCookies())).data!;
}, COMMENTS_DELETE_KEY);

export const ChatHook = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const commentsQuery = createQuery(() => ({
    queryKey: [COMMENTS_KEY],
    queryFn: async () => await serverFnComments(),
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: typeof commentInsertSchema.static) =>
      handleEden(await rpc.api.comment.post(args)),
    onSuccess: (newComment) => {
      queryClient.setQueryData<typeof commentsQuery.data>(
        [COMMENTS_KEY],
        (oldQueryData = []) => [...oldQueryData, newComment],
      );
      toast.success(t("CHAT.SUCCESS.COMMENT_ADD"));
    },
    onError: (e) => handleError(e, t),
  }));

  const commentDelete = createMutation(() => ({
    mutationFn: async (id: string) => serverFnCommentDelete(id),
    onSuccess: (c) => {
      queryClient.setQueryData<typeof commentsQuery.data>(
        [COMMENTS_KEY],
        (oldQueryData = []) =>
          oldQueryData.filter((comment) => comment.id !== c?.id),
      );
      toast.error(t("CHAT.INFO.COMMENT_DELETED"));
    },
    onError: (e) => handleError(e, t),
  }));

  return { commentsQuery, commentAdd, commentDelete };
};
