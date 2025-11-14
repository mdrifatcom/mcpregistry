import { supabase } from './client';
import type { MCPListingWithRelations } from './types';

export async function getApprovedListings(params?: {
  type?: 'server' | 'client';
  categoryId?: string;
  tagIds?: string[];
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags(tag:tags(*)),
      code_examples(*),
      faqs(*),
      use_cases(*),
      social_links(*),
      screenshots(*),
      promotions(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (params?.type) {
    query = query.eq('type', params.type);
  }

  if (params?.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }

  if (params?.featured !== undefined) {
    query = query.eq('featured', params.featured);
  }

  if (params?.search) {
    query = query.textSearch('title', params.search, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as unknown as MCPListingWithRelations[];
}

export async function getListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags(tag:tags(*)),
      code_examples(*),
      faqs(*),
      use_cases(*),
      social_links(*),
      screenshots(*),
      promotions(*)
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as MCPListingWithRelations;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getListingsByTag(tagSlug: string, limit = 20, offset = 0) {
  const tag = await getTagBySlug(tagSlug);

  const { data, error } = await supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags!inner(tag:tags!inner(*))
    `)
    .eq('status', 'approved')
    .eq('listing_tags.tag.slug', tagSlug)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return {
    tag,
    listings: data as unknown as MCPListingWithRelations[],
  };
}

export async function getListingsByCategory(categorySlug: string, limit = 20, offset = 0) {
  const category = await getCategoryBySlug(categorySlug);

  const { data, error } = await supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags(tag:tags(*))
    `)
    .eq('status', 'approved')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return {
    category,
    listings: data as unknown as MCPListingWithRelations[],
  };
}

export async function trackAnalytics(data: {
  listingId?: string;
  eventType: string;
  eventData?: Record<string, unknown>;
  userAgent?: string;
  referrer?: string;
}) {
  const { error } = await supabase.from('analytics').insert({
    listing_id: data.listingId || null,
    event_type: data.eventType,
    event_data: data.eventData || {},
    user_agent: data.userAgent || '',
    referrer: data.referrer || '',
  });

  if (error) {
    console.error('Failed to track analytics:', error);
  }
}

export async function incrementViewCount(listingId: string) {
  const { error } = await supabase.rpc('increment_view_count', {
    listing_id: listingId,
  });

  if (error) {
    console.error('Failed to increment view count:', error);
  }
}

export async function incrementClickCount(listingId: string) {
  const { error } = await supabase.rpc('increment_click_count', {
    listing_id: listingId,
  });

  if (error) {
    console.error('Failed to increment click count:', error);
  }
}

export async function searchListings(query: string, limit = 20) {
  const { data, error } = await supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags(tag:tags(*))
    `)
    .eq('status', 'approved')
    .textSearch('fts', query, {
      type: 'websearch',
      config: 'english',
    })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data as unknown as MCPListingWithRelations[];
}

export async function getFeaturedListings(limit = 6) {
  return getApprovedListings({ featured: true, limit });
}

export async function getTrendingListings(limit = 10) {
  const { data, error } = await supabase
    .from('mcp_listings')
    .select(`
      *,
      category:categories(*),
      tags:listing_tags(tag:tags(*))
    `)
    .eq('status', 'approved')
    .order('view_count', { ascending: false })
    .order('stars_count', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data as unknown as MCPListingWithRelations[];
}

export async function getRecentListings(limit = 10) {
  return getApprovedListings({ limit });
}
