"use client";

import background from "@/media/banner.gif";
import Image from "next/image";

export default function Background() {
  return (
    <Image
      src={background}
      alt="Coding Global Background"
      fill
      objectFit="cover"
      quality={100}
      priority
      className="z-1 select-none"
    />
  );
}
