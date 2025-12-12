"use client";

import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <Image
        src="/images/banner.gif"
        alt="Coding Global Background"
        fill
        className="h-full w-full object-cover select-none"
        quality={100}
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/90" />
    </div>
  );
}
