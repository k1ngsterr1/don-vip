"use client";

import SearchBar from "@/entities/search-bar/search-bar";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GamesMegaMenu } from "@/features/games-mega-menu/games-mega-menu";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { LanguageSwitcher } from "./language-switcher";
import { AuthMenu } from "./auth-menu";
import { MobileNav } from "./mobile-nav";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { TabletNav } from "./tablet-nav";
import { ServicesMegaMenu } from "../services-mega-menu/services-mega-menu";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";

interface IHeader {
  isSearchBar?: boolean;
}

export default function Header({ isSearchBar = true }: IHeader) {
  const t = useTranslations("Header");
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const { selectedCurrency } = useCurrency();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"games" | "services" | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);
  // FIXED: Added client-side only state for tablet detection
  const [isTablet, setIsTablet] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  // Track if mobile search is active to adjust UI
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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

  // Handle mobile search focus/blur
  const handleMobileSearchFocus = () => {
    setMobileSearchActive(true);
  };

  const handleMobileSearchBlur = () => {
    setTimeout(() => {
      setMobileSearchActive(false);
    }, 200);
  };

  // FIXED: Move all browser-specific code into useEffect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check tablet size on client-side only
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 930 && window.innerWidth < 1024);
      setIsMediumScreen(window.innerWidth >= 1024 && window.innerWidth < 1200);
    };

    // Initial checks
    checkTablet();
    handleScroll();

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkTablet);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkTablet);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setMobileSearchActive(false);
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

  useEffect(() => {
    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener("closeMobileMenu", closeMobileMenu);
    return () => {
      document.removeEventListener("closeMobileMenu", closeMobileMenu);
    };
  }, []);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
                height={isTablet ? "40px" : isMediumScreen ? "48px" : "44px"}
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
            {/* Currency Display */}
            <Link
              href="/language-currency"
              className="hidden md:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg mr-2 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-xs font-roboto font-medium text-gray-600">
                RUB/{selectedCurrency.code}
              </span>
              <span className="text-sm">{selectedCurrency.symbol}</span>
            </Link>

            {/* Mobile Currency Display */}
            <Link
              href="/language-currency"
              className="md:hidden flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs transition-colors duration-200 cursor-pointer"
            >
              <span className="text-xs font-roboto font-medium text-gray-600">
                RUB/{selectedCurrency.code}
              </span>
            </Link>

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
            {activeMenu === "games" && <GamesMegaMenu key="games-menu" />}
            {activeMenu === "services" && (
              <ServicesMegaMenu key="services-menu" />
            )}
          </AnimatePresence>
        </div>
        {isSearchBar && (
          <div
            ref={mobileSearchRef}
            className={`sm:hidden py-2 px-4 relative ${
              mobileSearchActive ? "z-50" : ""
            }`}
          >
            <SearchBar
              placeholder={t("searchPlaceholder")}
              onSearch={handleSearch}
              height="56px"
              className="rounded-lg"
              enhanced={true}
              onFocus={handleMobileSearchFocus as any}
              onBlur={handleMobileSearchBlur}
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
