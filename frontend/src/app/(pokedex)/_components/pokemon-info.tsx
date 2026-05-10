"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTypeColor } from "@/config/pokemon-types";
import { ROUTES } from "@/config/routes";
import { useGetPokemonById } from "@/shared/hooks/queries";
import {
  selectPokemon,
  selectPokemonSummary,
} from "@/shared/selectors/pokemon.selectors";
import type { PokemonInfoProps } from "@/types/pokemon.types";
import { PokemonInfoNavigator } from "./pokemon-info-navigator";
import { PokemonStatsSection } from "./pokemon-stats";

export function PokemonInfo({ numericId, routeId }: PokemonInfoProps) {
  const prevId = numericId > 1 ? numericId - 1 : null;
  const nextId = numericId + 1;

  const { data: currentResponse, isLoading, error } =
    useGetPokemonById(numericId);
  const { data: prevResponse } = useGetPokemonById(prevId);
  const { data: nextResponse } = useGetPokemonById(nextId);

  const currentPokemon = useMemo(
    () => selectPokemon(currentResponse),
    [currentResponse]
  );
  const prevPokemon = useMemo(
    () => selectPokemonSummary(prevResponse),
    [prevResponse]
  );
  const nextPokemon = useMemo(
    () => selectPokemonSummary(nextResponse),
    [nextResponse]
  );

  const [isImgLoading, setIsImgLoading] = useState(true);
  const [statsResetKey, setStatsResetKey] = useState(0);
  const previousId = useRef(numericId);

  useEffect(() => {
    setIsImgLoading(true);
  }, [numericId]);

  useEffect(() => {
    if (previousId.current !== numericId) {
      setStatsResetKey((k) => k + 1);
      previousId.current = numericId;
    }
  }, [numericId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [numericId]);

  const handleNavigatorClick = () => {
    setIsImgLoading(true);
  };

  const errorCondition = !!error || !currentPokemon;

  const pokemonImage = currentPokemon
    ? currentPokemon.image.full || currentPokemon.image.detail || ""
    : "";

  const errorImg = `/public_images/pokemon-notfound/poke${routeId}.png`;

  return (
    <div className="wrap-pokemon-info-section max-h-[290vw] pkm-hi-dpi:h-[300vw] pkm-mobile:overflow-hidden max-[450px]:h-[290vw]!">
      <section className="pokemon-info relative bg-[url('/images/pokemon_bg2-2.jpg')] bg-no-repeat bg-top bg-[length:100%_auto] !-top-[8vw] min-h-[70vw] max-[900px]:-top-[3vw]">
        {!errorCondition && currentPokemon && (
          <PokemonInfoNavigator
            currentId={numericId}
            prevPokemon={prevPokemon}
            nextPokemon={nextPokemon}
            onNavigate={handleNavigatorClick}
          />
        )}

        <div className="pokemon-container max-w-full w-[92vw] mx-auto relative pkm-mobile:top-[75vw] pkm-mobile:z-[1]">
          {isLoading ? (
            <div className="relative top-[24vw] max-[968px]:top-[20vw]">
              <img
                src="/images/loading-img/loading250x250-2.gif"
                alt="loading-img"
                className="block mx-auto max-[400px]:w-[50vw]"
              />
            </div>
          ) : errorCondition || !currentPokemon ? (
            <section className="absolute top-[30vw] right-[28vw] max-md:right-[-2vw] max-md:w-full max-md:text-center">
              <h4 className="text-[2.2vw] max-md:text-[7vw] max-md:tracking-[1px]">
                An error has occured,&nbsp;
                <span className="max-md:block"></span>
                please try again.
              </h4>
            </section>
          ) : (
            <>
              <div className="relative pt-[15%] pkm-mobile:relative! pkm-mobile:pt-[4%]!">
                <div className="absolute left-1/2 -translate-x-1/2">
                  <div className="absolute -top-[5%] w-full text-center z-[1] max-[900px]:-top-[22%] pkm-mobile:-top-[8%]!">
                    <h3 className="text-[#b3eafe] text-3xl pkm-mobile:text-[5.5vw]">
                      No. {currentPokemon.id}
                    </h3>
                    <h1 className="pokemon-info-name-shadow capitalize text-[3.5vw] tracking-[0.5px] text-white pkm-mobile:text-[6vw]!">
                      {currentPokemon.name}
                    </h1>
                  </div>
                  <div className="relative top-0 pkm-mobile:top-[6vw]! max-[450px]:top-[3vw]!">
                    <img
                      src="/images/pokemon_front_circle_bg.png"
                      className="!w-[42.5vw] !h-[39.5vw] animate-rotate-image pkm-mobile:w-[65.5vw]! pkm-mobile:h-[65.5vw]!"
                      alt=""
                    />
                    <img
                      src="/images/pokemon_back_circle_bg.png"
                      className="absolute pt-[12%] top-0 left-1/2 -translate-x-1/2 !h-[34vw] w-auto pkm-mobile:pt-[18%] pkm-mobile:h-[56vw]!"
                      alt=""
                    />
                    <img
                      src={
                        isImgLoading
                          ? "/images/loading-img/pokemon-loading6.gif"
                          : pokemonImage
                      }
                      className="absolute pt-[18%] top-0 left-1/2 -translate-x-1/2 !h-[30vw] pkm-mobile:pt-[20%]! pkm-mobile:h-[50vw]!"
                      alt=""
                      onLoad={() => setIsImgLoading(false)}
                      onError={(event) => {
                        event.currentTarget.src = errorImg;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pokemon-info-section2 absolute top-[182%] -right-[18%] w-[40vw] flex flex-wrap pkm-mobile:top-[680%]! pkm-mobile:right-[6%]! pkm-mobile:w-[80vw]!">
                <div className="info grid grid-cols-1 mb-2.5 flex-[0_0_30%] pkm-mobile:flex-[0_0_50%]! pkm-mobile:mb-[-8vw]!">
                  <span className="text-[1.5vw] text-[#b3eafe] tracking-[0.5px] pkm-mobile:text-[3.5vw]!">
                    Height
                  </span>
                  <div className="grid grid-cols-1 pkm-mobile:inline-block! pkm-mobile:mb-[10vw]!">
                    <span className="cm text-[1.5vw] text-white! pkm-mobile:text-[3.4vw]!">
                      {currentPokemon.height.centimeter} cm
                    </span>
                    <span className="hidden pkm-mobile:inline-block!">
                      &nbsp;/&nbsp;
                    </span>
                    <span className="ft text-[1.5vw] text-white! pkm-mobile:text-[3.4vw]!">
                      {currentPokemon.height.feet} ft
                    </span>
                  </div>
                </div>
                <div className="info grid grid-cols-1 mb-2.5 flex-[0_0_70%] pkm-mobile:flex-[0_0_50%]! pkm-mobile:mb-[-8vw]!">
                  <span className="text-[1.5vw] text-[#b3eafe] tracking-[0.5px] pkm-mobile:text-[3.5vw]!">
                    Weight
                  </span>
                  <div className="grid grid-cols-1 pkm-mobile:inline-block! pkm-mobile:mb-[10vw]!">
                    <span className="kg text-[1.5vw] text-white! pkm-mobile:text-[3.4vw]!">
                      {currentPokemon.weight.killogram} kg
                    </span>
                    <span className="hidden pkm-mobile:inline-block!">
                      &nbsp;/&nbsp;
                    </span>
                    <span className="lbs text-[1.5vw] text-white! pkm-mobile:text-[3.4vw]!">
                      {currentPokemon.weight.pound} lbs
                    </span>
                  </div>
                </div>
                <div className="info grid grid-cols-1 mb-2.5 flex-[0_0_30%] pkm-mobile:flex-[0_0_50%]! pkm-mobile:mb-[-8vw]!">
                  <span className="text-[1.5vw] text-[#b3eafe] tracking-[0.5px] pkm-mobile:text-[3.5vw]!">
                    Capture Rate
                  </span>
                  <span className="text-[1.4vw] text-white pkm-mobile:text-[3.4vw]!">
                    {currentPokemon.captureRate}
                  </span>
                </div>
                <div className="info grid grid-cols-1 mb-2.5 flex-[0_0_70%] pkm-mobile:flex-[0_0_50%]! pkm-mobile:mb-[-8vw]!">
                  <span className="text-[1.5vw] text-[#b3eafe] tracking-[0.5px] pkm-mobile:text-[3.5vw]!">
                    Hatch Steps
                  </span>
                  <span className="text-[1.4vw] text-white pkm-mobile:text-[3.4vw]!">
                    {currentPokemon.hatchSteps}
                  </span>
                </div>
                <div className="info abilities grid grid-cols-1 mb-2.5 flex-[0_0_100%] pkm-mobile:mt-[9.2vw]! pkm-mobile:mb-[-8vw]!">
                  <span className="text-[1.5vw] text-[#b3eafe] tracking-[0.5px] pkm-mobile:text-[3.5vw]!">
                    Abilities
                  </span>
                  <div className="wrap-abilities max-w-[20vw] leading-[1.5vw] pkm-mobile:max-w-[80vw]! pkm-mobile:leading-[initial]!">
                    {currentPokemon.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="relative text-[1.4vw] text-white pkm-mobile:text-[3.4vw]!"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pokemon-info-section3 absolute top-[165%] pkm-mobile:top-[965%]! pkm-mobile:right-[6%] pkm-mobile:w-[80vw] max-[450px]:top-[137vw]!">
                <div className="types">
                  <h4 className="thicker text-[#b3eafe] tracking-[0.5px] text-[1.9vw] pkm-mobile:text-[3.9vw]!">
                    Types
                  </h4>
                  <div className="mt-[2vw]">
                    {currentPokemon.types.map((type) => {
                      const typeLowerCase = type.toLowerCase();
                      return (
                        <span
                          className="thicker text-[1.3vw] py-[1vw] px-[2vw] mr-[1.1vw] rounded-[25px] pkm-mobile:text-[3.3vw]! pkm-mobile:py-[1vw]! pkm-mobile:px-[3vw]! pkm-mobile:mr-[2.1vw]! pkm-mobile:tracking-[1px]"
                          style={{ backgroundColor: getTypeColor(type) }}
                          key={typeLowerCase}
                        >
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="gender-ratio mt-[7%] w-[25vw] pkm-mobile:w-[50vw]! max-[450px]:w-[55vw]!">
                  <h4 className="text-[#b3eafe] tracking-[0.5px] text-[1.9vw] pkm-mobile:text-[3.9vw]!">
                    Gender Ratio
                  </h4>
                  <div className="flex flex-wrap h-[2.5vw] max-md:h-[5.5vw] pkm-mobile:h-[5.5vw]!">
                    {currentPokemon.genderRatio.originalRate > -1 &&
                      currentPokemon.genderRatio.maleRate > 0 && (
                        <div
                          className="flex justify-center items-center p-2.5 bg-[#3355ff] h-full max-[450px]:h-[15px]!"
                          style={{
                            width: `${currentPokemon.genderRatio.maleRate}%`,
                          }}
                        >
                          <div className="flex justify-center items-center">
                            <img
                              src="/images/icon_male.png"
                              alt="male-gender"
                              className="!h-[2vw] !w-[2vw] max-md:h-[4vw] max-md:w-[4vw] pkm-mobile:h-[4vw]! pkm-mobile:w-[4vw]!"
                            />
                          </div>
                        </div>
                      )}

                    {currentPokemon.genderRatio.originalRate > -1 &&
                      currentPokemon.genderRatio.femaleRate > 0 && (
                        <div
                          className="flex justify-center items-center p-2.5 bg-[#c2185b] relative top-[0.6px] h-full max-[450px]:h-[15px]!"
                          style={{
                            width: `${currentPokemon.genderRatio.femaleRate}%`,
                          }}
                        >
                          <div className="flex justify-center items-center">
                            <img
                              src="/images/icon_female.png"
                              alt="female-gender"
                              className="!h-[2vw] !w-[2vw] max-md:h-[4vw] max-md:w-[4vw] pkm-mobile:h-[4vw]! pkm-mobile:w-[4vw]!"
                            />
                          </div>
                        </div>
                      )}

                    {currentPokemon.genderRatio.originalRate === -1 && (
                      <div
                        className="flex justify-center items-center p-2.5 bg-[dimgray] h-[30px] max-[450px]:h-[15px]!"
                        style={{ width: "100%" }}
                      >
                        <div className="flex justify-center items-center">
                          <img
                            src="/images/genderless-gray.png"
                            alt="genderless"
                            className="!h-[2vw] !w-[2vw] max-md:h-[4vw] max-md:w-[4vw] pkm-mobile:h-[4vw]! pkm-mobile:w-[4vw]!"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {currentPokemon.genderRatio.originalRate >= 0 ? (
                      <>
                        {currentPokemon.genderRatio.maleRate > 0 && (
                          <span className="thicker text-[1.25vw] tracking-[0.5px] mr-[2vw] pkm-mobile:text-[3.25vw]!">
                            Male:&nbsp;
                            {currentPokemon.genderRatio.maleRate}%
                          </span>
                        )}
                        {currentPokemon.genderRatio.femaleRate > 0 && (
                          <span className="thicker text-[1.25vw] tracking-[0.5px] mr-[2vw] pkm-mobile:text-[3.25vw]!">
                            Female:&nbsp;
                            {currentPokemon.genderRatio.femaleRate}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="thicker text-[1.25vw] tracking-[0.5px] mr-[2vw] pkm-mobile:text-[3.25vw]!">
                        None (Unknown Gender)
                      </span>
                    )}
                  </div>
                </div>
                <div className="wrap-group-and-evs grid grid-cols-[auto_1fr] gap-x-[2vw] mt-[5%] pkm-mobile:gap-x-[20vw]! pkm-mobile:mt-[8%]! max-[450px]:mt-[5%]!">
                  <div className="egg-group">
                    <h4 className="text-[#b3eafe] tracking-[0.5px] text-[1.9vw] mb-[0.5vw] pkm-mobile:text-[3.9vw]! max-[900px]:m-0!">
                      {currentPokemon.eggGroups.length > 1
                        ? "Egg Groups"
                        : "Egg Group"}
                    </h4>
                    {currentPokemon.eggGroups.length > 0 ? (
                      currentPokemon.eggGroups.map((group) => (
                        <span
                          key={group}
                          className="text-[1.4vw] pkm-mobile:text-[3.4vw]!"
                        >
                          {group}
                        </span>
                      ))
                    ) : (
                      <span className="text-[1.4vw] pkm-mobile:text-[3.4vw]!">
                        Undiscovered
                      </span>
                    )}
                  </div>
                  <div className="EVs">
                    <h4 className="text-[#b3eafe] tracking-[0.5px] text-[1.9vw] mb-[0.5vw] pkm-mobile:text-[3.9vw]! max-[900px]:m-0!">
                      EVs
                    </h4>
                    {currentPokemon.evs.map((evs) => (
                      <span
                        key={evs}
                        className="text-[1.4vw] pkm-mobile:text-[3.4vw]!"
                      >
                        {evs}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute top-[380%] pkm-mobile:top-[1380%]! pkm-mobile:right-[6%] pkm-mobile:w-[80vw] max-[450px]:top-[196vw]!">
                <div className="info description">
                  <h4 className="thicker text-[#b3eafe] tracking-[0.5px] text-[1.9vw] pkm-mobile:text-[3.9vw]!">
                    Description
                  </h4>
                  <p className="text-[1.3vw] max-w-[28vw] pkm-mobile:text-[3vw]! pkm-mobile:max-w-full!">
                    {currentPokemon.description}
                  </p>
                </div>
              </div>

              <PokemonStatsSection
                stats={currentPokemon.stats}
                resetKey={statsResetKey}
              />

              <div className="absolute top-[520%] w-full text-center max-[1300px]:top-[540%] max-[1300px]:pb-[50px] max-[800px]:top-[535%] pkm-mobile:top-[270vw]! max-[450px]:top-[278vw]!">
                <Link
                  href={ROUTES.home}
                  className="text-white bg-transparent no-underline py-2.5 px-[50px] rounded-[20px] border-2 border-[#436a96] transition-all duration-300 text-[2.2vw] tracking-[1px] hover:bg-black"
                >
                  Home
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="background-bottom hidden absolute bg-[url('/images/main_sp_bg_bottom.jpg')] bg-no-repeat h-full w-full top-[227vw] bg-[length:100%_auto] pkm-mobile:block! max-md:block! max-[450px]:top-[240vw]!"></div>
      </section>
    </div>
  );
}
