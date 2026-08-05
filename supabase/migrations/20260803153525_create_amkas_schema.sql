/*
# AMKAS INTERNATIONAL — full corporate website schema

## Overview
Single-tenant textile company website. The public site reads all content freely
(anon key), while only authenticated admins can write. No public sign-up screen;
admin accounts are created via Supabase Auth directly.

## New tables
- `categories` — product categories (name, slug, sort order, visibility)
- `collections` — product collections (cover, description, sort, visibility)
- `products` — products (name, slug, category, collection, images, featured, etc.)
- `site_settings` — singleton row: logo, favicon, colors, footer text, SEO defaults
- `homepage` — singleton row: hero, who-we-are, why-choose-us, section visibility
- `company_info` — singleton row: mission, vision, about, years, markets, details
- `contact_info` — singleton row: phone, whatsapp, email, address, map, hours, socials
- `bank_details` — singleton row: bank fields + per-field visibility flags
- `media` — media library entries (path, folder, width, height, alt)
- `inquiries` — contact/inquiry submissions from the public site

## Security
- RLS enabled on every table.
- Public read (anon, authenticated) on all content tables.
- Write restricted to authenticated on all tables.
- `inquiries`: public INSERT (anyone can submit), authenticated SELECT only.
- Owner defaults omitted (single-tenant, admin-managed content).
*/

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE TO authenticated USING (true);

-- ---------- collections ----------
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_image text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_collections" ON collections;
CREATE POLICY "anon_read_collections" ON collections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_collections" ON collections;
CREATE POLICY "auth_insert_collections" ON collections FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_collections" ON collections;
CREATE POLICY "auth_update_collections" ON collections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_collections" ON collections;
CREATE POLICY "auth_delete_collections" ON collections FOR DELETE TO authenticated USING (true);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  featured_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_collection_idx ON products(collection_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured) WHERE featured = true;
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE TO authenticated USING (true);

