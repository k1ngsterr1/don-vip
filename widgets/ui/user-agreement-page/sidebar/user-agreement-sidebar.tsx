"use client";

import { useState } from "react";
import Link from "next/link";

export function UserAgreementSidebar() {
  const [activeSection, setActiveSection] = useState("general-provisions");

  const sections = [
    { id: "general-provisions", title: "1. Общие положения" },
    { id: "terms-definitions", title: "2. Термины и определения" },
    { id: "registration-account", title: "3. Регистрация и аккаунт" },
    { id: "terms-of-use", title: "4. Условия использования сайта" },
    {
      id: "digital-goods-purchase",
      title: "5. Покупка цифровых товаров и услуг",
    },
    { id: "intellectual-property", title: "6. Интеллектуальная собственность" },
    {
      id: "confidentiality",
      title: "7. Конфиденциальность и персональные данные",
    },
    { id: "liability-limitation", title: "8. Ограничение ответственности" },
    { id: "account-termination", title: "9. Прекращение действия аккаунта" },
    { id: "force-majeure", title: "10. Форс-мажор" },
    { id: "payment-conditions", title: "11. Условия оплаты и валют" },
    { id: "refunds", title: "12. Возвраты и отмена заказов" },
    {
      id: "third-party-liability",
      title: "13. Ответственность за действия третьих лиц",
    },
  ];

  if (typeof window !== "undefined") {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    // Add scroll event listener
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 sticky top-24">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Содержание</h3>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`#${section.id}`}
                className={`block text-sm py-1.5 px-3 rounded-md transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(section.id);
                  if (element) {
                    const yOffset = -80;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    setActiveSection(section.id);
                  }
                }}
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
