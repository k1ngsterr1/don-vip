"use client";

import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface OrderFooterProps {
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { label: "пользовательское соглашение", href: "/user-agreement" },
  { label: "политика конфиденциальности", href: "/privacy-policy" },
  { label: "Публичная оферта", href: "/public-offer" },
  { label: "связаться с нами", href: "/contact" },
  { label: "отзывы", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

export function OrderFooter({ links = defaultLinks }: OrderFooterProps) {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-6">
      {/* Logo and Payment */}
      <div className="flex items-center justify-between mb-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <div>
            <div className="text-gray-800 font-bold text-sm">DON–VIP.COM</div>
            <div className="text-xs">
              <span className="text-blue-600">Донаты – это</span>{" "}
              <span className="text-red-500">просто!</span>
            </div>
          </div>
        </div>

        {/* Payment Icon */}
        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs">💳</span>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3 mb-6">
        {links.map((link, index) => (
          <div key={index}>
            <Link
              href={link.href}
              className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="text-gray-500 text-xs">
        © Don-Vip.com, 2025. Все права защищены.
      </div>
    </div>
  );
}
