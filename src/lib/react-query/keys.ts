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
  comments: () => ["comments"],
  commentsAdd: () => ["comments-add"],
  commentsDelete: () => ["comments-delete"],

  // Showcase
  showcaseThreads: () => ["showcase-threads"],
  showcaseThread: (threadId: string) => ["showcase-thread", threadId],
  showcaseThreadMessages: (threadId: string) => [
    "showcase-thread-messages",
    threadId,
  ],

  // Job Board
  jobBoardThreads: () => ["job-board-threads"],

  // Dev Board
  devBoardThreads: () => ["dev-board-threads"],

  // Generic board keys (for detail pages)
  boardThread: (boardType: string, threadId: string) => [
    `${boardType}-thread`,
    threadId,
  ],
  boardThreadMessages: (boardType: string, threadId: string) => [
    `${boardType}-thread-messages`,
    threadId,
  ],
};
