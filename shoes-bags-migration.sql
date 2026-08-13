-- ═══════════════════════════════════════════════════════════════
-- CLASSIQ SHOES & BAGS TRANSFORMATION MIGRATION
-- ═══════════════════════════════════════════════════════════════
-- This migration transforms the e-commerce store from general clothing
-- to specialized women's shoes and bags boutique
-- ═══════════════════════════════════════════════════════════════

-- ─── STEP 1: ADD NEW COLUMNS TO PRODUCTS TABLE ───────────────────
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS product_type VARCHAR(20) DEFAULT 'shoe' CHECK (product_type IN ('shoe', 'bag')),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- ─── STEP 2: UPDATE CATEGORIES TABLE STRUCTURE ───────────────────
-- First, let's check if categories table exists, if not create it
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_category VARCHAR(20) CHECK (parent_category IN ('shoes', 'bags', NULL)),
  product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('shoe', 'bag')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add category_id to products if it doesn't exist
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

-- ─── STEP 3: CREATE INDEXES FOR PERFORMANCE ──────────────────────
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_metadata_gin ON products USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_product_type ON categories(product_type);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category);

-- ─── STEP 4: SEED SHOE CATEGORIES ────────────────────────────────
INSERT INTO categories (name, slug, description, parent_category, product_type, display_order) VALUES
  ('Heels', 'heels', 'Elegant high heels and pumps', 'shoes', 'shoe', 1),
  ('Flats', 'flats', 'Comfortable flat shoes', 'shoes', 'shoe', 2),
  ('Sneakers', 'sneakers', 'Casual and athletic sneakers', 'shoes', 'shoe', 3),
  ('Boots', 'boots', 'Stylish boots for all seasons', 'shoes', 'shoe', 4),
  ('Sandals', 'sandals', 'Open-toe sandals for warm weather', 'shoes', 'shoe', 5),
  ('Wedges', 'wedges', 'Comfortable wedge heels', 'shoes', 'shoe', 6),
  ('Mules', 'mules', 'Easy slip-on mules', 'shoes', 'shoe', 7),
  ('Loafers', 'loafers', 'Classic loafers', 'shoes', 'shoe', 8),
  ('Espadrilles', 'espadrilles', 'Summer espadrilles', 'shoes', 'shoe', 9)
ON CONFLICT (slug) DO NOTHING;

-- ─── STEP 5: SEED BAG CATEGORIES ─────────────────────────────────
INSERT INTO categories (name, slug, description, parent_category, product_type, display_order) VALUES
  ('Tote Bags', 'tote-bags', 'Spacious tote bags', 'bags', 'bag', 1),
  ('Shoulder Bags', 'shoulder-bags', 'Classic shoulder bags', 'bags', 'bag', 2),
  ('Crossbody Bags', 'crossbody-bags', 'Hands-free crossbody bags', 'bags', 'bag', 3),
  ('Clutches', 'clutches', 'Evening clutches', 'bags', 'bag', 4),
  ('Backpacks', 'backpacks', 'Stylish backpacks', 'bags', 'bag', 5),
  ('Satchels', 'satchels', 'Structured satchels', 'bags', 'bag', 6),
  ('Hobo Bags', 'hobo-bags', 'Slouchy hobo bags', 'bags', 'bag', 7),
  ('Mini Bags', 'mini-bags', 'Compact mini bags', 'bags', 'bag', 8),
  ('Belt Bags', 'belt-bags', 'Trendy belt bags', 'bags', 'bag', 9)
ON CONFLICT (slug) DO NOTHING;

-- ─── STEP 6: MIGRATE EXISTING PRODUCTS ───────────────────────────
-- Categorize existing products based on keywords

-- Update products that are shoes
UPDATE products 
SET 
  product_type = 'shoe',
  category_id = (SELECT id FROM categories WHERE slug = 'heels' LIMIT 1),
  metadata = jsonb_build_object(
    'sizes', jsonb_build_array(
      jsonb_build_object('us', '6', 'eu', '36', 'uk', '3.5', 'stock_count', COALESCE(stock_count, 0)),
      jsonb_build_object('us', '7', 'eu', '37', 'uk', '4', 'stock_count', COALESCE(stock_count, 0)),
      jsonb_build_object('us', '8', 'eu', '38', 'uk', '5', 'stock_count', COALESCE(stock_count, 0)),
      jsonb_build_object('us', '9', 'eu', '39', 'uk', '6', 'stock_count', COALESCE(stock_count, 0)),
      jsonb_build_object('us', '10', 'eu', '40', 'uk', '7', 'stock_count', COALESCE(stock_count, 0))
    ),
    'color', 'Black',
    'material', jsonb_build_array('Leather'),
    'style', 'Heels',
    'occasion', jsonb_build_array('Work', 'Evening')
  )
WHERE 
  LOWER(name) LIKE '%shoe%' 
  OR LOWER(name) LIKE '%heel%' 
  OR LOWER(name) LIKE '%sneaker%' 
  OR LOWER(name) LIKE '%boot%' 
  OR LOWER(name) LIKE '%sandal%'
  OR LOWER(name) LIKE '%flat%'
  OR LOWER(name) LIKE '%mule%'
  OR category IN ('shoe');

-- Update products that are bags
UPDATE products 
SET 
  product_type = 'bag',
  category_id = (SELECT id FROM categories WHERE slug = 'shoulder-bags' LIMIT 1),
  metadata = jsonb_build_object(
    'dimensions', jsonb_build_object(
      'width', 30,
      'height', 25,
      'depth', 10
    ),
    'color', 'Black',
    'material', jsonb_build_array('Leather'),
    'style', 'Shoulder Bag',
    'occasion', jsonb_build_array('Work', 'Casual'),
    'strap_type', 'Adjustable',
    'closure_type', 'Zipper',
    'compartments', 3
  )
WHERE 
  LOWER(name) LIKE '%bag%' 
  OR LOWER(name) LIKE '%purse%' 
  OR LOWER(name) LIKE '%tote%' 
  OR LOWER(name) LIKE '%clutch%'
  OR LOWER(name) LIKE '%backpack%'
  OR LOWER(name) LIKE '%satchel%'
  OR category IN ('bag');

-- Set default product_type for remaining products
UPDATE products 
SET product_type = 'shoe',
    category_id = (SELECT id FROM categories WHERE slug = 'flats' LIMIT 1)
WHERE product_type IS NULL OR category_id IS NULL;

-- ─── STEP 7: UPDATE RLS POLICIES FOR CATEGORIES ──────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories" ON categories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_write_categories" ON categories 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ─── STEP 8: ADD WHATSAPP SETTINGS ───────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '+2348022705826'),
  ('whatsapp_enabled', 'true'),
  ('store_currency', '₦'),
  ('business_name', 'CLASSIQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ═══════════════════════════════════════════════════════════════
-- MIGRATION COMPLETE
-- ═══════════════════════════════════════════════════════════════
-- Next steps:
-- 1. Update frontend to use new product_type field
-- 2. Implement size selector for shoes
-- 3. Update product detail pages for shoes vs bags
-- 4. Add WhatsApp checkout integration
-- ═══════════════════════════════════════════════════════════════
