"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { InfoIcon as InfoCircleIcon } from "lucide-react";
import { X } from "lucide-react";
import useMobile from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/utils/cn";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface CustomTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function CustomTooltip({
  content,
  position = "top", // This will be the default for desktop
  delay = 200,
  className,
  contentClassName,
  children,
}: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMobile(); // Detect mobile device

  // Determine the effective position based on device type
  const effectivePosition: TooltipPosition = isMobile ? "bottom" : position;

  const showTooltip = () => {
    if (isMobile) return; // Do not show on hover/focus for mobile
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const toggleTooltip = () => {
    if (isMobile) {
      setIsVisible((prev) => !prev);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Use effectivePosition for calculations
    switch (effectivePosition) {
      case "top":
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case "bottom":
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case "left":
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewportWidth - padding) {
      x = viewportWidth - tooltipRect.width - padding;
    }

    if (y < padding) {
      y = padding;
    } else if (y + tooltipRect.height > viewportHeight - padding) {
      y = viewportHeight - tooltipRect.height - padding;
    }

    setCoords({ x, y });
  }, [isVisible, effectivePosition]); // Add effectivePosition to dependencies

  const getArrowStyle = () => {
    // Use effectivePosition for arrow styling
    switch (effectivePosition) {
      case "top":
        return "bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent";
      case "bottom":
        return "top-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent";
      case "left":
        return "right-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent";
      case "right":
        return "left-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent";
    }
  };

  // Add click handler for mobile, keep hover/focus for desktop
  const triggerProps: React.HTMLAttributes<HTMLDivElement> = isMobile
    ? { onClick: toggleTooltip }
    : {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      };

  return (
    <div
      ref={triggerRef}
      className={cn("inline-block relative", className)}
      {...triggerProps} // Apply conditional event handlers
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            "fixed z-50 max-w-xs p-2 text-sm text-white bg-[#383838] rounded-md shadow-md",
            "animate-in fade-in duration-200",
            contentClassName
          )}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          <div className="w-full flex mb-2 items-center justify-between">
            <InfoCircleIcon />
            {/* Add onClick to the X icon to allow closing */}
            <X
              className="text-white/70 cursor-pointer"
              size={16}
              onClick={(e) => {
                e.stopPropagation(); // Prevent trigger's onClick if it's a child
                hideTooltip();
              }}
            />
          </div>
          {content}
          <div
            className={cn(
              "absolute w-0 h-0 border-4 border-[#383838]", // Match arrow color with tooltip bg
              getArrowStyle()
            )}
          />
        </div>
      )}
    </div>
  );
}
