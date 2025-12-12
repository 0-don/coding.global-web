"use client";

import { cn } from "@/lib/utils";
import NextImage from "next/image";

export const LogoImage = (
  props: Omit<React.ComponentProps<typeof NextImage>, "src" | "alt">,
) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  return (
    <NextImage
      height={20}
      width={20}
      {...props}
      src={"/images/cgLogo.gif"}
      alt={appName}
      unoptimized
      className="h-9 w-9 rounded-full"
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
