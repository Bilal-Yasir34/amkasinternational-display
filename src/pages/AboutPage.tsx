import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import WhoWeAre from '@/components/WhoWeAre';
import WhyChooseUs from '@/components/WhyChooseUs';
import CompanyInformation from '@/components/CompanyInformation';
import BankDetailsCard from '@/components/BankDetailsCard';
import {
  WhyChooseUsSkeleton,
  CompanyInfoSkeleton,
  BankDetailsSkeleton,
} from '@/components/Skeletons';
import { fetchHomepage, fetchCompanyInfo, fetchBankDetails } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { Homepage, CompanyInfo, BankDetails, SiteSettings, ContactInfo } from '@/types/database';

export default function AboutPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchHomepage(), fetchCompanyInfo(), fetchBankDetails()])
      .then(([h, c, b]) => {
        setHomepage(h);
        setCompany(c);
        setBank(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useSeo({
    title: `About — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}`,
    description: 'Learn about AMKAS INTERNATIONAL — our mission, vision, history and global export reach.',
    canonical: window.location.href,
  });

  return (
    <div className="pt-16 lg:pt-20">
      <section className="border-b border-ink-100 bg-beige-50 py-14">
        <div className="container-px">
          <p className="eyebrow mb-3">About Us</p>
          <h1 className="section-title">A Trusted Name in Premium Textiles</h1>
        </div>
      </section>
      <WhoWeAre homepage={homepage} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container-px py-8"
      >
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-950 p-8 text-center text-white sm:p-12">
          <p className="font-serif text-2xl leading-relaxed text-white/90 sm:text-3xl">
            “{homepage?.mission ?? 'To deliver textiles of uncompromising quality that earn the lasting trust of buyers worldwide.'}”
          </p>
          <p className="mt-4 text-sm uppercase tracking-wider text-gold-400">Our Mission</p>
        </div>
      </motion.div>

      {loading ? (
        <>
          <WhyChooseUsSkeleton />
          <CompanyInfoSkeleton />
          <BankDetailsSkeleton />
        </>
      ) : (
        <>
          <WhyChooseUs homepage={homepage} />
          <CompanyInformation info={company} />
          <BankDetailsCard bank={bank} />
        </>
      )}
    </div>
  );
}
