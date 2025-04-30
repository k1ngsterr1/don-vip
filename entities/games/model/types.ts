export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerImage: string;
  currencyName: string;
  currencyImage: string;
  requiresServer: boolean;
}
