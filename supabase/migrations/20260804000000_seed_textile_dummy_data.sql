-- Textile Dummy Data Seed Migration
-- Adds initial categories, collections, and products for AMKAS INTERNATIONAL

-- 1. Insert Categories
INSERT INTO categories (name, slug, description, sort_order, visible)
VALUES 
  ('Cotton & Linen Fabrics', 'cotton-linen-fabrics', 'Premium long-staple Egyptian cotton, organic linen, poplin, and breathable weaves.', 1, true),
  ('Wool & Cashmere Weaves', 'wool-cashmere-weaves', 'Luxury merino wools, cashmere blends, worsted suitings, and warm winter textiles.', 2, true),
  ('Silk & Jacquard', 'silk-jacquard', 'Pure mulberry silk, intricate brocades, embroidered jacquards, and lustrous satins.', 3, true),
  ('Home & Upholstery Textiles', 'home-upholstery-textiles', 'Durable velvet, heavyweight canvas, curtain drapes, and interior furnishing fabrics.', 4, true),
  ('Apparel & Denim', 'apparel-denim', 'Raw selvedge denim, heavy twills, cozy flannels, and versatile garment textiles.', 5, true)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. Insert Collections
INSERT INTO collections (name, slug, description, cover_image, sort_order, visible)
VALUES 
  (
    'Royal Silk & Brocade Series', 
    'royal-silk-brocade-series', 
    'Opulent silk and brocade textiles crafted for haute couture, formal wear, and ceremonial garments.', 
    'https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80', 
    1, 
    true
  ),
  (
    'Organic Cotton Essentials', 
    'organic-cotton-essentials', 
    'Sustainably farmed, ultra-soft combed cottons and eco-certified linens engineered for comfort.', 
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80', 
    2, 
    true
  ),
  (
    'Artisanal Handwoven Woolens', 
    'artisanal-handwoven-woolens', 
    'Pure merino wool and cashmere fabrics hand-loomed by master artisans with traditional heritage techniques.', 
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80', 
    3, 
    true
  ),
  (
    'Heritage Jacquard Collection', 
    'heritage-jacquard-collection', 
    'Intricately woven floral and geometric textured fabrics suitable for luxury apparel and statement drapes.', 
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', 
    4, 
    true
  )
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cover_image = EXCLUDED.cover_image;

-- 3. Insert Products
DO $$
DECLARE
  cat_cotton uuid;
  cat_wool uuid;
  cat_silk uuid;
  cat_home uuid;
  cat_denim uuid;

  col_silk uuid;
  col_cotton uuid;
  col_wool uuid;
  col_jacquard uuid;
