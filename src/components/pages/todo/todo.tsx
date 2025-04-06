import { RiBusinessCalendarTodoFill } from "solid-icons/ri";
import { TbTrashX } from "solid-icons/tb";
import { For } from "solid-js";
import { TodoHook } from "~/components/hook/todo-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { todoInsertChecker } from "~/lib/schema/todo";
import { safeParse } from "~/utils/base";

export default function Todo() {
  let parentRef: HTMLDivElement | undefined;

  const { locale } = useLanguage();
  const { todo, setTodo, todoAdd, todosInfiniteQuery, todoDelete, todoSeed } =
    TodoHook();

  const flattenedTodos = () =>
    todosInfiniteQuery.data?.pages.flatMap((page) => page) ?? [];

  const handleScroll = () => {
    if (!parentRef) return;

    const scrollHeight = parentRef.scrollHeight;
    const scrollTop = parentRef.scrollTop;
    const clientHeight = parentRef.clientHeight;

    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      !todosInfiniteQuery.isFetchingNextPage
    ) {
      todosInfiniteQuery.fetchNextPage();
    }
  };

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!todoAdd.isPending && safeParse(todoInsertChecker, todo).success)
      todoAdd.mutate();
  };

  return (
    <>
      <div
        ref={parentRef!}
        class="my-5 flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <For each={flattenedTodos()}>
          {(todo) => (
            <div class="hover:bg-foreground hover:text-secondary flex w-full items-start justify-between gap-4 rounded-md p-2 transition-all">
              <div class="flex gap-4">
                <RiBusinessCalendarTodoFill class="mt-px size-5" />
                <div class="space-y-1">
                  <p class="text-sm font-medium break-all">{todo.task}</p>
                  <p class="text-sm">
                    {new Date(todo.createdAt!).toLocaleString(locale())}
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                class="shrink-0"
                size="icon"
                disabled={todoDelete.isPending}
                onClick={async () => {
                  await todoDelete.mutateAsync(todo.id);
                }}
              >
                <TbTrashX />
              </Button>
            </div>
          )}
        </For>
      </div>

      <form onSubmit={onSubmit} class={"flex justify-center gap-4"}>
        <TextField class="w-full" validationState="invalid">
          <TextFieldInput
            class="bg-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700"
            type={"text"}
            value={todo.task}
            onInput={(e) => setTodo({ task: e.currentTarget.value })}
          />
        </TextField>
        <Button
          disabled={
            todoAdd.isPending || !safeParse(todoInsertChecker, todo).success
          }
          onClick={() => todoAdd.mutate()}
        >
          Submit
        </Button>
      </form>
    </>
  );
}
