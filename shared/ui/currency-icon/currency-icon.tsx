import Image from "next/image";
import { Paintbrush } from "lucide-react";

interface CurrencyIconProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function CurrencyIcon({
  src,
  alt,
  width = 48,
  height = 48,
  className = "rounded-full w-12 h-12 object-contain",
}: CurrencyIconProps) {
  // Проверяем, если это специальная иконка
  if (src?.startsWith("icon:")) {
    const iconType = src.replace("icon:", "");

    switch (iconType) {
      case "paintbrush":
        return (
          <div
            className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border border-gray-200`}
          >
            <Paintbrush className="w-6 h-6 text-blue-600" />
          </div>
        );
      default:
        return (
          <div
            className={`${className} bg-gray-100 flex items-center justify-center border border-gray-200`}
          >
            <span className="text-gray-400 text-xs">?</span>
          </div>
        );
    }
  }

  // Обычное изображение
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
