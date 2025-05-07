import GameCard from "@/entities/games/ui/game-card/game-card";
import CardsIcon from "@/shared/icons/cards-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { useTranslations } from "next-intl";

export const ServicesBlock = () => {
  const t = useTranslations();

  const services = [
    {
      id: 1,
      title: "PUBG MOBILE",
      image: "/PUBG.jpg",
    },
    {
      id: 2,
      title: "BIGO LIVE",
      image: "/feature-card.webp",
    },
  ];

  return (
    <div className="w-full">
      <SectionTitle icon={<CardsIcon />} title={t("services.title")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {services.map((service: any) => (
          <GameCard
            key={service.id}
            title={service.title}
            image={service.image}
            href={`/${service.id}`}
            hasGem={service.hasGem}
            gemColor={service.gemColor}
            badge={service.badge}
          />
        ))}
      </div>
    </div>
  );
};
