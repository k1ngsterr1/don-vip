import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";
import {
  CreateProductDto,
  PaginatedResponse,
  Product,
  UpdateProductDto,
} from "../model/types";

interface SmileProduct {
  id: string;
  name: string;
  api_game: string;
  image: string;
}

interface SmileSKU {
  id: string;
  name: string;
  price: number;
}

export const productService = {
  create: async (data: CreateProductDto): Promise<Product> => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("type", data.type);

      // Add image
      formData.append("image", data.image);

      // Add optional fields
      if (data.smile_api_game) {
        formData.append("smile_api_game", data.smile_api_game);
      }

      // Add replenishment array as JSON string
      formData.append("replenishment", JSON.stringify(data.replenishment));

      const response = await apiClient.post<Product>("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  findAll: async (
    search?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>(
        "/product/active",
        {
          params: { search, limit, page },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getSmileProducts: async (): Promise<SmileProduct[]> => {
    try {
      const response = await apiClient.get<SmileProduct[]>("/product/smile");
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getSmileSKU: async (apiGame: string): Promise<SmileSKU[]> => {
    try {
      const response = await apiClient.get<SmileSKU[]>(
        `/product/smile/${apiGame}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  findOne: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add fields to FormData if they exist
      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.type) formData.append("type", data.type);
      if (data.image) formData.append("image", data.image);
      if (data.smile_api_game)
        formData.append("smile_api_game", data.smile_api_game);
      if (data.replenishment)
        formData.append("replenishment", JSON.stringify(data.replenishment));

      const response = await apiClient.patch<Product>(
        `/product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/product/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
