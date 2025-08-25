"use client";

import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import HeroBanner from "@/widgets/ui/main-page/hero-banner/hero-banner";
import { MobileGamesBlock } from "@/widgets/ui/main-page/mobile-games/mobile-games";
import { ServicesBlock } from "@/widgets/ui/main-page/services-block/services-block";
import { useBanners } from "@/shared/hooks/useBanners";
import React from "react";

function HeroBannerSkeleton() {
  return (
    <div
      className="relative max-w-[1616px] w-full mx-auto bg-gray-200 animate-pulse overflow-hidden rounded-xl"
      style={{ height: "401px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-8 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: slides, isLoading, error } = useBanners();

  return (
    <div className="w-full flex flex-col items-center pb-20">
      <div className="w-full m-auto">
        {isLoading ? (
          <HeroBannerSkeleton />
        ) : error ? (
          <div>Error loading banners</div>
        ) : slides && slides.length > 0 ? (
          <HeroBanner slides={slides} />
        ) : null}
      </div>
      <ContentWrapper>
        <div className="w-full max-w-[1680px]">
          <div className="mt-6 sm:mt-8">
            <ServicesBlock />
          </div>
          {/* <div className="mt-6 sm:mt-10">
            <MobileGamesBlock />
          </div> */}
        </div>
      </ContentWrapper>
    </div>
  );
}
