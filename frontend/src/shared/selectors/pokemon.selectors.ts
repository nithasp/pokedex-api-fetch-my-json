import { DEFAULT_PAGINATION } from "@/shared/utils/pagination";
import type {
  ApiResponse,
  ApiSuccess,
  PaginationMeta,
} from "@/types/api.types";
import type {
  Pokemon,
  PokemonSummary,
  RawPokemon,
} from "@/types/pokemon.types";

const isApiSuccess = <T>(
  response: ApiResponse<T> | undefined
): response is ApiSuccess<T> => !!response && response.success === true;

export const mapPokemon = (
  item: RawPokemon | null | undefined
): Pokemon | null => {
  if (!item) return null;

  const heightDecimetres = Number(item.height) || 0;
  const weightHectograms = Number(item.weight) || 0;
  const genderRate =
    typeof item.genderRate === "number" ? item.genderRate : -1;

  return {
    id: item._id,
    name: item.name,
    height: {
      decimetres: heightDecimetres,
      centimeter: heightDecimetres * 10,
      feet: Number(heightDecimetres * 0.328084).toFixed(2),
    },
    weight: {
      killogram: Math.round(weightHectograms * 0.1),
      pound: Number(weightHectograms * 0.220462).toFixed(2),
    },
    captureRate: Math.round((100 / 255) * (item.captureRate || 0)),
    genderRatio: {
      originalRate: genderRate,
      femaleRate: genderRate >= 0 ? genderRate * 12.5 : 0,
      maleRate: genderRate >= 0 ? (8 - genderRate) * 12.5 : 0,
    },
    hatchSteps: 255 * ((item.hatchCounter || 0) + 1),
    description:
      Array.isArray(item.flavorTextEntries) &&
      item.flavorTextEntries.length > 0
        ? item.flavorTextEntries[0]
        : "",
    evs: Array.isArray(item.eVs) ? item.eVs : [],
    abilities: Array.isArray(item.abilities) ? item.abilities : [],
    eggGroups: Array.isArray(item.eggGroups) ? item.eggGroups : [],
    stats: item.stats || {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    },
    types: Array.isArray(item.types) ? item.types : [],
    image: item.image || { full: "", detail: "" },
  };
};

export const mapPokemonSummary = (
  item: RawPokemon | null | undefined
): PokemonSummary | null => {
  if (!item) return null;
  return {
    id: item._id,
    name: item.name,
    image: item.image || { full: "", detail: "" },
  };
};

export const selectRawPokemonList = (
  response: ApiResponse<RawPokemon[]> | undefined
): RawPokemon[] =>
  isApiSuccess(response) && Array.isArray(response.data) ? response.data : [];

export const selectPokemonList = (
  response: ApiResponse<RawPokemon[]> | undefined
): Pokemon[] =>
  selectRawPokemonList(response)
    .map(mapPokemon)
    .filter((item): item is Pokemon => item !== null);

export const selectPokemonPagination = (
  response: ApiResponse<RawPokemon[]> | undefined
): PaginationMeta =>
  isApiSuccess(response) && response.pagination
    ? response.pagination
    : DEFAULT_PAGINATION;

export const selectRawPokemon = (
  response: ApiResponse<RawPokemon> | undefined
): RawPokemon | null => (isApiSuccess(response) ? response.data : null);

export const selectPokemon = (
  response: ApiResponse<RawPokemon> | undefined
): Pokemon | null => mapPokemon(selectRawPokemon(response));

export const selectPokemonSummary = (
  response: ApiResponse<RawPokemon> | undefined
): PokemonSummary | null => mapPokemonSummary(selectRawPokemon(response));

export const getNextPageNumber = (
  response: ApiResponse<RawPokemon[]>
): number | undefined => {
  const pagination = selectPokemonPagination(response);
  const { page, totalPages } = pagination;
  if (totalPages > 0 && page < totalPages) return page + 1;
  return undefined;
};
