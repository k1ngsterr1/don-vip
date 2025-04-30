import HeroBanner from "@/widgets/ui/main-page/hero-banner/hero-banner";
import { MobileGamesBlock } from "@/widgets/ui/main-page/mobile-games/mobile-games";
import { PopularCategories } from "@/widgets/ui/main-page/popular-categories/popular-categories";
import { ServicesBlock } from "@/widgets/ui/main-page/services-block/services-block";

export default function Home() {
  const heroSlides = [
    {
      id: 1,
      image: "/banner.webp",
    },
    {
      id: 2,
      image: "/banner.webp",
    },
    {
      id: 3,
      image: "/banner.webp",
    },
    {
      id: 4,
      image: "/banner.webp",
    },
    {
      id: 5,
      image: "/banner.webp",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center pb-20">
      <div className="w-full">
        <HeroBanner slides={heroSlides} />
      </div>
      <div className="w-full max-w-[1680px] px-4 sm:px-6 md:px-8">
        <div className="mt-6 sm:mt-8">
          <ServicesBlock />
        </div>
        <div className="hidden xxs:block mt-6 sm:mt-8">
          <PopularCategories />
        </div>
        <div className="mt-6 sm:mt-10">
          <MobileGamesBlock />
        </div>
      </div>
    </div>
  );
}
