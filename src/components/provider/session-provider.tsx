"use client";

import { authClient, Session } from "@/lib/auth-client";
import { ReactNode, useLayoutEffect, useRef } from "react";

export function SessionProvider(props: {
  children: ReactNode;
  session: Session | null;
}) {
  const initialized = useRef(false);

  useLayoutEffect(() => {
    // Only hydrate if we have server session and haven't initialized yet
    if (props.session && !initialized.current) {
      console.log("Hydrating session", props.session);
      authClient.$store.atoms.$sessionSignal?.set({
        data: props.session,
        isPending: false,
        error: null,
        isRefetching: false,
      });
      initialized.current = true;
    }
  }, [props.session]);

  return <>{props.children}</>;
}
