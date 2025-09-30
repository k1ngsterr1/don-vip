"use client";

import { useState } from "react";
import GameCard from "@/entities/games/ui/game-card/game-card";
import ServiceCard from "@/entities/games/ui/service-card/service-card";
import JoystickIcon from "@/shared/icons/joystick-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { useTranslations, useLocale } from "next-intl";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { Paintbrush } from "lucide-react";

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

  // Service packages data
  const servicePackages = [
    {
      id: "mini-edit",
      name: locale === "ru" ? "Мини-правка" : "Mini Edit",
      description:
        locale === "ru" ? "Мелкая корректировка" : "Small correction",
      price: locale === "ru" ? "40 ₽" : "$1.20",
      href: "/product/mini-edit",
      icon: <Paintbrush className="w-16 h-16 text-blue-600" />,
    },
    {
      id: "small-edit",
      name: locale === "ru" ? "Небольшая правка" : "Small Edit",
      description:
        locale === "ru" ? "Правка среднего объема" : "Medium-sized correction",
      price: locale === "ru" ? "80 ₽" : "$2.40",
      href: "/product/small-edit",
      icon: <Paintbrush className="w-16 h-16 text-green-600" />,
    },
    {
      id: "medium-edit",
      name: locale === "ru" ? "Средняя правка" : "Medium Edit",
      description:
        locale === "ru" ? "Правка большого объема" : "Large-sized correction",
      price: locale === "ru" ? "150 ₽" : "$4.50",
      href: "/product/medium-edit",
      icon: <Paintbrush className="w-16 h-16 text-yellow-600" />,
    },
    {
      id: "large-edit",
      name: locale === "ru" ? "Большая правка" : "Large Edit",
      description:
        locale === "ru" ? "Крупная корректировка" : "Major correction",
      price: locale === "ru" ? "250 ₽" : "$7.50",
      href: "/product/large-edit",
      icon: <Paintbrush className="w-16 h-16 text-orange-600" />,
    },
    {
      id: "full-redesign",
      name: locale === "ru" ? "Полный редизайн" : "Full Redesign",
      description:
        locale === "ru"
          ? "Полная переработка дизайна"
          : "Complete design overhaul",
      price: locale === "ru" ? "500 ₽" : "$15.00",
      href: "/product/full-redesign",
      icon: <Paintbrush className="w-16 h-16 text-red-600" />,
    },
    {
      id: "icon-generation",
      name: locale === "ru" ? "Генерация иконок" : "Icon Generation",
      description:
        locale === "ru" ? "Создание новых иконок" : "Create new icons",
      price: locale === "ru" ? "100 ₽" : "$3.00",
      href: "/product/icon-generation",
      icon: <Paintbrush className="w-16 h-16 text-purple-600" />,
    },
    {
      id: "logo-design",
      name: locale === "ru" ? "Дизайн логотипа" : "Logo Design",
      description: locale === "ru" ? "Создание логотипа" : "Logo creation",
      price: locale === "ru" ? "300 ₽" : "$9.00",
      href: "/product/logo-design",
      icon: <Paintbrush className="w-16 h-16 text-indigo-600" />,
    },
    {
      id: "custom-graphics",
      name: locale === "ru" ? "Кастомная графика" : "Custom Graphics",
      description:
        locale === "ru" ? "Индивидуальная графика" : "Custom graphic design",
      price: locale === "ru" ? "400 ₽" : "$12.00",
      href: "/product/custom-graphics",
      icon: <Paintbrush className="w-16 h-16 text-pink-600" />,
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

        {/* Render service packages */}
        {servicePackages.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.name}
            href={service.href}
            badge={service.price}
            useIcon={true}
            icon={service.icon}
            description={service.description}
          />
        ))}

        {/* Show message if no content */}
        {nonBigoProducts.length === 0 && (
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
