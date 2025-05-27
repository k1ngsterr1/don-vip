"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ArrowLeft, Loader2, Search, SearchIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchProducts } from "@/entities/product/hooks/queries/use-search-product";
import SearchBar from "@/entities/search-bar/search-bar";
import GameCard from "@/entities/games/ui/game-card/game-card";
import { useTranslations } from "next-intl";

export default function SearchPage() {
  const t = useTranslations("Search");
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState<{
    category?: string;
    sort?: string;
  }>({});

  // Get search results
  const { data: searchResults, isLoading } = useSearchProducts(searchQuery);

  // Apply filters to results
  const filteredResults = searchResults?.data
    ? searchResults.data.filter((product) => {
        // Apply category filter if set
        if (filters.category && product.type !== filters.category) {
          return false;
        }
        return true;
      })
    : [];

  // Apply sorting
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!filters.sort || filters.sort === "relevance") {
      return 0;
    }
    if (filters.sort === "name_asc") {
      return a.name.localeCompare(b.name);
    }
    if (filters.sort === "name_desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Update search query when URL param changes
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Function to get the appropriate results text based on count
  const getResultsText = (count: number, query: string) => {
    if (count === 1) {
      return t("resultsFoundOne", { query });
    }
    return t("resultsFoundMany", { count, query });
  };

  return (
    <div className="w-full flex flex-col items-center pb-20">
      <ContentWrapper>
        <div className="w-full max-w-[1680px]">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              {t("back")}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 font-unbounded">
              {t("title")}
            </h1>

            <div className="mb-8">
              <SearchBar
                initialValue={searchQuery}
                onSearch={handleSearch}
                enhanced={true}
                height="56px"
              />
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">{t("searching")}</span>
              </div>
            ) : sortedResults.length === 0 && searchQuery ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <SearchIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {t("notFound")}
                </h3>
                <p className="text-gray-500">
                  {t("noResultsFor", { query: searchQuery })}
                </p>
              </div>
            ) : sortedResults.length === 0 && !searchQuery ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {t("startSearching")}
                </h3>
                <p className="text-gray-500">{t("enterQuery")}</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-gray-500">
                    {getResultsText(sortedResults.length, searchQuery)}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  <AnimatePresence>
                    {sortedResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <GameCard
                          title={product.name}
                          image={product.image || "/placeholder.svg"}
                          badge={product.type === "Bigo" ? "B" : "S"}
                          href={`/product/${product.id}`}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
