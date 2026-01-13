"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreadType } from "@/lib/types";
import { SortOrder, getThreadAtoms } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { RxCaretSort } from "react-icons/rx";

interface SortFilterProps {
  threadType: ThreadType;
}

export function SortFilter({ threadType }: SortFilterProps) {
  const atoms = getThreadAtoms(threadType);
  const sortOrder = useAtomValue(atoms.sortOrderAtom);
  const setSortOrder = useSetAtom(atoms.sortOrderAtom);
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed md:h-9"
          >
            <RxCaretSort className="mr-1.5 h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">
              {sortOrder === "newest"
                ? t("SHOWCASE.FILTER.SORT_NEWEST")
                : t("SHOWCASE.FILTER.SORT_OLDEST")}
            </span>
            <span className="sm:hidden">
              {sortOrder === "newest" ? t("SHOWCASE.FILTER.SORT_NEWEST") : t("SHOWCASE.FILTER.SORT_OLDEST")}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as SortOrder)}
        >
          <DropdownMenuRadioItem value="newest">
            {t("SHOWCASE.FILTER.SORT_NEWEST")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">
            {t("SHOWCASE.FILTER.SORT_OLDEST")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
