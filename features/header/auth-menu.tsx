"use client";

import { LogOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import google from "@/assets/google.webp";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/entities/auth/api/auth.api";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/routing";

export function AuthMenu() {
  const { isAuthenticated, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("Header");

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    setUserMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <Link
          href="/auth/login"
          className="text-[15px] !cursor-pointer md:text-base text-dark font-condensed hover:text-blue-600 transition-colors md:bg-transparent md:hover:bg-gray-50 md:px-4 md:py-2 md:rounded-full"
        >
          {t("login")}
        </Link>
        <button
          onClick={() => window.open("https://api.don-vip.com/api/auth/google")}
          className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] aspect-square flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Image
            src={google || "/placeholder.svg"}
            alt="Google"
            className="w-[50%] h-[50%] md:w-[60%] md:h-[60%] object-contain"
          />
        </button>
      </>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center cursor-pointer text-dark hover:text-blue-600 transition-colors"
      >
        {currentUser?.avatar ? (
          <Image
            src={currentUser.avatar}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8"
          />
        ) : (
          <div className="w-8 h-8 !cursor-pointer bg-blue rounded-full flex items-center justify-center text-white uppercase">
            {currentUser?.first_name?.[0] ||
              currentUser?.identifier?.[0] ||
              "U"}
          </div>
        )}
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href={{
              pathname: "/profile/[id]",
              params: { id: String(currentUser?.id || 1) },
            }}
            className="block !cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setUserMenuOpen(false)}
          >
            {t("profile")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex !cursor-pointer items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
