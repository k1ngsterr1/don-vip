"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ServiceItem {
  id: string;
  nameKey: string;
  image: string;
  learnLink: string;
  orderLink: string;
}

interface NavLink {
  id: string;
  link: string;
}

export function ServicesMegaMenu() {
  const t = useTranslations("ServicesMegaMenu");

  const featuredServices: ServiceItem[] = [
    {
      id: "bigo",
      nameKey: "services.bigo",
      image: "/feature-card.webp",
      learnLink: "/services/bigo-live",
      orderLink: "/order/bigo-live",
    },
    {
      id: "tiktok",
      nameKey: "services.tiktok",
      image: "/feature-card.webp",
      learnLink: "/services/tiktok",
      orderLink: "/order/tiktok",
    },
    {
      id: "likee",
      nameKey: "services.likee",
      image: "/feature-card.webp",
      learnLink: "/services/likee",
      orderLink: "/order/likee",
    },
  ];

  const categories: NavLink[] = [
    { id: "all", link: "/services" },
    { id: "streaming", link: "/services/streaming" },
    { id: "social", link: "/services/social" },
    { id: "entertainment", link: "/services/entertainment" },
    { id: "new", link: "/services/new" },
    { id: "popular", link: "/services/popular" },
  ];

  const helpLinks: NavLink[] = [
    { id: "coupons", link: "/coupons" },
    { id: "faq", link: "/faq" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
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
          {/* Featured Services */}
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
                {index === 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-blue text-white text-xs px-2 py-1 rounded-full z-10"
                    variants={highlightVariants}
                  >
                    {t("featured.popularBadge")}
                  </motion.div>
                )}

                <motion.div
                  className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-sm"
                  variants={cardVariants}
                >
                  <motion.div variants={imageHoverVariants}>
                    <Image
                      src={service.image}
                      alt={t(service.nameKey)}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </motion.div>

                <motion.h3 className="font-medium text-sm mb-1">
                  {t(service.nameKey)}
                </motion.h3>

                <div className="flex justify-center space-x-4 text-xs">
                  <motion.div variants={linkVariants}>
                    <Link
                      href={service.learnLink}
                      className="text-blue hover:underline"
                    >
                      {t("featured.learnMore")}
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link
                      href={service.orderLink}
                      className="text-blue hover:underline"
                    >
                      {t("featured.order")}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Help Links */}
          <motion.div
            className="w-64 pl-8 border-l border-gray-100"
            variants={itemVariants}
          >
            <motion.h3 className="font-medium text-sm uppercase text-gray-500 mb-2">
              {t("help.title")}
            </motion.h3>

            <ul className="space-y-2">
              {helpLinks.map((link, index) => (
                <motion.li
                  key={link.id}
                  variants={linkVariants}
                  custom={index + categories.length}
                >
                  <Link
                    href={link.link}
                    className="text-dark hover:text-blue-600 transition-colors"
                  >
                    {t(`help.${link.id}`)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
