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
import { TabletNav } from "./tablet-nav";

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

  // Determine if we're on a tablet-sized screen
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 930 && window.innerWidth < 1024);
    };

    checkTablet(); // Call immediately to set initial value
    window.addEventListener("resize", checkTablet);

    return () => {
      window.removeEventListener("resize", checkTablet);
    };
  }, []);

  useEffect(() => {
    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener("closeMobileMenu", closeMobileMenu);
    return () => {
      document.removeEventListener("closeMobileMenu", closeMobileMenu);
    };
  }, []);

  return (
    <motion.header
      className={`bg-white sticky top-0 border-b border-gray-100 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[1680px] mx-auto">
        <div
          className={`flex justify-between items-center px-4 sm:px-6 lg:px-8 py-[9px] sm:py-4 lg:py-5 transition-all duration-300 ${
            isScrolled ? "py-3 sm:py-3 lg:py-4" : ""
          }`}
        >
          <Logo />

          {isSearchBar && (
            <div className="hidden sm:block flex-1 mx-4 lg:mx-8 max-w-xl">
              <SearchBar
                placeholder={t("searchPlaceholder")}
                onSearch={handleSearch}
                height={isTablet ? "40px" : "44px"}
                className="rounded-full"
                enhanced={true}
                compact={true}
              />
            </div>
          )}

          <div ref={menuRef} className="hidden lg:block">
            <DesktopNav
              activeMenu={activeMenu}
              onMenuToggle={handleMenuToggle}
              onMenuMouseEnter={handleMenuMouseEnter}
              onMenuMouseLeave={handleMenuMouseLeave}
            />
          </div>

          {isTablet && (
            <div className="hidden sm:block lg:hidden">
              <TabletNav
                activeMenu={activeMenu}
                onMenuToggle={handleMenuToggle}
              />
            </div>
          )}

          <div className="relative flex items-center gap-2 ml-2 sm:ml-4 lg:ml-9 group">
            <LanguageSwitcher />
            <AuthMenu />
            <button
              className="sm:hidden ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            <button
              className="hidden sm:block lg:hidden ml-2 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu
                size={24}
                className="text-gray-800 hover:text-blue-600 transition-colors"
              />
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
          className="hidden lg:block"
        >
          <AnimatePresence>
            {activeMenu === "games" && <GamesMegaMenu />}
            {activeMenu === "services" && <ServicesMegaMenu />}
          </AnimatePresence>
        </div>
        {isSearchBar && (
          <div className="sm:hidden py-2 px-4">
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
          isTablet={isTablet}
        />
      </div>
    </motion.header>
  );
}
