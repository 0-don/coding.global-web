import { BoardType } from "../types";

export const queryKeys = {
  session: () => ["session"],

  // Widget
  discordWidget: () => ["discord-widget"],

  // News
  news: () => ["news"],
  team: () => ["team"],

  // Console
  console: () => ["console"],

  // Todos
  todos: () => ["todos"],
  todosAdd: () => ["todos-add"],
  todosDelete: () => ["todos-delete"],
  todosSeed: () => ["todos-seed"],

  // Comments
  chats: () => ["comments"],
  commentsAdd: () => ["comments-add"],
  commentsDelete: () => ["comments-delete"],

  // Boards (unified)
  boardThreads: (boardType: BoardType) => ["board", boardType, "threads"],
  boardThread: (boardType: BoardType, threadId: string) => [
    "board",
    boardType,
    "thread",
    threadId,
  ],
  boardThreadMessages: (boardType: BoardType, threadId: string) => [
    "board",
    boardType,
    "thread",
    threadId,
    "messages",
  ],

  // Search
  searchIndex: () => ["search-index"],
};
