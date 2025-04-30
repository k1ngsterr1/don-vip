"use client";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  LogOut,
  MessageCircle,
  Settings,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export function ProfileMenu() {
  const i18n = useTranslations("ProfileMenu");

  const menuItems = [
    {
      icon: <ShoppingBag size={20} className="text-orange" />,
      label: i18n("items.purchases.label"),
      href: "/profile/purchases",
      color: "bg-orange/10",
      description: i18n("items.purchases.description"),
    },
    {
      icon: <Ticket size={20} className="text-blue" />,
      label: i18n("items.coupons.label"),
      href: "/profile/coupons",
      color: "bg-blue/10",
      description: i18n("items.coupons.description"),
    },
    {
      icon: <MessageCircle size={20} className="text-[#37aee2]" />,
      label: i18n("items.chatBot.label"),
      href: "/profile/chat",
      color: "bg-[#37aee2]/10",
      description: i18n("items.chatBot.description"),
    },
    {
      icon: <Settings size={20} className="text-gray-600" />,
      label: i18n("items.settings.label"),
      href: "/profile/settings",
      color: "bg-gray-100",
      description: i18n("items.settings.description"),
    },
    {
      icon: <LogOut size={20} className="text-[#ff272c]" />,
      label: i18n("items.logout.label"),
      href: "/auth/logout",
      color: "bg-[#ff272c]/10",
      description: i18n("items.logout.description"),
    },
  ];

  // Mobile version
  const mobileMenu = (
    <nav className="space-y-3 md:hidden">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mr-3`}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>
      ))}
    </nav>
  );

  // Tablet version (grid layout)
  const tabletMenu = (
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start">
            <div
              className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{item.label}</h3>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-blue group-hover:translate-x-1 transition-all"
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">{item.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {mobileMenu}
      {tabletMenu}
    </>
  );
}
