import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '@/components/Hero';
import WhoWeAre from '@/components/WhoWeAre';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CollectionsGrid from '@/components/CollectionsGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import CompanyInformation from '@/components/CompanyInformation';
import ProductModal from '@/components/ProductModal';
import {
  FeaturedCarouselSkeleton,
  CollectionsGridSkeleton,
  WhyChooseUsSkeleton,
  CompanyInfoSkeleton,
} from '@/components/Skeletons';
import { fetchHomepage, fetchFeaturedProducts, fetchCollections, fetchCompanyInfo } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { Homepage, Product, Collection, CompanyInfo, SiteSettings, ContactInfo } from '@/types/database';

export default function HomePage() {
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([
      fetchHomepage(),
      fetchFeaturedProducts(),
      fetchCollections(),
      fetchCompanyInfo(),
    ])
      .then(([h, f, c, ci]) => {
        setHomepage(h);
        setFeatured(f);
        setCollections(c.filter((x) => x.visible));
        setCompany(ci);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useSeo({
    title: settings?.seo_title ?? 'AMKAS INTERNATIONAL — Premium Textile Exporters',
    description: settings?.seo_description ?? 'Trusted textile exporters delivering premium fabrics worldwide.',
    image: homepage?.hero_image ?? undefined,
    canonical: window.location.href,
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings?.company_name ?? 'AMKAS INTERNATIONAL',
      description: settings?.seo_description ?? '',
      url: window.location.origin,
    },
  });

  const showFeatured = homepage ? homepage.show_featured : true;
  const showCollections = homepage ? homepage.show_collections : true;
  const showWhyChoose = homepage ? homepage.show_why_choose : true;
  const showCompanyInfo = homepage ? homepage.show_company_info : true;

  return (
    <>
      <Hero homepage={homepage} />
      <WhoWeAre homepage={homepage} />
      
      {loading ? (
        <>
          <FeaturedCarouselSkeleton />
          <CollectionsGridSkeleton />
          <WhyChooseUsSkeleton />
          <CompanyInfoSkeleton />
        </>
      ) : (
        <>
          {showFeatured && <FeaturedCarousel products={featured} onSelect={setSelected} />}
          {showCollections && <CollectionsGrid collections={collections} />}
          {showWhyChoose && <WhyChooseUs homepage={homepage} />}
          {showCompanyInfo && <CompanyInformation info={company} />}
        </>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
