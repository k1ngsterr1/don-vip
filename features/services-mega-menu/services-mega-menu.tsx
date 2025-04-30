"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function GamesMegaMenu() {
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
    { name: "Все игры", link: "/games" },
    { name: "Мобильные игры", link: "/games/mobile" },
    { name: "PC игры", link: "/games/pc" },
    { name: "Консольные игры", link: "/games/console" },
    { name: "Новинки", link: "/games/new" },
    { name: "Популярные", link: "/games/popular" },
  ];

  const helpLinks = [
    { name: "Помощь с выбором", link: "/help/choose-game" },
    { name: "Как пополнить счет", link: "/help/top-up" },
    { name: "Сравнить цены", link: "/help/compare-prices" },
    { name: "Акции и скидки", link: "/promotions" },
    { name: "Купоны", link: "/coupons" },
    { name: "Часто задаваемые вопросы", link: "/faq" },
  ];

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
      onMouseEnter={() => {
        // This will be handled by the parent container
      }}
      onMouseLeave={() => {
        // This will be handled by the parent container
      }}
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
                      Подробнее
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link
                      href={game.orderLink}
                      className="text-blue hover:underline"
                    >
                      Заказать
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right sidebar with links */}
          <motion.div
            className="w-64 pl-8 border-l border-gray-100"
            variants={itemVariants}
          >
            <div className="mb-6">
              <motion.h3
                className="font-medium text-sm uppercase text-gray-500 mb-2"
                variants={itemVariants}
              >
                Категории
              </motion.h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <motion.li key={index} variants={linkVariants} custom={index}>
                    <Link
                      href={category.link}
                      className="text-dark hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <motion.h3
                className="font-medium text-sm uppercase text-gray-500 mb-2"
                variants={itemVariants}
              >
                Помощь
              </motion.h3>
              <ul className="space-y-2">
                {helpLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    variants={linkVariants}
                    custom={index + categories.length}
                  >
                    <Link
                      href={link.link}
                      className="text-dark hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
