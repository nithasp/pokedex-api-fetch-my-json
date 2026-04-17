import { Router } from "express";
import { z } from "zod";
import { Pokemon } from "../models/pokemon";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError, ok } from "../utils/response";
import { validate, validated } from "../utils/validate";
import type {
  ListPokemonQuery,
  PokemonIdParams,
} from "../types/pokemon.types";

export const pokemonRouter = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(25),
  type: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /api/pokemon — paginated list, filter by type and/or name search
pokemonRouter.get(
  "/",
  validate(listQuerySchema, "query"),
  asyncHandler(async (req, res) => {
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

    return ok(res, items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  })
);

// GET /api/pokemon/:id — single pokemon by national dex number
pokemonRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = validated<PokemonIdParams>(
      req as unknown as Record<string, unknown>,
      "params"
    );

    const pokemon = await Pokemon.findById(id).lean();
    if (!pokemon) {
      throw new HttpError(404, `Pokemon #${id} not found`, "POKEMON_NOT_FOUND");
    }

    return ok(res, pokemon);
  })
);
