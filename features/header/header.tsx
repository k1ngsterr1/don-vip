"use client";

import en from "@/assets/EN.webp";
import google from "@/assets/google.webp";
import logo from "@/assets/Logo.webp";
import ru from "@/assets/RU.webp";
import SearchBar from "@/entities/search-bar/search-bar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ServicesMegaMenu } from "../games-mega-menu/games-mega-menu";
import { GamesMegaMenu } from "../services-mega-menu/services-mega-menu";
import { useLocale, useTranslations } from "next-intl";

interface IHeader {
  isSearchBar?: boolean;
}

export default function Header({ isSearchBar = true }: IHeader) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"games" | "services" | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const otherLocale = locale === "ru" ? "en" : "ru";

  const switchLanguage = () => {
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    router.push(segments.join("/"));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleMenuToggle = (menu: "games" | "services") => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const handleMenuMouseEnter = (menu: "games" | "services") => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menu);
  };

  const handleMenuMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.header
      className={`bg-white md:sticky top-0 border-b border-gray-100 relative z-50 transition-all duration-300 ${
        isScrolled ? "md:shadow-md" : ""
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[1680px] mx-auto">
        <div
          className={`flex justify-between items-center px-4 md:px-8 py-[9px] md:py-5 transition-all duration-300 ${
            isScrolled ? "md:py-4" : ""
          }`}
        >
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
          {isSearchBar && (
            <div className="hidden md:block md:flex-1 mx-8 max-w-xl">
              <SearchBar
                placeholder={t("searchPlaceholder")}
                onSearch={handleSearch}
                height="44px"
                className="md:rounded-full"
                enhanced={true}
                compact={true}
              />
            </div>
          )}

          <div
            className="hidden md:flex md:items-center md:space-x-6"
            ref={menuRef}
          >
            <div
              className="relative"
              onMouseEnter={() => handleMenuMouseEnter("games")}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                className={`flex items-center text-dark font-condensed hover:text-blue-600 transition-colors text-base ${
                  activeMenu === "games" ? "text-blue-600" : ""
                }`}
                onClick={() => handleMenuToggle("games")}
              >
                {t("games")}
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-300 ${
                    activeMenu === "games" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {activeMenu === "games" && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[2px] w-1 h-1 bg-blue-600 rounded-full"
                  layoutId="navIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuMouseEnter("services")}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                className={`flex items-center text-dark font-condensed hover:text-blue-600 transition-colors text-base ${
                  activeMenu === "services" ? "text-blue-600" : ""
                }`}
                onClick={() => handleMenuToggle("services")}
              >
                {t("services")}
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-300 ${
                    activeMenu === "services" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {activeMenu === "services" && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[2px] w-1 h-1 bg-blue-600 rounded-full"
                  layoutId="navIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>

            <div className="relative">
              <Link
                href="/reviews"
                className="text-dark font-condensed hover:text-blue-600 transition-colors text-base"
              >
                {t("reviews")}
              </Link>
            </div>

            <div className="relative">
              <Link
                href="/faq"
                className="text-dark font-condensed hover:text-blue-600 transition-colors text-base"
              >
                {t("faq")}
              </Link>
            </div>
          </div>

          <div className="relative flex items-center gap-2 ml-9 group">
            <button className="flex items-center" onClick={switchLanguage}>
              <Image
                src={locale === "ru" ? ru.src : en.src}
                width={32}
                height={32}
                alt={locale === "ru" ? "RU" : "EN"}
                className="md:w-[28px] md:h-[28px] rounded-full border border-transparent group-hover:border-gray-200"
              />
            </button>

            <Link
              href="/auth/login"
              className="text-[15px] md:text-base text-dark font-condensed hover:text-blue-600 transition-colors md:bg-transparent md:hover:bg-gray-50 md:px-4 md:py-2 md:rounded-full"
            >
              {t("login")}
            </Link>

            <button className="w-[22px] h-[22px] md:w-[36px] md:h-[36px] flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              <Image
                src={google || "/placeholder.svg"}
                alt="Google"
                className="w-[12px] h-[12px] md:w-[16px] md:h-[16px]"
              />
            </button>

            <button
              className="md:hidden ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <div
          onMouseEnter={() => {
            if (menuTimeoutRef.current) {
              clearTimeout(menuTimeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            menuTimeoutRef.current = setTimeout(() => {
              setActiveMenu(null);
            }, 200);
          }}
        >
          <AnimatePresence>
            {activeMenu === "games" && <GamesMegaMenu />}
            {activeMenu === "services" && <ServicesMegaMenu />}
          </AnimatePresence>
        </div>

        {isSearchBar && (
          <div className="md:hidden py-2 px-4">
            <SearchBar
              placeholder={t("searchPlaceholder")}
              onSearch={handleSearch}
              height="56px"
              className="rounded-lg"
            />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-2 px-4 border-t border-gray-100">
            <nav className="space-y-3">
              <Link href="/games" className="block text-dark font-condensed">
                {t("games")}
              </Link>
              <Link href="/services" className="block text-dark font-condensed">
                {t("services")}
              </Link>
              <Link href="/reviews" className="block text-dark font-condensed">
                {t("reviews")}
              </Link>
              <Link href="/faq" className="block text-dark font-condensed">
                {t("faq")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
