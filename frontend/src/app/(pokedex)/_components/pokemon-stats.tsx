"use client";

import { useEffect, useRef } from "react";
import type { PokemonStats, PokemonStatsSectionProps } from "@/types/pokemon.types";

const STATUS_FIELDS: Array<{
  key: keyof PokemonStats;
  label: string;
  className: string;
}> = [
  { key: "hp", label: "HP", className: "status hp" },
  { key: "attack", label: "Attack", className: "status attack" },
  { key: "defense", label: "Defense", className: "status defense" },
  { key: "speed", label: "Speed", className: "status speed" },
  {
    key: "specialAttack",
    label: "Special Attack",
    className: "status special-attack",
  },
  {
    key: "specialDefense",
    label: "Special Defense",
    className: "status special-defense",
  },
];

export function PokemonStatsSection({
  stats,
  resetKey,
}: PokemonStatsSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver to add `active` once the bars enter the viewport,
  // mirroring the original scroll-listener behavior. Re-run when `resetKey`
  // changes so navigating between pokemon replays the bar animation.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    node.classList.remove("active");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("active");
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [resetKey]);

  return (
    <div className="pokemon-info-section5">
      <h4>Status</h4>
      <div className="wrap-status" ref={wrapRef}>
        {STATUS_FIELDS.map(({ key, label, className }) => {
          const value = stats[key];
          return (
            <div className={className} key={key}>
              <div className="description">{label}:</div>
              <div className="status-bar">
                <div className="bar-value" style={{ width: `${value}%` }}>
                  <div className="bar-value2">
                    <span className="text-value">{value}</span>
                  </div>
                  <span className="dummy-block">2</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
