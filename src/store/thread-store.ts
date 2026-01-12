import { ThreadType } from "@/lib/types";
import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import type { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
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

export const getThreadStoreKey = (threadType: ThreadType) =>
  `thread-store-${threadType}`;

const threadCookieStorage = createJotaiCookieStorage<ThreadState>();

// Atom family for per-thread-type state with cookie persistence
export const threadAtomFamily = atomFamily((threadType: ThreadType) =>
  atomWithStorage<ThreadState>(
    getThreadStoreKey(threadType),
    INITIAL_THREAD_STORE,
    threadCookieStorage,
  ),
);

// Derived atom families
const viewModeAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(
    (get) => get(baseAtom).viewMode,
    (get, set, value: ViewMode) => {
      set(baseAtom, { ...get(baseAtom), viewMode: value });
    },
  );
});

const searchQueryAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(
    (get) => get(baseAtom).searchQuery,
    (get, set, value: string) => {
      set(baseAtom, { ...get(baseAtom), searchQuery: value });
    },
  );
});

const selectedTagsAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(
    (get) => get(baseAtom).selectedTags,
    (get, set, value: string[]) => {
      set(baseAtom, { ...get(baseAtom), selectedTags: value });
    },
  );
});

const clearFiltersAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(null, (get, set) => {
    set(baseAtom, { ...get(baseAtom), searchQuery: "", selectedTags: [] });
  });
});

// Get atoms for a thread type (returns cached atoms)
export const getThreadAtoms = (threadType: ThreadType) => ({
  baseAtom: threadAtomFamily(threadType),
  viewModeAtom: viewModeAtomFamily(threadType),
  searchQueryAtom: searchQueryAtomFamily(threadType),
  selectedTagsAtom: selectedTagsAtomFamily(threadType),
  clearFiltersAtom: clearFiltersAtomFamily(threadType),
});

export const filterThreads = (
  threads: GetApiByGuildIdThreadByThreadType200Item[],
  state: ThreadState,
): GetApiByGuildIdThreadByThreadType200Item[] => {
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
