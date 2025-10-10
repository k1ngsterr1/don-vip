"use client";

import { Article } from "@/shared/api/articles";
import Link from "next/link";
import { useLocale } from "next-intl";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export const ArticleCard = ({ article, className = "" }: ArticleCardProps) => {
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return locale === "ru" ? "Только что" : "Just now";
    } else if (diffInHours < 24) {
      return locale === "ru"
        ? `${diffInHours} ч. назад`
        : `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return locale === "ru" ? `${days} д. назад` : `${days}d ago`;
    } else {
      return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getExcerpt = () => {
    if (article.excerpt) return article.excerpt;

    // Extract text from HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = article.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent;
  };

  return (
    <Link href={`/${locale}/articles/${article.slug}`}>
      <article className={`group cursor-pointer ${className}`}>
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: tag.color
                        ? `${tag.color}20`
                        : "#3B82F620",
                      color: tag.color || "#3B82F6",
                      border: `1px solid ${tag.color || "#3B82F6"}40`,
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {getExcerpt()}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {article.author && (
                  <span>
                    {article.author.first_name} {article.author.last_name}
                  </span>
                )}
                <span>{formatDate(article.created_at)}</span>
              </div>

              <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Читать</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
