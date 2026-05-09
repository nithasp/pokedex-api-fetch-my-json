import { notFound } from "next/navigation";
import { isValidPokemonId } from "@/config/routes";
import { PokemonInfo } from "./_components/pokemon-info";
import type { PokemonDetailPageProps } from "@/types/page.types";

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);

  if (!Number.isFinite(numericId) || !isValidPokemonId(numericId)) {
    notFound();
  }

  return <PokemonInfo numericId={numericId} routeId={id} />;
}
