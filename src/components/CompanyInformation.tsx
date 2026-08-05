import { motion } from 'framer-motion';
import { Building2, FileText, Briefcase, Calendar, Globe2, User, Clock } from 'lucide-react';
import type { CompanyInfo } from '@/types/database';

export default function CompanyInformation({ info }: { info: CompanyInfo | null }) {
  const rows = [
    { icon: Building2, label: 'Company Name', value: info?.company_name ?? 'AMKAS INTERNATIONAL' },
    { icon: FileText, label: 'Registration Information', value: info?.registration_info },
    { icon: Briefcase, label: 'Nature of Business', value: info?.nature_of_business ?? 'Textile Manufacturing & Export' },
    { icon: Calendar, label: 'Established Year', value: info?.established_year ? String(info.established_year) : '2010' },
    { icon: Globe2, label: 'Export Markets', value: info?.export_markets ?? 'Worldwide' },
    { icon: User, label: 'CEO / Director', value: info?.ceo_director },
    { icon: Clock, label: 'Business Hours', value: info?.business_hours ?? 'Mon - Fri: 9:00 AM - 6:00 PM' },
  ].filter((r) => r.value);

  if (rows.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow mb-3">Company Information</p>
          <h2 className="section-title">Who We Are, In Detail</h2>
        </div>
        <div className="mx-auto max-w-4xl">
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card divide-y divide-ink-100 overflow-hidden"
          >
            {rows.map((r) => (
              <div key={r.label} className="flex items-start gap-4 p-5 sm:p-6">
                <div className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <r.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">{r.label}</dt>
                  <dd className="mt-0.5 text-sm text-ink-800 sm:text-base">{r.value}</dd>
                </div>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
