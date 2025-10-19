// src/components/search-results.tsx
import { getProcessedPokemonList } from '@/lib/pokeapi';
import { PokemonCard } from '@/components/pokemon-card';
import { ProcessedPokemon } from '@/lib/types';

interface SearchResultsProps {
  query: string;
  page: number;
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  const ITEMS_PER_PAGE = 10;

  try {
    // 1. ポケモンリストを一括取得（本来はAPIの絞り込み検索が望ましい）
    const { pokemon } = await getProcessedPokemonList(1, 1000); // とりあえず全件取得

    // 2. 検索クエリでフィルタリング（日本語名または英語名にマッチ）
    const filtered = pokemon.filter(p =>
      p.japaneseName.includes(query) ||
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    // 3. ページ単位で切り出し
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return (
      <div className="search-results">
        {/* 検索クエリと件数表示 */}
        <p className="mb-4 text-center text-gray-700">
          検索ワード: <strong>{query}</strong> - 該当件数: {filtered.length}件
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">該当するポケモンが見つかりませんでした。</p>
        ) : (
          <>
            {/* ポケモンカードをグリッド表示 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {paginated.map((p: ProcessedPokemon) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {/* ページネーション */}
            <div className="mt-8 flex justify-center">
              <nav aria-label="検索結果ページネーション" className="inline-flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                    className={`px-4 py-2 rounded ${
                      pageNum === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    console.error('SearchResults error:', error);
    return (
      <p className="text-center text-red-600">
        検索中にエラーが発生しました。時間をおいて再度お試しください。
      </p>
    );
  }
}

