"use client";

import { ThreadType } from "@/lib/types";
import {
  INITIAL_THREAD_STORE,
  type ThreadState,
  threadAtomFamily,
} from "@/store/thread-store";
import { useHydrateAtoms } from "jotai/utils";
import type { ReactNode } from "react";

export function ThreadStoreProvider(props: {
  children: ReactNode;
  threadType: ThreadType;
  data?: Partial<ThreadState>;
}) {
  useHydrateAtoms([
    [
      threadAtomFamily(props.threadType),
      { ...INITIAL_THREAD_STORE, ...props.data },
    ],
  ]);

  return <>{props.children}</>;
}
