import api from "@/lib/axios";
import { buildListParams } from "@/shared/utils/function";
import type { ApiResponse } from "@/types/api.types";
import type {
  GetPokemonListParams,
  RawPokemon,
} from "@/types/pokemon.types";

type Id = string | number;

export const pokedexService = {
  getPokemonList: async (input: GetPokemonListParams = {}) => {
    const params = buildListParams(input);
    const { data } = await api.get<ApiResponse<RawPokemon[]>>("", { params });
    return data;
  },

  getPokemonById: async (id: Id) => {
    const { data } = await api.get<ApiResponse<RawPokemon>>(`/${id}`);
    return data;
  },
};

export default pokedexService;
