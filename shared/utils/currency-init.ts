/**
 * Инициализация валюты по умолчанию в localStorage
 */

export const DEFAULT_CURRENCY = "RUB";

export const initDefaultCurrency = () => {
  if (typeof window === "undefined") return;

  const existingCurrency = localStorage.getItem("selectedCurrency");

  if (!existingCurrency) {
    localStorage.setItem("selectedCurrency", DEFAULT_CURRENCY);
    console.log("🟢 Установлена валюта по умолчанию: RUB");
  }
};

export const getCurrentCurrency = (): string => {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;

  return localStorage.getItem("selectedCurrency") || DEFAULT_CURRENCY;
};

export const setCurrency = (currency: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("selectedCurrency", currency);
  console.log(`💰 Валюта изменена на: ${currency}`);
};
