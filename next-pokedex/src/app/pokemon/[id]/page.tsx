// /app/pokemon/[id]/page.tsx
import { getProcessedPokemon } from '@/lib/pokeapi';
import Image from 'next/image';
import Link from 'next/link';
import { typeTranslations } from '@/lib/pokeapi';

interface Props {
  params: { id: string };
}

export default async function PokemonDetailPage({ params }: Props) {
  const id = Number(params.id);

  try {
    const pokemon = await getProcessedPokemon(id);
    if (!pokemon) {
      return <p>ポケモンが見つかりませんでした。</p>;
    }

    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 relative bg-gray-100 p-4 rounded-xl shadow-md">
        {/* 背景カード */}
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl border shadow-sm -z-10" />

        {/* メインコンテンツ */}
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          {/* 左：画像 */}
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.japaneseName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 右：情報カード */}
          <div className="md:w-1/2 bg-card text-card-foreground flex flex-col rounded-xl border py-6 px-6 shadow-sm">
            {/* タイトル */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">No.{pokemon.id}</p>
              <h1 className="font-semibold text-2xl md:text-3xl">{pokemon.japaneseName}</h1>
            </div>

            {/* 基本情報 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">基本情報</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">分類:</span>
                  <span>{pokemon.genus || '???'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">高さ:</span>
                  <span>{pokemon.height.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">重さ:</span>
                  <span>{pokemon.weight.toFixed(1)} kg</span>
                </div>
              </div>
            </div>

            {/* タイプ */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">タイプ</h2>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/90 text-sm"
                  >
                    {typeTranslations[type] || type}
                  </span>
                ))}
              </div>
            </div>

            {/* 特性 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">特性</h2>
              <ul className="list-disc ml-5 space-y-1">
                {pokemon.abilities.map((ability) => (
                  <li key={ability.name}>{ability.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ナビゲーションリンク */}
        <div className="mt-8 flex justify-between max-w-4xl mx-auto px-6">
          {prevId ? (
            <Link href={`/pokemon/${prevId}`} className="text-blue-600 hover:underline">
              &larr; 前のポケモン
            </Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link href={`/pokemon/${nextId}`} className="text-blue-600 hover:underline">
              次のポケモン &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* 一覧へボタンを右下に固定 */}
        <div className="fixed bottom-6 right-6">
          <Link
            href="/pokemon"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            一覧へ
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p>ポケモン情報の取得に失敗しました。</p>;
  }
}
