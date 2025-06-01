"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export function PrivacyPolicySidebar() {
  const t = useTranslations("privacyPolicy");
  const [activeSection, setActiveSection] = useState("section1");

  const sections = [
    { id: "section1", titleKey: "sections.generalProvisions.title" },
    { id: "section2", titleKey: "sections.processingPurposes.title" },
    { id: "section3", titleKey: "sections.processingConditions.title" },
    { id: "section4", titleKey: "sections.obligations.title" },
    { id: "section5", titleKey: "sections.liability.title" },
    { id: "section6", titleKey: "sections.disputeResolution.title" },
    { id: "section7", titleKey: "sections.additionalTerms.title" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.1 } // Adjust rootMargin as needed
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []); // Re-run if sections array changes, though it's static here

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Adjust for fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId); // Optimistically update
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      {" "}
      {/* Added sticky top-24 */}
      <h3 className="text-lg font-medium text-gray-800 mb-4">{t("title")}</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
              activeSection === section.id
                ? "text-blue-700 bg-blue-50 font-medium border-l-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {t(section.titleKey)}
          </button>
        ))}
      </nav>
    </div>
  );
}
