"use client";

import { Button } from "@/components/ui/button";
import { ThreadType } from "@/lib/types";
import { getThreadAtoms, ViewMode } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { LayoutGrid, List } from "lucide-react";
import posthog from "posthog-js";

interface ViewModeToggleProps {
  threadType: ThreadType;
}

export function ViewModeToggle({ threadType }: ViewModeToggleProps) {
  const atoms = getThreadAtoms(threadType);
  const viewMode = useAtomValue(atoms.viewModeAtom);
  const setViewMode = useSetAtom(atoms.viewModeAtom);

  const handleViewModeChange = (mode: ViewMode) => {
    posthog.capture("view_mode_changed", {
      board_type: threadType,
      view_mode: mode,
    });
    setViewMode(mode);
  };

  return (
    <div className="border-border flex items-center gap-0.5 rounded-md border p-0.5 md:gap-1 md:p-1">
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => handleViewModeChange("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        title="Grid view"
        className="h-6 w-6 md:h-7 md:w-7"
      >
        <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => handleViewModeChange("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
        title="List view"
        className="h-6 w-6 md:h-7 md:w-7"
      >
        <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </Button>
    </div>
  );
}
