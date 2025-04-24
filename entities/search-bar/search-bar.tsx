"use client";

import { Search } from "lucide-react";
import { useState, type ChangeEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  className?: string;
  height?: string;
  iconSize?: number;
}

export default function SearchBar({
  placeholder = "Найти сервис, либо игру",
  initialValue = "",
  onSearch,
  className = "",
  height = "72px",
  iconSize = 17,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative">
      <Search
        size={iconSize}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className={`w-full bg-gray-100 rounded-[12px] placeholder:text-gray-400 placeholder:text-[16px] text-gray-400 pl-10 pr-4 py-2 text-[16px] focus:outline-none ${className}`}
        style={{ height }}
      />
    </div>
  );
}
