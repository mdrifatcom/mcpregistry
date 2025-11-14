import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getApprovedListings, getCategories, getTags } from '@repo/database';
import { MCPGrid } from '@/modules/mcp-registry/components/MCPGrid';
import { SearchBar } from '@/modules/mcp-registry/components/SearchBar';
import { FilterSection } from '@/modules/mcp-registry/components/FilterSection';
import { Skeleton } from '@ui/components/skeleton';

export const metadata = {
  title: 'MCP Registry - Discover Model Context Protocol Servers and Clients',
  description: 'Browse and discover MCP servers and clients for AI integrations. Find tools for data integration, AI models, development tools, and more.',
  openGraph: {
    title: 'MCP Registry - Model Context Protocol Directory',
    description: 'Comprehensive directory of MCP servers and clients for AI applications',
    type: 'website',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    type?: 'server' | 'client';
    category?: string;
    tag?: string | string[];
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
        </div>
      ))}
    </div>
  );
}

async function MCPListings({ searchParams }: { searchParams: Awaited<PageProps['searchParams']> }) {
  const listings = await getApprovedListings({
    type: searchParams.type,
    search: searchParams.q,
  });

  return <MCPGrid listings={listings} />;
}

export default async function MCPRegistryPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          MCP Registry
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover and explore Model Context Protocol servers and clients for your AI applications
        </p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <FilterSection categories={categories} tags={tags} />
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing all approved listings
            </p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <MCPListings searchParams={resolvedSearchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
