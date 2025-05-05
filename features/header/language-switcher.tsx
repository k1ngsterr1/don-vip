"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import en from "@/assets/EN.webp";
import ru from "@/assets/RU.webp";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "ru" ? "en" : "ru";

  const switchLanguage = () => {
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    router.push(segments.join("/"));
  };

  return (
    <button
      className="flex h-[32px] items-center group"
      onClick={switchLanguage}
    >
      <Image
        src={locale === "ru" ? ru.src : en.src}
        width={32}
        height={32}
        alt={locale === "ru" ? "RU" : "EN"}
        className="h-[32px] w-[32px]  rounded-full border border-transparent group-hover:border-gray-200"
      />
    </button>
  );
}
