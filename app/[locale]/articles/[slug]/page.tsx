"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { useArticleBySlug } from "@/entities/articles/hooks/use-articles";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import Link from "next/link";
import { useEffect } from "react";
import { RelatedArticles } from "@/entities/articles/ui/related-articles/related-articles";
import { ShareButtons } from "@/entities/articles/ui/share-buttons/share-buttons";
import { Breadcrumb } from "@/shared/ui/breadcrumb/breadcrumb";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const slug = params.slug as string;
  const { data: article, isLoading, error } = useArticleBySlug(slug);

  // Update page metadata when article loads
  useEffect(() => {
    if (article) {
      document.title = article.meta_title || article.title;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          article.meta_description || article.excerpt || ""
        );
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", article.title);
      }

      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute(
          "content",
          article.meta_description || article.excerpt || ""
        );
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && article.featured_image) {
        ogImage.setAttribute("content", article.featured_image);
      }
    }
  }, [article]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ContentWrapper>
          <div className="w-full max-w-4xl mx-auto py-8">
            {/* Back Button Skeleton */}
            <Skeleton className="h-10 w-32 mb-6" />

            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3" />
            </div>

            {/* Featured Image Skeleton */}
            <Skeleton className="h-64 w-full rounded-2xl mb-8" />

            {/* Content Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <ContentWrapper>
          <div className="w-full max-w-4xl mx-auto py-8">
            <div className="text-center py-16">
              <div className="text-red-500 text-6xl mb-4">📄</div>
              <div className="text-gray-600 text-xl font-medium mb-2">
                {locale === "ru" ? "Статья не найдена" : "Article not found"}
              </div>
              <p className="text-gray-500 mb-6">
                {locale === "ru"
                  ? "Возможно, статья была удалена или перемещена"
                  : "The article may have been deleted or moved"}
              </p>
              <Link
                href={`/${locale}/articles`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {locale === "ru" ? "Все статьи" : "All articles"}
              </Link>
            </div>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ContentWrapper>
        <div className="w-full max-w-4xl mx-auto py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              {
                label: locale === "ru" ? "Статьи" : "Articles",
                href: `/${locale}/articles`,
              },
              {
                label: article.title,
              },
            ]}
            locale={locale}
          />

          {/* Back Button */}
          <Link
            href={`/${locale}/articles`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {locale === "ru" ? "Все статьи" : "All articles"}
          </Link>

          {/* Article Header */}
          <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/articles?tag=${tag.slug}`}
                    className="px-3 py-1 text-sm font-medium rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: tag.color
                        ? `${tag.color}20`
                        : "#3B82F620",
                      color: tag.color || "#3B82F6",
                      border: `1px solid ${tag.color || "#3B82F6"}40`,
                    }}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              {article.author && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    {article.author.first_name} {article.author.last_name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDate(article.created_at)}</span>
              </div>

              {article.updated_at !== article.created_at && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>
                    {locale === "ru" ? "Обновлено" : "Updated"}{" "}
                    {formatDate(article.updated_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-8">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <ShareButtons
                title={article.title}
                url={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/${locale}/articles/${article.slug}`
                    : ""
                }
                locale={locale}
              />
            </div>
          </article>

          {/* Related Articles */}
          {article.tags && article.tags.length > 0 && (
            <RelatedArticles
              currentArticleId={article.id}
              tags={article.tags}
              locale={locale}
            />
          )}

          {/* Back to Articles */}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/articles`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {locale === "ru" ? "Вернуться к статьям" : "Back to articles"}
            </Link>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
