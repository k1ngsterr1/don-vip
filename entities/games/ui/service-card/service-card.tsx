import Image from "next/image";
import Link from "next/link";
import { Paintbrush } from "lucide-react";

interface ServiceCardProps {
  title?: string;
  image?: string;
  icon?: React.ReactNode;
  hasGem?: boolean;
  gemColor?: string;
  badge?: string;
  href?: string;
  useIcon?: boolean; // Флаг для использования иконки вместо изображения
}

export default function ServiceCard({
  title,
  image,
  icon,
  badge,
  href = "#",
  useIcon = false,
}: ServiceCardProps) {
  return (
    <Link href={href} className="block">
      <div className="relative shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-[12px] aspect-square group">
        {useIcon ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors duration-500">
            {icon || <Paintbrush className="w-16 h-16 text-blue-600" />}
          </div>
        ) : (
          <Image
            src={image || "/placeholder.svg"}
            alt={title || "Service"}
            width={166}
            height={166}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {badge && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            {badge}
          </div>
        )}

        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 className="text-white font-medium text-sm truncate">{title}</h3>
          </div>
        )}
      </div>
    </Link>
  );
}