-- ---------- site_settings (singleton) ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  company_name text NOT NULL DEFAULT 'AMKAS INTERNATIONAL',
  logo_url text,
  favicon_url text,
  primary_color text NOT NULL DEFAULT '#18181c',
  secondary_color text NOT NULL DEFAULT '#c2922f',
  footer_text text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  social_facebook text,
  social_instagram text,
  social_linkedin text,
  social_twitter text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_settings CHECK (id = 1)
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_site_settings" ON site_settings;
CREATE POLICY "anon_read_site_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- homepage (singleton) ----------
CREATE TABLE IF NOT EXISTS homepage (
  id int PRIMARY KEY DEFAULT 1,
  hero_title text NOT NULL DEFAULT 'Trusted Textile Exporters Delivering Premium Fabrics Worldwide',
  hero_subtitle text NOT NULL DEFAULT 'AMKAS INTERNATIONAL crafts and exports premium shawls, wool, cotton and luxury fabrics to discerning markets across the globe.',
  hero_image text,
  hero_button1_text text NOT NULL DEFAULT 'Explore Products',
  hero_button1_link text NOT NULL DEFAULT '/products',
  hero_button2_text text NOT NULL DEFAULT 'Contact Us',
  hero_button2_link text NOT NULL DEFAULT '/contact',
  intro_title text NOT NULL DEFAULT 'Who We Are',
  intro_body text,
  mission text,
  vision text,
  years_experience int NOT NULL DEFAULT 0,
  export_markets text,
  why_choose_us jsonb NOT NULL DEFAULT '[]'::jsonb,
  show_featured boolean NOT NULL DEFAULT true,
  show_collections boolean NOT NULL DEFAULT true,
  show_why_choose boolean NOT NULL DEFAULT true,
  show_company_info boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_homepage CHECK (id = 1)
);
ALTER TABLE homepage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_homepage" ON homepage;
CREATE POLICY "anon_read_homepage" ON homepage FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_homepage" ON homepage;
CREATE POLICY "auth_insert_homepage" ON homepage FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_homepage" ON homepage;
CREATE POLICY "auth_update_homepage" ON homepage FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- company_info (singleton) ----------
CREATE TABLE IF NOT EXISTS company_info (
  id int PRIMARY KEY DEFAULT 1,
  company_name text NOT NULL DEFAULT 'AMKAS INTERNATIONAL',
  registration_info text,
  nature_of_business text,
  established_year int,
  export_markets text,
  ceo_director text,
  business_hours text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_company CHECK (id = 1)
);
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_company_info" ON company_info;
CREATE POLICY "anon_read_company_info" ON company_info FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_company_info" ON company_info;
CREATE POLICY "auth_insert_company_info" ON company_info FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_company_info" ON company_info;
CREATE POLICY "auth_update_company_info" ON company_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- contact_info (singleton) ----------
CREATE TABLE IF NOT EXISTS contact_info (
  id int PRIMARY KEY DEFAULT 1,
  phone1 text,
  phone2 text,
  whatsapp text,
  email text,
  address text,
  map_url text,
  business_hours text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_contact CHECK (id = 1)
);
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_contact_info" ON contact_info;
CREATE POLICY "anon_read_contact_info" ON contact_info FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_contact_info" ON contact_info;
CREATE POLICY "auth_insert_contact_info" ON contact_info FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_contact_info" ON contact_info;
CREATE POLICY "auth_update_contact_info" ON contact_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- bank_details (singleton) ----------
CREATE TABLE IF NOT EXISTS bank_details (
  id int PRIMARY KEY DEFAULT 1,
  bank_name text,
  account_title text,
  account_number text,
  iban text,
  swift_code text,
  branch_name text,
  show_bank_name boolean NOT NULL DEFAULT true,
  show_account_title boolean NOT NULL DEFAULT true,
  show_account_number boolean NOT NULL DEFAULT true,
  show_iban boolean NOT NULL DEFAULT true,
  show_swift_code boolean NOT NULL DEFAULT true,
  show_branch_name boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_bank CHECK (id = 1)
);
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_bank_details" ON bank_details;
CREATE POLICY "anon_read_bank_details" ON bank_details FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_bank_details" ON bank_details;
CREATE POLICY "auth_insert_bank_details" ON bank_details FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_bank_details" ON bank_details;
CREATE POLICY "auth_update_bank_details" ON bank_details FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ---------- media ----------
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  folder text NOT NULL DEFAULT 'general',
  width int,
  height int,
  size_bytes int,
  mime_type text,
  alt text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS media_folder_idx ON media(folder);
DROP POLICY IF EXISTS "anon_read_media" ON media;
CREATE POLICY "anon_read_media" ON media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_media" ON media;
CREATE POLICY "auth_insert_media" ON media FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_media" ON media;
CREATE POLICY "auth_update_media" ON media FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_media" ON media;
CREATE POLICY "auth_delete_media" ON media FOR DELETE TO authenticated USING (true);

-- ---------- inquiries ----------
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  message text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries(created_at DESC);
DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_inquiries" ON inquiries;
CREATE POLICY "auth_read_inquiries" ON inquiries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
CREATE POLICY "auth_update_inquiries" ON inquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;
CREATE POLICY "auth_delete_inquiries" ON inquiries FOR DELETE TO authenticated USING (true);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_touch ON categories;
CREATE TRIGGER categories_touch BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS collections_touch ON collections;
CREATE TRIGGER collections_touch BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS products_touch ON products;
CREATE TRIGGER products_touch BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS site_settings_touch ON site_settings;
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS homepage_touch ON homepage;
CREATE TRIGGER homepage_touch BEFORE UPDATE ON homepage FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS company_info_touch ON company_info;
CREATE TRIGGER company_info_touch BEFORE UPDATE ON company_info FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS contact_info_touch ON contact_info;
CREATE TRIGGER contact_info_touch BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS bank_details_touch ON bank_details;
CREATE TRIGGER bank_details_touch BEFORE UPDATE ON bank_details FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
