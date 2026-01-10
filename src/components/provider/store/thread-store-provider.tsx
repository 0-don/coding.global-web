"use client";

import { BoardType } from "@/lib/types";
import {
  INITIAL_THREAD_STORE,
  type ThreadState,
  threadAtomFamily,
} from "@/store/thread-store";
import { useHydrateAtoms } from "jotai/utils";
import type { ReactNode } from "react";

export function ThreadStoreProvider(props: {
  children: ReactNode;
  boardType: BoardType;
  data?: Partial<ThreadState>;
}) {
  useHydrateAtoms([
    [
      threadAtomFamily(props.boardType),
      { ...INITIAL_THREAD_STORE, ...props.data },
    ],
  ]);

  return <>{props.children}</>;
}
