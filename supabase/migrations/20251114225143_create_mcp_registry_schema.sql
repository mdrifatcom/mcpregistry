/*
  # MCP Registry Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Display name
      - `description` (text) - Category description
      - `icon` (text) - Icon identifier
      - `parent_id` (uuid, nullable) - For nested categories
      - `seo_title` (text) - Custom SEO title
      - `seo_description` (text) - Custom meta description
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `tags`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Display name
      - `description` (text) - Tag description
      - `color` (text) - Visual color code
      - `usage_count` (integer) - Number of listings using this tag
      - `created_at` (timestamptz)

    - `mcp_listings`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - MCP name
      - `tagline` (text) - AI-generated tagline
      - `description` (text) - Full description
      - `type` (text) - 'server' or 'client'
      - `category_id` (uuid) - Foreign key to categories
      - `author_name` (text) - Author/organization name
      - `author_email` (text) - Contact email
      - `repository_url` (text) - GitHub/GitLab URL
      - `npm_package` (text) - npm package name
      - `website_url` (text) - Official website
      - `documentation_url` (text) - Documentation URL
      - `license` (text) - License type
      - `version` (text) - Latest version
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `featured` (boolean) - Featured listing flag
      - `verified` (boolean) - Verified by moderators
      - `downloads_count` (integer) - Download statistics
      - `stars_count` (integer) - GitHub stars
      - `view_count` (integer) - Page views
      - `click_count` (integer) - External link clicks
      - `submitted_by` (uuid, nullable) - User ID who submitted
      - `approved_by` (uuid, nullable) - Admin who approved
      - `approved_at` (timestamptz) - Approval timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `listing_tags`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `tag_id` (uuid) - Foreign key to tags
      - `created_at` (timestamptz)

    - `code_examples`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `title` (text) - Example title
      - `description` (text) - Example description
      - `language` (text) - Programming language
      - `framework` (text) - Framework (if applicable)
      - `code` (text) - Code content
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `faqs`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `question` (text) - FAQ question
      - `answer` (text) - FAQ answer
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `use_cases`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `title` (text) - Use case title
      - `description` (text) - Detailed description
      - `industry` (text) - Industry/domain
      - `example` (text) - Real-world example
      - `order` (integer) - Display order
      - `created_at` (timestamptz)

    - `social_links`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `platform` (text) - Platform name (github, twitter, discord, etc)
      - `url` (text) - Link URL
      - `metrics` (jsonb) - Additional metrics (followers, stars, etc)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `screenshots`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `url` (text) - Image URL
      - `alt_text` (text) - Alt text for accessibility
      - `caption` (text) - Image caption
      - `order` (integer) - Display order
      - `created_at` (timestamptz)

    - `promotions`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `type` (text) - Promotion type (featured, sponsored, etc)
      - `priority` (integer) - Display priority
      - `start_date` (timestamptz) - Promotion start
      - `end_date` (timestamptz) - Promotion end
      - `badge_text` (text) - Badge display text
      - `created_at` (timestamptz)

    - `analytics`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - Foreign key to mcp_listings
      - `event_type` (text) - Event type (view, click, bookmark, etc)
      - `event_data` (jsonb) - Additional event data
      - `user_agent` (text) - User agent string
      - `referrer` (text) - Referrer URL
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to approved listings
    - Add policies for authenticated users to submit listings
    - Add policies for admin operations

  3. Indexes
    - Add indexes on frequently queried fields (slug, status, category_id, etc)
    - Add full-text search indexes on title and description
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create mcp_listings table
CREATE TABLE IF NOT EXISTS mcp_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  tagline text DEFAULT '',
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('server', 'client')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  author_name text DEFAULT '',
  author_email text DEFAULT '',
  repository_url text DEFAULT '',
  npm_package text DEFAULT '',
  website_url text DEFAULT '',
  documentation_url text DEFAULT '',
  license text DEFAULT '',
  version text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured boolean DEFAULT false,
  verified boolean DEFAULT false,
  downloads_count integer DEFAULT 0,
  stars_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  submitted_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing_tags junction table
CREATE TABLE IF NOT EXISTS listing_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, tag_id)
);

-- Create code_examples table
CREATE TABLE IF NOT EXISTS code_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  language text DEFAULT 'javascript',
  framework text DEFAULT '',
  code text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create use_cases table
CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  industry text DEFAULT '',
  example text DEFAULT '',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create screenshots table
CREATE TABLE IF NOT EXISTS screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text DEFAULT '',
  caption text DEFAULT '',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES mcp_listings(id) ON DELETE CASCADE,
  type text DEFAULT 'featured',
  priority integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  badge_text text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES mcp_listings(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  user_agent text DEFAULT '',
  referrer text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_mcp_listings_slug ON mcp_listings(slug);
CREATE INDEX IF NOT EXISTS idx_mcp_listings_status ON mcp_listings(status);
CREATE INDEX IF NOT EXISTS idx_mcp_listings_type ON mcp_listings(type);
CREATE INDEX IF NOT EXISTS idx_mcp_listings_category_id ON mcp_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_mcp_listings_featured ON mcp_listings(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_listing_tags_listing_id ON listing_tags(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_tags_tag_id ON listing_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_analytics_listing_id ON analytics(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_mcp_listings_search ON mcp_listings 
  USING gin(to_tsvector('english', title || ' ' || description || ' ' || tagline));

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public read access to categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Public read access to tags
CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO public
  USING (true);

-- Public read access to approved listings
CREATE POLICY "Anyone can view approved listings"
  ON mcp_listings FOR SELECT
  TO public
  USING (status = 'approved');

-- Public read access to listing_tags (for approved listings)
CREATE POLICY "Anyone can view listing tags"
  ON listing_tags FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = listing_tags.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to code examples (for approved listings)
CREATE POLICY "Anyone can view code examples"
  ON code_examples FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = code_examples.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to faqs (for approved listings)
CREATE POLICY "Anyone can view faqs"
  ON faqs FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = faqs.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to use_cases (for approved listings)
CREATE POLICY "Anyone can view use cases"
  ON use_cases FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = use_cases.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to social_links (for approved listings)
CREATE POLICY "Anyone can view social links"
  ON social_links FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = social_links.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to screenshots (for approved listings)
CREATE POLICY "Anyone can view screenshots"
  ON screenshots FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = screenshots.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public read access to promotions (for active promotions)
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  TO public
  USING (
    start_date <= now() 
    AND (end_date IS NULL OR end_date >= now())
    AND EXISTS (
      SELECT 1 FROM mcp_listings
      WHERE mcp_listings.id = promotions.listing_id
      AND mcp_listings.status = 'approved'
    )
  );

-- Public insert access to analytics (for tracking)
CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT
  TO public
  WITH CHECK (true);

-- Public read access to analytics (aggregated data only)
CREATE POLICY "Anyone can view analytics"
  ON analytics FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcp_listings_updated_at BEFORE UPDATE ON mcp_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_examples_updated_at BEFORE UPDATE ON code_examples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();