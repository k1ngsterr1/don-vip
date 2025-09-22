"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { Info, Heart, ClipboardList, HelpCircle } from "lucide-react";
import { useLocale } from "next-intl";
import type {
  GameContent,
  InstructionStep,
  InstructionImage,
  GameInstruction,
} from "@/entities/games/api/games.api";

type TabType = "instruction" | "reviews" | "description" | "faq";

interface InstructionTabsProps {
  onTabChange?: (tab: TabType) => void;
  defaultTab?: TabType;
}

export function InstructionTabs({
  onTabChange,
  defaultTab = "instruction",
}: InstructionTabsProps) {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Localized tab labels
  const getTabLabel = (tabId: TabType): string => {
    const labels = {
      instruction: locale === "en" ? "Instructions" : "Инструкция",
      reviews: locale === "en" ? "Reviews" : "Отзывы",
      description: locale === "en" ? "Description" : "Описание",
      faq: locale === "en" ? "FAQ" : "FAQ",
    };
    return labels[tabId];
  };

  const tabs = [
    {
      id: "instruction" as TabType,
      label: getTabLabel("instruction"),
      icon: Info,
    },
    { id: "reviews" as TabType, label: getTabLabel("reviews"), icon: Heart },
    {
      id: "description" as TabType,
      label: getTabLabel("description"),
      icon: ClipboardList,
    },
    { id: "faq" as TabType, label: getTabLabel("faq"), icon: HelpCircle },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-6 overflow-x-auto md:justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "text-gray-800 font-medium border-b-2 border-blue-500 pb-1"
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
  gameContent?: GameContent | null;
  gameName?: string;
}

export function InstructionContent({
  gameContent,
  gameName = "Bigo Live",
}: InstructionContentProps) {
  const locale = useLocale();

  // Debug: Log gameContent
  useEffect(() => {
    console.log("🎮 InstructionContent received gameContent:", gameContent);
  }, [gameContent]);

  // Helper function to get localized text
  const getLocalizedText = (text: string, textEn?: string | null): string => {
    return locale === "en" && textEn ? textEn : text;
  };

  // Use API data if available, otherwise fallback to hardcoded content
  const instruction = gameContent?.instruction || {
    steps:
      locale === "en"
        ? [
            {
              id: "step-1",
              text: "Go to the application",
              highlight: "Bigo Live",
            },
            {
              id: "step-2",
              text: "Go to the page",
              highlight: "Me",
            },
            {
              id: "step-3",
              text: "Your Bigo Live ID will be displayed under your nickname",
            },
            {
              id: "step-4",
              text: "Copy and enter the numbers on the website",
            },
            {
              id: "step-5",
              text: "Pay for your order in any convenient way",
            },
          ]
        : [
            {
              id: "step-1",
              text: "ойдите в приложение",
              highlight: "Bigo Live",
            },
            {
              id: "step-2",
              text: "Перейдите на страницу",
              highlight: "Я",
            },
            {
              id: "step-3",
              text: "Под вашим ником отобразится Bigo Live ID",
            },
            {
              id: "step-4",
              text: "Скопируйте и введите цифры на сайте",
            },
            {
              id: "step-5",
              text: "Оплатите заказ любым удобным способом",
            },
          ],
    images: [
      {
        id: "instruction-image",
        src: "/info-buy.png",
        alt:
          locale === "en"
            ? "Diamond purchase instructions"
            : "Инструкция по покупке алмазов",
        width: 400,
        height: 200,
      },
      {
        id: "check-image",
        src: "/id.png",
        alt: locale === "en" ? "ID verification" : "Проверка ID",
        width: 400,
        height: 80,
      },
    ],
    headerText: locale === "en" ? "Instructions" : "Инструкция",
  };

  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg overflow-hidden md:max-w-4xl md:mx-auto">
      {/* Header */}
      <div className="p-3">
        <div className="bg-white px-3 py-2 rounded-lg inline-block">
          <span className="text-black text-xs font-light">
            {getLocalizedText(
              instruction.headerText || "Инструкция",
              instruction.headerText_en
            )}
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6">
        <div className="grid md:grid-cols-2 md:gap-6">
          {/* Steps Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {locale === "en"
                ? `How to get ${gameName} currency:`
                : `Как получить ${gameName} валюту:`}
            </h3>
            <div className="space-y-3">
              {instruction.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {step.highlight ? (
                      <>
                        <span className="uppercase">
                          {getLocalizedText(step.text, step.text_en).charAt(0)}
                        </span>
                        <span className="lowercase">
                          {getLocalizedText(step.text, step.text_en).slice(1)}
                        </span>{" "}
                        <span className="font-medium text-blue-600">
                          {getLocalizedText(step.highlight, step.highlight_en)}
                        </span>
                      </>
                    ) : (
                      <span className="lowercase">
                        {getLocalizedText(step.text, step.text_en)}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Images Column */}
          <div className="space-y-4">
            {instruction.images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={getLocalizedText(image.alt, image.alt_en)}
                  width={image.width || 400}
                  height={image.height || 200}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Steps */}
        <div className="p-3 pt-0">
          <div className="text-gray-800 text-sm font-normal leading-relaxed space-y-2">
            {instruction.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p>
                  {step.highlight ? (
                    <>
                      <span className="uppercase">
                        {getLocalizedText(step.text, step.text_en).charAt(0)}
                      </span>
                      <span className="lowercase">
                        {getLocalizedText(step.text, step.text_en).slice(1)}
                      </span>{" "}
                      <span className="uppercase">
                        {getLocalizedText(
                          step.highlight,
                          step.highlight_en
                        ).charAt(0)}
                      </span>
                      <span className="lowercase">
                        {getLocalizedText(
                          step.highlight,
                          step.highlight_en
                        ).slice(1)}
                      </span>
                    </>
                  ) : (
                    <span className="lowercase">
                      {getLocalizedText(step.text, step.text_en)}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        {instruction.images.map((image) => (
          <div key={image.id} className="p-2">
            <div className="bg-white rounded-lg overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width || 400}
                height={image.height || 200}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsContent({
  reviews,
  metadata,
}: {
  reviews: any[];
  metadata: any;
}) {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Отзывы ({metadata?.totalReviews || reviews.length})
        </h3>
        {metadata?.averageRating && (
          <p className="text-sm text-gray-600">
            Средний рейтинг: {metadata.averageRating}/5
          </p>
        )}
      </div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {reviews.length > 0 ? (
          reviews.slice(0, 6).map((review, index) => (
            <div key={review.id || index} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{review.userName}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
              {review.verified && (
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Проверен
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center py-8">
            Отзывы пока отсутствуют
          </p>
        )}
      </div>
    </div>
  );
}

function DescriptionContent({ description }: { description: string }) {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Описание</h3>
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQContent({ faq }: { faq: any[] }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Часто задаваемые вопросы
      </h3>

      <div className="space-y-3">
        {faq.length > 0 ? (
          faq.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden">
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <span className="font-medium text-sm">{item.question}</span>
                <HelpCircle
                  className={`w-4 h-4 transition-transform ${
                    openItems.has(item.id) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openItems.has(item.id) && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-sm text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-8">
            FAQ пока не добавлены
          </p>
        )}
      </div>
    </div>
  );
}

// Skeleton Components
function ContentSkeleton({ activeTab }: { activeTab: TabType }) {
  switch (activeTab) {
    case "instruction":
      return <InstructionSkeleton />;
    case "reviews":
      return <ReviewsSkeleton />;
    case "description":
      return <DescriptionSkeleton />;
    case "faq":
      return <FAQSkeleton />;
    default:
      return <InstructionSkeleton />;
  }
}

function InstructionSkeleton() {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg overflow-hidden md:max-w-4xl md:mx-auto">
      {/* Header Skeleton */}
      <div className="p-3">
        <div className="bg-white px-3 py-2 rounded-lg inline-block">
          <div className="h-3 w-16 bg-gray-300 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Desktop Layout Skeleton */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:p-6">
        {/* Steps Column */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-300 animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full flex-shrink-0 mt-0.5"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images Column */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden h-48 bg-gray-300 animate-pulse"></div>
          <div className="rounded-lg overflow-hidden h-20 bg-gray-300 animate-pulse"></div>
        </div>
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="md:hidden">
        {/* Steps */}
        <div className="p-3 pt-0">
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="p-2 space-y-2">
          <div className="rounded-lg h-32 bg-gray-300 animate-pulse"></div>
          <div className="rounded-lg h-16 bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <div className="mb-4">
        <div className="h-6 w-32 bg-gray-300 animate-pulse rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-300 animate-pulse rounded"></div>
      </div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gray-300 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
            </div>
            <div className="h-6 w-16 bg-gray-300 animate-pulse rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DescriptionSkeleton() {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <div className="h-6 w-24 bg-gray-300 animate-pulse rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded w-5/6"></div>
      </div>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="bg-[#eeeff3] mx-4 rounded-lg p-4 md:max-w-4xl md:mx-auto">
      <div className="h-6 w-48 bg-gray-300 animate-pulse rounded mb-4"></div>

      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
              <div className="w-4 h-4 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
