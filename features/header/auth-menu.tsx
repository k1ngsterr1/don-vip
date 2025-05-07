"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import google from "@/assets/google.webp";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export function AuthMenu() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("Header");

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
      </>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center cursor-pointer text-dark hover:text-blue-600 transition-colors"
      >
        <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white">
          {user?.firstName?.[0] || user?.email?.[0] || "U"}
        </div>
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href={`/profile/${user?.id || 1}`}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setUserMenuOpen(false)}
          >
            {t("profile")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
