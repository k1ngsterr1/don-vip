"use client";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import PublicOfferSidebar from "../public-offer-sidebar/public-offer-sidebar";
import PublicOfferContent from "../public-offer-content/public-offer-content";
import PublicOfferContactFooter from "../public-offer-footer/public-offer-footer";

export default function DesktopPublicOffer() {
  const i18n = useTranslations("DesktopPublicOffer");

  return (
    <div className="hidden md:block w-full py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group" // Assuming text-blue-600 from other components
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">{i18n("backLink")}</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {i18n("title")}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              {i18n("lastUpdate")} • {i18n("location")}
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <ShoppingBag className="text-blue-600 w-8 h-8" />{" "}
            {/* Assuming text-blue-600 */}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          {" "}
          {/* Added wrapper div for sidebar consistent with other desktop layouts */}
          <PublicOfferSidebar />
        </div>
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                {i18n("introText")}
              </p>
            </div>
            <PublicOfferContent />
            <PublicOfferContactFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
