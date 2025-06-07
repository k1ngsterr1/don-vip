import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { AuthSuccessWidget } from "@/widgets/ui/auth-success-page/auth-success-page";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const t = useTranslations("auth_success");

  return (
    <ContentWrapper>
      <div className="hidden md:block absolute top-40 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-70 blur-3xl"></div>
      <div className="hidden md:block absolute top-60 right-20 w-40 h-40 bg-blue-50 rounded-full opacity-70 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 pt-4 md:pt-12 lg:pt-16 relative">
        <div className="mb-6">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group w-fit"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">{t("backLink") || "Вернуться"}</span>
          </Link>
        </div>
        <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-100 md:p-8 lg:p-10 md:backdrop-blur-sm md:bg-white/95">
          <div>
            <AuthSuccessWidget />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
