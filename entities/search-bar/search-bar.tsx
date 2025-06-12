"use client";

import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSearchProducts } from "../product/hooks/queries/use-search-product";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  className?: string;
  height?: string;
  iconSize?: number;
  enhanced?: boolean;
  compact?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface ProductSuggestion {
  id: string | null;
  name: string;
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
  onFocus,
  onBlur,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch product suggestions based on search value
  const { data: searchResults } = useSearchProducts(
    searchValue.length > 1 ? searchValue : "",
    5
  );

  const suggestions: any =
    searchResults?.items?.map((product) => ({
      id: product.id,
      name: product.name,
    })) || [];

  // Only use actual search results, no popular products fallback
  const displaySuggestions: ProductSuggestion[] = suggestions;

  // Get recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<ProductSuggestion[]>([]);

  // Load recent searches from localStorage - FIXED: Using useEffect with client-side check
  useEffect(() => {
    // This will only run on the client after hydration is complete
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        // Ensure we have valid objects in our array
        const validSearches = Array.isArray(parsedSearches)
          ? parsedSearches.filter(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                typeof item.name === "string"
            )
          : [];
        setRecentSearches(validSearches);
      } catch (error) {
        localStorage.setItem("recentSearches", JSON.stringify([]));
      }
    }
  }, []);

  const addToRecentSearches = (term: string, id: string | null = null) => {
    if (!term.trim()) return;

    const newSearch = { id, name: term };
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((item) => item.name !== term),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

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
    // Call the external onFocus handler if provided
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      // Call the external onBlur handler if provided
      if (onBlur) {
        onBlur();
      }
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

  const handleSuggestionClick = (suggestion: ProductSuggestion) => {
    setSearchValue(suggestion.name);
    setShowSuggestions(false);

    // Add to recent searches
    addToRecentSearches(suggestion.name, suggestion.id);

    // Navigate to product detail page if ID exists, otherwise to search page
    if (suggestion.id) {
      router.push(`/product/${suggestion.id}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.name)}`);
    }

    if (onSearch) {
      onSearch(suggestion.name);
    }
  };

  const handleVoiceSearch = () => {
    alert("Voice search activated");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const matchingProduct = suggestions.find(
        (product: any) =>
          product.name.toLowerCase() === searchValue.toLowerCase()
      );

      // Add to recent searches with ID if available
      addToRecentSearches(searchValue, matchingProduct?.id || null);

      // Navigate to product detail page if match found, otherwise to search page
      if (matchingProduct?.id) {
        router.push(`/product/${matchingProduct.id}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      }

      if (onSearch) {
        onSearch(searchValue);
      }
    }
    setShowSuggestions(false);
  };

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

  // Determine if we're on mobile based on viewport width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
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
      {enhanced && (
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 ${
                isMobile ? "max-h-[70vh] overflow-y-auto" : ""
              }`}
            >
              <div className="p-2">
                {displaySuggestions.length > 0 && (
                  <>
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase">
                        Результаты поиска
                      </h3>
                    </div>
                    {displaySuggestions.map((suggestion, index) => (
                      <motion.div
                        key={`suggestion-${suggestion.id || index}-${
                          suggestion.name
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          className="flex items-center px-3 py-2 w-full hover:bg-gray-50 rounded-md text-left"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <Search size={14} className="text-gray-400 mr-2" />
                          <span>{suggestion.name}</span>
                        </button>
                      </motion.div>
                    ))}
                  </>
                )}

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
                        key={`recent-${index}-${search.id || ""}-${
                          search.name
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: (displaySuggestions.length + index) * 0.05,
                        }}
                      >
                        <button
                          className="flex items-center px-3 py-2 w-full hover:bg-gray-50 rounded-md text-left"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <Search size={14} className="text-gray-400 mr-2" />
                          <span>{search.name}</span>
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
