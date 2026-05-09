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
    <div className="wrap-pokemon-info-section">
      <section className="pokemon-info">
        {!errorCondition && currentPokemon && (
          <PokemonInfoNavigator
            currentId={numericId}
            prevPokemon={prevPokemon}
            nextPokemon={nextPokemon}
            onNavigate={handleNavigatorClick}
          />
        )}

        <div className="pokemon-container">
          {isLoading ? (
            <div className="pokemon-info-loading">
              <img
                src="/images/loading-img/loading250x250-2.gif"
                alt="loading-img"
              />
            </div>
          ) : errorCondition || !currentPokemon ? (
            <section className="pokemon-info-error">
              <h4>
                An error has occured,&nbsp;
                <span></span>
                please try again.
              </h4>
            </section>
          ) : (
            <>
              <div className="pokemon-info-section1">
                <div className="wrap-image">
                  <div className="pokemon-info-title">
                    <h3 className="pokemonID">No. {currentPokemon.id}</h3>
                    <h1 className="name">{currentPokemon.name}</h1>
                  </div>
                  <div className="wrap-pokemon-image">
                    <img
                      src="/images/pokemon_front_circle_bg.png"
                      className="pokemon-front-circle-background"
                      alt=""
                    />
                    <img
                      src="/images/pokemon_back_circle_bg.png"
                      className="pokemon-back-circle-background"
                      alt=""
                    />
                    <img
                      src={
                        isImgLoading
                          ? "/images/loading-img/pokemon-loading6.gif"
                          : pokemonImage
                      }
                      className="pokemon-image-info"
                      alt=""
                      onLoad={() => setIsImgLoading(false)}
                      onError={(event) => {
                        event.currentTarget.src = errorImg;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pokemon-info-section2">
                <div className="info height">
                  <span>Height</span>
                  <div className="wrap-height">
                    <span className="cm">
                      {currentPokemon.height.centimeter} cm
                    </span>
                    <span className="seperate">&nbsp;/&nbsp;</span>
                    <span className="ft">{currentPokemon.height.feet} ft</span>
                  </div>
                </div>
                <div className="info weight">
                  <span>Weight</span>
                  <div className="wrap-weight">
                    <span className="kg">
                      {currentPokemon.weight.killogram} kg
                    </span>
                    <span className="seperate">&nbsp;/&nbsp;</span>
                    <span className="lbs">
                      {currentPokemon.weight.pound} lbs
                    </span>
                  </div>
                </div>
                <div className="info capture-rate">
                  <span>Capture Rate</span>
                  <span>{currentPokemon.captureRate}</span>
                </div>
                <div className="info hatch-steps">
                  <span>Hatch Steps</span>
                  <span>{currentPokemon.hatchSteps}</span>
                </div>
                <div className="info abilities">
                  <span>Abilities</span>
                  <div className="wrap-abilities">
                    {currentPokemon.abilities.map((ability) => (
                      <span key={ability}>{ability}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pokemon-info-section3">
                <div className="types">
                  <h4 className="thicker">Types</h4>
                  <div className="wrap-types">
                    {currentPokemon.types.map((type) => {
                      const typeLowerCase = type.toLowerCase();
                      return (
                        <span
                          className="types thicker"
                          style={{ backgroundColor: getTypeColor(type) }}
                          key={typeLowerCase}
                        >
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="gender-ratio">
                  <h4>Gender Ratio</h4>
                  <div className="wrap-line">
                    {currentPokemon.genderRatio.originalRate > -1 &&
                      currentPokemon.genderRatio.maleRate > 0 && (
                        <div
                          className="gender male"
                          style={{
                            width: `${currentPokemon.genderRatio.maleRate}%`,
                          }}
                        >
                          <div className="graph">
                            <img
                              src="/images/icon_male.png"
                              alt="male-gender"
                            />
                          </div>
                        </div>
                      )}

                    {currentPokemon.genderRatio.originalRate > -1 &&
                      currentPokemon.genderRatio.femaleRate > 0 && (
                        <div
                          className="gender female"
                          style={{
                            width: `${currentPokemon.genderRatio.femaleRate}%`,
                          }}
                        >
                          <div className="graph">
                            <img
                              src="/images/icon_female.png"
                              alt="female-gender"
                            />
                          </div>
                        </div>
                      )}

                    {currentPokemon.genderRatio.originalRate === -1 && (
                      <div
                        className="gender unknown"
                        style={{ width: "100%" }}
                      >
                        <div className="graph">
                          <img
                            src="/images/genderless-gray.png"
                            alt="genderless"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ratio-percent">
                    {currentPokemon.genderRatio.originalRate >= 0 ? (
                      <>
                        {currentPokemon.genderRatio.maleRate > 0 && (
                          <span className="male thicker">
                            Male:&nbsp;
                            {currentPokemon.genderRatio.maleRate}%
                          </span>
                        )}
                        {currentPokemon.genderRatio.femaleRate > 0 && (
                          <span className="female thicker">
                            Female:&nbsp;
                            {currentPokemon.genderRatio.femaleRate}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="unknown thicker">
                        None (Unknown Gender)
                      </span>
                    )}
                  </div>
                </div>
                <div className="wrap-group-and-evs">
                  <div className="egg-group">
                    <h4>
                      {currentPokemon.eggGroups.length > 1
                        ? "Egg Groups"
                        : "Egg Group"}
                    </h4>
                    {currentPokemon.eggGroups.length > 0 ? (
                      currentPokemon.eggGroups.map((group) => (
                        <span key={group}>{group}</span>
                      ))
                    ) : (
                      <span>Undiscovered</span>
                    )}
                  </div>
                  <div className="EVs">
                    <h4>EVs</h4>
                    {currentPokemon.evs.map((evs) => (
                      <span key={evs}>{evs}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pokemon-info-section4">
                <div className="info description">
                  <h4 className="thicker">Description</h4>
                  <p>{currentPokemon.description}</p>
                </div>
              </div>

              <PokemonStatsSection
                stats={currentPokemon.stats}
                resetKey={statsResetKey}
              />

              <div className="return-button">
                <Link href={ROUTES.home}>Home</Link>
              </div>
            </>
          )}
        </div>
        <div className="background-bottom"></div>
      </section>
    </div>
  );
}
