"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import enFlag from "@/assets/EN.webp"; // Assuming EN.webp is the UK flag
import ruFlag from "@/assets/RU.webp";
import { ChevronDown, DollarSign } from "lucide-react"; // Optional: for a dropdown icon
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { Link } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedCurrency } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const locales = [
    { code: "en", name: "English (Английский)", flag: enFlag },
    { code: "ru", name: "Russian (Русский)", flag: ruFlag },
  ];

  const currentLocaleData =
    locales.find((l) => l.code === locale) || locales[0];

  const switchLanguage = (newLocale: string) => {
    if (locale === newLocale) return;

    const segments = pathname.split("/");
    if (segments.length > 1 && locales.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    let newPath = segments.join("/");
    if (newPath.startsWith("//")) {
      newPath = `/${newLocale}`;
    } else if (newPath === "" || newPath === "/") {
      newPath = `/${newLocale}`;
    }

    router.replace(newPath as any);
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          ref={triggerRef}
          type="button"
          className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 h-auto rounded-md border border-transparent hover:border-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-colors"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={
              currentLocaleData.flag.src ||
              "/placeholder.svg?width=24&height=24&text=Flag"
            }
            width={20}
            height={20}
            alt={currentLocaleData.name}
            className="rounded-full w-5 h-5 sm:w-7 sm:h-7 border border-gray-200"
          />
          <span className="hidden sm:inline text-xs sm:text-sm font-medium">
            {locale.toUpperCase()}
          </span>
          <ChevronDown
            className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-40 sm:w-56 rounded-md shadow-lg bg-white ring-opacity-5 focus:outline-none border border-gray-200 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {locales.map((item) => (
              <button
                key={item.code}
                onClick={() => switchLanguage(item.code)}
                disabled={locale === item.code}
                className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                  locale === item.code
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                } ${
                  locale === item.code ? "cursor-default" : "cursor-pointer"
                }`}
                role="menuitem"
              >
                <Image
                  src={
                    item.flag.src ||
                    "/placeholder.svg?width=24&height=24&text=Flag"
                  }
                  width={20}
                  height={20}
                  alt={item.name}
                  className="rounded-full w-4 h-4 sm:w-5 sm:h-5 border border-gray-100"
                />
                <span>{item.name}</span>
              </button>
            ))}

            {/* Currency Selection Button */}
            <div className="border-t border-gray-100 pt-1 mt-1">
              <Link href="/language-currency" onClick={() => setIsOpen(false)}>
                <button
                  className="w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  role="menuitem"
                >
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">Currency Settings</span>
                    <span className="text-xs text-gray-500">
                      RUB/{selectedCurrency.code}
                    </span>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
