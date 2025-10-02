import { DesignServicesOrderBlock } from "@/widgets/ui/product-services-page/design-services-order-block/design-services-order-block";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export const metadata: Metadata = {
  title: "Дизайн Услуги | DonVip",
  description:
    "Профессиональные дизайн-услуги: логотипы, фирменный стиль, веб-дизайн, мобильные приложения и многое другое.",
  keywords:
    "дизайн услуги, логотип, фирменный стиль, веб-дизайн, мобильный дизайн, UI/UX",
};

function OrderPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Skeleton className="w-full h-[250px] rounded-lg mb-6" />
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b">
              <Skeleton className="w-1/2 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-3/4 h-4" />
            </div>
            <div className="p-6">
              <Skeleton className="w-1/3 h-5 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full h-[120px] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <Skeleton className="w-1/2 h-6 mb-4" />
            <div className="space-y-4 mb-6">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </div>
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductServicesPage() {
  return (
    <Suspense fallback={<OrderPageSkeleton />}>
      <DesignServicesOrderBlock />
    </Suspense>
  );
}
