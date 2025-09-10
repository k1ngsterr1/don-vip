"use client";

interface GameDescriptionProps {
  gameName?: string;
  description?: string;
  features?: string[];
  publisher?: string;
}

export function GameDescription({
  gameName = "BIGO LIVE",
  description,
  features = [
    "Доступно в 150 странах.",
    "Более 400 млн скачиваний по всему миру!",
    "Лучшее приложение в Google Play 172 раза.",
  ],
  publisher = "BIGO TECHNOLOGY PTE. LTD",
}: GameDescriptionProps) {
  const defaultDescription = `BIGO LIVE это платформа для ведения прямых эфиров. Она позволит вам выходить в прямой эфир, делиться интересными моментами из жизни со своими друзьями, а также совершать видео и аудио звонки. Доступно в 150 стране. Создавайте или присоединяйтесь к любым голосовым чатам бесплатно и веселитесь вместе.`;

  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3">
        <div className="bg-white px-3 py-2 rounded-lg inline-block">
          <span className="text-black text-xs font-light">Описание</span>
        </div>
      </div>

      {/* Game Icon and Info */}
      <div className="px-3 pb-3">
        <div className="flex items-start gap-3">
          {/* Game Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0" />

          {/* Game Info */}
          <div>
            <h3 className="text-gray-800 font-medium text-sm">{gameName}</h3>
            <p className="text-gray-600 text-xs uppercase">
              прямой эфир, Лайвчат
            </p>
            <p className="text-gray-500 text-xs uppercase mt-1">{publisher}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-3 pb-4">
        <p className="text-gray-800 text-sm leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>

      {/* Features */}
      {features && features.length > 0 && (
        <div className="px-3 pb-3">
          <div className="space-y-1">
            {features.map((feature, index) => (
              <p key={index} className="text-gray-600 text-xs">
                * {feature}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
