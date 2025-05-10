"use client";

import { useState } from "react";
import GameCard from "@/entities/games/ui/game-card/game-card";
import JoystickIcon from "@/shared/icons/joystick-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { useTranslations } from "next-intl";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export const MobileGamesBlock = () => {
  const t = useTranslations();
  const [limit, setLimit] = useState(8); // Initially show 8 products
  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts(undefined, limit);

  // Filter out Bigo products
  const nonBigoProducts =
    productsData?.data?.filter((product) => product.type !== "Bigo") || [];

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
    // If we're already showing all products, this could link to a dedicated page
    // For now, we'll just increase the limit to show more products
    setLimit((prevLimit) => prevLimit + 8);
  };

  // Check if there are more products to load
  const hasMoreProducts = productsData?.meta?.total
    ? productsData.meta.total > nonBigoProducts.length
    : false;

  return (
    <div className="w-full">
      <SectionTitle icon={<JoystickIcon />} title={t("mobile_games.title")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {nonBigoProducts.length > 0 ? (
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
          ))
        ) : (
          <div className="col-span-full p-4 text-center text-muted-foreground">
            No games available at the moment.
          </div>
        )}
      </div>

      {/* View all button - Mobile optimized */}
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
