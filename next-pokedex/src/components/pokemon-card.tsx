"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedPokemon } from '@/lib/types';

// ここに typeTranslations を直接定義する
const typeTranslations: Record<string, string> = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  grass: 'くさ',
  electric: 'でんき',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー',
};

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="text-center">
            {/* ポケモン画像 */}
            <Image 
              src={pokemon.imageUrl} 
              alt={pokemon.japaneseName} 
              width={120} 
              height={120} 
              className="mx-auto"
              priority
            />

            {/* ポケモン番号を3桁で表示 */}
            <p className="text-sm text-gray-500 mt-2">No. {pokemon.id.toString().padStart(3, '0')}</p>

            {/* ポケモン日本語名 */}
            <h2 className="text-lg font-semibold">{pokemon.japaneseName}</h2>

            {/* タイプをBadgeで表示 */}
            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((type) => (
                <Badge key={type} variant="secondary">
                  {typeTranslations[type] ?? type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

