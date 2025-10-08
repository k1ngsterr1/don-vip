"use client";

import { useArticles } from "@/entities/articles/hooks/use-articles";
import { ArticleCard } from "@/entities/articles/ui/article-card/article-card";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import type { Tag } from "@/shared/api/articles";

interface RelatedArticlesProps {
  currentArticleId: number;
  tags: Tag[];
  locale: string;
}

export function RelatedArticles({
  currentArticleId,
  tags,
  locale,
}: RelatedArticlesProps) {
  // Get articles with same tags
  const { data: articlesResponse, isLoading } = useArticles({
    limit: 4,
    tag: tags[0]?.slug, // Use first tag for related articles
  });

  // Filter out current article and limit to 3 related articles
  const relatedArticles =
    articlesResponse?.data
      ?.filter((article) => article.id !== currentArticleId)
      .slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {locale === "ru" ? "Похожие статьи" : "Related Articles"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Skeleton className="h-40 w-full rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedArticles.length) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {locale === "ru" ? "Похожие статьи" : "Related Articles"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
