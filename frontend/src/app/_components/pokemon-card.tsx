"use client";

import Link from "next/link";
import { useRef } from "react";
import { LazyImage } from "@/shared/components/lazy-image/lazy-image";
import { getTypeColor } from "@/config/pokemon-types";
import { ROUTES } from "@/config/routes";
import { smoothScrollTo } from "@/shared/utils/scroll";
import { useSetScrollTopPosition } from "@/stores";
import type { Pokemon } from "@/types/pokemon.types";

interface PokemonCardListProps {
  pokemon: Pokemon[];
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}

const padId = (id: number): string => {
  if (id < 10) return `00${id}`;
  if (id < 100) return `0${id}`;
  return `${id}`;
};

const capitalize = (value: string): string =>
  value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.substring(1))
    .join("");

export function PokemonCardList({
  pokemon,
  hasMore,
  isFetchingMore,
  onLoadMore,
}: PokemonCardListProps) {
  const setScrollTopPosition = useSetScrollTopPosition();
  const wrapPokemonItemRef = useRef<HTMLDivElement>(null);

  const handleLoadingMore = () => {
    const wrapPokeCard = wrapPokemonItemRef.current;
    const lastBefore =
      wrapPokeCard && wrapPokeCard.children.length > 0
        ? (wrapPokeCard.children[
            wrapPokeCard.children.length - 1
          ] as HTMLElement)
        : null;

    onLoadMore();

    // After the new items render, scroll to where the previous last card ended.
    if (lastBefore) {
      const elemBottom = lastBefore.offsetTop + lastBefore.offsetHeight;
      smoothScrollTo(elemBottom + 110, { duration: 500, delay: 300 });
    }
  };

  const goTop = () => smoothScrollTo(0, { duration: 1500, delay: 100 });

  if (!pokemon || !Array.isArray(pokemon)) {
    return (
      <div className="notfound-pokemon">
        <div className="wrap-notfound-pokemon">
          <h2>500: Internal Server Error, please try again.</h2>
        </div>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="notfound-pokemon">
        <div className="wrap-notfound-pokemon">
          <h2>No Pokemon Match Your Search</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="go-top-btn"
        onClick={goTop}
        role="button"
        aria-label="Go to top"
      />
      <div className="pokemon-row" ref={wrapPokemonItemRef}>
        {pokemon.map((value) => {
          const { id, name, types, image } = value;
          const paddedId = padId(id);
          const pokemonImage =
            image.detail ||
            image.full ||
            `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
          const displayName = capitalize(name);

          return (
            <div key={id} id={String(id)} className="pokemon-card">
              <Link
                href={ROUTES.pokemonDetail(id)}
                onClick={() => setScrollTopPosition(window.scrollY)}
              >
                <div className="wrap-image">
                  <LazyImage
                    src={pokemonImage}
                    alt={displayName}
                    className="pokemon-image img-fit"
                    placeholderSrc="/images/loading-img/loading2-small.gif"
                    errorSrc="/public_images/notfound1.png"
                  />
                </div>
                <div className="wrap-info">
                  <h4 className="number">No. {id}</h4>
                  <h3 className="name">{displayName}</h3>
                </div>
                <div className="wrap-types">
                  {types.map((item, idx) => (
                    <span
                      className="types thicker"
                      style={{ backgroundColor: getTypeColor(item) }}
                      key={`${id}-${item}-${idx}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="loading-more-button">
        <div className="wrap-button">
          {!hasMore ? (
            <button className="no-more-item" type="button">
              No More Item
            </button>
          ) : (
            <button
              className="loading-more"
              type="button"
              onClick={handleLoadingMore}
              disabled={isFetchingMore}
            >
              {isFetchingMore ? "Loading..." : "Loading More..."}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
