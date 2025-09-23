"use client";

import { useState } from "react";
import GameCard from "@/entities/games/ui/game-card/game-card";
import JoystickIcon from "@/shared/icons/joystick-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { useTranslations, useLocale } from "next-intl";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export const MobileGamesBlock = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [limit, setLimit] = useState(8); // Initially show 8 products
  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts(undefined, limit);

  // Filter out Bigo products
  const nonBigoProducts =
    productsData?.data?.filter((product) => product.type !== "Bigo") || [];

  // Hardcoded design services as game-style products
  const designServiceProducts = [
    {
      id: "design-mini-fix",
      name: locale === "ru" ? "Мини-правка" : "Mini Fix",
      image: "/feature-card.webp", // используем существующее изображение
      href: "/design-services",
      hasGem: false,
      gemColor: "",
      badge: locale === "ru" ? "40 ₽" : "$1.50",
    },
    {
      id: "design-icon",
      name: locale === "ru" ? "Иконка" : "Icon Design",
      image: "/feature-card.webp",
      href: "/design-services",
      hasGem: false,
      gemColor: "",
      badge: locale === "ru" ? "167 ₽" : "$5.90",
    },
    {
      id: "design-banner",
      name: locale === "ru" ? "Сториc-баннер" : "Stories Banner",
      image: "/feature-card.webp",
      href: "/design-services",
      hasGem: false,
      gemColor: "",
      badge: locale === "ru" ? "335 ₽" : "$11.50",
    },
    {
      id: "design-card",
      name: locale === "ru" ? "Визитка" : "Business Card",
      image: "/feature-card.webp",
      href: "/design-services",
      hasGem: false,
      gemColor: "",
      badge: locale === "ru" ? "505 ₽" : "$17.50",
    },
  ];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <SectionTitle icon={<JoystickIcon />} title={t("mobile_games.title")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="w-full">
        <SectionTitle icon={<JoystickIcon />} title={t("mobile_games.title")} />
        <div className="p-4 text-center text-red-500">
          Failed to load games. Please try again later.
        </div>
      </div>
    );
  }

  const handleViewAll = () => {
    setLimit((prevLimit) => prevLimit + 8);
  };

  const hasMoreProducts = productsData?.meta?.total
    ? productsData.meta.total > nonBigoProducts.length
    : false;

  return (
    <div className="w-full">
      <SectionTitle icon={<JoystickIcon />} title={t("mobile_games.title")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {/* Render games */}
        {nonBigoProducts.length > 0 &&
          nonBigoProducts.map((product) => (
            <GameCard
              key={product.id}
              title={product.name}
              image={product.image || "/game-card.webp"}
              href={`/product/${product.id}`}
              hasGem={false}
              gemColor=""
              badge=""
            />
          ))}

        {/* Render design services as game cards */}
        {designServiceProducts.map((service) => (
          <GameCard
            key={service.id}
            title={service.name}
            image={service.image}
            href={service.href}
            hasGem={service.hasGem}
            gemColor={service.gemColor}
            badge={service.badge}
          />
        ))}

        {/* Show message if no content */}
        {nonBigoProducts.length === 0 && designServiceProducts.length === 0 && (
          <div className="col-span-full p-4 text-center text-muted-foreground">
            {t("services.notFound")}
          </div>
        )}
      </div>
      {nonBigoProducts.length > 0 && hasMoreProducts && (
        <div className="mt-4 text-center">
          <button
            onClick={handleViewAll}
            className="bg-gray-100 text-dark text-xs px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            {t("mobile_games.view_all")}
          </button>
        </div>
      )}
    </div>
  );
};
