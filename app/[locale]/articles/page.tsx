"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import {
  useArticles,
  useArticleTags,
  useArticlesByTag,
  useSearchArticles,
} from "@/entities/articles/hooks/use-articles";
import { ArticleCard } from "@/entities/articles/ui/article-card/article-card";
import { TagFilter } from "@/entities/articles/ui/tag-filter/tag-filter";
import { Pagination } from "@/shared/ui/pagination/pagination";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import SectionTitle from "@/shared/ui/section-title/section-title";

const ARTICLES_PER_PAGE = 12;

export default function ArticlesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  // Get URL parameters
  useEffect(() => {
    const page = searchParams.get("page");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    if (page) setCurrentPage(parseInt(page) || 1);
    if (tag) setSelectedTag(tag);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading } = useArticleTags();

  // Fetch articles based on filters
  const filters = {
    page: currentPage,
    limit: ARTICLES_PER_PAGE,
  };

  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
  } = searchQuery
    ? useSearchArticles(searchQuery, filters)
    : selectedTag
    ? useArticlesByTag(selectedTag, filters)
    : useArticles(filters);

  // Update URL when filters change
  const updateURL = (newPage?: number, newTag?: string, newSearch?: string) => {
    const params = new URLSearchParams();

    if (newPage && newPage > 1) params.set("page", newPage.toString());
    if (newTag) params.set("tag", newTag);
    if (newSearch) params.set("search", newSearch);

    const newURL = params.toString()
      ? `/${locale}/articles?${params.toString()}`
      : `/${locale}/articles`;

    router.replace(newURL, { scroll: false });
  };

  const handleTagSelect = (tagSlug?: string) => {
    setSelectedTag(tagSlug);
    setCurrentPage(1);
    setSearchQuery("");
    updateURL(1, tagSlug, undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, selectedTag, searchQuery);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTag(undefined);
    setCurrentPage(1);
    updateURL(1, undefined, query);
  };

  const articles = articlesData?.data || [];
  const pagination = articlesData?.pagination;

  return (
    <div className="min-h-screen bg-white">
      <ContentWrapper>
        <div className="w-full max-w-[1680px] py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <SectionTitle
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              }
              title={locale === "ru" ? "Статьи" : "Articles"}
            />
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              {locale === "ru"
                ? "Полезные статьи, гайды и новости о играх и наших сервисах"
                : "Useful articles, guides and news about games and our services"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={
                  locale === "ru" ? "Поиск статей..." : "Search articles..."
                }
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tag Filter */}
          {tagsLoading ? (
            <div className="flex gap-3 mb-8 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          ) : (
            <TagFilter
              tags={tags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
              className="justify-center mb-8"
            />
          )}

          {/* Articles Grid */}
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: ARTICLES_PER_PAGE }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : articlesError ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-lg font-medium mb-2">
                {locale === "ru" ? "Ошибка загрузки" : "Loading Error"}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {locale === "ru"
                  ? "Не удалось загрузить статьи. Попробуйте позже."
                  : "Failed to load articles. Please try again later."}
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
                {searchQuery
                  ? locale === "ru"
                    ? "Статьи не найдены"
                    : "No articles found"
                  : selectedTag
                  ? locale === "ru"
                    ? "Нет статей с этим тегом"
                    : "No articles with this tag"
                  : locale === "ru"
                  ? "Пока нет статей"
                  : "No articles yet"}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? locale === "ru"
                    ? "Попробуйте изменить запрос или очистить фильтры"
                    : "Try changing your search query or clearing filters"
                  : locale === "ru"
                  ? "Скоро здесь появятся интересные материалы"
                  : "Interesting content will appear here soon"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              )}
            </>
          )}

          {/* Stats */}
          {pagination && articles.length > 0 && (
            <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              {locale === "ru"
                ? `Показано ${articles.length} из ${pagination.total} статей`
                : `Showing ${articles.length} of ${pagination.total} articles`}
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}
