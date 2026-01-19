import Image from "next/image";

export default function Home() {
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
          quality={75}
        />
      </div>
      {/* Actual Content */}
      <div className="relative z-10 min-h-screen w-full"></div>
    </div>
  );
}
