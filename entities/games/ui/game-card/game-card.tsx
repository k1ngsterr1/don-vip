import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <Link href={href} className="block">
      <div className="relative shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-[12px] aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={title || "Game"}
          width={166}
          height={166}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </div>
        )}

        {/* Game title overlay - Only shown if title exists */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-xs font-medium truncate">{title}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
