"use client";

import google from "@/assets/google.webp";
import logo from "@/assets/Logo.webp";
import ru from "@/assets/RU.webp";
import SearchBar from "@/entities/search-bar/search-bar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IHeader {
  isSearchBar?: boolean;
}

export default function Header({ isSearchBar = true }: IHeader) {
  const [language, setLanguage] = useState("ru");
  const navigate = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Additional search logic can be added here
  };

  return (
    <header className="bg-white border-b border-gray-100 px-[11px]">
      <div className="flex justify-between items-center px-4 py-[9px]">
        <div className="flex items-center">
          <Image
            onClick={() => navigate.push("/")}
            src={logo.src || "/placeholder.svg"}
            width={161}
            height={31}
            alt="DON-VIP Logo"
            className=" xxs:h-[24px] xxs:w-[121px] xs:w-[161px] xs:h-[31px]"
          />
        </div>
        <div className="flex gap-[18px] xxs:w-[24px] xxs:h-[24px] items-center justify-center">
          <Image
            src={ru.src || "/placeholder.svg"}
            width={32}
            height={32}
            alt="RU"
          />
          <Link
            href="/auth/login"
            className="text-[15px] text-dark font-condensed"
          >
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
        <SearchBar
          placeholder="Найти сервис, либо игру"
          onSearch={handleSearch}
          height="72px"
        />
      )}
    </header>
  );
}
