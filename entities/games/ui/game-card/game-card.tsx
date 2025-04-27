import Image from "next/image";

interface GameCardProps {
  title: string;
  image: string;
  logo?: string;
  hasGem?: boolean;
  gemColor?: string;
  badge?: string;
}

export default function GameCard({ title, image, badge }: GameCardProps) {
  return (
    <div className="relative shadow-xl overflow-hidden rounded-[12px] aspect-square">
      <Image
        src={image}
        alt={title}
        width={166}
        height={166}
        className="w-full h-full object-cover"
      />
      {badge && (
        <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
  );
}
