import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import type {
  GetApiByGuildIdBoardByBoardType200Item,
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
} from "@/openapi";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { atomWithStorage } from "jotai/utils";

export type ViewMode = "grid" | "list";
export type BoardType =
  | GetApiByGuildIdBoardByBoardType200ItemBoardType
  | "marketplace";

export interface ListItemState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedTags: string[];
}

export const INITIAL_LIST_ITEM_STORE: ListItemState = {
  viewMode: "grid",
  searchQuery: "",
  selectedTags: [],
};

export const getListItemStoreKey = (boardType: BoardType) =>
  `list-items-store-${boardType}`;

const listItemCookieStorage = createJotaiCookieStorage<ListItemState>();

// Atom family for per-board-type state with cookie persistence
export const listItemAtomFamily = atomFamily((boardType: BoardType) =>
  atomWithStorage<ListItemState>(
    getListItemStoreKey(boardType),
    INITIAL_LIST_ITEM_STORE,
    listItemCookieStorage,
  ),
);

// Derived atom families
const viewModeAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = listItemAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).viewMode,
    (get, set, value: ViewMode) => {
      set(baseAtom, { ...get(baseAtom), viewMode: value });
    },
  );
});

const searchQueryAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = listItemAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).searchQuery,
    (get, set, value: string) => {
      set(baseAtom, { ...get(baseAtom), searchQuery: value });
    },
  );
});

const selectedTagsAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = listItemAtomFamily(boardType);
  return atom(
    (get) => get(baseAtom).selectedTags,
    (get, set, value: string[]) => {
      set(baseAtom, { ...get(baseAtom), selectedTags: value });
    },
  );
});

const clearFiltersAtomFamily = atomFamily((boardType: BoardType) => {
  const baseAtom = listItemAtomFamily(boardType);
  return atom(null, (get, set) => {
    set(baseAtom, { ...get(baseAtom), searchQuery: "", selectedTags: [] });
  });
});

// Get atoms for a board type (returns cached atoms)
export const getListItemAtoms = (boardType: BoardType) => ({
  baseAtom: listItemAtomFamily(boardType),
  viewModeAtom: viewModeAtomFamily(boardType),
  searchQueryAtom: searchQueryAtomFamily(boardType),
  selectedTagsAtom: selectedTagsAtomFamily(boardType),
  clearFiltersAtom: clearFiltersAtomFamily(boardType),
});

export const filterItems = (
  items: GetApiByGuildIdBoardByBoardType200Item[],
  state: ListItemState,
): GetApiByGuildIdBoardByBoardType200Item[] => {
  const { searchQuery, selectedTags } = state;

  let filtered = items;

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const contentMatch = item.content?.toLowerCase().includes(query);
      const authorMatch = item.author.username.toLowerCase().includes(query);
      const authorDisplayNameMatch = item.author.displayName
        ?.toLowerCase()
        .includes(query);
      const authorGlobalNameMatch = item.author.globalName
        ?.toLowerCase()
        .includes(query);
      const tagMatch = item.tags.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );
      const userIdMatch = item.author.id.toLowerCase().includes(query);
      const threadIdMatch = item.id.toLowerCase().includes(query);

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
    filtered = filtered.filter((item) =>
      item.tags.some((tag) => selectedTags.includes(tag.id)),
    );
  }

  return filtered;
};
