import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

export interface InstructionStep {
  id: string;
  text: string;
  highlight?: string;
}

export interface InstructionImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface GameInstruction {
  steps: InstructionStep[];
  images: InstructionImage[];
  headerText?: string;
}

export interface GameContent {
  gameId: string;
  gameName: string;
  instruction: GameInstruction;
  description: string;
  reviews: any[];
  faq: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  metadata: {
    totalReviews: number;
    averageRating: number;
    lastUpdated: string;
  };
}

export interface GameContentResponse {
  total: number;
  games: GameContent[];
}

export const gamesApi = {
  /**
   * Get game content by game ID
   * GET /game-content
   */
  getGameContent: async (gameId: string): Promise<GameContent> => {
    try {
      const response = await apiClient.get<GameContentResponse>(
        `/game-content`
      );

      console.log("Game content response:", response.data);

      // Find the game with matching gameId
      const game = response.data.games.find((game) => game.gameId === gameId);

      if (!game) {
        throw new Error(`Game with ID "${gameId}" not found`);
      }

      return game;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Error fetching game content:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
