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
      description: "История ваших заказов и покупок",
    },
    {
      icon: <Ticket size={20} className="text-blue" />,
      label: "Купоны",
      href: "/profile/coupons",
      color: "bg-blue/10",
      description: "Ваши активные купоны и скидки",
    },
    {
      icon: <MessageCircle size={20} className="text-[#37aee2]" />,
      label: "Чат-бот",
      href: "/profile/chat",
      color: "bg-[#37aee2]/10",
      description: "Общение с нашим чат-ботом поддержки",
    },
    {
      icon: <Settings size={20} className="text-gray-600" />,
      label: "Настройки",
      href: "/profile/settings",
      color: "bg-gray-100",
      description: "Настройки аккаунта и приложения",
    },
    {
      icon: <LogOut size={20} className="text-[#ff272c]" />,
      label: "Выйти из аккаунта",
      href: "/auth/logout",
      color: "bg-[#ff272c]/10",
      description: "Выход из текущей сессии",
    },
  ];

  // Mobile version (unchanged)
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
