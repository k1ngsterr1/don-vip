"use client";

import { Percent, Sparkles } from "lucide-react";

interface DiscountPackagesDemoProps {
  onToggleDemo: (enabled: boolean) => void;
  isDemoEnabled: boolean;
}

export function DiscountPackagesDemo({
  onToggleDemo,
  isDemoEnabled,
}: DiscountPackagesDemoProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Demo режим</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            BETA
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Включите демо-режим, чтобы увидеть скидочные пакеты в действии
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleDemo(!isDemoEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isDemoEnabled
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            <Percent className="w-4 h-4" />
            {isDemoEnabled ? "Отключить скидки" : "Включить скидки"}
          </button>
        </div>

        {isDemoEnabled && (
          <div className="mt-3 p-2 bg-green-50 rounded-md">
            <p className="text-xs text-green-700">
              ✨ Скидочные пакеты активированы! Смотрите изменения в карточках
              пакетов.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
