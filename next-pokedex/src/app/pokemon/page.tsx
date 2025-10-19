import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { PokemonCard } from '@/components/pokemon-card';
import { getProcessedPokemonList } from '@/lib/pokeapi';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

interface SearchParams {
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function PokemonListPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン一覧</h1>
      
      <Suspense fallback={<Loading />}>
        <PokemonListContent page={currentPage} />
      </Suspense>
    </div>
  );
}

async function PokemonListContent({ page }: { page: number }) {
  const { pokemon, pagination } = await getProcessedPokemonList(page, 20);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <Pagination aria-label="Pagination Navigation" className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/pokemon?page=${pagination.currentPage - 1}`}
              aria-disabled={!pagination.hasPrev}
              tabIndex={pagination.hasPrev ? 0 : -1}
            />
          </PaginationItem>

          {/* ページ番号のリンクを作成 */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={`/pokemon?page=${pageNum}`}
                isActive={pageNum === pagination.currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={`/pokemon?page=${pagination.currentPage + 1}`}
              aria-disabled={!pagination.hasNext}
              tabIndex={pagination.hasNext ? 0 : -1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
