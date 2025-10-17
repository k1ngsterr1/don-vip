const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.don-vip.com/api";

export interface DiamondPrice {
  id: number;
  price_per_diamond: number;
  currency: string;
  is_active: boolean;
  custom_amount_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const diamondPriceApi = {
  async getActivePrice(currency: string = "RUB"): Promise<DiamondPrice> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/diamond-price/active?currency=${currency}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching diamond price:", error);
      // Возвращаем fallback цену, если API недоступен
      return {
        id: 0,
        price_per_diamond: 1, // 1 рубль за алмаз как fallback
        currency: currency,
        is_active: true,
        custom_amount_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },
};
