"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

type TabType = "instruction" | "reviews" | "description" | "faq";

interface InstructionTabsProps {
  onTabChange?: (tab: TabType) => void;
  defaultTab?: TabType;
}

export function InstructionTabs({
  onTabChange,
  defaultTab = "instruction",
}: InstructionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    { id: "instruction" as TabType, label: "Инструкция", icon: "ℹ️" },
    { id: "reviews" as TabType, label: "Отзывы", icon: "❤️" },
    { id: "description" as TabType, label: "Описание", icon: "📋" },
    { id: "faq" as TabType, label: "FAQ", icon: "❓" },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              activeTab === tab.id
                ? "text-gray-800 font-medium"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface InstructionContentProps {
  gameName?: string;
}

export function InstructionContent({
  gameName = "Bigo Live",
}: InstructionContentProps) {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3">
        <div className="bg-white px-3 py-2 rounded-lg inline-block">
          <span className="text-black text-xs font-light">Инструкция</span>
        </div>
      </div>

      {/* Steps */}
      <div className="p-3 pt-0">
        <div className="text-gray-800 text-sm font-normal leading-relaxed space-y-2">
          <p>
            👉 <span className="uppercase">В</span>
            <span className="lowercase">ойдите в приложение</span>{" "}
            <span className="uppercase">B</span>
            <span className="lowercase">igo</span>{" "}
            <span className="uppercase">L</span>
            <span className="lowercase">ive</span>
          </p>
          <p>
            👉 <span className="lowercase">Перейдите на страницу</span>{" "}
            <span className="uppercase">Я</span>
          </p>
          <p>
            👉 <span className="lowercase">Под вашим ником отобразится</span>{" "}
            Bigo Live ID
          </p>
          <p>
            👉{" "}
            <span className="lowercase">
              Скопируйте и введите цифры на сайте
            </span>
          </p>
          <p>
            👉{" "}
            <span className="lowercase">
              Оплатите заказ любым удобным способом
            </span>
          </p>
        </div>
      </div>

      {/* Instruction Image */}
      <div className="p-2">
        <div className="bg-gray-200 h-40 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">Инструкция с картинками</span>
        </div>
      </div>

      {/* Check Image */}
      <div className="p-2">
        <div className="bg-gray-200 h-12 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">Проверка ID</span>
        </div>
      </div>
    </div>
  );
}
