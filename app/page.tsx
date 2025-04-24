import HeroBanner from "@/widgets/ui/main-page/hero-banner/hero-banner";
import { MobileGamesBlock } from "@/widgets/ui/main-page/mobile-games/mobile-games";
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
    <div className="w-full flex flex-col items-center">
      <HeroBanner slides={heroSlides} />
      <ServicesBlock />
      <MobileGamesBlock />
    </div>
  );
}
