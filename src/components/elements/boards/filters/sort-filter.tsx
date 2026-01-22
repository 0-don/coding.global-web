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
import posthog from "posthog-js";
import { RxCaretSort } from "react-icons/rx";

interface SortFilterProps {
  threadType: ThreadType;
}

export function SortFilter({ threadType }: SortFilterProps) {
  const atoms = getThreadAtoms(threadType);
  const sortOrder = useAtomValue(atoms.sortOrderAtom);
  const setSortOrder = useSetAtom(atoms.sortOrderAtom);
  const t = useTranslations();

  const getSortLabel = () => {
    if (sortOrder === "recentlyActive") {
      return t("SHOWCASE.FILTER.SORT_RECENTLY_ACTIVE");
    }
    if (sortOrder === "oldest") {
      return t("SHOWCASE.FILTER.SORT_OLDEST");
    }
    return t("SHOWCASE.FILTER.SORT_DATE_POSTED");
  };

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
            <span>{getSortLabel()}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={(value) => {
            posthog.capture("sort_order_changed", {
              board_type: threadType,
              sort_order: value,
            });
            setSortOrder(value as SortOrder);
          }}
        >
          <DropdownMenuRadioItem value="recentlyActive">
            {t("SHOWCASE.FILTER.SORT_RECENTLY_ACTIVE")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="datePosted">
            {t("SHOWCASE.FILTER.SORT_DATE_POSTED")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">
            {t("SHOWCASE.FILTER.SORT_OLDEST")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
