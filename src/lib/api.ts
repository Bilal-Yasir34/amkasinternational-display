import { supabase } from './supabase';
import type {
  Category,
  Collection,
  Product,
  SiteSettings,
  Homepage,
  CompanyInfo,
  ContactInfo,
  BankDetails,
  MediaItem,
  Inquiry,
} from '@/types/database';

// ---------- Categories ----------
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertCategory(cat: Partial<Category>): Promise<Category> {
  const { id, ...rest } = cat;
  if (id) {
    const { data, error } = await supabase.from('categories').update(rest).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from('categories').insert(rest).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Collections ----------
export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase.from('collections').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertCollection(col: Partial<Collection>): Promise<Collection> {
  const { id, ...rest } = col;
  if (id) {
    const { data, error } = await supabase.from('collections').update(rest).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from('collections').insert(rest).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Products ----------
export async function fetchProducts(opts?: {
  categorySlug?: string;
  collectionSlug?: string;
  search?: string;
}): Promise<Product[]> {
  const catSelect = opts?.categorySlug ? 'category:categories!inner(*)' : 'category:categories(*)';
  const colSelect = opts?.collectionSlug ? 'collection:collections!inner(*)' : 'collection:collections(*)';

  let q = supabase
    .from('products')
    .select(`*, ${catSelect}, ${colSelect}`)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (opts?.categorySlug) {
    q = q.eq('category.slug', opts.categorySlug);
  }
  if (opts?.collectionSlug) {
    q = q.eq('collection.slug', opts.collectionSlug);
  }

  const { data, error } = await q;
  if (error) throw error;
  let rows = data ?? [];
  if (opts?.search) {
    const s = opts.search.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.short_description ?? '').toLowerCase().includes(s) ||
        (p.category?.name ?? '').toLowerCase().includes(s) ||
        (p.collection?.name ?? '').toLowerCase().includes(s),
    );
  }
  return rows;
}

export async function fetchAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), collection:collections(*)')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), collection:collections(*)')
    .eq('featured', true)
    .eq('visible', true)
    .order('featured_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertProduct(p: Partial<Product>): Promise<Product> {
  const { id, category, collection, ...rest } = p;
  const payload: Record<string, any> = { ...rest };

  if (p.category_id !== undefined) {
    payload.category_id = p.category_id || null;
  }
  if (p.collection_id !== undefined) {
    payload.collection_id = p.collection_id || null;
  }
  if (p.specs !== undefined) {
    payload.specs = p.specs ?? {};
  }

  if (id) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('*, category:categories(*), collection:collections(*)')
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select('*, category:categories(*), collection:collections(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Singleton Default Fallbacks ----------
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  company_name: 'AMKAS INTERNATIONAL',
  logo_url: null,
  favicon_url: null,
  primary_color: '#18181c',
  secondary_color: '#c2922f',
  footer_text: 'AMKAS INTERNATIONAL — Premium Textile Exporters',
  seo_title: 'AMKAS INTERNATIONAL — Premium Textile Exporters',
  seo_description: 'Trusted textile exporters delivering premium fabrics worldwide.',
  seo_keywords: 'textile, fabric, cotton, silk, wool, export, amkas',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  social_twitter: '',
  updated_at: new Date().toISOString(),
};

const DEFAULT_HOMEPAGE: Homepage = {
  id: 1,
  hero_title: 'Trusted Textile Exporters Delivering Premium Fabrics Worldwide',
  hero_subtitle: 'AMKAS INTERNATIONAL crafts and exports premium shawls, wool, cotton and luxury fabrics to discerning markets across the globe.',
  hero_image: null,
  hero_button1_text: 'Explore Products',
  hero_button1_link: '/products',
  hero_button2_text: 'Contact Us',
  hero_button2_link: '/contact',
  intro_title: 'Who We Are',
  intro_body: 'AMKAS INTERNATIONAL is a premier textile manufacturer and exporter supplying fine fabrics across international markets.',
  mission: 'To deliver world-class textiles with uncompromising quality, innovation, and integrity.',
  vision: 'To be the global benchmark in sustainable luxury textile manufacturing and export.',
  years_experience: 15,
  export_markets: 'Europe, Middle East, North America, Asia-Pacific',
  why_choose_us: [
    { title: 'Uncompromising Quality', description: 'Rigorous quality control at every stage of textile production.', icon: 'ShieldCheck' },
    { title: 'Global Export Reach', description: 'Efficient logistics and customs clearance worldwide.', icon: 'Globe' },
    { title: 'Sustainable Craftsmanship', description: 'Eco-certified dyes and responsibly sourced natural fibers.', icon: 'Leaf' },
  ],
  show_featured: true,
  show_collections: true,
  show_why_choose: true,
  show_company_info: true,
  updated_at: new Date().toISOString(),
};

const DEFAULT_COMPANY_INFO: CompanyInfo = {
  id: 1,
  company_name: 'AMKAS INTERNATIONAL',
  registration_info: '',
  nature_of_business: 'Textile Manufacturing & Export',
  established_year: 2010,
  export_markets: 'Worldwide',
  ceo_director: '',
  business_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  updated_at: new Date().toISOString(),
};

const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: 1,
  phone1: '+92 301 8621370',
  phone2: '+92 301 8621370',
  whatsapp: '+923018621370',
  email: 'amkas_inter@hotmail.com',
  address: 'Pakistan',
  map_url: '',
  business_hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  updated_at: new Date().toISOString(),
};

