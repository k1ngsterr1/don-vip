import Image from "next/image";

interface GameCardProps {
  title?: string;
  image: string;
  logo?: string;
  hasGem?: boolean;
  gemColor?: string;
  badge?: string;
  href?: string;
}

export default function GameCard({
  title,
  image,
  badge,
  href = "#",
}: GameCardProps) {
  return (
    <div className="block cursor-pointer">
      <div className="relative shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-[12px] aspect-square group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title || "Game"}
          width={166}
          height={166}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
          {/* Game title with reveal animation */}
          {title && (
            <div className="p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <p className="text-white text-sm font-medium">{title}</p>
              <div className="w-10 h-0.5 bg-blue-500 mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          )}
        </div>

        {/* Badge - Always visible */}
        {badge && (
          <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10">
            {badge}
          </div>
        )}

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
