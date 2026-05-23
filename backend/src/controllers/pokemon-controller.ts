import { Request, Response } from "express";
import { config } from "../config/env";
import { Pokemon } from "../models/pokemon";
import type { ListPokemonQuery, PokemonIdParams } from "../types/pokemon-routes.type";
import { HttpError, buildPagination, ok } from "../utils/response";

/** Zero-pad the dex id to 3 digits: 4 → "004", 10 → "010", 100 → "100". */
const padDexId = (id: number): string => String(id).padStart(3, "0");

/**
 * Build the public image URLs for a pokemon entirely from its dex id.
 *
 * The DB no longer stores image paths — they're 100% derivable from:
 *   _id              → 1..898 → zero-padded ("004")
 *   R2_PUBLIC_URL    → CDN base, e.g. https://pub-XXXX.r2.dev
 *   IMAGE_EXTENSION  → file format, e.g. "webp" / "png"
 *
 * Bucket path convention:
 *   images/pokemon/full/004.webp
 *   images/pokemon/detail/004.webp
 *
 * To switch CDN, file format, or folder structure: change env/code only —
 * the database stays untouched, no migrations required.
 */
function buildImageUrls(id: number): { full: string; detail: string } | null {
  const base = config.r2PublicUrl;
  if (!base) return null;
  const ext = config.imageExtension;
  const name = padDexId(id);
  return {
    full: `${base}/images/pokemon/full/${name}.${ext}`,
    detail: `${base}/images/pokemon/detail/${name}.${ext}`,
  };
}

/**
 * Attach a derived `image` object to a lean pokemon document.
 *
 * `_id` is typed as nullable by Mongoose's `InferSchemaType`, but in practice
 * every persisted document has one — we just narrow the type defensively.
 */
function attachImage<T extends { _id?: number | null }>(pokemon: T) {
  const id = pokemon._id;
  return {
    ...pokemon,
    image: typeof id === "number" ? buildImageUrls(id) : null,
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
  return ok(res, items.map(attachImage), buildPagination(page, effectiveLimit, total));
};

// GET /api/pokemon/:id — single pokemon by national dex number
export const getPokemon = async (req: Request, res: Response) => {
  const { id } = req.valid.params as PokemonIdParams;

  const pokemon = await Pokemon.findById(id).lean();
  if (!pokemon) {
    throw new HttpError(404, `Pokemon #${id} not found`, "POKEMON_NOT_FOUND");
  }

  return ok(res, attachImage(pokemon));
};
