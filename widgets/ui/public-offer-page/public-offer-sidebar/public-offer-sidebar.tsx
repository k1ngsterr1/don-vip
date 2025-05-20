"use client";
import { Link } from "@/i18n/navigation";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PublicOfferSidebar() {
  const i18n = useTranslations("PublicOfferSidebar");

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
        <h2 className="font-medium text-lg mb-4 text-gray-800">
          {i18n("contents.title")}
        </h2>
        <ul className="space-y-3">
          <li>
            <a
              href="#section1"
              className="text-blue hover:underline flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue flex items-center justify-center mr-2 text-xs">
                1
              </span>
              {i18n("contents.sections.general")}
            </a>
          </li>
          <li>
            <a
              href="#section2"
              className="text-gray-700 hover:text-blue transition-colors flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-2 text-xs">
                2
              </span>
              {i18n("contents.sections.subject")}
            </a>
          </li>
          <li>
            <a
              href="#section3"
              className="text-gray-700 hover:text-blue transition-colors flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-2 text-xs">
                3
              </span>
              {i18n("contents.sections.order")}
            </a>
          </li>
          <li>
            <a
              href="#section4"
              className="text-gray-700 hover:text-blue transition-colors flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-2 text-xs">
                4
              </span>
              {i18n("contents.sections.payment")}
            </a>
          </li>
          <li>
            <a
              href="#section5"
              className="text-gray-700 hover:text-blue transition-colors flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-2 text-xs">
                5
              </span>
              {i18n("contents.sections.changes")}
            </a>
          </li>
          <li>
            <a
              href="#section6"
              className="text-gray-700 hover:text-blue transition-colors flex items-center"
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-2 text-xs">
                6
              </span>
              {i18n("contents.sections.other")}
            </a>
          </li>
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
                className="text-sm text-gray-700 hover:text-blue transition-colors"
              >
                {i18n("documents.privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link
                href="/user-agreement"
                className="text-sm text-gray-700 hover:text-blue transition-colors"
              >
                {i18n("documents.terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
