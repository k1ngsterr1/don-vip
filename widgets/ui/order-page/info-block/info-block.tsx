"use client";

import { Check, Globe, Flag, DollarSign, Zap, Handshake } from "lucide-react";

interface InfoFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  emoji: React.ComponentType<{ className?: string }>;
}

interface InfoBlockProps {
  features?: InfoFeature[];
}

const defaultFeatures: InfoFeature[] = [
  {
    icon: Check,
    title: "Для всех регионов",
    emoji: Globe,
  },
  {
    icon: Check,
    title: "Для России",
    emoji: Flag,
  },
  {
    icon: Check,
    title: "Низкие цены",
    emoji: DollarSign,
  },
  {
    icon: Check,
    title: "Мгновенная доставка",
    emoji: Zap,
  },
  {
    icon: Check,
    title: "Официальный партнер",
    emoji: Handshake,
  },
];

export function InfoBlock({ features = defaultFeatures }: InfoBlockProps) {
  return (
    <div className="px-4 py-4">
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <feature.icon className="w-4 h-4 text-green-500" />
            <span className="text-gray-800 text-sm">
              <span className="uppercase">{feature.title.charAt(0)}</span>
              <span className="lowercase">{feature.title.slice(1)}</span>{" "}
              <feature.emoji className="w-4 h-4 inline" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
