// src/components/search-form.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    // 🔍 検索ページへ遷移（クエリパラメータ付き）
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* 🔎 入力フィールド */}
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ポケモンの名前を入力(日本語・英語対応)"
        className="flex-1"
      />

      {/* 🔍 検索ボタン */}
      <Button type="submit">検索</Button>
    </form>
  );
}
