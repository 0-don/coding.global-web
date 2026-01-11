"use client";

import { cn } from "@/lib/utils";
import NextImage from "next/image";

export const LogoImage = (
  props: Omit<React.ComponentProps<typeof NextImage>, "src" | "alt">,
) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  return (
    <NextImage
      height={28}
      width={28}
      {...props}
      src={"/images/logo.gif"}
      alt={appName}
      unoptimized
      className={cn("h-7 w-7 rounded-full object-cover", props.className)}
    />
  );
};

export const CompanyName = (props: { className?: string }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const firstWord = appName.split(" ")[0];
  const secondWord = appName.split(" ")[1] || "";
  return (
    <div className={cn("flex gap-1", props.className)}>
      <span>{firstWord}</span>
      <span className="text-primary">{secondWord}</span>
    </div>
  );
};
