"use client";

import type React from "react";
import { forwardRef, useState, useRef, useEffect } from "react";
import { type Country, getCountryCallingCode } from "react-phone-number-input";
import { PhoneIcon, ChevronDownIcon } from "lucide-react";

// --- Self-Contained Utility & Components ---

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Country data with flags and additional metadata - COMPLETE WORLD LIST
const countryData: Record<
  string,
  { name: string; flag: string; priority?: number }
> = {
  // CIS Countries - prioritize Russia for +7
  RU: { name: "Россия", flag: "🇷🇺", priority: 1 },
  KZ: { name: "Казахстан", flag: "🇰🇿", priority: 2 },
  AZ: { name: "Азербайджан", flag: "🇦🇿" },
  AM: { name: "Армения", flag: "🇦🇲" },
  BY: { name: "Беларусь", flag: "🇧🇾" },
  KG: { name: "Киргизия", flag: "🇰🇬" },
  UZ: { name: "Узбекистан", flag: "🇺🇿" },
  TJ: { name: "Таджикистан", flag: "🇹🇯" },
  TM: { name: "Туркменистан", flag: "🇹🇲" },
  MD: { name: "Молдова", flag: "🇲🇩" },
  GE: { name: "Грузия", flag: "🇬🇪" },
  UA: { name: "Украина", flag: "🇺🇦" },

  // Europe
  AD: { name: "Андорра", flag: "🇦🇩" },
  AL: { name: "Албания", flag: "🇦🇱" },
  AT: { name: "Австрия", flag: "🇦🇹" },
  BA: { name: "Босния и Герцеговина", flag: "🇧🇦" },
  BE: { name: "Бельгия", flag: "🇧🇪" },
  BG: { name: "Болгария", flag: "🇧🇬" },
  CH: { name: "Швейцария", flag: "🇨🇭" },
  CY: { name: "Кипр", flag: "🇨🇾" },
  CZ: { name: "Чехия", flag: "🇨🇿" },
  DE: { name: "Германия", flag: "🇩🇪" },
  DK: { name: "Дания", flag: "🇩🇰" },
  EE: { name: "Эстония", flag: "🇪🇪" },
  ES: { name: "Испания", flag: "🇪🇸" },
  FI: { name: "Финляндия", flag: "🇫🇮" },
  FR: { name: "Франция", flag: "🇫🇷" },
  GB: { name: "Великобритания", flag: "🇬🇧" },
  GR: { name: "Греция", flag: "🇬🇷" },
  HR: { name: "Хорватия", flag: "🇭🇷" },
  HU: { name: "Венгрия", flag: "🇭🇺" },
  IE: { name: "Ирландия", flag: "🇮🇪" },
  IS: { name: "Исландия", flag: "🇮🇸" },
  IT: { name: "Италия", flag: "🇮🇹" },
  LI: { name: "Лихтенштейн", flag: "🇱🇮" },
  LT: { name: "Литва", flag: "🇱🇹" },
  LU: { name: "Люксембург", flag: "🇱🇺" },
  LV: { name: "Латвия", flag: "🇱🇻" },
  MC: { name: "Монако", flag: "🇲🇨" },
  ME: { name: "Черногория", flag: "🇲🇪" },
  MK: { name: "Северная Македония", flag: "🇲🇰" },
  MT: { name: "Мальта", flag: "🇲🇹" },
  NL: { name: "Нидерланды", flag: "🇳🇱" },
  NO: { name: "Норвегия", flag: "🇳🇴" },
  PL: { name: "Польша", flag: "🇵🇱" },
  PT: { name: "Португалия", flag: "🇵🇹" },
  RO: { name: "Румыния", flag: "🇷🇴" },
  RS: { name: "Сербия", flag: "🇷🇸" },
  SE: { name: "Швеция", flag: "🇸🇪" },
  SI: { name: "Словения", flag: "🇸🇮" },
  SK: { name: "Словакия", flag: "🇸🇰" },
  SM: { name: "Сан-Марино", flag: "🇸🇲" },
  VA: { name: "Ватикан", flag: "🇻🇦" },
  XK: { name: "Косово", flag: "🇽🇰" },

  // Asia
  AF: { name: "Афганистан", flag: "🇦🇫" },
  BD: { name: "Бангладеш", flag: "🇧🇩" },
  BH: { name: "Бахрейн", flag: "🇧🇭" },
  BN: { name: "Бруней", flag: "🇧🇳" },
  BT: { name: "Бутан", flag: "🇧🇹" },
  CN: { name: "Китай", flag: "🇨🇳" },
  HK: { name: "Гонконг", flag: "🇭🇰" },
  ID: { name: "Индонезия", flag: "🇮🇩" },
  IL: { name: "Израиль", flag: "🇮🇱" },
  IN: { name: "Индия", flag: "🇮🇳" },
  IQ: { name: "Ирак", flag: "🇮🇶" },
  IR: { name: "Иран", flag: "🇮🇷" },
  JO: { name: "Иордания", flag: "🇯🇴" },
  JP: { name: "Япония", flag: "🇯🇵" },
  KH: { name: "Камбоджа", flag: "🇰🇭" },
  KP: { name: "Северная Корея", flag: "🇰🇵" },
  KR: { name: "Южная Корея", flag: "🇰🇷" },
  KW: { name: "Кувейт", flag: "🇰🇼" },
  LA: { name: "Лаос", flag: "🇱🇦" },
  LB: { name: "Ливан", flag: "🇱🇧" },
  LK: { name: "Шри-Ланка", flag: "🇱🇰" },
  MM: { name: "Мьянма", flag: "🇲🇲" },
  MN: { name: "Монголия", flag: "🇲🇳" },
  MO: { name: "Макао", flag: "🇲🇴" },
  MV: { name: "Мальдивы", flag: "🇲🇻" },
  MY: { name: "Малайзия", flag: "🇲🇾" },
  NP: { name: "Непал", flag: "🇳🇵" },
  OM: { name: "Оман", flag: "🇴🇲" },
  PH: { name: "Филиппины", flag: "🇵🇭" },
  PK: { name: "Пакистан", flag: "🇵🇰" },
  PS: { name: "Палестина", flag: "🇵🇸" },
  QA: { name: "Катар", flag: "🇶🇦" },
  SA: { name: "Саудовская Аравия", flag: "🇸🇦" },
  SG: { name: "Сингапур", flag: "🇸🇬" },
  SY: { name: "Сирия", flag: "🇸🇾" },
  TH: { name: "Таиланд", flag: "🇹🇭" },
  TL: { name: "Восточный Тимор", flag: "🇹🇱" },
  TR: { name: "Турция", flag: "🇹🇷" },
  TW: { name: "Тайвань", flag: "🇹🇼" },
  AE: { name: "ОАЭ", flag: "🇦🇪" },
  VN: { name: "Вьетнам", flag: "🇻🇳" },
  YE: { name: "Йемен", flag: "🇾🇪" },

  // Africa
  AO: { name: "Ангола", flag: "🇦🇴" },
  BF: { name: "Буркина-Фасо", flag: "🇧🇫" },
  BI: { name: "Бурунди", flag: "🇧🇮" },
  BJ: { name: "Бенин", flag: "🇧🇯" },
  BW: { name: "Ботсвана", flag: "🇧🇼" },
  CD: { name: "ДР Конго", flag: "🇨🇩" },
  CF: { name: "ЦАР", flag: "🇨🇫" },
  CG: { name: "Конго", flag: "🇨🇬" },
  CI: { name: "Кот-д'Ивуар", flag: "🇨🇮" },
  CM: { name: "Камерун", flag: "🇨🇲" },
  CV: { name: "Кабо-Верде", flag: "🇨🇻" },
  DJ: { name: "Джибути", flag: "🇩🇯" },
  DZ: { name: "Алжир", flag: "🇩🇿" },
  EG: { name: "Египет", flag: "🇪🇬" },
  EH: { name: "Западная Сахара", flag: "🇪🇭" },
  ER: { name: "Эритрея", flag: "🇪🇷" },
  ET: { name: "Эфиопия", flag: "🇪🇹" },
  GA: { name: "Габон", flag: "🇬🇦" },
  GH: { name: "Гана", flag: "🇬🇭" },
  GM: { name: "Гамбия", flag: "🇬🇲" },
  GN: { name: "Гвинея", flag: "🇬🇳" },
  GQ: { name: "Экваториальная Гвинея", flag: "🇬🇶" },
  GW: { name: "Гвинея-Бисау", flag: "🇬🇼" },
  KE: { name: "Кения", flag: "🇰🇪" },
  KM: { name: "Коморы", flag: "🇰🇲" },
  LR: { name: "Либерия", flag: "🇱🇷" },
  LS: { name: "Лесото", flag: "🇱🇸" },
  LY: { name: "Ливия", flag: "🇱🇾" },
  MA: { name: "Марокко", flag: "🇲🇦" },
  MG: { name: "Мадагаскар", flag: "🇲🇬" },
  ML: { name: "Мали", flag: "🇲🇱" },
  MR: { name: "Мавритания", flag: "🇲🇷" },
  MU: { name: "Маврикий", flag: "🇲🇺" },
  MW: { name: "Малави", flag: "🇲🇼" },
  MZ: { name: "Мозамбик", flag: "🇲🇿" },
  NA: { name: "Намибия", flag: "🇳🇦" },
  NE: { name: "Нигер", flag: "🇳🇪" },
  NG: { name: "Нигерия", flag: "🇳🇬" },
  RW: { name: "Руанда", flag: "🇷🇼" },
  SC: { name: "Сейшелы", flag: "🇸🇨" },
  SD: { name: "Судан", flag: "🇸🇩" },
  SL: { name: "Сьерра-Леоне", flag: "🇸🇱" },
  SN: { name: "Сенегал", flag: "🇸🇳" },
  SO: { name: "Сомали", flag: "🇸🇴" },
  SS: { name: "Южный Судан", flag: "🇸🇸" },
  ST: { name: "Сан-Томе и Принсипи", flag: "🇸🇹" },
  SZ: { name: "Эсватини", flag: "🇸🇿" },
  TD: { name: "Чад", flag: "🇹🇩" },
  TG: { name: "Того", flag: "🇹🇬" },
  TN: { name: "Тунис", flag: "🇹🇳" },
  TZ: { name: "Танзания", flag: "🇹🇿" },
  UG: { name: "Уганда", flag: "🇺🇬" },
  ZA: { name: "ЮАР", flag: "🇿🇦" },
  ZM: { name: "Замбия", flag: "🇿🇲" },
  ZW: { name: "Зимбабве", flag: "🇿🇼" },

  // North America
  CA: { name: "Канада", flag: "🇨🇦" },
  MX: { name: "Мексика", flag: "🇲🇽" },
  US: { name: "США", flag: "🇺🇸" },

  // Central America & Caribbean
  AG: { name: "Антигуа и Барбуда", flag: "🇦🇬" },
  AI: { name: "Ангилья", flag: "🇦🇮" },
  AW: { name: "Аруба", flag: "🇦🇼" },
  BB: { name: "Барбадос", flag: "🇧🇧" },
  BZ: { name: "Белиз", flag: "🇧🇿" },
  BM: { name: "Бермуды", flag: "🇧🇲" },
  BS: { name: "Багамы", flag: "🇧🇸" },
  CR: { name: "Коста-Рика", flag: "🇨🇷" },
  CU: { name: "Куба", flag: "🇨🇺" },
  CW: { name: "Кюрасао", flag: "🇨🇼" },
  DM: { name: "Доминика", flag: "🇩🇲" },
  DO: { name: "Доминиканская Республика", flag: "🇩🇴" },
  GD: { name: "Гренада", flag: "🇬🇩" },
  GL: { name: "Гренландия", flag: "🇬🇱" },
  GP: { name: "Гваделупа", flag: "🇬🇵" },
  GT: { name: "Гватемала", flag: "🇬🇹" },
  HN: { name: "Гондурас", flag: "🇭🇳" },
  HT: { name: "Гаити", flag: "🇭🇹" },
  JM: { name: "Ямайка", flag: "🇯🇲" },
  KN: { name: "Сент-Китс и Невис", flag: "🇰🇳" },
  KY: { name: "Каймановы острова", flag: "🇰🇾" },
  LC: { name: "Сент-Люсия", flag: "🇱🇨" },
  MQ: { name: "Мартиника", flag: "🇲🇶" },
  MS: { name: "Монтсеррат", flag: "🇲🇸" },
  NI: { name: "Никарагуа", flag: "🇳🇮" },
  PA: { name: "Панама", flag: "🇵🇦" },
  PR: { name: "Пуэрто-Рико", flag: "🇵🇷" },
  SV: { name: "Сальвадор", flag: "🇸🇻" },
  SX: { name: "Синт-Мартен", flag: "🇸🇽" },
  TC: { name: "Теркс и Кайкос", flag: "🇹🇨" },
  TT: { name: "Тринидад и Тобаго", flag: "🇹🇹" },
  VC: { name: "Сент-Винсент и Гренадины", flag: "🇻🇨" },
  VG: { name: "Британские Виргинские острова", flag: "🇻🇬" },
  VI: { name: "Виргинские острова США", flag: "🇻🇮" },

  // South America
  AR: { name: "Аргентина", flag: "🇦🇷" },
  BO: { name: "Боливия", flag: "🇧🇴" },
  BR: { name: "Бразилия", flag: "🇧🇷" },
  CL: { name: "Чили", flag: "🇨🇱" },
  CO: { name: "Колумбия", flag: "🇨🇴" },
  EC: { name: "Эквадор", flag: "🇪🇨" },
  FK: { name: "Фолклендские острова", flag: "🇫🇰" },
  GF: { name: "Французская Гвиана", flag: "🇬🇫" },
  GY: { name: "Гайана", flag: "🇬🇾" },
  PE: { name: "Перу", flag: "🇵🇪" },
  PY: { name: "Парагвай", flag: "🇵🇾" },
  SR: { name: "Суринам", flag: "🇸🇷" },
  UY: { name: "Уругвай", flag: "🇺🇾" },
  VE: { name: "Венесуэла", flag: "🇻🇪" },

  // Oceania
  AS: { name: "Американское Самоа", flag: "🇦🇸" },
  AU: { name: "Австралия", flag: "🇦🇺" },
  CK: { name: "Острова Кука", flag: "🇨🇰" },
  FJ: { name: "Фиджи", flag: "🇫🇯" },
  FM: { name: "Микронезия", flag: "🇫🇲" },
  GU: { name: "Гуам", flag: "🇬🇺" },
  KI: { name: "Кирибати", flag: "🇰🇮" },
  MH: { name: "Маршалловы острова", flag: "🇲🇭" },
  MP: { name: "Северные Марианские острова", flag: "🇲🇵" },
  NC: { name: "Новая Каледония", flag: "🇳🇨" },
  NF: { name: "Остров Норфолк", flag: "🇳🇫" },
  NR: { name: "Науру", flag: "🇳🇷" },
  NU: { name: "Ниуэ", flag: "🇳🇺" },
  NZ: { name: "Новая Зеландия", flag: "🇳🇿" },
  PF: { name: "Французская Полинезия", flag: "🇵🇫" },
  PG: { name: "Папуа-Новая Гвинея", flag: "🇵🇬" },
  PW: { name: "Палау", flag: "🇵🇼" },
  SB: { name: "Соломоновы острова", flag: "🇸🇧" },
  TK: { name: "Токелау", flag: "🇹🇰" },
  TO: { name: "Тонга", flag: "🇹🇴" },
  TV: { name: "Тувалу", flag: "🇹🇻" },
  VU: { name: "Вануату", flag: "🇻🇺" },
  WF: { name: "Уоллис и Футуна", flag: "🇼🇫" },
  WS: { name: "Самоа", flag: "🇼🇸" },
};

