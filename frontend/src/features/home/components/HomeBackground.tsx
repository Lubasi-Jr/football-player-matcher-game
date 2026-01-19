"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface HomeBackgroundProps {
  children: ReactNode;
  backgroundImage?: string;
}

export function HomeBackground({
  children,
  backgroundImage = "/background.jpg",
}: HomeBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={80}
        />
        {/* Foggy Overlay */}
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
