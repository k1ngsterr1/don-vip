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
    // Use Intersection Observer for better performance and reliability
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      }
    );

    // Observe all sections after a delay to ensure they're rendered
    const timer = setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Find the target element
    const targetElement = document.getElementById(sectionId);

    if (!targetElement) {
      console.error(`Section ${sectionId} not found`);
      return;
    }

    // Calculate position
    const headerOffset = 100; // Adjust this value based on your header height
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Scroll to position
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Update active section immediately
    setActiveSection(sectionId);
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
