"use client";

import { useTestAccess } from "@/shared/providers/test-access-provider";
import { TestTube, X } from "lucide-react";

export function TestModeIndicator() {
  const { isTestMode, hasAccess } = useTestAccess();

  if (!isTestMode || !hasAccess) {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("test_access_granted");
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white py-2 px-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          <span className="text-sm font-medium">
            ТЕСТОВЫЙ РЕЖИМ - Это защищенная версия для разработки
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm hover:text-orange-200 transition-colors"
          title="Выйти из тестового режима"
        >
          <X className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );
}
