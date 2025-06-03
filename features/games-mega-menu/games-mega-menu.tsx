"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { GamesMegaMenuSkeleton } from "./games-mega-menu-skeleton";
import { useProducts } from "@/entities/product/hooks/queries/use-products";
import { Link } from "@/i18n/navigation";

interface GameItem {
  id: number;
  name: string;
  image: string;
  learnLink: string;
  orderLink: string;
}

interface NavLink {
  id: string;
  link: string;
}

export function GamesMegaMenu() {
  const t = useTranslations("games_mega_menu");
  const { data: productsData, isLoading } = useProducts();
  const [nonBigoGames, setNonBigoGames] = useState<GameItem[]>([]);

  const helpLinks: NavLink[] = [{ id: "coupons", link: "/coupons" }];

  // Filter out Bigo products when data is loaded
  useEffect(() => {
    if (productsData?.data) {
      const filteredGames = productsData.data
        .filter((product) => product.type !== "Bigo")
        .slice(0, 3) // Limit to 3 games for the mega menu
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
            <div className="flex-1 grid grid-cols-3 gap-6">
              {nonBigoGames.map((game, index) => (
                <Link href={`/product/${game.id}` as any} key={game.id}>
                  <motion.div
                    className="text-center !cursor-pointer" // cursor-pointer is fine, Link handles click
                    variants={itemVariants}
                    custom={index}
                  >
                    <motion.div
                      className="relative w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden mb-2 shadow-sm mx-auto"
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
                </Link>
              ))}
            </div>
            <motion.div
              className="w-64 pl-8 ml-6 border-l border-gray-100"
              variants={itemVariants} // You can reuse itemVariants or create specific ones if needed
            >
              <motion.h3
                className="font-medium text-sm uppercase text-gray-500 mb-2"
                variants={itemVariants} // Or a specific variant for the title
              >
                {t("help.title")}
              </motion.h3>
              <ul className="space-y-2">
                {helpLinks.map((link, idx) => (
                  <motion.li
                    key={link.id}
                    variants={linkVariants} // Reusing existing linkVariants
                    custom={idx} // Pass index for stagger effect
                  >
                    <Link
                      href={link.link as any} // Cast to any if type issues with i18n Link
                      className="text-dark hover:text-blue-600 transition-colors"
                    >
                      {t(`help.${link.id}`)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : (
          <div className="flex">
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-gray-500">
                {t("no_games") || "No games available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
