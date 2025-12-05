"use client";

import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Image
        src="/banner.gif"
        alt="Coding Global Background"
        fill
        className="object-cover w-full h-full select-none"
        quality={100}
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
