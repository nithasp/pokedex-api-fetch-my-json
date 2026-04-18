import { Request, Response } from "express";
import { validated } from "../middleware/validate";
import { Pokemon } from "../models/pokemon";
import type {
  ListPokemonQuery,
  PokemonIdParams,
} from "../types/pokemon.types";
import { HttpError, buildPagination, ok } from "../utils/response";

// GET /api/pokemon — paginated list, filter by type and/or name search
export const getPokemons = async (req: Request, res: Response) => {
  const { page, limit, type, search } = validated<ListPokemonQuery>(
    req as unknown as Record<string, unknown>,
    "query"
  );

  const filter: Record<string, unknown> = {};
  if (type) filter.types = type;
  if (search) filter.name = { $regex: search, $options: "i" };

  const [items, total] = await Promise.all([
    Pokemon.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Pokemon.countDocuments(filter),
  ]);

  return ok(res, items, buildPagination(page, limit, total));
};

// GET /api/pokemon/:id — single pokemon by national dex number
export const getPokemon = async (req: Request, res: Response) => {
  const { id } = validated<PokemonIdParams>(
    req as unknown as Record<string, unknown>,
    "params"
  );

  const pokemon = await Pokemon.findById(id).lean();
  if (!pokemon) {
    throw new HttpError(404, `Pokemon #${id} not found`, "POKEMON_NOT_FOUND");
  }

  return ok(res, pokemon);
};
