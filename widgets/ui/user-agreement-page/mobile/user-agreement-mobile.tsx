"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { UserAgreementContactFooter } from "../footer/user-agreement-footer";
import { UserAgreementSidebar } from "../sidebar/user-agreement-sidebar";
import { UserAgreementContent } from "../content/user-agreement-content";
import { Link } from "@/i18n/navigation";

export function UserAgreementMobile() {
  return (
    <div className="md:hidden px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
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
            <h1 className="text-2xl font-medium text-gray-800">
              Пользовательское соглашение
            </h1>
            <p className="text-gray-500 mt-2">
              Дата последнего обновления: 11 мая 2025 года
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
            <FileText className="text-blue-600 w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <UserAgreementSidebar />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <UserAgreementContent />
        <UserAgreementContactFooter />
      </div>
    </div>
  );
}
