import { Suspense } from 'react';
import { SearchForm } from '@/components/search-form';
import { Loading } from '@/components/loading';
import { SearchResults } from '@/components/search-results';

interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = Number(resolvedParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン検索</h1>

      {/* 🔍 検索フォーム */}
      <SearchForm initialQuery={query} />

      {/* 🔎 検索クエリがある場合、結果表示 */}
      {query && (
        <Suspense fallback={<Loading message="検索中..." />}>
          <SearchResults query={query} page={page} />
        </Suspense>
      )}
    </div>
  );
}
