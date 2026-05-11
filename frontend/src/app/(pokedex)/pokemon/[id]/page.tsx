"use client";

import { notFound, useParams } from "next/navigation";
import { isValidPokemonId } from "@/config/routes";
import { PokemonInfo } from "../../_components/pokemon-info";

/**
 * Client component on purpose: it avoids triggering an async server-side
 * Suspense boundary on every navigation between two pokemon detail pages,
 * which is what was causing the global `loading.tsx` (`loading250x250-2.gif`)
 * to flash over the page on every prev/next click. With params read via
 * `useParams()`, navigations between detail pages are pure client-side and
 * `PokemonInfo`'s own loading states drive the UI.
 */
export default function PokemonDetailPage() {
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
