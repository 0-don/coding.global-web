"use client";

import Image from "next/image";

export default function Background() {
  return (
    <Image
      src={"/banner.gif"}
      alt="Coding Global Background"
      fill
      objectFit="cover"
      quality={100}
      priority
      className="z-1 select-none"
    />
  );
}
