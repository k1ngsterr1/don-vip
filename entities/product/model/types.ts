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
  donatbank_product_id?: string;
  type: "Bigo" | "Smile" | "DonatBank";
  currency_image: string; // URL to the currency icon image
  currency_name: string; // Name of the currency (e.g., USD, EUR, RUB)
  isServerRequired?: boolean; // Whether the game requires server selection
  // Required fields for purchase
  requireUserId?: boolean; // Whether user ID is required
  requireServer?: boolean; // Whether server is required
  requireEmail?: boolean; // Whether email is required
  requireUID?: boolean; // Whether UID is required
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  image: File;
  replenishment: ReplenishmentItem[];
  smile_api_game?: string;
  donatbank_product_id?: string;
  type: "Bigo" | "Smile" | "DonatBank";
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  image?: File;
  replenishment?: ReplenishmentItem[];
  smile_api_game?: string;
  donatbank_product_id?: string;
  type?: "Bigo" | "Smile" | "DonatBank";
}
