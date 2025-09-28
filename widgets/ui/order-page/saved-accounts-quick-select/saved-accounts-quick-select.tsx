"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Clock, User, Server, X } from "lucide-react";
import { useOrderCookies } from "@/shared/hooks/use-order-cookies";
import type { SavedGameData } from "@/shared/utils/cookies";

interface SavedAccountsQuickSelectProps {
  gameId: number;
  onAccountSelect: (accountId: string, serverId?: string) => void;
  className?: string;
}

export function SavedAccountsQuickSelect({
  gameId,
  onAccountSelect,
  className = "",
}: SavedAccountsQuickSelectProps) {
  const locale = useLocale();
  const { getAllSavedGameData } = useOrderCookies();
  const [isExpanded, setIsExpanded] = useState(false);

  const savedAccounts = getAllSavedGameData().filter(
    (data) => data.gameId === gameId
  );

  if (savedAccounts.length === 0) {
    return null;
  }

  const texts = {
    ru: {
      quickSelect: "Быстрый выбор аккаунта",
      savedAccounts: "Сохраненные аккаунты",
      lastUsed: "Последний раз использован",
      select: "Выбрать",
      showMore: `Показать еще ${savedAccounts.length - 1}`,
      showLess: "Скрыть",
      userId: "ID пользователя",
      serverId: "ID сервера",
    },
    en: {
      quickSelect: "Quick account selection",
      savedAccounts: "Saved accounts",
      lastUsed: "Last used",
      select: "Select",
      showMore: `Show ${savedAccounts.length - 1} more`,
      showLess: "Hide",
      userId: "User ID",
      serverId: "Server ID",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return locale === "ru" ? "сегодня" : "today";
    } else if (diffDays === 2) {
      return locale === "ru" ? "вчера" : "yesterday";
    } else if (diffDays <= 7) {
      return locale === "ru" ? `${diffDays} дн. назад` : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(locale);
    }
  };

  const handleAccountSelect = (account: SavedGameData) => {
    onAccountSelect(account.accountId, account.serverId);
  };

  const displayedAccounts = isExpanded
    ? savedAccounts
    : savedAccounts.slice(0, 1);

  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          {t.quickSelect}
        </span>
      </div>

      <div className="space-y-2">
        {displayedAccounts.map((account, index) => (
          <div
            key={`${account.gameId}-${account.accountId}-${index}`}
            className="bg-white rounded-md p-3 border border-blue-100 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">{t.userId}:</span>
                  <span className="text-sm font-mono text-gray-900 truncate">
                    {account.accountId}
                  </span>
                </div>

                {account.serverId && (
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500">{t.serverId}:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {account.serverId}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {t.lastUsed}: {formatDate(account.lastUsed)}
                </div>
              </div>

              <button
                onClick={() => handleAccountSelect(account)}
                className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                {t.select}
              </button>
            </div>
          </div>
        ))}
      </div>

      {savedAccounts.length > 1 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <X className="w-3 h-3" />
              {t.showLess}
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              {t.showMore}
            </>
          )}
        </button>
      )}
    </div>
  );
}
