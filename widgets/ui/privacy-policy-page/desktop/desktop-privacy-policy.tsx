import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { PrivacyPolicyContent } from "../content/privacy-policy-content";
import { PrivacyPolicyContactFooter } from "../footer/privacy-policy-footer";
import { PrivacyPolicySidebar } from "../sidebar/privacy-policy-sidebar";

export function DesktopPrivacyPolicy() {
  return (
    <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">Вернуться</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-unbounded font-medium text-gray-800">
              Политика конфиденциальности
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Последнее обновление: 1 апреля 2025 г. • г. Находка
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <Shield className="text-blue w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <PrivacyPolicySidebar />
        </div>
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <PrivacyPolicyContent />
            <PrivacyPolicyContactFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
