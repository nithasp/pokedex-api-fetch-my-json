/**
 * The detail page UI lives in `layout.tsx` (see the comment there for why).
 * This file exists only so Next.js registers the `/pokemon/[id]` route —
 * the actual rendering is done by the layout, which is preserved across
 * dynamic-param changes and therefore lets prev/next navigation reuse the
 * same React tree instead of remounting it on every click.
 */
export default function PokemonDetailPage() {
  return null;
}
