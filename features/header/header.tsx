"use client";

import { useState } from "react";
import logo from "@/assets/Logo.webp";
import ru from "@/assets/RU.webp";
import Image from "next/image";
import Link from "next/link";
import google from "@/assets/google.webp";
import SearchBar from "@/entities/search-bar/search-bar";

interface IHeader {
  isSearchBar?: boolean;
}

export default function Header({ isSearchBar = true }: IHeader) {
  const [language, setLanguage] = useState("ru");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Additional search logic can be added here
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex justify-between items-center px-4 py-[9px]">
        <div className="flex items-center">
          <Image
            src={logo.src || "/placeholder.svg"}
            width={161}
            height={31}
            alt="DON-VIP Logo"
            className="w-[161px] h-[31px]"
          />
        </div>
        <div className="flex gap-[18px] items-center justify-center">
          <Image
            src={ru.src || "/placeholder.svg"}
            width={32}
            height={32}
            alt="RU"
          />
          <Link href="/login" className="text-[15px] text-dark font-condensed">
            ВОЙТИ
          </Link>
          <button className="w-[22px] h-[22px] flex items-center justify-center rounded-[4px] border-[1px] border-black/5 p-[2px]">
            <Image
              src={google || "/placeholder.svg"}
              alt="Google"
              className="w-[12px] h-[12px]"
            />
          </button>
        </div>
      </div>
      {isSearchBar && (
        <div className="px-4 py-2">
          <SearchBar
            placeholder="Найти сервис, либо игру"
            onSearch={handleSearch}
            height="72px"
          />
        </div>
      )}
    </header>
  );
}
