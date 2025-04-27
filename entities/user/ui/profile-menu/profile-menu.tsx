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
  const menuItems = [
    {
      icon: <ShoppingBag size={20} className="text-orange" />,
      label: "Покупки",
      href: "/profile/purchases",
      color: "bg-orange/10",
    },
    {
      icon: <Ticket size={20} className="text-blue" />,
      label: "Купоны",
      href: "/profile/coupons",
      color: "bg-blue/10",
    },
    {
      icon: <MessageCircle size={20} className="text-[#37aee2]" />,
      label: "Чат-бот",
      href: "/profile/chat",
      color: "bg-[#37aee2]/10",
    },
    {
      icon: <Settings size={20} className="text-gray-600" />,
      label: "Настройки",
      href: "/profile/settings",
      color: "bg-gray-100",
    },
    {
      icon: <LogOut size={20} className="text-[#ff272c]" />,
      label: "Выйти из аккаунта",
      href: "/auth/logout",
      color: "bg-[#ff272c]/10",
    },
  ];

  return (
    <nav className="space-y-3">
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
}
