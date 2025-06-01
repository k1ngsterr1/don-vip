"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
export function UserAgreementSidebar() {
  const [activeSection, setActiveSection] = useState("general-provisions");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const t = useTranslations("userAgreement.sidebar");

  const sections = [
    { id: "general-provisions", key: "section1" },
    { id: "terms-definitions", key: "section2" },
    { id: "registration-account", key: "section3" },
    { id: "terms-of-use", key: "section4" },
    { id: "digital-goods-purchase", key: "section5" },
    { id: "intellectual-property", key: "section6" },
    { id: "confidentiality", key: "section7" },
    { id: "liability-limitation", key: "section8" },
    { id: "account-termination", key: "section9" },
    { id: "force-majeure", key: "section10" },
    { id: "payment-conditions", key: "section11" },
    { id: "refunds", key: "section12" },
    { id: "third-party-liability", key: "section13" },
    { id: "applicable-law", key: "section14" },
    { id: "agreement-changes", key: "section15" },
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px", // Adjust based on your layout
        threshold: 0.1, // A small part of the section is visible
      }
    );

    const currentObserver = observerRef.current;

    const timer = setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && currentObserver) {
          currentObserver.observe(element);
        }
      });
    }, 500); // Delay to ensure content is rendered

    return () => {
      clearTimeout(timer);
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Adjust as needed for fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId); // Optimistically update active section
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 sticky top-24">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{t("title")}</h3>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={`block w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {t(section.key)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
