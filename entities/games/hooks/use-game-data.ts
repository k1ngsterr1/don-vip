"use client";

import type { CurrencyOption } from "@/entities/currency/model/types";
import { useMemo } from "react";
import { Game } from "../model/types";

export function useGameData(gameSlug: string): {
  game: Game;
  currencyOptions: CurrencyOption[];
} {
  const game = useMemo(() => {
    if (gameSlug === "street-fighter") {
      return {
        id: "sf-1",
        slug: "street-fighter",
        name: "Street Fighter",
        description:
          "Присоединяйтесь к Рyu и Ken в их путешествии на бойцовский турнир и примите участие в этом приключении. Выполняйте миссии и станьте сильнейшим!",
        bannerImage: "/banner.webp",
        currencyName: "Rainbow Stone",
        currencyImage: "/diamond.webp",
        requiresServer: false,
      };
    } else if (gameSlug === "watcher-realms") {
      return {
        id: "wr-1",
        slug: "watcher-realms",
        name: "Watcher Realms",
        description:
          "Исследуйте фэнтезийный мир Watcher Realms, сражайтесь с монстрами и другими игроками, собирайте редкие предметы и станьте легендой!",
        bannerImage: "/battle-for-the-pass.png",
        currencyName: "W-Gold",
        currencyImage: "/game-card.webp",
        requiresServer: true,
      };
    }

    // Default fallback
    return {
      id: "default",
      slug: "default-game",
      name: "Game",
      description: "Game description",
      bannerImage: "/placeholder.svg",
      currencyName: "Currency",
      currencyImage: "/diamond.webp",
      requiresServer: false,
    };
  }, [gameSlug]);

  const currencyOptions = useMemo(() => {
    if (gameSlug === "street-fighter") {
      return [
        { id: 1, amount: 599, price: "404.00 руб", priceValue: 404.0 },
        { id: 2, amount: 1199, price: "809.00 руб", priceValue: 809.0 },
        { id: 3, amount: 2399, price: "1,611.00 руб", priceValue: 1611.0 },
        { id: 4, amount: 3599, price: "2,511.00 руб", priceValue: 2511.0 },
        { id: 5, amount: 5999, price: "4,127.00 руб", priceValue: 4127.0 },
        { id: 6, amount: 11199, price: "8,351.00 руб", priceValue: 8351.0 },
      ];
    } else if (gameSlug === "watcher-realms") {
      return [
        { id: 1, amount: 499, price: "490.00 руб", priceValue: 490.0 },
        { id: 2, amount: 999, price: "990.00 руб", priceValue: 990.0 },
        { id: 3, amount: 1999, price: "1,990.00 руб", priceValue: 1990.0 },
        { id: 4, amount: 2999, price: "2,890.00 руб", priceValue: 2890.0 },
        { id: 5, amount: 4999, price: "4,790.00 руб", priceValue: 4790.0 },
        { id: 6, amount: 9999, price: "9,390.00 руб", priceValue: 9390.0 },
        { id: 7, amount: 29999, price: "28,090.00 руб", priceValue: 28090.0 },
        { id: 8, amount: 59999, price: "56,090.00 руб", priceValue: 56090.0 },
      ];
    }

    // Default fallback
    return [
      { id: 1, amount: 100, price: "100.00 руб", priceValue: 100.0 },
      { id: 2, amount: 200, price: "200.00 руб", priceValue: 200.0 },
    ];
  }, [gameSlug]);

  return { game, currencyOptions };
}
