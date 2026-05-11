export type PokemonTypeName =
  | "grass"
  | "fire"
  | "water"
  | "normal"
  | "flying"
  | "bug"
  | "poison"
  | "electric"
  | "ground"
  | "fighting"
  | "psychic"
  | "rock"
  | "ice"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface PokemonImage {
  full?: string;
  detail?: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

/**
 * Raw pokemon item returned by the Pokedex API.
 * MongoDB-style with `_id` and a few raw numeric fields that need post-processing.
 */
export interface RawPokemon {
  _id: number;
  name: string;
  height: number;
  weight: number;
  captureRate?: number;
  genderRate?: number;
  hatchCounter?: number;
  flavorTextEntries?: string[];
  eVs?: string[];
  abilities?: string[];
  eggGroups?: string[];
  stats?: PokemonStats;
  types?: string[];
  image?: PokemonImage;
}

/**
 * Normalised pokemon object consumed by the UI.
 * Produced by `mapPokemon` in `shared/selectors/pokemon.selectors.ts`.
 */
export interface Pokemon {
  id: number;
  name: string;
  height: {
    decimetres: number;
    centimeter: number;
    feet: string;
  };
  weight: {
    killogram: number;
    pound: string;
  };
  captureRate: number;
  genderRatio: {
    originalRate: number;
    femaleRate: number;
    maleRate: number;
  };
  hatchSteps: number;
  description: string;
  evs: string[];
  abilities: string[];
  eggGroups: string[];
  stats: PokemonStats;
  types: string[];
  image: PokemonImage;
}

export interface PokemonSummary {
  id: number;
  name: string;
  image: PokemonImage;
}

/**
 * Atomic snapshot of the detail page that's currently rendered to the
 * screen. Held in the Zustand store so it survives any unmount/remount of
 * the detail-page subtree triggered by Next.js's route transitions, which
 * is what allows prev/next navigation to keep the previous pokemon visible
 * (instead of flashing the full-page loader) while the new data loads.
 */
export interface DisplayedPokemon {
  currentId: number;
  current: Pokemon;
  prev: PokemonSummary | null;
  next: PokemonSummary | null;
}

export interface GetPokemonListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

/**
 * Static filters shared across every page of an infinite list query.
 * `page` is supplied per-page by React Query's `pageParam`; everything else
 * (search, type, limit, …) flows through unchanged so new filter fields on
 * `GetPokemonListParams` are picked up automatically.
 */
export type PokemonListFilters = Omit<GetPokemonListParams, "page">;

export interface PokemonListResult {
  data: RawPokemon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PokemonCardListProps {
  pokemon: Pokemon[];
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}

export interface PokemonInfoProps {
  numericId: number;
  routeId: string;
}

export interface PokemonInfoNavigatorProps {
  currentId: number;
  prevPokemon: PokemonSummary | null;
  nextPokemon: PokemonSummary | null;
  onNavigate: () => void;
  /**
   * When true, the prev/next buttons remain visible but are non-interactive
   * and visually muted. Used while the current pokemon detail is still loading
   * so the navigator doesn't visually flicker in/out on each navigation.
   */
  disabled?: boolean;
}

export interface PokemonStatsSectionProps {
  stats: PokemonStats;
  /**
   * Triggers the bar-fill animation by toggling the `active` class on the
   * status wrapper. Bumping this number forces the animation to replay
   * (used when navigating between pokemon).
   */
  resetKey: number;
}
