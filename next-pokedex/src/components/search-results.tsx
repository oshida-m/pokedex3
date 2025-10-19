// src/components/search-results.tsx
import { getProcessedPokemonList } from '@/lib/pokeapi';
import { PokemonCard } from '@/components/pokemon-card';
import { ProcessedPokemon } from '@/lib/types';
import { Loading } from '@/components/loading';

interface SearchResultsProps {
  query: string;
  page: number;
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  // 1ページあたり表示数（仕様：10体／ページ）
  const ITEMS_PER_PAGE = 10;

  try {
    // 全一覧またはフィルタ対象を取得 — ここでは簡易に全取得してからフィルタする例
    const { pokemon, pagination } = await getProcessedPokemonList(1, ITEMS_PER_PAGE * page);
    // フィルタ
    const filtered = pokemon.filter((p) =>
      p.japaneseName.includes(query) ||
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const totalFilteredPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return (
      <div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">ポケモンが見つかりませんでした。</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paginated.map((p: ProcessedPokemon) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {/* ページネーション部分 */}
            <div className="mt-8 flex justify-center">
              <nav aria-label="検索結果ページネーション">
                {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                    className={`px-3 py-1 mx-1 rounded ${
                      pageNum === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("SearchResults error:", error);
    return <p className="text-center text-red-600">検索中にエラーが発生しました。</p>;
  }
}
