export interface Review {
  id: string;
  author: string;
  date: string;
  text: string;
  liked: boolean;
  avatar?: string;
  game?: string;
}
