import { apiClient } from "@/shared/config/apiClient";

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  is_active: boolean;
  author_id?: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  tags: Tag[];
}

export interface ArticlesResponse {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  is_published?: boolean;
  author_id?: number;
}

export const articlesApi = {
  // Get all published articles with filters and pagination
  getAll: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();

    // Only get published and active articles for public view
    params.append("is_published", "true");
    params.append("is_active", "true");

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.author_id)
      params.append("author_id", filters.author_id.toString());

    const response = await apiClient.get(`/articles?${params.toString()}`);
    return response.data;
  },

  // Search articles
  search: async (
    query: string,
    filters?: Omit<ArticleFilters, "search">
  ): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("is_published", "true");
    params.append("is_active", "true");

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.author_id)
      params.append("author_id", filters.author_id.toString());

    const response = await apiClient.get(
      `/articles/search?${params.toString()}`
    );
    return response.data;
  },

  // Get article by slug
  getBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get(`/articles/slug/${slug}`);
    return response.data;
  },

  // Get all tags
  getTags: async (): Promise<Tag[]> => {
    const response = await apiClient.get("/articles/tags/all");
    return response.data;
  },

  // Get articles by tag
  getByTag: async (
    tagSlug: string,
    filters?: Omit<ArticleFilters, "tag">
  ): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();
    params.append("is_published", "true");
    params.append("is_active", "true");

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.author_id)
      params.append("author_id", filters.author_id.toString());

    const response = await apiClient.get(
      `/articles/tag/${tagSlug}?${params.toString()}`
    );
    return response.data;
  },
};
