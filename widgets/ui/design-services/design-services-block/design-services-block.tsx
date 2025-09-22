"use client";

import { useTranslations } from "next-intl";
import { ServiceCard } from "../service-card/service-card";

export function DesignServicesBlock() {
  const t = useTranslations("DesignServices");

  const services = [
    {
      id: "mini-fix",
      title: t("services.miniFix.title"),
      description: t("services.miniFix.description"),
      price: "40 ₽",
      features: [t("services.miniFix.feature")],
    },
    {
      id: "icon",
      title: t("services.icon.title"),
      description: t("services.icon.description"),
      price: "167 ₽",
      features: [t("services.icon.feature")],
    },
    {
      id: "stories-banner",
      title: t("services.storiesBanner.title"),
      description: t("services.storiesBanner.description"),
      price: "335 ₽",
      features: [t("services.storiesBanner.feature")],
    },
    {
      id: "business-card",
      title: t("services.businessCard.title"),
      description: t("services.businessCard.description"),
      price: "505 ₽",
      features: [t("services.businessCard.feature")],
    },
    {
      id: "flyer",
      title: t("services.flyer.title"),
      description: t("services.flyer.description"),
      price: "840 ₽",
      features: [t("services.flyer.feature")],
    },
    {
      id: "base-logo",
      title: t("services.baseLogo.title"),
      description: t("services.baseLogo.description"),
      price: "1 670 ₽",
      features: [
        t("services.baseLogo.feature1"),
        t("services.baseLogo.feature2"),
      ],
    },
    {
      id: "avatar-cover",
      title: t("services.avatarCover.title"),
      description: t("services.avatarCover.description"),
      price: "2 510 ₽",
      features: [t("services.avatarCover.feature")],
    },
    {
      id: "mini-presentation",
      title: t("services.miniPresentation.title"),
      description: t("services.miniPresentation.description"),
      price: "3 350 ₽",
      features: [t("services.miniPresentation.feature")],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-unbounded)" }}
        >
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            price={service.price}
            features={service.features}
          />
        ))}
      </div>
    </div>
  );
}
