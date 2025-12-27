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

const initialState: ListItemState = {
  viewMode: "grid",
  searchQuery: "",
  selectedTags: [],
};

// Atom family for per-board-type state with localStorage persistence
export const listItemAtomFamily = atomFamily((boardType: BoardType) =>
  atomWithStorage<ListItemState>(
    `list-items-store-${boardType}`,
    initialState,
    undefined,
    { getOnInit: true },
  ),
);

// Derived atoms factory for individual properties
export const createListItemAtoms = (boardType: BoardType) => {
  const baseAtom = listItemAtomFamily(boardType);

  return {
    baseAtom,
    viewModeAtom: atom(
      (get) => get(baseAtom).viewMode,
      (get, set, value: ViewMode) => {
        set(baseAtom, { ...get(baseAtom), viewMode: value });
      },
    ),
    searchQueryAtom: atom(
      (get) => get(baseAtom).searchQuery,
      (get, set, value: string) => {
        set(baseAtom, { ...get(baseAtom), searchQuery: value });
      },
    ),
    selectedTagsAtom: atom(
      (get) => get(baseAtom).selectedTags,
      (get, set, value: string[]) => {
        set(baseAtom, { ...get(baseAtom), selectedTags: value });
      },
    ),
    toggleViewModeAtom: atom(null, (get, set) => {
      const current = get(baseAtom);
      set(baseAtom, {
        ...current,
        viewMode: current.viewMode === "grid" ? "list" : "grid",
      });
    }),
    clearSearchAtom: atom(null, (get, set) => {
      set(baseAtom, { ...get(baseAtom), searchQuery: "" });
    }),
    clearFiltersAtom: atom(null, (get, set) => {
      set(baseAtom, { ...get(baseAtom), searchQuery: "", selectedTags: [] });
    }),
    resetAtom: atom(null, (_get, set) => {
      set(baseAtom, initialState);
    }),
  };
};

// Filter function (pure, not an atom - can be used anywhere)
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
      const tagMatch = item.tags.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );

      return nameMatch || contentMatch || authorMatch || tagMatch;
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

// Pre-created atoms for common board types
export const marketplaceAtoms = createListItemAtoms("marketplace");
