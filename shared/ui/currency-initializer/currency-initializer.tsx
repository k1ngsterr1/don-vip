"use client";

import { useEffect } from "react";
import { initDefaultCurrency } from "@/shared/utils/currency-init";

export function CurrencyInitializer() {
  useEffect(() => {
    initDefaultCurrency();
  }, []);

  return null; // Этот компонент ничего не рендерит
}
