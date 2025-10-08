"use client";

import { useQuery } from "@tanstack/react-query";
import { articlesApi, type ArticleFilters } from "@/shared/api/articles";

export const useArticles = (filters?: ArticleFilters) => {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: () => articlesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchArticles = (
  query: string,
  filters?: Omit<ArticleFilters, "search">
) => {
  return useQuery({
    queryKey: ["articles", "search", query, filters],
    queryFn: () => articlesApi.search(query, filters),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => articlesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useArticleTags = () => {
  return useQuery({
    queryKey: ["article-tags"],
    queryFn: () => articlesApi.getTags(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useArticlesByTag = (
  tagSlug: string,
  filters?: Omit<ArticleFilters, "tag">
) => {
  return useQuery({
    queryKey: ["articles", "tag", tagSlug, filters],
    queryFn: () => articlesApi.getByTag(tagSlug, filters),
    enabled: !!tagSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
