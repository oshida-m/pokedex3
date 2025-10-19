// src/app/pokemon/page.tsx

import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { getProcessedPokemonList } from "@/lib/pokeapi";
import { ClientSidePokemonListContent } from '@/components/client-side-pokemon-list-content';

interface SearchParams {
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function PokemonListPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  const { pokemon, pagination } = await getProcessedPokemonList(currentPage, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン一覧</h1>

      <Suspense fallback={<Loading />}>
        {/* ここでページ変更はクライアント側で行う */}
        <ClientSidePokemonListContent pokemon={pokemon} pagination={pagination} />
      </Suspense>
    </div>
  );
}
