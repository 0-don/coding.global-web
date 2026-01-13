"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThreadType } from "@/lib/types";
import {
  ArchivedFilter as ArchivedFilterType,
  getThreadAtoms,
} from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { RxArchive } from "react-icons/rx";

interface ArchivedFilterProps {
  threadType: ThreadType;
}

export function ArchivedFilter({ threadType }: ArchivedFilterProps) {
  const atoms = getThreadAtoms(threadType);
  const archivedFilter = useAtomValue(atoms.archivedFilterAtom);
  const setArchivedFilter = useSetAtom(atoms.archivedFilterAtom);
  const t = useTranslations();

  const getLabel = (filter: ArchivedFilterType) => {
    switch (filter) {
      case "all":
        return t("SHOWCASE.FILTER.ARCHIVED_ALL");
      case "active":
        return t("SHOWCASE.FILTER.ARCHIVED_ACTIVE");
      case "archived":
        return t("SHOWCASE.FILTER.ARCHIVED_ONLY");
    }
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
            <RxArchive className="mr-1.5 h-4 w-4 md:mr-2" />
            {t("SHOWCASE.FILTER.STATUS")}
            {archivedFilter !== "all" && (
              <>
                <Separator orientation="vertical" className="mx-1.5 h-4 md:mx-2" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {getLabel(archivedFilter)}
                </Badge>
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={archivedFilter}
          onValueChange={(value) =>
            setArchivedFilter(value as ArchivedFilterType)
          }
        >
          <DropdownMenuRadioItem value="all">
            {t("SHOWCASE.FILTER.ARCHIVED_ALL")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="active">
            {t("SHOWCASE.FILTER.ARCHIVED_ACTIVE")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="archived">
            {t("SHOWCASE.FILTER.ARCHIVED_ONLY")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
