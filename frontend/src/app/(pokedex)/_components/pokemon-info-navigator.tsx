"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { POKEMON_ID_RANGE, ROUTES } from "@/config/routes";
import type { PokemonInfoNavigatorProps } from "@/types/pokemon.types";

export function PokemonInfoNavigator({
  currentId,
  prevPokemon,
  nextPokemon,
  onNavigate,
  disabled = false,
}: PokemonInfoNavigatorProps) {
  // Button visibility is purely structural (driven by the id range), not by
  // whether the neighbor's summary data has loaded yet. Otherwise the next
  // button flickers off whenever we navigate to a cached pokemon while its
  // own *next* neighbor's request is still in flight.
  const showPrev = currentId > POKEMON_ID_RANGE.min;
  const showNext = currentId < POKEMON_ID_RANGE.max;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onNavigate();
  };

  const linkDisabledClasses = disabled
    ? "pointer-events-none opacity-50"
    : "";

  return (
    <div className="pokemon-info-navigator absolute !pt-[14%] w-full pkm-mobile:pt-[18%]!">
      {showPrev && (
        <div className="pokemon-info-navigator-left absolute top-full left-0">
          <img
            src="/images/arrow_pc_left.png"
            alt="nav-left"
            className="nav-left !w-[30vw] h-auto max-md:bg-[url('/images/arrow_pc_left_mobile.png')] max-md:p-[12vw] max-md:bg-contain max-md:bg-[position:initial] max-md:bg-no-repeat max-md:w-0! max-md:h-0!"
          />
          {prevPokemon && (
            <div className="prev-pokemon absolute flex top-[15%] -right-[30%] w-full text-[1.8vw] tracking-[1px]">
              <div className="text-[#b3eafe] max-md:hidden pkm-mobile:hidden!">
                No.{prevPokemon.id}
              </div>
              <div className="capitalize !ml-2.5 max-md:hidden pkm-mobile:hidden!">
                {prevPokemon.name}
              </div>
            </div>
          )}
          <Link
            href={ROUTES.pokemonDetail(currentId - 1)}
            className={`wrap-arrow-left ${linkDisabledClasses}`.trim()}
            onClick={handleClick}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
          >
            <img
              src="/images/arrow_left_btn.png"
              alt="arrow-left"
              className="arrow-left absolute top-[15%] left-[7%] !w-[5vw] !h-[5vw] cursor-pointer z-[2] max-md:top-[12%] max-md:left-[3%] max-md:w-[7vw] max-md:h-[7vw] pkm-mobile:max-w-none! pkm-mobile:top-[3vw]! pkm-mobile:left-[3vw]! pkm-mobile:w-[7vw]! pkm-mobile:h-[7vw]!"
            />
            <img
              src="/images/arrow_left_btn_on.png"
              alt="arrow-left-active"
              className="arrow-left-active absolute top-[15%] left-[7%] !w-[5vw] !h-[5vw] cursor-pointer z-[2] opacity-0 transition-all duration-300 hover:opacity-100 max-md:top-[12%] max-md:left-[3%] max-md:w-[7vw] max-md:h-[7vw] pkm-mobile:max-w-none! pkm-mobile:top-[3vw]! pkm-mobile:left-[3vw]! pkm-mobile:w-[7vw]! pkm-mobile:h-[7vw]!"
            />
          </Link>
        </div>
      )}

      {showNext && (
        <div className="pokemon-info-navigator-right absolute top-full right-0">
          <img
            src="/images/arrow_pc_right.png"
            alt="nav-right"
            className="nav-right !w-[30vw] h-auto max-md:bg-[url('/images/arrow_pc_right_mobile.png')] max-md:p-[12vw] max-md:bg-contain max-md:bg-[position:initial] max-md:bg-no-repeat max-md:w-0! max-md:h-0!"
          />
          {nextPokemon && (
            <div className="next-pokemon absolute flex top-[15%] left-[20%] text-[1.8vw] tracking-[1px]">
              <div className="text-[#b3eafe] max-md:hidden pkm-mobile:hidden!">
                No.{nextPokemon.id}
              </div>
              <div className="capitalize !ml-2.5 max-md:hidden pkm-mobile:hidden!">
                {nextPokemon.name}
              </div>
            </div>
          )}
          <Link
            href={ROUTES.pokemonDetail(currentId + 1)}
            className={`wrap-arrow-right ${linkDisabledClasses}`.trim()}
            onClick={handleClick}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
          >
            <img
              src="/images/arrow_right_btn.png"
              alt="arrow-right"
              className="arrow-right absolute top-[15%] right-[7%] !w-[5vw] !h-[5vw] cursor-pointer z-[2] max-md:top-[12%] max-md:right-[3%] max-md:w-[7vw] max-md:h-[7vw] pkm-mobile:max-w-none! pkm-mobile:top-[3vw]! pkm-mobile:right-[3vw]! pkm-mobile:w-[7vw]! pkm-mobile:h-[7vw]!"
            />
            <img
              src="/images/arrow_right_btn_on.png"
              alt="arrow-right-active"
              className="arrow-right-active absolute top-[15%] right-[7%] !w-[5vw] !h-[5vw] cursor-pointer z-[2] opacity-0 transition-all duration-300 hover:opacity-100 max-md:top-[12%] max-md:right-[3%] max-md:w-[7vw] max-md:h-[7vw] pkm-mobile:max-w-none! pkm-mobile:top-[3vw]! pkm-mobile:right-[3vw]! pkm-mobile:w-[7vw]! pkm-mobile:h-[7vw]!"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
