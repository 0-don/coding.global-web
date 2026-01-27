import { ThreadType } from "@/lib/types";
import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { atomWithStorage } from "jotai/utils";

export type ViewMode = "grid" | "list";
export type SortOrder = "recentlyActive" | "datePosted" | "oldest";
export type ArchivedFilter = "all" | "active" | "archived";

export interface ThreadState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedTags: string[];
  sortOrder: SortOrder;
  archivedFilter: ArchivedFilter;
}

export const INITIAL_THREAD_STORE: ThreadState = {
  viewMode: "grid",
  searchQuery: "",
  selectedTags: [],
  sortOrder: "recentlyActive",
  archivedFilter: "all",
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

const sortOrderAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(
    (get) => get(baseAtom).sortOrder,
    (get, set, value: SortOrder) => {
      set(baseAtom, { ...get(baseAtom), sortOrder: value });
    },
  );
});

const archivedFilterAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(
    (get) => get(baseAtom).archivedFilter,
    (get, set, value: ArchivedFilter) => {
      set(baseAtom, { ...get(baseAtom), archivedFilter: value });
    },
  );
});

const clearFiltersAtomFamily = atomFamily((threadType: ThreadType) => {
  const baseAtom = threadAtomFamily(threadType);
  return atom(null, (get, set) => {
    set(baseAtom, {
      ...get(baseAtom),
      searchQuery: "",
      selectedTags: [],
      archivedFilter: "all",
    });
  });
});

// Get atoms for a thread type (returns cached atoms)
export const getThreadAtoms = (threadType: ThreadType) => ({
  baseAtom: threadAtomFamily(threadType),
  viewModeAtom: viewModeAtomFamily(threadType),
  searchQueryAtom: searchQueryAtomFamily(threadType),
  selectedTagsAtom: selectedTagsAtomFamily(threadType),
  sortOrderAtom: sortOrderAtomFamily(threadType),
  archivedFilterAtom: archivedFilterAtomFamily(threadType),
  clearFiltersAtom: clearFiltersAtomFamily(threadType),
});

export const filterThreads = (
  threads: GetApiByGuildIdThreadByThreadType200Item[],
  state: ThreadState,
): GetApiByGuildIdThreadByThreadType200Item[] => {
  const { searchQuery, selectedTags, sortOrder, archivedFilter } = state;

  let filtered = threads;

  // Filter by archived status
  if (archivedFilter === "active") {
    filtered = filtered.filter((thread) => !thread.archived);
  } else if (archivedFilter === "archived") {
    filtered = filtered.filter((thread) => thread.archived);
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((thread) => {
      const nameMatch = thread.name.toLowerCase().includes(query);
      const contentMatch = thread.firstMessage?.content?.toLowerCase().includes(query);
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

  // Sort by date
  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === "recentlyActive") {
      const dateA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      const dateB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      return dateB - dateA;
    }
    if (sortOrder === "oldest") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    }
    // datePosted - sort by createdAt descending (newest first)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return filtered;
};
