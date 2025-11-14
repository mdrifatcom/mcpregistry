'use client';

import Link from 'next/link';
import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/components/card';
import { ExternalLink, Github, Star, TrendingUp } from 'lucide-react';
import type { MCPListingWithRelations } from '@repo/database';

interface MCPCardProps {
  listing: MCPListingWithRelations;
}

export function MCPCard({ listing }: MCPCardProps) {
  const tags = Array.isArray(listing.tags)
    ? listing.tags.map((t: any) => t.tag).filter(Boolean)
    : [];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={listing.type === 'server' ? 'default' : 'secondary'} className="text-xs">
                {listing.type}
              </Badge>
              {listing.verified && (
                <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                  Verified
                </Badge>
              )}
              {listing.featured && (
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-700 dark:text-amber-400">
                  Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
              <Link href={`/mcp/${listing.slug}`} className="hover:underline">
                {listing.title}
              </Link>
            </CardTitle>
          </div>
        </div>
        {listing.tagline && (
          <CardDescription className="line-clamp-1 text-sm font-medium">
            {listing.tagline}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {listing.description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag: any) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {listing.stars_count > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{listing.stars_count.toLocaleString()}</span>
            </div>
          )}
          {listing.view_count > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{listing.view_count.toLocaleString()} views</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild size="sm" variant="default" className="flex-1">
          <Link href={`/mcp/${listing.slug}`}>
            View Details
          </Link>
        </Button>
        {listing.repository_url && (
          <Button asChild size="sm" variant="outline">
            <a href={listing.repository_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </a>
        )}
        {listing.website_url && (
          <Button asChild size="sm" variant="outline">
            <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
