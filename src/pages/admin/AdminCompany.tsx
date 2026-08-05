import { useEffect, useState } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchCompanyInfo, updateCompanyInfo } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { CompanyInfo } from '@/types/database';

export default function AdminCompany() {
  const toast = useToast();
  const [data, setData] = useState<CompanyInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyInfo().then(setData).catch(() => toast('Failed to load', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await updateCompanyInfo(data);
      toast('Company information saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="skeleton h-96 rounded-3xl" />;

  return (
    <form onSubmit={save}>
      <AdminHeader title="Company Information" subtitle="Editable company details shown on the About page." action={<SaveButton saving={saving} />} />
      <AdminCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company Name"><input value={data.company_name} onChange={(e) => setData({ ...data, company_name: e.target.value })} className="input" /></Field>
          <Field label="Established Year"><input type="number" value={data.established_year ?? ''} onChange={(e) => setData({ ...data, established_year: e.target.value ? Number(e.target.value) : null })} className="input" /></Field>
          <Field label="Registration Information"><input value={data.registration_info ?? ''} onChange={(e) => setData({ ...data, registration_info: e.target.value })} className="input" /></Field>
          <Field label="Nature of Business"><input value={data.nature_of_business ?? ''} onChange={(e) => setData({ ...data, nature_of_business: e.target.value })} className="input" /></Field>
          <Field label="Export Markets"><input value={data.export_markets ?? ''} onChange={(e) => setData({ ...data, export_markets: e.target.value })} className="input" /></Field>
          <Field label="CEO / Director"><input value={data.ceo_director ?? ''} onChange={(e) => setData({ ...data, ceo_director: e.target.value })} className="input" /></Field>
          <Field label="Business Hours"><input value={data.business_hours ?? ''} onChange={(e) => setData({ ...data, business_hours: e.target.value })} className="input" /></Field>
        </div>
      </AdminCard>
    </form>
  );
}
