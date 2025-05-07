import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import DesktopPublicOffer from "@/widgets/ui/public-offer-page/desktop-public-offer/desktop-public-offer";
import MobilePublicOffer from "@/widgets/ui/public-offer-page/mobile-public-offer/mobile-public-offer";

export default function PublicOfferPage() {
  return (
    <ContentWrapper>
      <MobilePublicOffer />
      <DesktopPublicOffer />
    </ContentWrapper>
  );
}
