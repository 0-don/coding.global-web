import { BoardType } from "@/lib/types";
import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import type { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { atomWithStorage } from "jotai/utils";

export type ViewMode = "grid" | "list";

export interface ThreadState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedTags: string[];
}

export const INITIAL_THREAD_STORE: ThreadState = {
  viewMode: "grid",
  searchQuery: "",
  selectedTags: [],
};

export const getThreadStoreKey = (boardType: BoardType) =>
  `thread-store-${boardType}`;

const threadCookieStorage = createJotaiCookieStorage<ThreadState>();

// Atom family for per-board-type state with cookie persistence
export const threadAtomFamily = atomFamily((boardType: BoardType) =>
  atomWithStorage<ThreadState>(
    getThreadStoreKey(boardType),
    INITIAL_THREAD_STORE,
    threadCookieStorage,
  ),
);

// Derived atom families
const viewModeAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = threadAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).viewMode,
    (get, set, value: ViewMode) => {
      set(baseAtom, { ...get(baseAtom), viewMode: value });
    },
  );
});

const searchQueryAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = threadAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).searchQuery,
    (get, set, value: string) => {
      set(baseAtom, { ...get(baseAtom), searchQuery: value });
    },
  );
});

const selectedTagsAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = threadAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).selectedTags,
    (get, set, value: string[]) => {
      set(baseAtom, { ...get(baseAtom), selectedTags: value });
    },
  );
});

const clearFiltersAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = threadAtomFamily(boardType);
  return atom(null, (get, set) => {
    set(baseAtom, { ...get(baseAtom), searchQuery: "", selectedTags: [] });
  });
});

// Get atoms for a board type (returns cached atoms)
export const getThreadAtoms = (boardType: BoardType) => ({
  baseAtom: threadAtomFamily(boardType),
  viewModeAtom: viewModeAtomFamily(boardType),
  searchQueryAtom: searchQueryAtomFamily(boardType),
  selectedTagsAtom: selectedTagsAtomFamily(boardType),
  clearFiltersAtom: clearFiltersAtomFamily(boardType),
});

export const filterThreads = (
  threads: GetApiByGuildIdBoardByBoardType200Item[],
  state: ThreadState,
): GetApiByGuildIdBoardByBoardType200Item[] => {
  const { searchQuery, selectedTags } = state;

  let filtered = threads;

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((thread) => {
      const nameMatch = thread.name.toLowerCase().includes(query);
      const contentMatch = thread.content?.toLowerCase().includes(query);
      const authorMatch = thread.author.username.toLowerCase().includes(query);
      const authorDisplayNameMatch = thread.author.displayName
        ?.toLowerCase()
        .includes(query);
      const authorGlobalNameMatch = thread.author.globalName
        ?.toLowerCase()
        .includes(query);
      const tagMatch = thread.tags.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );
      const userIdMatch = thread.author.id.toLowerCase().includes(query);
      const threadIdMatch = thread.id.toLowerCase().includes(query);

      return (
        nameMatch ||
        contentMatch ||
        authorMatch ||
        authorDisplayNameMatch ||
        authorGlobalNameMatch ||
        tagMatch ||
        userIdMatch ||
        threadIdMatch
      );
    });
  }

  // Filter by selected tags
  if (selectedTags.length > 0) {
    filtered = filtered.filter((thread) =>
      thread.tags.some((tag) => selectedTags.includes(tag.id)),
    );
  }

  return filtered;
};
