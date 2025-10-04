"use client";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
export default function PublicOfferContactFooter() {
  const i18n = useTranslations("PublicOfferContactFooter");

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      {/* Company Information Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4">
          Информация о компании / Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Директор / Director:</span> Davit
              Aslanyan
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Компания / Company:</span> DMME HK
              LIMITED
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">
                Рег. номер компании / Company Reg. No.:
              </span>{" "}
              77196171
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">
                Бизнес рег. номер / Business Reg. No.:
              </span>{" "}
              77196171-000-10-24-9
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Страна / Country:</span> Hong Kong
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Адрес / Address:</span> 8/F., China
              Hong Kong Tower, 8-12 Hennessy Road, Wan Chai, Hong Kong
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Город / City:</span> Hong Kong
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 shrink-0">
            <CreditCard className="text-blue-600 w-6 h-6" />{" "}
            {/* Assuming text-blue-600 */}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{i18n("title")}</h3>
            <p className="text-gray-500 text-sm">{i18n("subtitle")}</p>
          </div>
        </div>
        <a
          href={`mailto:${i18n("email")}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap" /* Assuming blue-600 and blue-700 */
        >
          {i18n("email")}
        </a>
      </div>
    </div>
  );
}
