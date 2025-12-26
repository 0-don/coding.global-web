"use client";

import { Button } from "@/components/ui/button";
import { BoardType, useListItemStore } from "@/lib/stores/list-item-store";
import { LayoutGrid, List } from "lucide-react";

interface ViewModeToggleProps {
  boardType: BoardType;
}

export function ViewModeToggle({ boardType }: ViewModeToggleProps) {
  const listItemsStore = useListItemStore(boardType);

  return (
    <div className="border-border flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={listItemsStore.viewMode === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => listItemsStore.setViewMode("grid")}
        aria-label="Grid view"
        aria-pressed={listItemsStore.viewMode === "grid"}
        title="Grid view"
      >
        <LayoutGrid />
      </Button>
      <Button
        variant={listItemsStore.viewMode === "list" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => listItemsStore.setViewMode("list")}
        aria-label="List view"
        aria-pressed={listItemsStore.viewMode === "list"}
        title="List view"
      >
        <List />
      </Button>
    </div>
  );
}
