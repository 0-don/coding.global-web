import { cache } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { toast } from "solid-sonner";
import { rpc } from "~/lib/rpc";
import { CommentInsertSimple, CommentSelect } from "~/lib/schema/comment";
import { COMMENTS_KEY } from "~/utils/cache/keys";

const prefetchComments = cache(async () => {
  "use server";
  return (await rpc.api.comment.get()).data!;
}, COMMENTS_KEY);

export const CommentHook = () => {
  const queryClient = useQueryClient();

  const commentsQuery = createQuery(() => ({
    queryKey: [COMMENTS_KEY],
    queryFn: async () => await prefetchComments(),
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: CommentInsertSimple) =>
      (await rpc.api.comment.post(args)).data!,
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
    mutationFn: async (id: string) =>
      (await rpc.api.comment({ id }).delete()).data!,
    onSuccess: (c) => {
      queryClient.setQueryData<CommentSelect[]>(
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
