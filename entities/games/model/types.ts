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

// Re-export types from API for convenience
export type {
  GameContent,
  GameInstruction,
  InstructionStep,
  InstructionImage,
} from "../api/games.api";
