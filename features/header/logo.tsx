"use client";

import Image from "next/image";
import logo from "@/assets/Logo.webp";
import { useRouter } from "@/i18n/routing";

export function Logo() {
  const router = useRouter();

  return (
    <div className="flex items-center flex-shrink-0">
      <Image
        onClick={() => router.push("/")}
        src={logo.src || "/placeholder.svg"}
        width={161}
        height={31}
        alt="Logo"
        className="h-[24px] w-auto sm:h-[27px] md:h-[31px] lg:h-[35px] xl:h-[38px] cursor-pointer object-contain"
      />
    </div>
  );
}
