export interface CurrencyOption {
  id: number;
  amount: number;
  price: string;
  priceValue?: number;
  originalPriceRub: number;
  type: string;
  sku: string;
  discount?: number;
  discountPercent?: number;
  isDiscounted?: boolean;
  isPopular?: boolean;
  bonus?: number;
}
