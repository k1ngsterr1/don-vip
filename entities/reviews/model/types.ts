export interface Review {
  id: string;
  author: string;
  date: string;
  text: string;
  status: string;
  liked: boolean;
  avatar?: string;
  game?: string;
  product: any;
}
