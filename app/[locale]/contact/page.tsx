import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ContactsPageBlock } from "@/widgets/ui/contacts-page/contacts-page";
import { CouponsHeaderWidget } from "@/widgets/ui/coupons-page/coupon-widget/coupon-widget";
import { CouponsManagerWidget } from "@/widgets/ui/coupons-page/coupons-manager/coupons-manager";

export default function ContactPage() {
  return (
    <ContentWrapper>
      <ContactsPageBlock />
    </ContentWrapper>
  );
}
