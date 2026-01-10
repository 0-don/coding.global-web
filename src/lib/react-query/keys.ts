import { BoardType } from "../types";

export const queryKeys = {
  session: () => ["session"],

  // Widget
  discordWidget: () => ["discord-widget"],
  topStats: () => ["top-stats"],

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

  // Terminal
  terminalMembers: () => ["terminal", "members"],
  terminalTop: (days?: number, limit?: number) => ["terminal", "top", { days, limit }],
  terminalUserSearch: (query: string, limit?: number) => ["terminal", "user", "search", { query, limit }],
  terminalUser: (userId: string) => ["terminal", "user", userId],
};
