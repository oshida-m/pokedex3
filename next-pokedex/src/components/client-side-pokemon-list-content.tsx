// src/components/client-side-pokemon-list-content.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PokemonListContent } from "./pokemon-list-content";
import type { ProcessedPokemon, PaginationInfo } from "@/lib/types";

interface Props {
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}

export function ClientSidePokemonListContent({ pokemon, pagination }: Props) {
  const router = useRouter();

  const onPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    router.push(`/pokemon?page=${newPage}`);
  };

  return (
    <PokemonListContent
      pokemon={pokemon}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}

