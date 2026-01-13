"use client";

import { dayjs } from "@/lib/utils/dayjs";
import { useLocale } from "next-intl";
import { ReactNode, useEffect } from "react";

export function DayjsProvider(props: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  return props.children;
}
