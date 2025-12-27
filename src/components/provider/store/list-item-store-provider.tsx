"use client";

import {
  type BoardType,
  INITIAL_LIST_ITEM_STORE,
  type ListItemState,
  listItemAtomFamily,
} from "@/store/list-item-store";
import { useHydrateAtoms } from "jotai/utils";
import type { ReactNode } from "react";

export function ListItemStoreProvider(props: {
  children: ReactNode;
  boardType: BoardType;
  data?: Partial<ListItemState>;
}) {
  useHydrateAtoms([
    [
      listItemAtomFamily(props.boardType),
      { ...INITIAL_LIST_ITEM_STORE, ...props.data },
    ],
  ]);

  return <>{props.children}</>;
}
