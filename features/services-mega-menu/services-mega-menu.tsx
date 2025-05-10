"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { ServicesMegaMenuSkeleton } from "./services-mega-menu-skeleton";
import { useProducts } from "@/entities/product/hooks/queries/use-products";

interface ServiceItem {
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

export function ServicesMegaMenu() {
  const t = useTranslations("ServicesMegaMenu");
  const { data: productsData, isLoading } = useProducts();
  const [bigoServices, setBigoServices] = useState<ServiceItem[]>([]);

  // Filter to only include Bigo products when data is loaded
  useEffect(() => {
    if (productsData?.data) {
      const filteredServices = productsData.data
        .filter((product) => product.type === "Bigo")
        .slice(0, 3) // Limit to 3 services for the mega menu
        .map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image || "/feature-card.webp",
          learnLink: `/services/${product.id}`,
          orderLink: `/products/${product.id}`,
        }));

      setBigoServices(filteredServices);
    }
  }, [productsData]);

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
        {isLoading ? (
          <ServicesMegaMenuSkeleton />
        ) : bigoServices.length > 0 ? (
          <div className="flex">
            {/* Featured Services */}
            <div className="flex-1 grid grid-cols-3 gap-6">
              {bigoServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="text-center relative"
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-sm"
                    variants={cardVariants}
                  >
                    <motion.div variants={imageHoverVariants}>
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.h3 className="font-medium text-sm mb-1">
                    {service.name}
                  </motion.h3>
                </motion.div>
              ))}
            </div>
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
                    custom={index}
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
        ) : (
          <div className="flex">
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-gray-500">
                {t("noServices") || "No services available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
