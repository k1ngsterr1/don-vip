import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import HeroBanner from "@/widgets/ui/main-page/hero-banner/hero-banner";
import { MobileGamesBlock } from "@/widgets/ui/main-page/mobile-games/mobile-games";
import { ServicesBlock } from "@/widgets/ui/main-page/services-block/services-block";

export default function Home() {
  const heroSlides = [
    {
      id: 1,
      image: {
        desktop: "/bigo_pc.webp",
        mobile: "/bigo_banner_mob.webp",
      },
      link: "/product/1",
    },
    {
      id: 2,
      image: {
        desktop: "/mlbb_pc.webp",
        mobile: "/banner_new.webp",
      },
      link: "/product/3",
    },
    {
      id: 3,
      image: {
        desktop: "/pubg_pc.webp",
        mobile: "/pubg_banner_mob.webp",
      },
      link: "/product/2",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center pb-20">
      <div className="w-full m-auto">
        <HeroBanner slides={heroSlides} />
      </div>
      <ContentWrapper>
        <div className="w-full max-w-[1680px]">
          <div className="mt-6 sm:mt-8">
            <ServicesBlock />
          </div>
          <div className="mt-6 sm:mt-10">
            <MobileGamesBlock />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
