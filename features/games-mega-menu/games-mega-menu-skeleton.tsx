"use client";

import { motion } from "framer-motion";

interface GamesMegaMenuSkeletonProps {
  count?: number;
}

export function GamesMegaMenuSkeleton({
  count = 8,
}: GamesMegaMenuSkeletonProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </motion.div>
      ))}
    </motion.div>
  );
}
