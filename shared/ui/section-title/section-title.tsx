import type React from "react";
interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

export default function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center mb-3 sm:mb-4">
      <span className="mr-2 text-lg sm:text-xl">{icon}</span>
      <h2 className="text-[18px] sm:text-[20px] font-medium text-dark font-unbounded capitalize">
        {title}
      </h2>
    </div>
  );
}
