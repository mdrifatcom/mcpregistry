# MCP Registry Module

A comprehensive Model Context Protocol (MCP) registry and directory for discovering MCP servers and clients.

## Features

### Core Functionality
- **Browse MCP Listings**: Discover MCP servers and clients with detailed information
- **Advanced Search**: Full-text search across titles, descriptions, and taglines
- **Category Navigation**: Browse by categories like Data Integration, AI & ML, Development Tools, etc.
- **Tag Filtering**: Filter listings by multiple tags for precise discovery
- **Type Filtering**: Filter by server or client type

### SEO Optimization
- **Dynamic Sitemaps**: Auto-generated sitemaps with all listings, categories, and tags
- **Structured Data**: JSON-LD schema markup for rich search results
- **FAQ Schema**: FAQ structured data for featured snippets
- **Meta Tags**: Comprehensive Open Graph and Twitter Card meta tags
- **Semantic HTML**: Proper heading hierarchy and semantic markup
- **Performance**: Optimized for Core Web Vitals

### Listing Pages
Each MCP listing includes:
- Title, tagline, and detailed description
- Code examples with syntax highlighting
- Use cases with real-world scenarios
- FAQs with schema markup
- Social links and external resources
- Version and license information
- Category and tag associations

## Database Schema

The MCP registry uses Supabase with the following tables:

- `mcp_listings`: Main listings table with full details
- `categories`: Hierarchical category system
- `tags`: Tag system with usage tracking
- `listing_tags`: Many-to-many relationship for listing tags
- `code_examples`: Multiple code examples per listing
- `faqs`: Frequently asked questions per listing
- `use_cases`: Real-world use cases per listing
- `social_links`: Social media and external links
- `screenshots`: Screenshots and media
- `promotions`: Featured and sponsored listings
- `analytics`: View and click tracking

## API

Query functions available in `@repo/database`:

- `getApprovedListings()`: Get all approved listings with filters
- `getListingBySlug(slug)`: Get single listing with all relations
- `getCategories()`: Get all categories
- `getTags()`: Get all tags
- `getListingsByCategory(slug)`: Get listings in a category
- `getListingsByTag(slug)`: Get listings with a specific tag
- `getFeaturedListings()`: Get featured listings
- `getTrendingListings()`: Get trending listings by views
- `searchListings(query)`: Full-text search

## Components

### Display Components
- `MCPCard`: Listing card for grid display
- `MCPGrid`: Responsive grid of listing cards
- `MCPListingDetail`: Full listing detail page
- `CodeBlock`: Syntax-highlighted code with copy button

### Interactive Components
- `SearchBar`: Search input with query handling
- `FilterSection`: Category and tag filters

## Routes

- `/mcp` - Main registry page with search and filters
- `/mcp/[slug]` - Individual listing detail page
- `/mcp/categories/[slug]` - Category-specific listings
- `/mcp/tags/[slug]` - Tag-specific listings

## Adding New Listings

Listings can be added directly to the Supabase database with status 'pending', then reviewed and approved by admins. Future features will include a submission form UI.

## Analytics

The registry tracks:
- Page views per listing
- External link clicks
- Search queries
- User engagement metrics

All analytics are stored in the `analytics` table for future reporting.
