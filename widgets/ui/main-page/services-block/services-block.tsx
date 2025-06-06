"use client";

import GameCard from "@/entities/games/ui/game-card/game-card";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import CardsIcon from "@/shared/icons/cards-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { useTranslations } from "next-intl";

export const ServicesBlock = () => {
  const t = useTranslations();
  const { data: productsData, isLoading, isError } = useProducts();

  const bigoProducts =
    productsData?.data.filter((product) => product.type === "Bigo") || [];

  if (isLoading) {
    return (
      <div className="w-full">
        <SectionTitle icon={<CardsIcon />} title={t("services.title")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
        <SectionTitle icon={<CardsIcon />} title={t("services.title")} />
        <div className="p-4 text-center text-red-500">
          Failed to load products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SectionTitle icon={<CardsIcon />} title={t("services.title")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bigoProducts.length > 0 ? (
          bigoProducts.map((product: any) => (
            <GameCard
              key={product.id}
              title={product.name}
              image={product.image || "/diverse-group-playing-board-game.png"}
              href={`/product/${product.id}`}
              hasGem={false}
              gemColor=""
              badge=""
            />
          ))
        ) : (
          <div className="col-span-full p-4 text-center text-muted-foreground">
            {t("services.notFound")}
          </div>
        )}
      </div>
    </div>
  );
};