BEGIN
  SELECT id INTO cat_cotton FROM categories WHERE slug = 'cotton-linen-fabrics';
  SELECT id INTO cat_wool FROM categories WHERE slug = 'wool-cashmere-weaves';
  SELECT id INTO cat_silk FROM categories WHERE slug = 'silk-jacquard';
  SELECT id INTO cat_home FROM categories WHERE slug = 'home-upholstery-textiles';
  SELECT id INTO cat_denim FROM categories WHERE slug = 'apparel-denim';

  SELECT id INTO col_silk FROM collections WHERE slug = 'royal-silk-brocade-series';
  SELECT id INTO col_cotton FROM collections WHERE slug = 'organic-cotton-essentials';
  SELECT id INTO col_wool FROM collections WHERE slug = 'artisanal-handwoven-woolens';
  SELECT id INTO col_jacquard FROM collections WHERE slug = 'heritage-jacquard-collection';

  INSERT INTO products (name, slug, short_description, description, category_id, collection_id, images, featured, featured_order, visible, sort_order, specs)
  VALUES
    (
      '600 TC Egyptian Cotton Satin',
      '600-tc-egyptian-cotton-satin',
      'Silky smooth 100% Giza Egyptian cotton fabric with a luminous sateen weave.',
      'Crafted from extra-long staple Giza Egyptian cotton, this 600 thread count sateen fabric provides exceptional softness and durability. Ideal for luxury bedding, dress shirts, and high-end lining.',
      cat_cotton,
      col_cotton,
      ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'],
      true,
      1,
      true,
      1,
      '{"Material": "100% Giza Egyptian Cotton", "GSM": "140 GSM", "Width": "58/60 inches", "Weave": "Sateen", "Finish": "Mercerized"}'::jsonb
    ),
    (
      'Mulberry Silk Jacquard Weave',
      'mulberry-silk-jacquard-weave',
      'Pure Mulberry silk featuring intricate woven motifs and a lustrous sheen.',
      'Woven from 100% pure Grade-6A Mulberry silk, this exquisite jacquard fabric features detailed embossed patterns with a subtle sheen. Perfect for evening wear, ties, luxury scarves, and haute couture.',
      cat_silk,
      col_silk,
      ARRAY['https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80'],
      true,
      2,
      true,
      2,
      '{"Material": "100% Mulberry Silk", "Momme": "19 Momme", "Width": "44 inches", "Pattern": "Woven Jacquard", "Care": "Dry Clean Only"}'::jsonb
    ),
    (
      'Artisanal Merino Wool Suiting',
      'artisanal-merino-wool-suiting',
      'Super 130s Australian merino wool fabric designed for bespoke tailored suits.',
      'Woven from ultra-fine Super 130s Australian merino wool, this lightweight and wrinkle-resistant suiting fabric offers superior drape, breathability, and natural elasticity for year-round tailoring.',
      cat_wool,
      col_wool,
      ARRAY['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80'],
      true,
      3,
      true,
      3,
      '{"Material": "100% Super 130s Merino Wool", "GSM": "260 GSM", "Width": "59 inches", "Origin": "Woven in Italy", "Season": "Four Season"}'::jsonb
    ),
    (
      'Heavyweight Upholstery Velvet',
      'heavyweight-upholstery-velvet',
      'Rich cotton-blend velvet fabric engineered for curtains and high-end furniture.',
      'A dense, luxurious plush velvet fabric with 50,000+ Martindale rub count durability. Offers deep color richness and subtle shimmer, ideal for statement sofas, headboards, and drapery.',
      cat_home,
      col_jacquard,
      ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'],
      true,
      4,
      true,
      4,
      '{"Material": "80% Cotton, 20% Polyester", "GSM": "420 GSM", "Width": "56 inches", "Durability": "50,000 Martindale", "Usage": "Upholstery & Drapery"}'::jsonb
    ),
    (
      'Raw Selvedge Denim 14oz',
      'raw-selvedge-denim-14oz',
      'Heavyweight unwashed indigo shuttle-loom denim fabric with iconic red selvedge ID.',
      'Authentic 14oz shuttle-loom raw denim dyed with pure indigo. Designed to develop unique honeycomb and whiskering fade characteristics over wear, suitable for premium jeans and jackets.',
      cat_denim,
      col_jacquard,
      ARRAY['https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'],
      true,
      5,
      true,
      5,
      '{"Material": "100% Ring-Spun Cotton", "Weight": "14 oz/yd²", "Edge": "Red Selvedge ID", "Dye": "Pure Indigo Rope-Dyed", "Shrinkage": "3-5% Unsanforized"}'::jsonb
    ),
    (
      'Pure Belgian Linen Weave',
      'pure-belgian-linen-weave',
      'Natural slub textured flax linen for summer apparel and coastal home furnishings.',
      '100% eco-washed flax linen grown and woven in Western Europe. Naturally hypoallergenic, breathable, and pre-softened for effortless relaxed garments, tablecloths, and curtains.',
      cat_cotton,
      col_cotton,
      ARRAY['https://images.unsplash.com/photo-1528458909336-e7a0adfac1d5?auto=format&fit=crop&w=1000&q=80'],
      false,
      0,
      true,
      6,
      '{"Material": "100% European Flax Linen", "GSM": "180 GSM", "Width": "58 inches", "Finish": "Enzyme Stonewashed", "Certification": "OEKO-TEX Standard 100"}'::jsonb
    ),
    (
      'Cashmere Blend Twill Wrap Fabric',
      'cashmere-blend-twill-wrap-fabric',
      'Ultra-soft cashmere and virgin wool blend for shawls, stoles, and overcoats.',
      'Combining 30% Grade-A Mongolian Cashmere with 70% fine virgin wool, this twill weave fabric delivers supreme warmth with a feather-light feel. Exceptional choice for luxury shawls and winter wraps.',
      cat_wool,
      col_wool,
      ARRAY['https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1000&q=80'],
      false,
      0,
      true,
      7,
      '{"Material": "30% Cashmere, 70% Virgin Wool", "GSM": "310 GSM", "Width": "54 inches", "Weave": "2/2 Twill", "Touch": "Ultra Soft Brushed"}'::jsonb
    ),
    (
      'Handcrafted Gold Brocade Silk',
      'handcrafted-gold-brocade-silk',
      'Traditional metallic Zari embroidered silk fabric for bridal and festive outfits.',
      'Woven on traditional jacquard looms, this metallic gold Zari brocade features complex floral scrollwork across a rich ruby red silk warp. Designed for bridal couture and ceremonial vests.',
      cat_silk,
      col_silk,
      ARRAY['https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80'],
      false,
      0,
      true,
      8,
      '{"Material": "70% Silk, 30% Metallic Zari Thread", "GSM": "220 GSM", "Width": "44 inches", "Care": "Specialist Dry Clean", "Occasion": "Bridal & Festive"}'::jsonb
    ),
    (
      'Heavyweight Duck Canvas Fabric',
      'heavyweight-duck-canvas-fabric',
      'Rugged #10 double-fill cotton duck canvas for bags, aprons, and outdoor gear.',
      'Extremely tight plied-yarn cotton canvas engineered for heavy-duty applications. Offers high tear resistance, water resistance treatment suitability, and vintage workwear aesthetics.',
      cat_home,
      col_jacquard,
      ARRAY['https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80'],
      false,
      0,
      true,
      9,
      '{"Material": "100% Heavy Cotton Duck", "Weight": "14.7 oz/yd²", "Width": "60 inches", "Weave": "#10 Double-Fill Plain", "Usage": "Workwear & Gear"}'::jsonb
    ),
    (
      'Brushed Cotton Flannel',
      'brushed-cotton-flannel',
      'Double-brushed soft cotton plaid fabric for autumn shirts and loungewear.',
      'Made from 100% yarn-dyed cotton and double brushed on both sides for maximum loft and warmth. Features classic tartan plaid patterns with high wash colorfastness.',
      cat_denim,
      col_cotton,
      ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'],
      false,
      0,
      true,
      10,
      '{"Material": "100% Yarn-Dyed Cotton", "GSM": "175 GSM", "Width": "58 inches", "Finish": "Double Side Napped", "Pattern": "Tartan Plaid"}'::jsonb
    )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    specs = EXCLUDED.specs;
END $$;
