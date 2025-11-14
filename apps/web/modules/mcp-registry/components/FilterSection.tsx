'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Tabs, TabsList, TabsTrigger } from '@ui/components/tabs';
import type { Category, Tag } from '@repo/database';

interface FilterSectionProps {
  categories: Category[];
  tags: Tag[];
}

export function FilterSection({ categories, tags }: FilterSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') || 'all';
  const currentCategory = searchParams.get('category');
  const currentTags = searchParams.getAll('tag');

  const updateFilter = (key: string, value: string | null, append = false) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else if (append) {
      params.append(key, value);
    } else {
      params.set(key, value);
    }

    router.push(`/mcp?${params.toString()}`);
  };

  const toggleTag = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const tags = params.getAll('tag');

    if (tags.includes(tagSlug)) {
      params.delete('tag');
      tags.filter(t => t !== tagSlug).forEach(t => params.append('tag', t));
    } else {
      params.append('tag', tagSlug);
    }

    router.push(`/mcp?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/mcp');
  };

  const hasActiveFilters = currentType !== 'all' || currentCategory || currentTags.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Type</h3>
          <Tabs value={currentType} onValueChange={(v) => updateFilter('type', v === 'all' ? null : v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="server">Servers</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.slug ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => updateFilter('category', currentCategory === category.slug ? null : category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag) => (
              <Badge
                key={tag.id}
                variant={currentTags.includes(tag.slug) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => toggleTag(tag.slug)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
