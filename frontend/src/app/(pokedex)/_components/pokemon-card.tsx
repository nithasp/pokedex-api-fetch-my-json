"use client";

import Link from "next/link";
import { useRef } from "react";
import { LazyImage } from "@/shared/components/lazy-image/lazy-image";
import { getTypeColor } from "@/config/pokemon-types";
import { ROUTES } from "@/config/routes";
import { smoothScrollTo } from "@/shared/utils/scroll";
import { useSetScrollTopPosition } from "@/stores";
import type { PokemonCardListProps } from "@/types/pokemon.types";

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
      <div className="notfound-pokemon relative h-screen w-full">
        <div className="wrap-notfound-pokemon absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-[50px] bg-[#0a141e] border-2 border-[#466e9b] rounded-[20px]">
          <h2 className="tracking-[1px]">
            500: Internal Server Error, please try again.
          </h2>
        </div>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="notfound-pokemon relative h-screen w-full">
        <div className="wrap-notfound-pokemon absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-[50px] bg-[#0a141e] border-2 border-[#466e9b] rounded-[20px]">
          <h2 className="tracking-[1px]">No Pokemon Match Your Search</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="go-top-btn bg-[url('/images/arrowtop-removebg-preview.png')] bg-cover bg-[position:0px] fixed top-0 right-[3px] w-[50px] h-[50px] border-2 border-white rounded-full cursor-pointer z-[1]"
        onClick={goTop}
        role="button"
        aria-label="Go to top"
      />
      <div
        className="pokemon-row grid grid-cols-4 gap-y-5 gap-x-2.5 pt-[17px] max-[992px]:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1"
        ref={wrapPokemonItemRef}
      >
        {pokemon.map((value) => {
          const { id, name, types, image } = value;
          const paddedId = padId(id);
          const pokemonImage =
            image.detail ||
            image.full ||
            `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
          const displayName = capitalize(name);

          return (
            <div
              key={id}
              id={String(id)}
              className="pokemon-card relative bg-[url('/images/pokemon_card_bg.png')] bg-[length:auto_100%] bg-center bg-no-repeat h-[36vw] max-[992px]:h-[46vw] max-md:h-[70vw] max-[450px]:h-[140vw]"
            >
              <Link
                href={ROUTES.pokemonDetail(id)}
                onClick={() => setScrollTopPosition(window.scrollY)}
                className="block w-full h-full"
              >
                <div className="wrap-image absolute top-[10.5%] left-1/2 -translate-x-1/2 max-[992px]:top-[11.5%] w-[12vw] h-[12vw] max-[992px]:w-[15vw] max-[992px]:h-[15vw] max-md:w-[23vw] max-md:h-[23vw] max-[450px]:w-[43vw] max-[450px]:h-[43vw]">
                  <LazyImage
                    src={pokemonImage}
                    alt={displayName}
                    placeholderSrc="/images/loading-img/loading2-small.gif"
                    errorSrc="/public_images/notfound1.png"
                  />
                </div>
                <div className="wrap-info absolute top-[60%] left-[10%] text-left">
                  <h4 className="number text-[2vw] max-[992px]:text-[2.7vw] max-md:text-[3.7vw] max-[450px]:text-[5.7vw]">
                    No. {id}
                  </h4>
                  <h3 className="name text-[2vw] tracking-[0.5px] max-[992px]:text-[2.8vw] max-md:text-[3.8vw] max-[450px]:text-[5.8vw]">
                    {displayName}
                  </h3>
                </div>
                <div className="wrap-types absolute bottom-[10%] left-[10%]">
                  {types.map((item, idx) => (
                    <span
                      className="types thicker mr-[15px] py-2.5 px-5 rounded-[20px] text-[1.2vw] tracking-[0.5px] max-[992px]:text-[1.8vw] max-md:text-[2.8vw] max-[450px]:text-[4.8vw]"
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

      <div className="loading-more-button my-[30px]">
        <div className="wrap-button">
          {!hasMore ? (
            <button
              className="no-more-item text-white text-[22px] tracking-[1px] bg-[gray] py-2.5 px-5 border-2 border-[gray] rounded-[50px] outline-none cursor-[no-drop]"
              type="button"
            >
              No More Item
            </button>
          ) : (
            <button
              className="loading-more text-white text-[22px] tracking-[1px] bg-transparent py-2.5 px-5 border-2 border-[#436a96] rounded-[50px] outline-none cursor-pointer transition-all duration-300 hover:bg-black"
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
