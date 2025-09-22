import { Metadata } from "next";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { DesignServices } from "@/widgets/ui/design-services/design-services";

export const metadata: Metadata = {
  title: "Дизайн-услуги с фиксированными ценами | Don VIP",
  description:
    "Профессиональные дизайн-услуги: логотипы, флаеры, баннеры, визитки. Фиксированные цены, быстрое выполнение, гарантия качества.",
  keywords:
    "дизайн услуги, логотип, флаер, баннер, визитка, дизайн на заказ, графический дизайн",
};

export default function DesignServicesPage() {
  return (
    <ContentWrapper>
      <DesignServices />
    </ContentWrapper>
  );
}
