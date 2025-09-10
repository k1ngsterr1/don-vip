"use client";

interface InfoFeature {
  icon: string;
  title: string;
  emoji: string;
}

interface InfoBlockProps {
  features?: InfoFeature[];
}

const defaultFeatures: InfoFeature[] = [
  {
    icon: "✅",
    title: "Для всех регионов",
    emoji: "🌎",
  },
  {
    icon: "✅",
    title: "Для России",
    emoji: "🇷🇺",
  },
  {
    icon: "✅",
    title: "Низкие цены",
    emoji: "💸",
  },
  {
    icon: "✅",
    title: "Мгновенная доставка",
    emoji: "⚡️",
  },
  {
    icon: "✅",
    title: "Официальный партнер",
    emoji: "🤝",
  },
];

export function InfoBlock({ features = defaultFeatures }: InfoBlockProps) {
  return (
    <div className="px-4 py-4">
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-green-500 text-sm">{feature.icon}</span>
            <span className="text-gray-800 text-sm">
              <span className="uppercase">{feature.title.charAt(0)}</span>
              <span className="lowercase">{feature.title.slice(1)}</span>{" "}
              <span>{feature.emoji}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
