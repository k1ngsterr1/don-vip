import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CountryCurrency {
  country: string;
  language: string;
  currency: string;
  flag: string;
}

interface LanguageStore {
  selectedLocale: string;
  selectedCountry: CountryCurrency | null;
  setSelectedLocale: (locale: string) => void;
  setSelectedCountry: (country: CountryCurrency | null) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLocale: "ru", // default locale
      selectedCountry: null,
      setSelectedLocale: (locale: string) => set({ selectedLocale: locale }),
      setSelectedCountry: (country: CountryCurrency | null) =>
        set({ selectedCountry: country }),
    }),
    {
      name: "language-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
