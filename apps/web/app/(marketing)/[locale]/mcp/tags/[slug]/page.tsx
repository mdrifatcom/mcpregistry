import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getListingsByTag } from '@repo/database';
import { MCPGrid } from '@/modules/mcp-registry/components/MCPGrid';
import { SearchBar } from '@/modules/mcp-registry/components/SearchBar';
import { Badge } from '@ui/components/badge';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { tag } = await getListingsByTag(slug, 1, 0);

    const title = `${tag.name} - MCP Registry Tags`;
    const description = tag.description || `Browse MCP servers and clients tagged with ${tag.name}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      alternates: {
        canonical: `/mcp/tags/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Tag Not Found',
    };
  }
}

export default async function TagPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const { tag, listings } = await getListingsByTag(slug, 100, 0);

    return (
      <div className="container mx-auto px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${tag.name} Tag`,
              description: tag.description,
              url: `/mcp/tags/${slug}`,
            }),
          }}
        />

        <div className="mb-8">
          <Link href="/mcp" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Registry
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{tag.name}</h1>
            <Badge style={{ backgroundColor: tag.color }} className="text-white">
              {listings.length}
            </Badge>
          </div>

          {tag.description && (
            <p className="text-xl text-muted-foreground mb-6">{tag.description}</p>
          )}

          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} tagged with {tag.name}
          </p>
        </div>

        <MCPGrid
          listings={listings}
          emptyMessage={`No MCP listings found with the ${tag.name} tag yet.`}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
