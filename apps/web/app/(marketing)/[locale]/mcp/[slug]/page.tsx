import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getListingBySlug } from '@repo/database';
import { MCPListingDetail } from '@/modules/mcp-registry/components/MCPListingDetail';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const listing = await getListingBySlug(slug);

    const title = `${listing.title} - MCP ${listing.type === 'server' ? 'Server' : 'Client'}`;
    const description = listing.tagline || listing.description.substring(0, 160);

    return {
      title,
      description,
      keywords: [
        'MCP',
        'Model Context Protocol',
        listing.type,
        listing.title,
        ...(Array.isArray(listing.tags) ? listing.tags.map((t: any) => t.tag?.name).filter(Boolean) : []),
      ],
      authors: listing.author_name ? [{ name: listing.author_name }] : [],
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/mcp/${slug}`,
        images: listing.screenshots && Array.isArray(listing.screenshots) && listing.screenshots.length > 0
          ? [{ url: listing.screenshots[0].url, alt: listing.screenshots[0].alt_text }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/mcp/${slug}`,
      },
    };
  } catch {
    return {
      title: 'MCP Listing Not Found',
    };
  }
}

export default async function MCPListingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const listing = await getListingBySlug(slug);
    return <MCPListingDetail listing={listing} />;
  } catch {
    notFound();
  }
}
