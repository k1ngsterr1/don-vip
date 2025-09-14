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
  features = [],
  publisher,
}: GameDescriptionProps) {
  // Если описание пустое, показываем пустое состояние
  if (!description || description.trim() === "") {
    return (
      <div className="bg-[#eeeff3] mx-4 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-3">
          <div className="bg-white px-3 py-2 rounded-lg inline-block">
            <span className="text-black text-xs font-light">Описание</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="p-4 bg-white mx-3 mb-3 rounded-lg">
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Описание для {gameName} пока недоступно
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Информация будет добавлена позже
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {description || `Описание для ${gameName} пока недоступно`}
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
