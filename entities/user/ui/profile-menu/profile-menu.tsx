"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import CouponIcon from "@/shared/icons/coupon-icon";
import TelegramIcon from "@/shared/icons/telegram-icon";
import BoxIcon from "@/shared/icons/box-icon";
import SettingsIcon from "@/shared/icons/settings-icon";
import LogoutIcon from "@/shared/icons/logout-icon";

export function ProfileMenu() {
  const i18n = useTranslations("ProfileMenu");
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuthStore();

  const userId = params?.id;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const menuItems = [
    {
      icon: <BoxIcon width={24} height={24} color="#fff" />,
      label: i18n("items.purchases.label"),
      href: "/profile/purchases",
      color: "bg-orange", // фон за иконкой
      description: i18n("items.purchases.description"),
    },
    {
      icon: <CouponIcon width={28} height={45} color="#fff" />,
      label: i18n("items.coupons.label"),
      href: "/coupons",
      color: "bg-blue",
      description: i18n("items.coupons.description"),
    },
    {
      icon: <TelegramIcon width={24} height={24} />,
      label: i18n("items.chatBot.label"),
      href: "/profile/chat",
      color: "bg-[#37aee2]",
      description: i18n("items.chatBot.description"),
    },
    {
      icon: <SettingsIcon width={24} height={24} />,
      label: i18n("items.settings.label"),
      href: `/profile/${userId}/edit/`,
      color: "bg-gray-500",
      description: i18n("items.settings.description"),
    },
    {
      icon: <LogoutIcon width={20} height={20} />,
      label: i18n("items.logout.label"),
      href: "#",
      color: "bg-red-500",
      description: i18n("items.logout.description"),
      onClick: handleLogout,
    },
  ];

  const renderMenuItem = (
    item: (typeof menuItems)[number],
    index: number,
    variant: "mobile" | "tablet"
  ) => {
    const content = (
      <>
        <div className="flex items-center">
          <div
            className={`${
              variant === "mobile" ? "w-10 h-10" : "w-12 h-12"
            } rounded-lg ${item.color} flex items-center justify-center mr-3`}
          >
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span
                className={`${
                  variant === "mobile"
                    ? "font-medium"
                    : "font-medium text-[16px]"
                }`}
              >
                {item.label}
              </span>
              <ChevronRight
                size={variant === "mobile" ? 20 : 18}
                className={`text-gray-400 ${
                  variant === "tablet"
                    ? "group-hover:text-blue group-hover:translate-x-1 transition-all"
                    : ""
                }`}
              />
            </div>
            {variant === "tablet" && (
              <p className="text-gray-500 text-sm mt-1">{item.description}</p>
            )}
          </div>
        </div>
      </>
    );

    if (item.onClick) {
      return (
        <button
          key={index}
          onClick={item.onClick}
          className={`${
            variant === "mobile"
              ? "flex items-center justify-between p-4 bg-gray-50 rounded-lg w-full"
              : "bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group text-left"
          }`}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={index}
        href={item.href}
        className={
          variant === "mobile"
            ? "flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            : "bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
        }
      >
        {content}
      </Link>
    );
  };

  return (
    <>
      <nav className="space-y-3 md:hidden">
        {menuItems.map((item, index) => renderMenuItem(item, index, "mobile"))}
      </nav>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {menuItems.map((item, index) => renderMenuItem(item, index, "tablet"))}
      </div>
    </>
  );
}
