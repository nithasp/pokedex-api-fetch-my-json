"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import type { PokemonSummary } from "@/types/pokemon.types";

interface PokemonInfoNavigatorProps {
  currentId: number;
  prevPokemon: PokemonSummary | null;
  nextPokemon: PokemonSummary | null;
  onNavigate: () => void;
}

export function PokemonInfoNavigator({
  currentId,
  prevPokemon,
  nextPokemon,
  onNavigate,
}: PokemonInfoNavigatorProps) {
  return (
    <div className="pokemon-info-navigator">
      {prevPokemon && (
        <div className="pokemon-info-navigator-left">
          <img
            src="/images/arrow_pc_left.png"
            alt="nav-left"
            className="nav-left"
          />
          <div className="prev-pokemon">
            <div className="id">No.{prevPokemon.id}</div>
            <div className="name">{prevPokemon.name}</div>
          </div>
          <Link
            href={ROUTES.pokemonDetail(currentId - 1)}
            className="wrap-arrow-left"
            onClick={onNavigate}
          >
            <img
              src="/images/arrow_left_btn.png"
              alt="arrow-left"
              className="arrow-left"
            />
            <img
              src="/images/arrow_left_btn_on.png"
              alt="arrow-left-active"
              className="arrow-left-active"
            />
          </Link>
        </div>
      )}

      {nextPokemon && (
        <div className="pokemon-info-navigator-right">
          <img
            src="/images/arrow_pc_right.png"
            alt="nav-right"
            className="nav-right"
          />
          <div className="next-pokemon">
            <div className="id">No.{nextPokemon.id}</div>
            <div className="name">{nextPokemon.name}</div>
          </div>
          <Link
            href={ROUTES.pokemonDetail(currentId + 1)}
            className="wrap-arrow-right"
            onClick={onNavigate}
          >
            <img
              src="/images/arrow_right_btn.png"
              alt="arrow-right"
              className="arrow-right"
            />
            <img
              src="/images/arrow_right_btn_on.png"
              alt="arrow-right-active"
              className="arrow-right-active"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
