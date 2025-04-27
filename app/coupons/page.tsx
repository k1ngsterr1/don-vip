import { CouponsHeaderWidget } from "@/widgets/ui/coupons-page/coupon-widget/coupon-widget";
import { CouponsManagerWidget } from "@/widgets/ui/coupons-page/coupons-manager/coupons-manager";

export default function CouponsPage() {
  return (
    <main>
      <div className="px-4 pb-20">
        <CouponsHeaderWidget />
        <CouponsManagerWidget />
      </div>
    </main>
  );
}
