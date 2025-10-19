// src/app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダーは _app.tsx や layout.tsx にある想定なので省略 */}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ポケモン図鑑へようこそ</h1>
          <p className="text-xl text-gray-600 mb-8">お気に入りのポケモンを探してみましょう！</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="px-6 border-b pb-6">
              <h2 className="font-semibold text-2xl">ポケモン一覧</h2>
            </div>
            <div className="px-6">
              <p className="text-gray-600 mb-4">
                すべてのポケモンを一覧で表示します。画像をクリックして詳細を確認できます。
              </p>
              <Link href="/pokemon" passHref>
                <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 w-full">
                  一覧を見る
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="px-6 border-b pb-6">
              <h2 className="font-semibold text-2xl">ポケモン検索</h2>
            </div>
            <div className="px-6">
              <p className="text-gray-600 mb-4">
                名前で検索してお気に入りのポケモンを見つけましょう。日本語で検索できます。
              </p>
              <Link href="/search" passHref>
                <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 w-full">
                  検索する
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            このアプリは{" "}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              PokéAPI
            </a>{" "}
            を使用しています
          </p>
        </div>
      </div>
    </main>
  );
}


