"use client";

import { useSessionHook } from "@/hook/session-hook";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useRef } from "react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

function PostHogIdentify() {
  const session = useSessionHook();
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    const userId = session.data?.user?.id;
    const userName = session.data?.user?.name;

    if (userId && previousUserId.current !== userId) {
      posthog.identify(userId, {
        name: userName,
      });
      posthog.capture("user_signed_in", {
        provider: "discord",
      });
      previousUserId.current = userId;
    }

    if (!userId && previousUserId.current) {
      posthog.reset();
      previousUserId.current = null;
    }
  }, [session.data?.user?.id, session.data?.user?.name]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      <PostHogIdentify />
      {children}
    </PHProvider>
  );
}
