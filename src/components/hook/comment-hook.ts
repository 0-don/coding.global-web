import { query } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { toast } from "solid-sonner";
import { rpc } from "~/lib/rpc";
import { CommentInsertSimple } from "~/lib/schema/comment";
import { COMMENTS_ADD_KEY, COMMENTS_KEY } from "~/utils/cache/keys";
import { setCookies } from "~/utils/server";

const serverFnComments = query(async () => {
  "use server";
  return (await rpc.api.comment.get()).data!;
}, COMMENTS_KEY);

const serverFnCommentAdd = query(async (args: CommentInsertSimple) => {
  "use server";
  return (await rpc.api.comment.post({ ...args, ...setCookies() })).data!;
}, COMMENTS_ADD_KEY);

const serverFnCommentDelete = query(async (id: string) => {
  "use server";
  return (await rpc.api.comment[id].delete(setCookies())).data!;
}, COMMENTS_KEY);

export const CommentHook = () => {
  const queryClient = useQueryClient();

  const commentsQuery = createQuery(() => ({
    queryKey: [COMMENTS_KEY],
    queryFn: async () => await serverFnComments(),
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: CommentInsertSimple) => serverFnCommentAdd(args),
    onSuccess: (newComment) => {
      queryClient.setQueryData<typeof commentsQuery.data>(
        [COMMENTS_KEY],
        (oldQueryData = []) => [...oldQueryData, newComment],
      );
    },
    onError: (error) => {
      const err = JSON.parse(error.message).errors as Error[];
      for (const { message } of err) {
        toast.error(message);
      }
    },
  }));

  const commentDelete = createMutation(() => ({
    mutationFn: async (id: string) => serverFnCommentDelete(id),
    onSuccess: (c) => {
      queryClient.setQueryData<typeof commentsQuery.data>(
        [COMMENTS_KEY],
        (oldQueryData = []) =>
          oldQueryData.filter((comment) => comment.id !== c?.id),
      );
    },
    onError: (error) => {
      const err = JSON.parse(error.message).errors as Error[];
      for (const { message } of err) {
        toast.error(message);
      }
    },
  }));

  return { commentsQuery, commentAdd, commentDelete };
};
