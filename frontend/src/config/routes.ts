/**
 * Centralised route definitions for use across the app.
 * Adding routes here keeps `next/link`, programmatic navigation, and the
 * detail navigator in sync.
 */

export const ROUTES = {
  home: "/",
  pokemonDetail: (id: string | number) => `/pokemon/${id}`,
} as const;

/**
 * Limit Pokemon Number 1-898 (matches the original CRA route regex).
 */
export const POKEMON_ID_RANGE = {
  min: 1,
  max: 898,
} as const;

export const isValidPokemonId = (id: number): boolean =>
  Number.isInteger(id) &&
  id >= POKEMON_ID_RANGE.min &&
  id <= POKEMON_ID_RANGE.max;
