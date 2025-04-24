import Image from "next/image";
import logo from "@/assets/Logo.webp";
import tbank from "@/assets/T-Bank.webp";
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { text: "ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ", href: "/terms" },
    { text: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ", href: "/privacy-policy" },
    { text: "ПУБЛИЧНАЯ ОФЕРТА", href: "/public-offer" },
    { text: "СВЯЗАТЬСЯ С НАМИ", href: "/contact" },
    { text: "ОТЗЫВЫ", href: "/reviews" },
    { text: "FAQ", href: "/faq" },
  ];

  return (
    <footer className="bg-white px-4 mt-[24px] py-6 border-t border-gray-100">
      <div className="flex items-center mb-4">
        <Image
          src={logo.src || "/placeholder.svg"}
          width={161}
          height={31}
          alt="DON-VIP Logo"
          className="w-[161px] h-[31px]"
        />
        <div className="ml-auto">
          <Image
            src={tbank.src || "/placeholder.svg"}
            width={32}
            height={32}
            className="w-[32px] h-[32px]"
            alt="T-Bank"
          />
        </div>
      </div>
      <div className="space-y-3">
        {footerLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="block text-[13px] text-dark uppercase hover:text-blue-600 transition-colors"
          >
            {link.text}
          </Link>
        ))}
      </div>
      <div className="mt-6 text-left text-gray-400 ">
        © Don-Vip.com 2025. Все права защищены.
      </div>
    </footer>
  );
}
