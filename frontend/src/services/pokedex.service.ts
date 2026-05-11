import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { RawPokemon } from "@/types/pokemon.types";

export const pokedexService = {
  /**
   * Fetch every pokemon in a single request via `?all=true`. The response is
   * cached in the global pokedex store and reused by the home grid, search
   * dropdown, and detail page so the app never hits the API again.
   */
  getAllPokemon: async () => {
    const { data } = await api.get<ApiResponse<RawPokemon[]>>("", {
      params: { all: true },
    });
    return data;
  },
};

export default pokedexService;
