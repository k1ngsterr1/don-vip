"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  Info,
  Heart,
  ClipboardList,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

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
    { id: "instruction" as TabType, label: "Инструкция", icon: Info },
    { id: "reviews" as TabType, label: "Отзывы", icon: Heart },
    { id: "description" as TabType, label: "Описание", icon: ClipboardList },
    { id: "faq" as TabType, label: "FAQ", icon: HelpCircle },
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
            <tab.icon className="w-4 h-4" />
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
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <p>
              <span className="uppercase">В</span>
              <span className="lowercase">ойдите в приложение</span>{" "}
              <span className="uppercase">B</span>
              <span className="lowercase">igo</span>{" "}
              <span className="uppercase">L</span>
              <span className="lowercase">ive</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <p>
              <span className="lowercase">Перейдите на страницу</span>{" "}
              <span className="uppercase">Я</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <p>
              <span className="lowercase">Под вашим ником отобразится</span>{" "}
              Bigo Live ID
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <p>
              <span className="lowercase">
                Скопируйте и введите цифры на сайте
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <p>
              <span className="lowercase">
                Оплатите заказ любым удобным способом
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Instruction Image */}
      <div className="p-2">
        <div className="bg-white rounded-lg overflow-hidden">
          <Image
            src="/info-buy.png"
            alt="Инструкция по покупке алмазов"
            width={400}
            height={200}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Check Image */}
      <div className="p-2">
        <div className="bg-white rounded-lg overflow-hidden">
          <Image
            src="/id.png"
            alt="Проверка ID"
            width={400}
            height={80}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
