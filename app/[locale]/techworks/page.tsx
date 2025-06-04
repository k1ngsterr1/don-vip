"use client";

import CountdownTimer from "@/features/countdown/countdown";
import Image from "next/image";

export default function TechworksPage() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 2); // Example: 2 hours from now
  targetDate.setMinutes(targetDate.getMinutes() + 17); // Example: 17 minutes from now
  targetDate.setSeconds(targetDate.getSeconds() + 48); // Example: 48 seconds from now

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <Image
        src="/techworks.webp"
        alt="Techworks Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 top-[64px] left-[16px] ">
        <h1 className="text-white font-black w-full font-unbounded text-[45px]">
          Внимание! <br />
          Технические работы
        </h1>
      </div>

      <div className="absolute w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
}
