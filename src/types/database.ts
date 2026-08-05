export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductSpecs = Record<string, string>;

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  collection_id: string | null;
  images: string[];
  featured: boolean;
  featured_order: number;
  visible: boolean;
  sort_order: number;
  specs: ProductSpecs;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  collection?: Collection | null;
};

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: string;
};

export type SiteSettings = {
  id: number;
  company_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  updated_at: string;
};

export type Homepage = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string | null;
  hero_button1_text: string;
  hero_button1_link: string;
  hero_button2_text: string;
  hero_button2_link: string;
  intro_title: string;
  intro_body: string | null;
  mission: string | null;
  vision: string | null;
  years_experience: number;
  export_markets: string | null;
  why_choose_us: WhyChooseItem[];
  show_featured: boolean;
  show_collections: boolean;
  show_why_choose: boolean;
  show_company_info: boolean;
  updated_at: string;
};

export type CompanyInfo = {
  id: number;
  company_name: string;
  registration_info: string | null;
  nature_of_business: string | null;
  established_year: number | null;
  export_markets: string | null;
  ceo_director: string | null;
  business_hours: string | null;
  updated_at: string;
};

export type ContactInfo = {
  id: number;
  phone1: string | null;
  phone2: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  business_hours: string | null;
  updated_at: string;
};

export type BankDetails = {
  id: number;
  bank_name: string | null;
  account_title: string | null;
  account_number: string | null;
  iban: string | null;
  swift_code: string | null;
  branch_name: string | null;
  show_bank_name: boolean;
  show_account_title: boolean;
  show_account_number: boolean;
  show_iban: boolean;
  show_swift_code: boolean;
  show_branch_name: boolean;
  updated_at: string;
};

export type MediaItem = {
  id: string;
  name: string;
  path: string;
  folder: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  alt: string | null;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string;
  product_id: string | null;
  status: string;
  created_at: string;
};

export type TableName =
  | 'categories'
  | 'collections'
  | 'products'
  | 'site_settings'
  | 'homepage'
  | 'company_info'
  | 'contact_info'
  | 'bank_details'
  | 'media'
  | 'inquiries';
