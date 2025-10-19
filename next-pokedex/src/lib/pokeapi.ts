// src/lib/pokeapi.ts

import type {
  PokemonListResponse,
  Pokemon,
  Name,
  ProcessedPokemon,
  PaginationInfo,
  PokemonSpeciesDetail,
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * ポケモン一覧を取得する
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return res.json();
}

/**
 * 個別のポケモン詳細情報を取得する
 */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon detail for ${idOrName}`);
  }
  return res.json();
}

/**
 * ポケモン種別の詳細情報を取得する（日本語名・分類など）
 */
export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokemonSpeciesDetail> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon species for ${idOrName}`);
  }
  return res.json();
}

/**
 * 多言語名前配列から日本語名を取得する
 */
export function getJapaneseName(names: Name[]): string {
  const nameObj = names.find(
    (n) => n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
  );
  return nameObj ? nameObj.name : '不明';
}

/**
 * ポケモンの画像URLを取得する
 */
export function getPokemonImageUrl(sprites: Pokemon['sprites']): string {
  return (
    sprites.other['official-artwork']?.front_default ||
    sprites.other.home?.front_default ||
    sprites.front_default ||
    '/images/dummy-pokemon.png' // フォールバック画像
  );
}

// タイプ名の日本語変換テーブル
export const typeTranslations: Record<string, string> = {
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

/**
 * ポケモン一覧を処理済みデータとして取得する
 */
export async function getProcessedPokemonList(
  page: number = 1,
  limit: number = 20
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  const offset = (page - 1) * limit;
  const listData = await fetchPokemonList(limit, offset);

  const totalPages = Math.ceil(listData.count / limit);

  const pokemonDetails = await Promise.all(
    listData.results.map(async (item) => {
      const detail = await fetchPokemon(item.name);
      const species = await fetchPokemonSpecies(detail.id);

      const japaneseName = getJapaneseName(species.names);
      const genus =
        species.genera.find((g) => g.language.name === 'ja')?.genus ?? '不明';

      const types = detail.types.map((t) => t.type.name);
      const imageUrl = getPokemonImageUrl(detail.sprites);

      return {
        id: detail.id,
        name: detail.name,
        japaneseName,
        genus,
        types,
        height: detail.height / 10,
        weight: detail.weight / 10,
        abilities: [], // 必要なら加工
        imageUrl,
      };
    })
  );

  return {
    pokemon: pokemonDetails,
    pagination: {
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * 個別のポケモンデータを処理済み形式で取得する
 */
export async function getProcessedPokemon(id: number): Promise<ProcessedPokemon> {
  const detail = await fetchPokemon(id);
  const species = await fetchPokemonSpecies(detail.id);

  const japaneseName = getJapaneseName(species.names);
  const genus =
    species.genera.find((g) => g.language.name === 'ja')?.genus ?? '不明';

  const types = detail.types.map((t) => t.type.name);
  const imageUrl = getPokemonImageUrl(detail.sprites);

  return {
    id: detail.id,
    name: detail.name,
    japaneseName,
    genus,
    types,
    height: detail.height / 10,
    weight: detail.weight / 10,
    abilities: [], // 必要なら加工
    imageUrl,
  };
}
