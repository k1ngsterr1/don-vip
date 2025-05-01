"use client";

import GameCard from "@/entities/games/ui/game-card/game-card";
import JoystickIcon from "@/shared/icons/joystick-icon";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { useTranslations } from "next-intl";

export const MobileGamesBlock = () => {
  const t = useTranslations();

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
    <div className="w-full">
      <SectionTitle icon={<JoystickIcon />} title={t("mobile_games.title")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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

      {/* View all button - Mobile optimized */}
      <div className="mt-4 text-center">
        <button className="bg-gray-100 text-dark text-xs px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
          {t("mobile_games.view_all")}
        </button>
      </div>
    </div>
  );
};
