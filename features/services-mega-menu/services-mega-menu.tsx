"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function GamesMegaMenu() {
  const t = useTranslations();

  const featuredGames = [
    {
      id: 1,
      name: "Mobile Legends",
      image: "/game-card.webp",
      learnLink: "/games/mobile-legends",
      orderLink: "/order/mobile-legends",
    },
    {
      id: 2,
      name: "PUBG Mobile",
      image: "/game-card.webp",
      learnLink: "/games/pubg-mobile",
      orderLink: "/order/pubg-mobile",
    },
    {
      id: 3,
      name: "Free Fire",
      image: "/game-card.webp",
      learnLink: "/games/free-fire",
      orderLink: "/order/free-fire",
    },
    {
      id: 4,
      name: "Genshin Impact",
      image: "/game-card.webp",
      learnLink: "/games/genshin-impact",
      orderLink: "/order/genshin-impact",
    },
  ];

  const categories = [
    { name: t("games_mega_menu.all_games"), link: "/games" },
    { name: t("games_mega_menu.mobile_games"), link: "/games/mobile" },
    { name: t("games_mega_menu.pc_games"), link: "/games/pc" },
    { name: t("games_mega_menu.console_games"), link: "/games/console" },
    { name: t("games_mega_menu.new_games"), link: "/games/new" },
    { name: t("games_mega_menu.popular_games"), link: "/games/popular" },
  ];

  const helpLinks = [
    { name: t("games_mega_menu.help_choose"), link: "/help/choose-game" },
    { name: t("games_mega_menu.how_to_topup"), link: "/help/top-up" },
    { name: t("games_mega_menu.compare_prices"), link: "/help/compare-prices" },
    { name: t("games_mega_menu.promotions"), link: "/promotions" },
    { name: t("games_mega_menu.coupons"), link: "/coupons" },
    { name: t("games_mega_menu.faq"), link: "/faq" },
  ];

  // Animation variants (same as before)
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
        <div className="flex">
          {/* Featured Games with Images */}
          <div className="flex-1 grid grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="text-center"
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                initial="rest"
                animate="visible"
              >
                <motion.div
                  className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-sm"
                  variants={cardVariants}
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
                <div className="flex justify-center space-x-4 text-xs">
                  <motion.div variants={linkVariants}>
                    <Link
                      href={game.learnLink}
                      className="text-blue hover:underline"
                    >
                      {t("games_mega_menu.learn_more")}
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link
                      href={game.orderLink}
                      className="text-blue hover:underline"
                    >
                      {t("games_mega_menu.order_now")}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
