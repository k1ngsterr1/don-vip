"use client";

import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Slide {
  id: number;
  image: string;
}

interface HeroBannerProps {
  slides: Slide[];
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Simple slide variants - just horizontal movement
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      zIndex: 1,
    }),
    center: {
      x: 0,
      zIndex: 2,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      zIndex: 0,
    }),
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ height: isMobile ? "180px" : "621px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="hidden">
        {slides.map((slide) => (
          <Image
            width={377}
            height={211}
            key={`preload-${slide.id}`}
            src={slide.image || "/placeholder.svg"}
            alt="Preload"
          />
        ))}
      </div>
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.3, ease: "easeInOut" },
          }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              handlePrev();
            } else if (info.offset.x < -100) {
              handleNext();
            }
          }}
        >
          <Image
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt="Slide"
            fill
            className="object-cover"
            priority={currentSlide === 0}
          />
        </motion.div>
      </AnimatePresence>
      <button className="absolute bottom-[32px] left-5 w-[140px] h-[40px] border-white border-[1px] rounded-full text-white text-[14px] font-medium z-100 transition-colors hover:bg-blue hover:border-blue">
        Купить сейчас
      </button>
      <div className="hidden sm:block">
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 z-10"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
