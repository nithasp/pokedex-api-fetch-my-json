"use client";

import { useEffect, useRef } from "react";
import type { PokemonStats, PokemonStatsSectionProps } from "@/types/pokemon.types";

const STATUS_FIELDS: Array<{
  key: keyof PokemonStats;
  label: string;
  marker: string;
}> = [
  { key: "hp", label: "HP", marker: "hp" },
  { key: "attack", label: "Attack", marker: "attack" },
  { key: "defense", label: "Defense", marker: "defense" },
  { key: "speed", label: "Speed", marker: "speed" },
  { key: "specialAttack", label: "Special Attack", marker: "special-attack" },
  { key: "specialDefense", label: "Special Defense", marker: "special-defense" },
];

export function PokemonStatsSection({ stats }: PokemonStatsSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Add the `active` class once the bars first scroll into view and leave it
  // on for the lifetime of the component. The CSS `increaseBar` keyframe
  // animation is meant as a one-shot intro — re-triggering it on every
  // pokemon navigation visibly snaps every bar back to 0 before refilling,
  // which is the flicker the user saw. Keeping `active` persistent lets the
  // inline `width: ${value}%` style (with `transition-all duration-1000`)
  // smoothly interpolate from the previous pokemon's value to the new one.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || node.classList.contains("active")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("active");
            observer.disconnect();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pokemon-info-section5 absolute top-[54.2vw] right-0 pkm-mobile:static! pkm-mobile:top-auto! pkm-mobile:right-auto! pkm-mobile:w-[80vw]! pkm-mobile:mx-auto! pkm-mobile:mt-[8vw]! pkm-tablet-tall:top-[54.8vw] max-[450px]:top-[220.8vw]!">
      <h4 className="text-[#b3eafe] tracking-[0.5px] text-[1.9vw] absolute -top-[3vw] right-[45%] max-[1333px]:-top-[3vw] max-[1000px]:-top-[3.1vw] pkm-mobile:static! pkm-mobile:text-[3.9vw]! pkm-mobile:right-auto! pkm-mobile:mb-[2vw]!">
        Status
      </h4>
      <div
        className="wrap-status grid grid-cols-2 gap-x-[3vw] !mt-[3vw] pkm-mobile:grid-cols-1! pkm-mobile:mt-[5vw]!"
        ref={wrapRef}
      >
        {STATUS_FIELDS.map(({ key, label, marker }) => {
          const value = stats[key];
          return (
            <div
              className={`status ${marker} grid grid-cols-[11vw_1fr] items-center !mb-[4%] pkm-mobile:grid-cols-[30vw_1fr]!`}
              key={key}
            >
              <div className="text-[1.3vw] tracking-[0.5px] pkm-mobile:text-[3vw]!">
                {label}:
              </div>
              <div className="w-[12vw] h-[1.5vw] max-md:h-[3vw] pkm-mobile:w-[48vw]! pkm-mobile:h-[3vw]!">
                <div
                  className="relative text-center h-full max-w-full rounded-[10px] transition-all duration-1000"
                  style={{ width: `${value}%` }}
                >
                  <div className="bar-value2 absolute w-full h-full bg-[indianred] rounded-[10px] flex justify-center items-center">
                    <span className="thicker relative text-[1.2vw] pkm-mobile:text-[2.2vw]!">
                      {value}
                    </span>
                  </div>
                  <span className="invisible opacity-0">2</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
