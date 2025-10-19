// src/lib/pokeapi.ts

import type {
  PokemonListResponse,
  Pokemon,
  Name,
  ProcessedPokemon,
  PaginationInfo,
  PokemonSpeciesDetail,
  AbilityDetail,
  ProcessedAbility,
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * タイプの日本語訳マッピング
 */
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
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`, { cache: 'no-store' });
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
 * 特性詳細情報を取得する（日本語名・説明など）
 */
export async function fetchAbilityDetail(abilityUrl: string): Promise<AbilityDetail> {
  const res = await fetch(abilityUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ability detail from ${abilityUrl}`);
  }
  return res.json();
}

/**
 * 多言語名前配列から日本語名を取得する（カタカナひらがな両対応）
 */
export function getJapaneseName(names: Name[]): string {
  const nameObj = names.find((n) => n.language.name === 'ja-Hrkt') || names.find((n) => n.language.name === 'ja');
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

      const abilityDetails = await Promise.all(
        detail.abilities.map((a) => fetchAbilityDetail(a.ability.url))
      );

      const japaneseName = getJapaneseName(species.names);
      const genus = species.genera.find((g) => g.language.name === 'ja')?.genus ?? '不明';
      const types = detail.types.map((t) => t.type.name);
      const imageUrl = getPokemonImageUrl(detail.sprites);

      const abilities: ProcessedAbility[] = detail.abilities.map((a, idx) => {
        const abilityDetail = abilityDetails[idx];

        // 日本語説明文を優先的に取得
        let description =
          abilityDetail.effect_entries.find((e) => e.language.name === 'ja')?.short_effect;

        if (!description) {
          description =
            abilityDetail.effect_entries.find((e) => e.language.name === 'ja')?.effect;
        }

        if (!description) {
          const flavorEntry = abilityDetail.flavor_text_entries.find((e) => e.language.name === 'ja');
          if (flavorEntry) {
            description = flavorEntry.flavor_text.replace(/\n|\f/g, ' ');
          }
        }

        // 日本語がなければ英語を使う
        if (!description) {
          description =
            abilityDetail.effect_entries.find((e) => e.language.name === 'en')?.short_effect;
        }

        if (!description) {
          description = '説明なし';
        }

        const jpName = getJapaneseName(abilityDetail.names);

        return {
          name: a.ability.name,
          japaneseName: jpName,
          description,
          isHidden: a.is_hidden,
        };
      });

      return {
        id: detail.id,
        name: detail.name,
        japaneseName,
        genus,
        types,
        height: detail.height / 10,
        weight: detail.weight / 10,
        abilities,
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

  const abilityDetails = await Promise.all(
    detail.abilities.map((a) => fetchAbilityDetail(a.ability.url))
  );

  const japaneseName = getJapaneseName(species.names);
  const genus = species.genera.find((g) => g.language.name === 'ja')?.genus ?? '不明';
  const types = detail.types.map((t) => t.type.name);
  const imageUrl = getPokemonImageUrl(detail.sprites);

  const abilities: ProcessedAbility[] = detail.abilities.map((a, idx) => {
    const abilityDetail = abilityDetails[idx];

    let description =
      abilityDetail.effect_entries.find((e) => e.language.name === 'ja')?.short_effect;

    if (!description) {
      description =
        abilityDetail.effect_entries.find((e) => e.language.name === 'ja')?.effect;
    }

    if (!description) {
      const flavorEntry = abilityDetail.flavor_text_entries.find((e) => e.language.name === 'ja');
      if (flavorEntry) {
        description = flavorEntry.flavor_text.replace(/\n|\f/g, ' ');
      }
    }

    if (!description) {
      description =
        abilityDetail.effect_entries.find((e) => e.language.name === 'en')?.short_effect;
    }

    if (!description) {
      description = '説明なし';
    }

    const jpName = getJapaneseName(abilityDetail.names);

    return {
      name: a.ability.name,
      japaneseName: jpName,
      description,
      isHidden: a.is_hidden,
    };
  });

  return {
    id: detail.id,
    name: detail.name,
    japaneseName,
    genus,
    types,
    height: detail.height / 10,
    weight: detail.weight / 10,
    abilities,
    imageUrl,
  };
}