// Available countries for the dropdown
const availableCountries: Country[] = Object.keys(countryData) as Country[];

// Helper function to get countries by calling code
const getCountriesByCallingCode = (callingCode: string): Country[] => {
  return availableCountries
    .filter((country) => {
      try {
        return getCountryCallingCode(country) === callingCode;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      const priorityA = countryData[a]?.priority || 999;
      const priorityB = countryData[b]?.priority || 999;
      return priorityA - priorityB;
    });
};

// Format phone number with spaces for Russian format
const formatPhoneNumber = (value: string, country: Country): string => {
  if (!value) return "";

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  if (getCountryCallingCode(country) === "7") {
    // Format for Russian numbers: XXX XXX-XX-XX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        8
      )}-${digits.slice(8, 10)}`;
    }
  }

  // Default formatting with spaces every 3 digits
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
};

interface CustomPhoneInputProps {
  onChange: (value: string | undefined) => void;
  value?: string;
  placeholder?: string;
  defaultCountry?: Country;
  error?: string;
  className?: string;
}

const PhoneInputWithCountry = forwardRef<
  HTMLInputElement,
  CustomPhoneInputProps
>(
  (
    {
      className,
      onChange,
      value,
      placeholder = "Введите номер телефона",
      defaultCountry = "RU",
      error,
      ...restProps
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] =
      useState<Country>(defaultCountry);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const callingCode = getCountryCallingCode(selectedCountry);

    const [isYandexBrowser, setIsYandexBrowser] = useState(false);

    // detect Yandex.Browser on mount
    useEffect(() => {
      const ua = window.navigator.userAgent;
      if (ua.includes("YaBrowser")) {
        setIsYandexBrowser(true);
      }
    }, []);

    // Forward the ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    // Update input value when external value changes
    useEffect(() => {
      if (value) {
        const digits = value.replace(/\D/g, "");
        if (digits.startsWith(callingCode)) {
          setInputValue(
            formatPhoneNumber(digits.slice(callingCode.length), selectedCountry)
          );
        } else {
          setInputValue(formatPhoneNumber(digits, selectedCountry));
        }
      } else {
        setInputValue("");
      }
    }, [value, callingCode, selectedCountry]);

    const handleCountryChange = (country: Country) => {
      setSelectedCountry(country);
      setInputValue("");
      onChange(undefined);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isYandexBrowser) {
        const newRaw = e.target.value.replace(/\D/g, "");
        setInputValue(newRaw);
        onChange(newRaw ? `+${callingCode}${newRaw}` : undefined);
        return;
      }
      const newValue = e.target.value;
      const digits = newValue.replace(/\D/g, "");
      // Format the input value for display
      setInputValue(formatPhoneNumber(digits, selectedCountry));

      // Pass the full number with country code to onChange
      if (digits.length > 0) {
        onChange(`+${callingCode}${digits}`);
      } else {
        onChange(undefined);
      }
    };

    if (isYandexBrowser) {
      return (
        <input
          type="tel"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            onChange(raw ? `+${raw}` : undefined);
          }}
          className={cn(
            "w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none",
            className
          )}
          {...restProps}
        />
      );
    }

    return (
      <div className={cn("relative w-full", className)}>
        <div
          className={cn(
            "flex items-center w-full px-3 py-2.5 border rounded-lg bg-gray-50 text-sm focus-within:ring-1",
            "border-gray-300 focus-within:ring-blue-500"
          )}
        >
          {/* Country selector */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none mr-2"
          >
            <span className="text-base">
              {countryData[selectedCountry]?.flag}
            </span>
            <ChevronDownIcon className="h-3 w-3 text-gray-400" />
          </button>

          {/* Country code */}
          <span className="text-gray-600 mr-1">+{callingCode}</span>

          {/* Input field */}
          <input
            ref={inputRef}
            type="tel"
            maxLength={13}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
            {...restProps}
          />

          {/* Phone icon */}
          <PhoneIcon className="h-4 w-4 text-gray-400 ml-2" />
        </div>

        {/* Country dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
              {/* Show +7 countries first if current selection is +7 */}
              {callingCode === "7" && (
                <>
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                    Страны +7
                  </div>
                  {getCountriesByCallingCode("7").map((country) => {
                    const data = countryData[country];
                    if (!data) return null;

                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          handleCountryChange(country);
                          setIsOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm ${
                          country === selectedCountry
                            ? "bg-blue-50 text-blue-700"
                            : ""
                        }`}
                      >
                        <span className="text-base">{data.flag}</span>
                        <span className="flex-1">{data.name}</span>
                        <span className="text-gray-500 text-xs">
                          +{getCountryCallingCode(country)}
                        </span>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-100 my-1"></div>
                </>
              )}

              {/* Show all other countries */}
              {availableCountries
                .filter(
                  (country) =>
                    callingCode !== "7" ||
                    !getCountriesByCallingCode("7").includes(country)
                )
                .map((country) => {
                  const data = countryData[country];
                  if (!data) return null;

                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        handleCountryChange(country);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm ${
                        country === selectedCountry
                          ? "bg-blue-50 text-blue-700"
                          : ""
                      }`}
                    >
                      <span className="text-base">{data.flag}</span>
                      <span className="flex-1">{data.name}</span>
                      <span className="text-gray-500 text-xs">
                        +{getCountryCallingCode(country)}
                      </span>
                    </button>
                  );
                })}
            </div>
          </>
        )}

        {/* Error message */}
        {/* {error && <p className="mt-1 text-sm text-red-600">{error}</p>} */}
      </div>
    );
  }
);
PhoneInputWithCountry.displayName = "PhoneInputWithCountry";

export { PhoneInputWithCountry };
