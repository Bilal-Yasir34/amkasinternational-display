import { supabase } from './supabase';
import type { Category, Collection, Product } from '@/types/database';

export const SAMPLE_CATEGORIES = [
  {
    name: 'Cotton & Linen Fabrics',
    slug: 'cotton-linen-fabrics',
    description: 'Premium long-staple Egyptian cotton, organic linen, poplin, and breathable weaves.',
    sort_order: 1,
    visible: true,
  },
  {
    name: 'Wool & Cashmere Weaves',
    slug: 'wool-cashmere-weaves',
    description: 'Luxury merino wools, cashmere blends, worsted suitings, and warm winter textiles.',
    sort_order: 2,
    visible: true,
  },
  {
    name: 'Silk & Jacquard',
    slug: 'silk-jacquard',
    description: 'Pure mulberry silk, intricate brocades, embroidered jacquards, and lustrous satins.',
    sort_order: 3,
    visible: true,
  },
  {
    name: 'Home & Upholstery Textiles',
    slug: 'home-upholstery-textiles',
    description: 'Durable velvet, heavyweight canvas, curtain drapes, and interior furnishing fabrics.',
    sort_order: 4,
    visible: true,
  },
  {
    name: 'Apparel & Denim',
    slug: 'apparel-denim',
    description: 'Raw selvedge denim, heavy twills, cozy flannels, and versatile garment textiles.',
    sort_order: 5,
    visible: true,
  },
];

export const SAMPLE_COLLECTIONS = [
  {
    name: 'Royal Silk & Brocade Series',
    slug: 'royal-silk-brocade-series',
    description: 'Opulent silk and brocade textiles crafted for haute couture, formal wear, and ceremonial garments.',
    cover_image: 'https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80',
    sort_order: 1,
    visible: true,
  },
  {
    name: 'Organic Cotton Essentials',
    slug: 'organic-cotton-essentials',
    description: 'Sustainably farmed, ultra-soft combed cottons and eco-certified linens engineered for comfort.',
    cover_image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    sort_order: 2,
    visible: true,
  },
  {
    name: 'Artisanal Handwoven Woolens',
    slug: 'artisanal-handwoven-woolens',
    description: 'Pure merino wool and cashmere fabrics hand-loomed by master artisans with traditional heritage techniques.',
    cover_image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80',
    sort_order: 3,
    visible: true,
  },
  {
    name: 'Heritage Jacquard Collection',
    slug: 'heritage-jacquard-collection',
    description: 'Intricately woven floral and geometric textured fabrics suitable for luxury apparel and statement drapes.',
    cover_image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    sort_order: 4,
    visible: true,
  },
];

