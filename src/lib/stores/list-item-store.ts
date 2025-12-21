import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";

export type ViewMode = "grid" | "list";

interface ListItemsState {
  viewMode: ViewMode;
  searchQuery: string;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  filterItems: (
    items: GetApiByGuildIdBoardByBoardType200Item[]
  ) => GetApiByGuildIdBoardByBoardType200Item[];
}

export const useListItemsStore = create<ListItemsState>()(
  persist(
    (set, get) => ({
      viewMode: "grid",
      searchQuery: "",
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleViewMode: () =>
        set({
          viewMode: get().viewMode === "grid" ? "list" : "grid",
        }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearSearch: () => set({ searchQuery: "" }),
      filterItems: (items) => {
        const { searchQuery } = get();
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter((item) => {
          const nameMatch = item.name.toLowerCase().includes(query);
          const contentMatch = item.content?.toLowerCase().includes(query);
          const authorMatch = item.author.username.toLowerCase().includes(query);
          const tagMatch = item.tags.some((tag) =>
            tag.name.toLowerCase().includes(query)
          );

          return nameMatch || contentMatch || authorMatch || tagMatch;
        });
      },
    }),
    {
      name: "list-items-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Keep the old export for backward compatibility
export const useViewModeStore = useListItemsStore;
