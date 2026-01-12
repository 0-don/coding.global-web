"use client";

import { Button } from "@/components/ui/button";
import { ThreadType } from "@/lib/types";
import { getThreadAtoms } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { LayoutGrid, List } from "lucide-react";

interface ViewModeToggleProps {
  threadType: ThreadType;
}

export function ViewModeToggle({ threadType }: ViewModeToggleProps) {
  const atoms = getThreadAtoms(threadType);
  const viewMode = useAtomValue(atoms.viewModeAtom);
  const setViewMode = useSetAtom(atoms.viewModeAtom);

  return (
    <div className="border-border flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        title="Grid view"
      >
        <LayoutGrid />
      </Button>
      <Button
        variant={viewMode === "list" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setViewMode("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
        title="List view"
      >
        <List />
      </Button>
    </div>
  );
}
