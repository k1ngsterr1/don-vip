import GameCard from "@/entities/game-card/game-card";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { GamepadIcon } from "lucide-react";
import React from "react";

export const MobileGamesBlock = () => {
  const services = [
    {
      id: 1,
      image: "/game-card.webp",
    },
    {
      id: 2,
      image: "/game-card.webp",
    },
    {
      id: 3,
      image: "/game-card.webp",
    },
    {
      id: 4,
      image: "/game-card.webp",
    },
    {
      id: 5,
      image: "/game-card.webp",
    },
    {
      id: 6,
      image: "/game-card.webp",
    },
    {
      id: 7,
      image: "/game-card.webp",
    },
    {
      id: 8,
      image: "/game-card.webp",
    },
  ];

  return (
    <div className="w-full flex flex-col px-4 py-3">
      <SectionTitle
        icon={<GamepadIcon className="text-orange" width={16} height={16} />}
        title="мобильные игры"
      />
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
