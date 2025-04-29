import GameCard from "@/entities/games/ui/game-card/game-card";
import CardsIcon from "@/shared/icons/cards-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { DicesIcon } from "lucide-react";

export const ServicesBlock = () => {
  const services = [
    {
      id: 1,
      title: "BIGO LIVE",
      image: "/feature-card.webp",
    },
    {
      id: 2,
      title: "BIGO LIVE",
      image: "/feature-card.webp",
    },
  ];

  return (
    <div className="w-full flex flex-col mt-[24px] px-4 py-3">
      <SectionTitle icon={<CardsIcon />} title="сервисы" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {services.map((service: any) => (
          <GameCard
            key={service.id}
            title={service.title}
            image={service.image}
            hasGem={service.hasGem}
            gemColor={service.gemColor}
            badge={service.badge}
          />
        ))}
      </div>
    </div>
  );
};
