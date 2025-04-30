"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ServicesMegaMenu() {
  const featuredServices = [
    {
      id: 1,
      name: "BIGO LIVE",
      image: "/feature-card.webp",
      learnLink: "/services/bigo-live",
      orderLink: "/order/bigo-live",
    },
    {
      id: 2,
      name: "TikTok Coins",
      image: "/feature-card.webp",
      learnLink: "/services/tiktok",
      orderLink: "/order/tiktok",
    },
    {
      id: 3,
      name: "Likee Diamonds",
      image: "/feature-card.webp",
      learnLink: "/services/likee",
      orderLink: "/order/likee",
    },
  ];

  const categories = [
    { name: "Все сервисы", link: "/services" },
    { name: "Стриминговые платформы", link: "/services/streaming" },
    { name: "Социальные сети", link: "/services/social" },
    { name: "Развлечения", link: "/services/entertainment" },
    { name: "Новинки", link: "/services/new" },
    { name: "Популярные", link: "/services/popular" },
  ];

  const helpLinks = [
    { name: "Как пополнить баланс", link: "/help/top-up-service" },
    { name: "Сравнить цены", link: "/help/compare-service-prices" },
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

  // Special animation for the highlight effect
  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
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
          {/* Featured Services with Images */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="text-center relative"
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                initial="rest"
              >
                {/* Special highlight for first item */}
                {index === 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-blue text-white text-xs px-2 py-1 rounded-full z-10"
                    variants={highlightVariants}
                  >
                    Популярно
                  </motion.div>
                )}

                <motion.div
                  className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-sm"
                  variants={cardVariants}
                >
                  <motion.div
                    className="w-full h-full"
                    variants={imageHoverVariants}
                  >
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </motion.div>
                <motion.h3
                  className="font-medium text-sm mb-1"
                  variants={itemVariants}
                >
                  {service.name}
                </motion.h3>
                <div className="flex justify-center space-x-4 text-xs">
                  <motion.div variants={linkVariants}>
                    <Link
                      href={service.learnLink}
                      className="text-blue hover:underline"
                    >
                      Подробнее
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link
                      href={service.orderLink}
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

            {/* Special promo card with animation */}
            <motion.div
              className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="font-medium text-sm mb-2">
                Специальное предложение
              </h4>
              <p className="text-xs text-gray-700 mb-2">
                Получите скидку 10% на первый заказ
              </p>
              <Link href="/promo" className="text-xs text-blue hover:underline">
                Узнать больше →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
