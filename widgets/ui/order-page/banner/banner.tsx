import LightningIcon from "@/shared/icons/lightning-icon";
import Image from "next/image";

interface BannerProps {
  backgroundImage: string;
  height: string;
}

export function Banner({ backgroundImage, height }: BannerProps) {
  const mobileBanner = (
    <div className="relative w-full md:hidden" style={{ height }}>
      <Image
        src={backgroundImage || "/placeholder.svg"}
        alt="Game banner"
        fill
        className="object-cover"
      />
      <div className="absolute bottom-4 right-4 bg-blue/60 text-white text-xs py-1 px-2 rounded-[4px] font-unbounded gap-2 flex items-center">
        <LightningIcon />
        Мгновенная доставка
      </div>
    </div>
  );

  // Desktop version - now matches mobile styling
  const desktopBanner = (
    <div
      className="hidden md:block relative w-full rounded-lg overflow-hidden shadow-md"
      style={{ height }}
    >
      <Image
        src={backgroundImage || "/placeholder.svg"}
        alt="Game banner"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-6 left-6">
        <div className="bg-blue/60 text-white text-xs py-1 px-2 rounded-[4px] font-unbounded gap-2 flex items-center w-fit">
          <LightningIcon />
          Мгновенная доставка
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileBanner}
      {desktopBanner}
    </>
  );
}
