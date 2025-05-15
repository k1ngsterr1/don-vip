import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { CouponsHeaderWidget } from "@/widgets/ui/coupons-page/coupon-widget/coupon-widget";
import { CouponsManagerWidget } from "@/widgets/ui/coupons-page/coupons-manager/coupons-manager";

export default function CouponsPage() {
  return (
    <ContentWrapper>
      <div className="hidden md:block absolute top-40 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-70 blur-3xl"></div>
      <div className="hidden md:block absolute top-60 right-20 w-40 h-40 bg-blue-50 rounded-full opacity-70 blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 pt-4 md:pt-12 lg:pt-16 relative">
        <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-100 md:p-8 lg:p-10 md:backdrop-blur-sm md:bg-white/95">
          <div className="max-w-3xl mx-auto">
            <CouponsHeaderWidget />
            <CouponsManagerWidget />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
