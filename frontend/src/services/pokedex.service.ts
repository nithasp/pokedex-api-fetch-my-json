import api, { buildApiErrorMessage } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type {
  GetPokemonListParams,
  PokemonListResult,
  RawPokemon,
} from "@/types/pokemon.types";

const unwrap = <T>(body: ApiResponse<T> | undefined): T => {
  if (!body || body.success !== true) {
    throw new Error(body?.message || "Unexpected response from server");
  }
  return body.data;
};

export const pokedexService = {
  /**
   * Fetch a paginated list of pokemon. Mirrors the original CRA service.
   */
  getPokemonList: async ({
    page = 1,
    limit = 12,
    search = "",
    type = "",
  }: GetPokemonListParams = {}): Promise<PokemonListResult> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search) params.search = search;
      if (type) params.type = type;

      const response = await api.get<ApiResponse<RawPokemon[]>>("", { params });
      const body = response?.data;
      if (!body || body.success !== true) {
        throw new Error(body?.message || "Unexpected response from server");
      }

      return {
        data: Array.isArray(body.data) ? body.data : [],
        pagination: body.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      const message = buildApiErrorMessage(error);
      console.error("[pokedex.service] getPokemonList failed:", message);
      throw new Error(message);
    }
  },

  /**
   * Fetch a single pokemon by its national dex number.
   */
  getPokemonById: async (id: number | string): Promise<RawPokemon> => {
    try {
      const response = await api.get<ApiResponse<RawPokemon>>(`/${id}`);
      return unwrap(response.data);
    } catch (error) {
      const message = buildApiErrorMessage(error);
      console.error(`[pokedex.service] getPokemonById(${id}) failed:`, message);
      throw new Error(message);
    }
  },
};

export default pokedexService;
