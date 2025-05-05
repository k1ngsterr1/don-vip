"use client";

import SearchBar from "@/entities/search-bar/search-bar";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ServicesMegaMenu } from "@/features/games-mega-menu/games-mega-menu";
import { GamesMegaMenu } from "@/features/services-mega-menu/services-mega-menu";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { LanguageSwitcher } from "./language-switcher";
import { AuthMenu } from "./auth-menu";
import { MobileNav } from "./mobile-nav";
import { useAuthStore } from "@/entities/auth/store/auth.store";

interface IHeader {
  isSearchBar?: boolean;
}

export default function Header({ isSearchBar = true }: IHeader) {
  const t = useTranslations("Header");
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"games" | "services" | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleMenuToggle = (menu: "games" | "services") => {
    setActiveMenu(activeMenu === menu ? null : menu);
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

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
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
          <Logo />

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

          <div ref={menuRef}>
            <DesktopNav
              activeMenu={activeMenu}
              onMenuToggle={handleMenuToggle}
              onMenuMouseEnter={handleMenuMouseEnter}
              onMenuMouseLeave={handleMenuMouseLeave}
            />
          </div>

          <div className="relative flex items-center gap-2 ml-9 group">
            <LanguageSwitcher />
            <AuthMenu />

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

        <MobileNav
          isOpen={mobileMenuOpen}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </motion.header>
  );
}
