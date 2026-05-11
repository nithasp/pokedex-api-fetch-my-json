"use client";

import { notFound, useParams } from "next/navigation";
import { isValidPokemonId } from "@/config/routes";
import { PokemonInfo } from "../../_components/pokemon-info";

/**
 * The detail-page UI is rendered here in the layout (not in `page.tsx`) on
 * purpose. Next.js App Router unmounts a *page* component every time a
 * dynamic param changes, so navigating `/pokemon/2 -> /pokemon/3` used to
 * tear down the entire `<PokemonInfo>` subtree and rebuild it from scratch
 * — which is what restarted every CSS animation (rotating circle, stat-bar
 * fill, …) and forced the `<img>` to reload, producing the flash on every
 * prev/next click.
 *
 * Layouts at a dynamic segment are PRESERVED across param changes. By
 * rendering `<PokemonInfo>` at the layout level we keep the same React tree
 * (and DOM nodes) mounted; only its `numericId` / `routeId` props change,
 * so the pokemon image stays painted, the rotating background keeps
 * spinning, and the stat bars smoothly interpolate between the previous and
 * current pokemon's percentages via their built-in `transition-all`.
 *
 * `page.tsx` deliberately returns `null` — it exists only so Next.js
 * registers the `/pokemon/[id]` route.
 */
export default function PokemonDetailLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!id) {
    notFound();
  }

  const numericId = Number.parseInt(id, 10);

  if (!Number.isFinite(numericId) || !isValidPokemonId(numericId)) {
    notFound();
  }

  return <PokemonInfo numericId={numericId} routeId={id} />;
}
