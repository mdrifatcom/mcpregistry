import type { MCPListingWithRelations } from '@repo/database';
import { MCPCard } from './MCPCard';

interface MCPGridProps {
  listings: MCPListingWithRelations[];
  emptyMessage?: string;
}

export function MCPGrid({ listings, emptyMessage = 'No MCP servers or clients found.' }: MCPGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <MCPCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