const DEFAULT_BANK_DETAILS: BankDetails = {
  id: 1,
  bank_name: '',
  account_title: '',
  account_number: '',
  iban: '',
  swift_code: '',
  branch_name: '',
  show_bank_name: true,
  show_account_title: true,
  show_account_number: true,
  show_iban: true,
  show_swift_code: true,
  show_branch_name: true,
  updated_at: new Date().toISOString(),
};

// ---------- Singletons API ----------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_SITE_SETTINGS;
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const payload = { ...DEFAULT_SITE_SETTINGS, ...patch, id: 1 };
  const { data, error } = await supabase.from('site_settings').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function fetchHomepage(): Promise<Homepage> {
  const { data, error } = await supabase.from('homepage').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_HOMEPAGE;
}

export async function updateHomepage(patch: Partial<Homepage>): Promise<Homepage> {
  const payload = { ...DEFAULT_HOMEPAGE, ...patch, id: 1 };
  const { data, error } = await supabase.from('homepage').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const { data, error } = await supabase.from('company_info').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_COMPANY_INFO;
}

export async function updateCompanyInfo(patch: Partial<CompanyInfo>): Promise<CompanyInfo> {
  const payload = { ...DEFAULT_COMPANY_INFO, ...patch, id: 1 };
  const { data, error } = await supabase.from('company_info').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function fetchContactInfo(): Promise<ContactInfo> {
  const { data, error } = await supabase.from('contact_info').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_CONTACT_INFO;
}

export async function updateContactInfo(patch: Partial<ContactInfo>): Promise<ContactInfo> {
  const payload = { ...DEFAULT_CONTACT_INFO, ...patch, id: 1 };
  const { data, error } = await supabase.from('contact_info').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function fetchBankDetails(): Promise<BankDetails> {
  const { data, error } = await supabase.from('bank_details').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_BANK_DETAILS;
}

export async function updateBankDetails(patch: Partial<BankDetails>): Promise<BankDetails> {
  const payload = { ...DEFAULT_BANK_DETAILS, ...patch, id: 1 };
  const { data, error } = await supabase.from('bank_details').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

// ---------- Media ----------
export async function fetchMedia(folder?: string): Promise<MediaItem[]> {
  let q = supabase.from('media').select('*').order('created_at', { ascending: false });
  if (folder && folder !== 'all') q = q.eq('folder', folder);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function deleteMedia(id: string, path: string): Promise<void> {
  const { error: dbErr } = await supabase.from('media').delete().eq('id', id);
  if (dbErr) throw dbErr;
  const pathParts = path.split(`/${MEDIA_BUCKET}/`)[1];
  if (pathParts) {
    await supabase.storage.from(MEDIA_BUCKET).remove([pathParts]);
  }
}

export async function renameMedia(id: string, name: string, alt: string): Promise<void> {
  const { error } = await supabase.from('media').update({ name, alt }).eq('id', id);
  if (error) throw error;
}

// ---------- Inquiries ----------
export async function createInquiry(payload: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('inquiries').insert(payload);
  if (error) throw error;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, product:products(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateInquiryStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}

import { MEDIA_BUCKET } from './supabase';
