import { Suspense } from 'react';
import Link from 'next/link';  
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
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-center mb-4">ポケモン検索</h1>

        {/* 説明文 */}
        <p className="text-center mb-6 text-gray-600">ポケモンの名前で検索できます</p>

        {/* 検索フォームと説明文 */}
        <div className="max-w-md mx-auto mb-8">
          <SearchForm initialQuery={query} />
          <p className="mt-10 text-center text-gray-600 text-sm">
            上の検索フォームにポケモンの名前を入力してください
          </p>
        </div>

        {/* 検索結果 */}
        {query && (
          <Suspense fallback={<Loading message="検索中..." />}>
            <SearchResults query={query} page={page} />
          </Suspense>
        )}
      </main>

      {/* 右下の「一覧へ」ボタン */}
      <footer className="fixed bottom-6 right-6">
        <Link
          href="/pokemon"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          一覧へ
        </Link>
      </footer>
    </div>
  );
}



