import { Request, Response } from "express";
import { config } from "../config/env";
import { Pokemon } from "../models/pokemon";
import type { ListPokemonQuery, PokemonIdParams } from "../types/pokemon-routes.type";
import { HttpError, buildPagination, ok } from "../utils/response";

/**
 * Attach the full CDN URL to a pokemon's image paths.
 *
 * MongoDB stores only the relative path:
 *   "images/pokemon/full/004.png"
 *
 * R2_PUBLIC_URL env var holds the CDN base (never changes regardless of backend host):
 *   "https://pub-XXXX.r2.dev"
 *
 * Result in API response:
 *   "https://pub-XXXX.r2.dev/images/pokemon/full/004.png"
 *
 * To switch CDN providers: change R2_PUBLIC_URL in .env — DB stays untouched.
 */
function withImageUrls<T extends { image?: { full?: string | null; detail?: string | null } | null }>(
  pokemon: T
): T {
  const base = config.r2PublicUrl;
  if (!base || !pokemon.image) return pokemon;
  return {
    ...pokemon,
    image: {
      full: pokemon.image.full ? `${base}/${pokemon.image.full}` : null,
      detail: pokemon.image.detail ? `${base}/${pokemon.image.detail}` : null,
    },
  };
}

// GET /api/pokemon — paginated list, filter by type and/or name search.
// Pass `?all=true` to bypass pagination and return every matching pokemon.
export const getPokemons = async (req: Request, res: Response) => {
  const { page, limit, type, search, all } = req.valid.query as ListPokemonQuery;

  const filter: Record<string, unknown> = {};
  if (type) filter.types = type;
  if (search) filter.name = { $regex: search, $options: "i" };

  const query = Pokemon.find(filter).sort({ _id: 1 });
  if (!all) {
    query.skip((page - 1) * limit).limit(limit);
  }

  const [items, total] = await Promise.all([query.lean(), Pokemon.countDocuments(filter)]);

  const effectiveLimit = all ? total : limit;
  return ok(res, items.map(withImageUrls), buildPagination(page, effectiveLimit, total));
};

// GET /api/pokemon/:id — single pokemon by national dex number
export const getPokemon = async (req: Request, res: Response) => {
  const { id } = req.valid.params as PokemonIdParams;

  const pokemon = await Pokemon.findById(id).lean();
  if (!pokemon) {
    throw new HttpError(404, `Pokemon #${id} not found`, "POKEMON_NOT_FOUND");
  }

  return ok(res, withImageUrls(pokemon));
};
