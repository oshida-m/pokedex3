// src/components/client-side-pokemon-list-content.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PokemonListContent } from "./pokemon-list-content";
import type { ProcessedPokemon, PaginationInfo } from "@/lib/types";
import { MAX_PAGE } from "@/constants/pagination"; // ここでimport

interface Props {
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}

export function ClientSidePokemonListContent({ pokemon, pagination }: Props) {
  const router = useRouter();

  const onPageChange = (newPage: number) => {
    // ページ範囲チェック（1〜MAX_PAGE）
    if (newPage < 1 || newPage > MAX_PAGE) return;
    router.push(`/pokemon?page=${newPage}`);
  };

  return (
    <PokemonListContent
      pokemon={pokemon}
      pagination={{ ...pagination, totalPages: MAX_PAGE }} // totalPagesも制限して渡す
      onPageChange={onPageChange}
    />
  );
}



