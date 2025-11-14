import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getListingsByCategory } from '@repo/database';
import { MCPGrid } from '@/modules/mcp-registry/components/MCPGrid';
import { SearchBar } from '@/modules/mcp-registry/components/SearchBar';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { category } = await getListingsByCategory(slug, 1, 0);

    const title = `${category.name} - MCP Registry`;
    const description = category.seo_description || category.description || `Browse ${category.name} MCP servers and clients`;

    return {
      title: category.seo_title || title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      alternates: {
        canonical: `/mcp/categories/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Category Not Found',
    };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const { category, listings } = await getListingsByCategory(slug, 100, 0);

    return (
      <div className="container mx-auto px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: category.name,
              description: category.description,
              url: `/mcp/categories/${slug}`,
            }),
          }}
        />

        <div className="mb-8">
          <Link href="/mcp" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Registry
          </Link>

          <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-muted-foreground mb-6">{category.description}</p>
          )}

          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>

        <MCPGrid
          listings={listings}
          emptyMessage={`No MCP listings found in the ${category.name} category yet.`}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
