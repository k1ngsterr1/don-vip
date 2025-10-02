import { DesignServices } from "@/widgets/ui/services-page/design-services/design-services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дизайн Услуги | DonVip",
  description:
    "Профессиональные дизайн-услуги: логотипы, фирменный стиль, веб-дизайн, мобильные приложения и многое другое.",
  keywords:
    "дизайн услуги, логотип, фирменный стиль, веб-дизайн, мобильный дизайн, UI/UX",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DesignServices />
    </div>
  );
}
