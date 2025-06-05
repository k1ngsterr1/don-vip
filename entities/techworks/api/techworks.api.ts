import { apiClient } from "@/shared/config/apiClient";

const TECHWORK_BASE_PATH = "/techworks";
const FIXED_TECHWORK_ID = 1; // All operations will use this ID

// --- Types ---

/**
 * Represents the main Techwork entity structure.
 * This should match the DTO or entity returned by your NestJS service.
 */
export interface Techwork {
  id: number;
  isTechWorks?: boolean;
  techWorksEndsAt: string;
}

/**
 * Data Transfer Object for updating a Techwork item.
 * Typically a subset of Techwork, excluding 'id' and other non-updatable fields.
 */
export interface UpdateTechworkDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  // Add other updatable fields
}

/**
 * Expected response structure after a toggle operation,
 * if the server doesn't redirect and returns JSON.
 */
export interface TechworkToggleResult {
  id: number;
  isActive: boolean;
  // Potentially other status-related fields
}

/**
 * Techworks API service for interacting with the /techworks endpoints.
 */
export const techworksApi = {
  /**
   * Fetches the techwork data for the fixed ID (1).
   * Corresponds to: GET /techworks/:id
   */
  getTechwork: async (): Promise<Techwork> => {
    try {
      const response = await apiClient.get<Techwork>(
        `${TECHWORK_BASE_PATH}/${FIXED_TECHWORK_ID}`
      );
      return response.data; // Assuming apiClient returns full Axios response
    } catch (error) {
      console.error(
        `Error fetching techwork (ID: ${FIXED_TECHWORK_ID}):`,
        error
      );
      throw error; // Re-throw for the caller to handle
    }
  },
};
