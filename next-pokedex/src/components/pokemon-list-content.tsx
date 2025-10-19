// src/components/pokemon-list-content.tsx

"use client";

import React from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { Pagination } from "@/components/ui/pagination";
import type { ProcessedPokemon } from '@/lib/types';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface Props {
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function PokemonListContent({ pokemon, pagination, onPageChange }: Props) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </>
  );
}
