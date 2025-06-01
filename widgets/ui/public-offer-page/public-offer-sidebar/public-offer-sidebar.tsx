"use client";
import { Link } from "@/i18n/navigation";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function PublicOfferSidebar() {
  const i18n = useTranslations("PublicOfferSidebar");
  const [activeSection, setActiveSection] = useState("section1");

  const sections = [
    { id: "section1", titleKey: "contents.sections.general" },
    { id: "section2", titleKey: "contents.sections.subject" },
    { id: "section3", titleKey: "contents.sections.order" },
    { id: "section4", titleKey: "contents.sections.payment" },
    { id: "section5", titleKey: "contents.sections.changes" },
    { id: "section6", titleKey: "contents.sections.other" },
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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.1 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    // Removed lg:w-1/4 as it's applied by parent in DesktopPublicOffer
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      {" "}
      {/* Applied sticky top-24 */}
      <h2 className="font-medium text-lg mb-4 text-gray-800">
        {i18n("contents.title")}
      </h2>
      <ul className="space-y-3">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left flex items-center transition-colors duration-200 rounded-md py-2 px-3 ${
                activeSection === section.id
                  ? "text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-500"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs shrink-0 ${
                  activeSection === section.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {index + 1}
              </span>
              {i18n(section.titleKey)}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center text-gray-500 mb-3">
          <FileText size={16} className="mr-2" />
          <span className="text-sm">{i18n("documents.title")}</span>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors" // Assuming text-blue-600
            >
              {i18n("documents.privacyPolicy")}
            </Link>
          </li>
          <li>
            <Link
              href="/user-agreement"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors" // Assuming text-blue-600
            >
              {i18n("documents.terms")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
