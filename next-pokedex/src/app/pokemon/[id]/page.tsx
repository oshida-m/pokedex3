import { Suspense } from 'react';
import { getProcessedPokemon } from '@/lib/pokeapi';
import { Loading } from '@/components/loading';
import Image from 'next/image';
import Link from 'next/link';
import { typeTranslations } from '@/lib/pokeapi';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PokemonDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function PokemonDetailContent({ id }: { id: number }) {
  try {
    const pokemon = await getProcessedPokemon(id);
    if (!pokemon) {
      return <p>ポケモンが見つかりませんでした。</p>;
    }

    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null; // SAFE_POKEMON_LIMITを想定

    return (
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{pokemon.japaneseName}</h1>
          <Image
            src={pokemon.imageUrl}
            alt={pokemon.japaneseName}
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
          <div className="mt-2 flex justify-center gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 rounded bg-blue-200 text-blue-800 text-sm font-semibold"
              >
                {typeTranslations[type] || type}
              </span>
            ))}
          </div>
          <p className="mt-2">
            高さ: {(pokemon.height / 10).toFixed(1)} m / 重さ: {(pokemon.weight / 10).toFixed(1)} kg
          </p>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          {prevId ? (
            <Link href={`/pokemon/${prevId}`} className="text-blue-600 hover:underline">
              &larr; 前のポケモン
            </Link>
          ) : <span />}
          {nextId ? (
            <Link href={`/pokemon/${nextId}`} className="text-blue-600 hover:underline">
              次のポケモン &rarr;
            </Link>
          ) : <span />}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p>ポケモン情報の取得に失敗しました。</p>;
  }
}
