import { notFound } from "next/navigation";
import { isValidPokemonId } from "@/config/routes";
import { PokemonInfo } from "./_components/pokemon-info";

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>;
}

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
