"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mic, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  className?: string;
  height?: string;
  iconSize?: number;
  enhanced?: boolean;
  compact?: boolean;
}

export default function SearchBar({
  placeholder = "Найти сервис, либо игру",
  initialValue = "",
  onSearch,
  className = "",
  height = "72px",
  iconSize = 17,
  enhanced = false,
  compact = false,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Example suggestions - in a real app, these would be dynamic
  const suggestions = [
    "Mobile Legends",
    "PUBG Mobile",
    "Bigo Live",
    "Free Fire",
    "TikTok Coins",
  ];

  const recentSearches = ["Genshin Impact", "Likee Diamonds"];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }

    // Show suggestions when typing
    if (value.length > 0 && enhanced) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (enhanced && searchValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleClear = () => {
    setSearchValue("");
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleVoiceSearch = () => {
    // In a real app, this would trigger voice recognition
    alert("Voice search activated");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchValue) {
      onSearch(searchValue);
    }
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`relative ${enhanced ? "group" : ""}`}>
          {/* Search icon */}
          <Search
            size={compact ? 18 : enhanced ? 20 : iconSize}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              enhanced
                ? `text-gray-400 group-hover:text-blue-600 transition-colors ${
                    isFocused ? "text-blue-600" : ""
                  }`
                : "text-gray-400"
            }`}
          />

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full bg-gray-100 placeholder:text-gray-400 placeholder:text-[16px] text-gray-700 pl-12 pr-12 py-2 text-[16px] focus:outline-none ${
              enhanced
                ? `md:bg-gray-50 md:border md:border-gray-200 md:rounded-full md:py-3 md:pl-14 md:pr-14 md:text-base md:shadow-sm md:focus:shadow-md md:focus:border-blue-300 transition-all duration-200 group-hover:border-gray-300 ${
                    compact ? "md:py-2 md:pl-10 md:pr-10 md:text-sm" : ""
                  }`
                : ""
            } ${className}`}
            style={{ height: compact ? "auto" : height }}
          />

          {/* Clear button - only show when there's text */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                enhanced
                  ? `right-${
                      compact ? "10" : "14"
                    } md:w-8 md:h-8 md:flex md:items-center md:justify-center md:rounded-full md:hover:bg-gray-200 transition-colors ${
                      compact ? "md:w-6 md:h-6" : ""
                    }`
                  : "right-10"
              }`}
            >
              <X
                size={compact ? 14 : enhanced ? 18 : 16}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}

          {/* Voice search button - PC only */}
          {enhanced && !compact && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Mic size={18} className="text-gray-400 hover:text-blue-600" />
            </button>
          )}

          {/* Submit button - only visible on PC when enhanced */}
          {enhanced && (
            <button
              type="submit"
              className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 items-center justify-center"
            >
              <ArrowRight
                size={compact ? 16 : 20}
                className={`text-gray-400 hover:text-blue-600 transition-colors ${
                  isFocused ? "text-blue-600" : ""
                }`}
              />
            </button>
          )}
        </div>
      </form>

      {/* Search suggestions dropdown - PC only */}
      {enhanced && (
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200"
            >
              {/* Suggestions */}
              <div className="p-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    Популярные запросы
                  </h3>
                </div>

                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      className="flex items-center px-3 py-2 w-full hover:bg-gray-50 rounded-md text-left"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search size={14} className="text-gray-400 mr-2" />
                      <span>{suggestion}</span>
                    </button>
                  </motion.div>
                ))}

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <>
                    <div className="px-3 py-2 mt-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase">
                        Недавние запросы
                      </h3>
                    </div>

                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: (suggestions.length + index) * 0.05,
                        }}
                      >
                        <button
                          className="flex items-center px-3 py-2 w-full hover:bg-gray-50 rounded-md text-left"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <Search size={14} className="text-gray-400 mr-2" />
                          <span>{search}</span>
                        </button>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-2 bg-gray-50">
                <div className="flex justify-between items-center px-3 py-1">
                  <span className="text-xs text-gray-500">
                    Нажмите Enter для поиска
                  </span>
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => setShowSuggestions(false)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
