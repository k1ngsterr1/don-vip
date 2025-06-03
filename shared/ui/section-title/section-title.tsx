import type React from "react";
interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
  description?: string;
}

export default function SectionTitle({
  icon,
  title,
  className = "",
  description,
}: SectionTitleProps) {
  return (
    <div className={`flex flex-col items-start mb-3 sm:mb-4 ${className}`}>
      <div className="flex items-center">
        <span className="mr-2 text-lg sm:text-xl md:text-2xl">{icon}</span>
        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium text-dark font-unbounded capitalize">
          {title}
        </h2>
      </div>
      {description && (
        <p className="hidden md:block text-gray-500 mt-2 md:mt-3 text-sm md:text-base max-w-xl md:text-center md:mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
