import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import PublicOfferContent from "../public-offer-content/public-offer-content";
import PublicOfferContactFooter from "../public-offer-footer/public-offer-footer";
import PublicOfferSidebar from "../public-offer-sidebar/public-offer-sidebar";

export default function DesktopPublicOffer() {
  return (
    <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      {/* Header section */}
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
              Публичная оферта
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Последнее обновление: 1 апреля 2025 г. • г. Находка
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <ShoppingBag className="text-blue w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <PublicOfferSidebar />
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                Настоящая Публичная оферта является предложением ИП Асланян
                Давид Арменович заключить договор купли-продажи виртуальных
                товаров на условиях, указанных ниже.
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
