export interface ReplenishmentItem {
  price: number;
  amount: number;
  type: string;
  sku: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  description_en: string;
  image: string;
  replenishment: ReplenishmentItem[];
  smile_api_game?: string;
  type: "Bigo" | "Smile";
  currency_image: string; // URL to the currency icon image
  currency_name: string; // Name of the currency (e.g., USD, EUR, RUB)
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  image: File;
  replenishment: ReplenishmentItem[];
  smile_api_game?: string;
  type: "Bigo" | "Smile";
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  image?: File;
  replenishment?: ReplenishmentItem[];
  smile_api_game?: string;
  type?: "Bigo" | "Smile";
}
