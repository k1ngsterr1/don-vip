"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductInfoProps {
  isExpanded: boolean;
  onToggle: () => void;
  description: string;
}

export function ProductInfo({
  isExpanded,
  onToggle,
  description,
}: ProductInfoProps) {
  return (
    <div className="w-[344px] xxs:w-[90%] mt-[24px] mx-auto mb-6">
      <motion.div
        className="rounded-[12px] bg-blue text-white overflow-hidden"
        animate={{ height: isExpanded ? "auto" : "60px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          className="w-full  h-[60px] px-4 flex items-center justify-center"
          onClick={onToggle}
        >
          <span>Информация о товаре</span>
          {isExpanded ? (
            <ChevronUp className="ml-2" size={18} />
          ) : (
            <ChevronDown className="ml-2" size={18} />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4"
            >
              <p className="text-sm">{description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