export async function seedTextileData(): Promise<{ categories: number; collections: number; products: number }> {
  // 1. Upsert Categories
  const categoryMap = new Map<string, string>();
  for (const cat of SAMPLE_CATEGORIES) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' })
      .select()
      .single();
    if (error) throw error;
    if (data) categoryMap.set(data.slug, data.id);
  }

  // 2. Upsert Collections
  const collectionMap = new Map<string, string>();
  for (const col of SAMPLE_COLLECTIONS) {
    const { data, error } = await supabase
      .from('collections')
      .upsert(col, { onConflict: 'slug' })
      .select()
      .single();
    if (error) throw error;
    if (data) collectionMap.set(data.slug, data.id);
  }

  // 3. Prepare Products
  const sampleProducts = [
    {
      name: '600 TC Egyptian Cotton Satin',
      slug: '600-tc-egyptian-cotton-satin',
      short_description: 'Silky smooth 100% Giza Egyptian cotton fabric with a luminous sateen weave.',
      description:
        'Crafted from extra-long staple Giza Egyptian cotton, this 600 thread count sateen fabric provides exceptional softness and durability. Ideal for luxury bedding, dress shirts, and high-end lining.',
      category_id: categoryMap.get('cotton-linen-fabrics') ?? null,
      collection_id: collectionMap.get('organic-cotton-essentials') ?? null,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      featured_order: 1,
      visible: true,
      sort_order: 1,
      specs: {
        Material: '100% Giza Egyptian Cotton',
        GSM: '140 GSM',
        Width: '58/60 inches',
        Weave: 'Sateen',
        Finish: 'Mercerized',
      },
    },
    {
      name: 'Mulberry Silk Jacquard Weave',
      slug: 'mulberry-silk-jacquard-weave',
      short_description: 'Pure Mulberry silk featuring intricate woven motifs and a lustrous sheen.',
      description:
        'Woven from 100% pure Grade-6A Mulberry silk, this exquisite jacquard fabric features detailed embossed patterns with a subtle sheen. Perfect for evening wear, ties, luxury scarves, and haute couture.',
      category_id: categoryMap.get('silk-jacquard') ?? null,
      collection_id: collectionMap.get('royal-silk-brocade-series') ?? null,
      images: ['https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      featured_order: 2,
      visible: true,
      sort_order: 2,
      specs: {
        Material: '100% Mulberry Silk',
        Momme: '19 Momme',
        Width: '44 inches',
        Pattern: 'Woven Jacquard',
        Care: 'Dry Clean Only',
      },
    },
    {
      name: 'Artisanal Merino Wool Suiting',
      slug: 'artisanal-merino-wool-suiting',
      short_description: 'Super 130s Australian merino wool fabric designed for bespoke tailored suits.',
      description:
        'Woven from ultra-fine Super 130s Australian merino wool, this lightweight and wrinkle-resistant suiting fabric offers superior drape, breathability, and natural elasticity for year-round tailoring.',
      category_id: categoryMap.get('wool-cashmere-weaves') ?? null,
      collection_id: collectionMap.get('artisanal-handwoven-woolens') ?? null,
      images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      featured_order: 3,
      visible: true,
      sort_order: 3,
      specs: {
        Material: '100% Super 130s Merino Wool',
        GSM: '260 GSM',
        Width: '59 inches',
        Origin: 'Woven in Italy',
        Season: 'Four Season',
      },
    },
    {
      name: 'Heavyweight Upholstery Velvet',
      slug: 'heavyweight-upholstery-velvet',
      short_description: 'Rich cotton-blend velvet fabric engineered for curtains and high-end furniture.',
      description:
        'A dense, luxurious plush velvet fabric with 50,000+ Martindale rub count durability. Offers deep color richness and subtle shimmer, ideal for statement sofas, headboards, and drapery.',
      category_id: categoryMap.get('home-upholstery-textiles') ?? null,
      collection_id: collectionMap.get('heritage-jacquard-collection') ?? null,
      images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      featured_order: 4,
      visible: true,
      sort_order: 4,
      specs: {
        Material: '80% Cotton, 20% Polyester',
        GSM: '420 GSM',
        Width: '56 inches',
        Durability: '50,000 Martindale',
        Usage: 'Upholstery & Drapery',
      },
    },
    {
      name: 'Raw Selvedge Denim 14oz',
      slug: 'raw-selvedge-denim-14oz',
      short_description: 'Heavyweight unwashed indigo shuttle-loom denim fabric with iconic red selvedge ID.',
      description:
        'Authentic 14oz shuttle-loom raw denim dyed with pure indigo. Designed to develop unique honeycomb and whiskering fade characteristics over wear, suitable for premium jeans and jackets.',
      category_id: categoryMap.get('apparel-denim') ?? null,
      collection_id: collectionMap.get('heritage-jacquard-collection') ?? null,
      images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      featured_order: 5,
      visible: true,
      sort_order: 5,
      specs: {
        Material: '100% Ring-Spun Cotton',
        Weight: '14 oz/yd²',
        Edge: 'Red Selvedge ID',
        Dye: 'Pure Indigo Rope-Dyed',
        Shrinkage: '3-5% Unsanforized',
      },
    },
    {
      name: 'Pure Belgian Linen Weave',
      slug: 'pure-belgian-linen-weave',
      short_description: 'Natural slub textured flax linen for summer apparel and coastal home furnishings.',
      description:
        '100% eco-washed flax linen grown and woven in Western Europe. Naturally hypoallergenic, breathable, and pre-softened for effortless relaxed garments, tablecloths, and curtains.',
      category_id: categoryMap.get('cotton-linen-fabrics') ?? null,
      collection_id: collectionMap.get('organic-cotton-essentials') ?? null,
      images: ['https://images.unsplash.com/photo-1528458909336-e7a0adfac1d5?auto=format&fit=crop&w=1000&q=80'],
      featured: false,
      featured_order: 0,
      visible: true,
      sort_order: 6,
      specs: {
        Material: '100% European Flax Linen',
        GSM: '180 GSM',
        Width: '58 inches',
        Finish: 'Enzyme Stonewashed',
        Certification: 'OEKO-TEX Standard 100',
      },
    },
    {
      name: 'Cashmere Blend Twill Wrap Fabric',
      slug: 'cashmere-blend-twill-wrap-fabric',
      short_description: 'Ultra-soft cashmere and virgin wool blend for shawls, stoles, and overcoats.',
      description:
        'Combining 30% Grade-A Mongolian Cashmere with 70% fine virgin wool, this twill weave fabric delivers supreme warmth with a feather-light feel. Exceptional choice for luxury shawls and winter wraps.',
      category_id: categoryMap.get('wool-cashmere-weaves') ?? null,
      collection_id: collectionMap.get('artisanal-handwoven-woolens') ?? null,
      images: ['https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1000&q=80'],
      featured: false,
      featured_order: 0,
      visible: true,
      sort_order: 7,
      specs: {
        Material: '30% Cashmere, 70% Virgin Wool',
        GSM: '310 GSM',
        Width: '54 inches',
        Weave: '2/2 Twill',
        Touch: 'Ultra Soft Brushed',
      },
    },
    {
      name: 'Handcrafted Gold Brocade Silk',
      slug: 'handcrafted-gold-brocade-silk',
      short_description: 'Traditional metallic Zari embroidered silk fabric for bridal and festive outfits.',
      description:
        'Woven on traditional jacquard looms, this metallic gold Zari brocade features complex floral scrollwork across a rich ruby red silk warp. Designed for bridal couture and ceremonial vests.',
      category_id: categoryMap.get('silk-jacquard') ?? null,
      collection_id: collectionMap.get('royal-silk-brocade-series') ?? null,
      images: ['https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=1000&q=80'],
      featured: false,
      featured_order: 0,
      visible: true,
      sort_order: 8,
      specs: {
        Material: '70% Silk, 30% Metallic Zari Thread',
        GSM: '220 GSM',
        Width: '44 inches',
        Care: 'Specialist Dry Clean',
        Occasion: 'Bridal & Festive',
      },
    },
    {
      name: 'Heavyweight Duck Canvas Fabric',
      slug: 'heavyweight-duck-canvas-fabric',
      short_description: 'Rugged #10 double-fill cotton duck canvas for bags, aprons, and outdoor gear.',
      description:
        'Extremely tight plied-yarn cotton canvas engineered for heavy-duty applications. Offers high tear resistance, water resistance treatment suitability, and vintage workwear aesthetics.',
      category_id: categoryMap.get('home-upholstery-textiles') ?? null,
      collection_id: collectionMap.get('heritage-jacquard-collection') ?? null,
      images: ['https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80'],
      featured: false,
      featured_order: 0,
      visible: true,
      sort_order: 9,
      specs: {
        Material: '100% Heavy Cotton Duck',
        Weight: '14.7 oz/yd²',
        Width: '60 inches',
        Weave: '#10 Double-Fill Plain',
        Usage: 'Workwear & Gear',
      },
    },
    {
      name: 'Brushed Cotton Flannel',
      slug: 'brushed-cotton-flannel',
      short_description: 'Double-brushed soft cotton plaid fabric for autumn shirts and loungewear.',
      description:
        'Made from 100% yarn-dyed cotton and double brushed on both sides for maximum loft and warmth. Features classic tartan plaid patterns with high wash colorfastness.',
      category_id: categoryMap.get('apparel-denim') ?? null,
      collection_id: collectionMap.get('organic-cotton-essentials') ?? null,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'],
      featured: false,
      featured_order: 0,
      visible: true,
      sort_order: 10,
      specs: {
        Material: '100% Yarn-Dyed Cotton',
        GSM: '175 GSM',
        Width: '58 inches',
        Finish: 'Double Side Napped',
        Pattern: 'Tartan Plaid',
      },
    },
  ];

  let pCount = 0;
  for (const prod of sampleProducts) {
    const { error } = await supabase.from('products').upsert(prod, { onConflict: 'slug' });
    if (error) throw error;
    pCount++;
  }

  return {
    categories: SAMPLE_CATEGORIES.length,
    collections: SAMPLE_COLLECTIONS.length,
    products: pCount,
  };
}

export async function clearAllCatalogData(): Promise<void> {
  // Delete all products, collections, categories (foreign keys cascade or set null)
  const { error: pErr } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (pErr) throw pErr;

  const { error: cErr } = await supabase.from('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (cErr) throw cErr;

  const { error: catErr } = await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (catErr) throw catErr;
}
