"use client";

import { useState } from "react";
import { ReviewForm } from "@/entities/reviews/ui/submit-review/submit-review";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { Edit2Icon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Image from "next/image";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useProducts } from "@/entities/product/hooks/queries/use-products";

export default function SendReview() {
  const i18n = useTranslations("SendReview");
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId")
    ? Number.parseInt(searchParams.get("productId")!, 10)
    : searchParams.get("gameId")
    ? Number.parseInt(searchParams.get("gameId")!, 10)
    : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >(productId);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch products with search if provided
  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts(debouncedSearch);

  // Filter products based on search query
  const filteredProducts = productsData?.data || [];

  // Handle product selection
  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
  };

  return (
    <ContentWrapper>
      <div className="w-full min-h-[80vh] px-[11px] mt-[24px] flex flex-col items-center">
        <div className="w-full flex items-start justify-start mb-[24px]">
          <Link href={"/reviews"} className="text-blue text-[15px] font-roboto">
            {i18n("backLink")}
          </Link>
        </div>
        <div className="w-full flex items-start justify-start">
          <SectionTitle
            icon={<Edit2Icon className="text-blue" size={16} />}
            title={i18n("title")}
          />
        </div>

        {/* Show product selection if no productId is provided in URL */}
        {!productId && !selectedProductId && (
          <div className="w-full mb-6">
            <h3 className="text-lg font-medium mb-3">
              {i18n("selectProduct")}
            </h3>

            {/* Search input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={i18n("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse rounded-lg h-32"
                  ></div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-red-500 text-center py-4">
                {i18n("errorLoading")}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {i18n("noProducts")}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="relative h-20 mb-2">
                      <Image
                        src={
                          product.image ||
                          "/placeholder.svg?height=80&width=120&query=product" ||
                          "/placeholder.svg"
                        }
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-center truncate">
                      {product.name}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show selected product info if a product is selected but not from URL */}
        {selectedProductId && !productId && (
          <div className="w-full mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-medium">{i18n("selectedProduct")}:</div>
                <div className="ml-2">
                  {productsData?.data.find((p) => p.id === selectedProductId)
                    ?.name || `Product #${selectedProductId}`}
                </div>
              </div>
              <button
                onClick={() => setSelectedProductId(undefined)}
                className="text-sm text-blue-600 hover:underline"
              >
                {i18n("change")}
              </button>
            </div>
          </div>
        )}
        {(productId || selectedProductId) && (
          <ReviewForm
            gameId={productId || selectedProductId}
            redirectPath="/reviews"
          />
        )}
      </div>
    </ContentWrapper>
  );
}
