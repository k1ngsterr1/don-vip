import { productService } from "@/entities/product/api/product.api";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { OrderBlock } from "@/widgets/ui/order-page/order-block";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const gameId = parseInt(resolvedParams.game, 10);
    const gameData = await productService.findOne(gameId);

    const gameName = gameData.name;
    const gameDescription = gameData.description || gameData.description_en;
    const locale = resolvedParams.locale;

    // Базовые тексты для метатегов
    const baseTexts = {
      ru: {
        buyPrefix: "Купить",
        cheapPrefix: "Дешево и быстро",
        suffix: "| DonVip",
      },
      en: {
        buyPrefix: "Buy",
        cheapPrefix: "Cheap and fast",
        suffix: "| DonVip",
      },
    };

    const texts = baseTexts[locale as keyof typeof baseTexts] || baseTexts.en;

    // Формируем title с названием игры и брендом
    const title = `${texts.buyPrefix} ${gameName} ${texts.suffix}`;

    // Формируем описание
    const description = gameDescription
      ? `${texts.cheapPrefix} ${gameName}. ${gameDescription.slice(0, 120)}...`
      : `${texts.cheapPrefix} ${gameName} ${texts.suffix}`;

    return {
      title,
      description,
      keywords: `${gameName}, ${texts.buyPrefix.toLowerCase()}, game currency, virtual currency, gaming, DonVip`,
      openGraph: {
        title,
        description,
        images: gameData.image ? [gameData.image] : [],
        siteName: "DonVip",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: gameData.image ? [gameData.image] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    const locale = resolvedParams.locale;
    const fallbackTitle = locale === "ru" ? "Игра | DonVip" : "Game | DonVip";
    const fallbackDescription =
      locale === "ru"
        ? "Покупка игровой валюты на DonVip"
        : "Buy game currency on DonVip";

    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }
}

export default async function OrderPageRoute({ params }: Props) {
  const { game } = await params;
  const gameId = parseInt(game, 10);

  return (
    <Suspense fallback={<OrderPageSkeleton />}>
      <OrderBlock gameSlug={gameId} />
    </Suspense>
  );
}

function OrderPageSkeleton() {
  return (
    <>
      <div className="md:hidden">
        <Skeleton className="w-full h-[112px] rounded-none" />
        <div className="p-4">
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-2/3 h-4" />
        </div>
        <div className="p-4 border-t border-gray-100">
          <Skeleton className="w-1/2 h-5 mb-3" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-[80px] rounded-lg" />
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Skeleton className="w-1/3 h-5 mb-2" />
          <Skeleton className="w-full h-[42px] rounded-lg mb-4" />
          <Skeleton className="w-1/3 h-5 mb-2" />
          <Skeleton className="w-full h-[42px] rounded-lg mb-4" />
          <Skeleton className="w-full h-5 mb-2" />
        </div>

        {/* Payment method skeleton */}
        <div className="p-4 border-t border-gray-100">
          <Skeleton className="w-1/2 h-5 mb-3" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="w-[120px] h-[60px] rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>
        {/* Buy button skeleton */}
        <div className="fixed bottom-16 right-[16px] px-4 py-2">
          <Skeleton className="w-[140px] h-[48px] rounded-full" />
        </div>
      </div>
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Skeleton className="w-full h-[250px] rounded-lg" />
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <Skeleton className="w-1/2 h-7 mb-3" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </div>
              <div className="p-6 border-b border-gray-100">
                <Skeleton className="w-1/3 h-6 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="w-full h-[90px] rounded-lg" />
                  ))}
                </div>
              </div>

              {/* User ID form skeleton */}
              <div className="p-6 border-b border-gray-100">
                <Skeleton className="w-1/4 h-6 mb-3" />
                <Skeleton className="w-full h-[42px] rounded-lg mb-4" />
                <Skeleton className="w-1/4 h-6 mb-3" />
                <Skeleton className="w-full h-[42px] rounded-lg mb-4" />
                <Skeleton className="w-full h-5" />
              </div>

              {/* Payment method skeleton */}
              <div className="p-6">
                <Skeleton className="w-1/3 h-6 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-[80px] rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <Skeleton className="w-1/2 h-6 mb-4" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-5" />
                  <Skeleton className="w-1/4 h-5" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-5" />
                  <Skeleton className="w-1/4 h-5" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-5" />
                  <Skeleton className="w-1/4 h-5" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="w-1/3 h-6" />
                  <Skeleton className="w-1/4 h-6" />
                </div>
                <Skeleton className="w-full h-[48px] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
