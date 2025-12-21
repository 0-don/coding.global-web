import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ViewMode = "grid" | "list";

interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set, get) => ({
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleViewMode: () =>
        set({
          viewMode: get().viewMode === "grid" ? "list" : "grid",
        }),
    }),
    {
      name: "showcase-view-mode",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
