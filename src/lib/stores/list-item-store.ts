import type { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ViewMode = "grid" | "list";
export type BoardType = "showcase" | "marketplace" | "job-board" | "dev-board";

interface ListItemState {
  viewMode: ViewMode;
  searchQuery: string;
  selectedTags: string[];
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  setSelectedTags: (tags: string[]) => void;
  clearFilters: () => void;
  filterItems: (
    items: GetApiByGuildIdBoardByBoardType200Item[],
  ) => GetApiByGuildIdBoardByBoardType200Item[];
}

// Store instances cache
const storeInstances = new Map<BoardType, ReturnType<typeof create<ListItemState>>>();

// Factory function to create or get store instance for a specific board type
export const useListItemStore = (boardType: BoardType = "showcase") => {
  if (!storeInstances.has(boardType)) {
    const store = create<ListItemState>()(
      persist(
        (set, get) => ({
          viewMode: "grid",
          searchQuery: "",
          selectedTags: [],
          setViewMode: (mode) => set({ viewMode: mode }),
          toggleViewMode: () =>
            set({
              viewMode: get().viewMode === "grid" ? "list" : "grid",
            }),
          setSearchQuery: (query) => set({ searchQuery: query }),
          clearSearch: () => set({ searchQuery: "" }),
          setSelectedTags: (tags) => set({ selectedTags: tags }),
          clearFilters: () => set({ searchQuery: "", selectedTags: [] }),
          filterItems: (items) => {
            const { searchQuery, selectedTags } = get();

            let filtered = items;

            // Filter by search query
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              filtered = filtered.filter((item) => {
                const nameMatch = item.name.toLowerCase().includes(query);
                const contentMatch = item.content?.toLowerCase().includes(query);
                const authorMatch = item.author.username
                  .toLowerCase()
                  .includes(query);
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
          },
        }),
        {
          name: `list-items-store-${boardType}`,
          storage: createJSONStorage(() => localStorage),
        },
      ),
    );
    storeInstances.set(boardType, store);
  }

  return storeInstances.get(boardType)!();
};
