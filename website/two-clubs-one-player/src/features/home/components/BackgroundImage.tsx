import React, { ReactNode } from "react";
import Image from "next/image";

function BackgroundImage({ children }: { children: ReactNode }) {
  return (
    <div
      id="background-with-image"
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={"/background.jpg"}
          alt="Background Image"
          fill
          className="object-cover"
          priority
          quality={80}
        />
        {/* Foggy shadow Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm " />
      </div>
      {/* Actual Content */}
      <div className="relative z-10 min-h-screen w-full">{children}</div>
    </div>
  );
}

export default BackgroundImage;
