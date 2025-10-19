// src/lib/pokeapi.ts

import type {
  PokemonListResponse,
  Pokemon,
  Name,
  ProcessedPokemon,
  PaginationInfo,
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const SAFE_POKEMON_LIMIT = 1010;

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
  const data: PokemonListResponse = await res.json();
  return data;
}

/**
 * 個別のポケモン詳細情報を取得する
 */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon detail for ${idOrName}`);
  }
  const data: Pokemon = await res.json();
  return data;
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
    '/dummy-pokemon.png' // フォールバック画像（存在しなければここで対応）
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

  // ページ数計算
  const totalPages = Math.ceil(listData.count / limit);

  // 詳細を全部取得（API制限がなければOK。制限ある場合は改良必要）
  const pokemonDetails = await Promise.all(
    listData.results.map(async (item) => {
      const detail = await fetchPokemon(item.name);
      return detail;
    })
  );

  // 変換処理
  const processed: ProcessedPokemon[] = pokemonDetails.map((poke) => {
    const japaneseName = getJapaneseName(poke.species.names || []);
    const genus = '不明'; // 後でspecies APIから取れるなら更新してください
    const types = poke.types.map((t) => t.type.name);
    const imageUrl = getPokemonImageUrl(poke.sprites);
    return {
      id: poke.id,
      name: poke.name,
      japaneseName,
      genus,
      types,
      height: poke.height / 10, // デカメートル → メートル
      weight: poke.weight / 10, // ヘクトグラム → キログラム
      abilities: [], // 必要に応じて埋める
      imageUrl,
    };
  });

  return {
    pokemon: processed,
    pagination: {
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
