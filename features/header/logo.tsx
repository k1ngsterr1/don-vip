"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/Logo.webp";

export function Logo() {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <Image
        onClick={() => router.push("/")}
        src={logo.src || "/placeholder.svg"}
        width={161}
        height={31}
        alt="Logo"
        className="xxs:h-[24px] xxs:w-[121px] xs:w-[161px] xs:h-[31px] md:w-[180px] md:h-[35px] lg:w-[200px] lg:h-[38px] cursor-pointer"
      />
    </div>
  );
}
