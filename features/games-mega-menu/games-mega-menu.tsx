"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { GamesMegaMenuSkeleton } from "./games-mega-menu-skeleton";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import { useRouter } from "next/navigation";

interface GameItem {
  id: number;
  name: string;
  image: string;
  learnLink: string;
  orderLink: string;
}

export function GamesMegaMenu() {
  const t = useTranslations();
  const { data: productsData, isLoading } = useProducts();
  const navigate = useRouter();
  const [nonBigoGames, setNonBigoGames] = useState<GameItem[]>([]);

  // Filter out Bigo products when data is loaded
  useEffect(() => {
    if (productsData?.data) {
      const filteredGames = productsData.data
        .filter((product) => product.type !== "Bigo")
        .slice(0, 4) // Limit to 4 games for the mega menu
        .map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image || "/game-card.webp",
          learnLink: `/games/${product.id}`,
          orderLink: `/products/${product.id}`,
        }));

      setNonBigoGames(filteredGames);
    }
  }, [productsData]);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: -5,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const cardVariants = {
    rest: {},
    hover: {
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="absolute left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        {isLoading ? (
          <GamesMegaMenuSkeleton />
        ) : nonBigoGames.length > 0 ? (
          <div className="flex">
            {/* Featured Games with Images */}
            <div className="flex-1 grid grid-cols-4 gap-6">
              {nonBigoGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  onClick={() => navigate.push(`/product/${game.id}`)}
                  className="text-center"
                  variants={itemVariants}
                  custom={index}
                >
                  <motion.div
                    className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-sm"
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-full h-full"
                      variants={imageHoverVariants}
                    >
                      <Image
                        src={game.image || "/placeholder.svg"}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.h3
                    className="font-medium text-sm mb-1"
                    variants={itemVariants}
                  >
                    {game.name}
                  </motion.h3>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-gray-500">
                {t("games_mega_menu.no_games") || "No games available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
