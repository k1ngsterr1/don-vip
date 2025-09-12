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
  faq: any[];
  metadata: {
    totalReviews: number;
    averageRating: number;
    lastUpdated: string;
  };
}

export const gamesApi = {
  /**
   * Get game content by game ID
   * GET /game-content/:gameId
   */
  getGameContent: async (gameId: string): Promise<GameContent> => {
    try {
      const response = await apiClient.get<GameContent>(
        `/game-content/${gameId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Error fetching game content:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
