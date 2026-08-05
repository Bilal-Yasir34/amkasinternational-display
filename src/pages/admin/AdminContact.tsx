import { useEffect, useState } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchContactInfo, updateContactInfo } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { ContactInfo } from '@/types/database';

export default function AdminContact() {
  const toast = useToast();
  const [data, setData] = useState<ContactInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo().then(setData).catch(() => toast('Failed to load', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await updateContactInfo(data);
      toast('Contact information saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="skeleton h-96 rounded-3xl" />;

  return (
    <form onSubmit={save}>
      <AdminHeader title="Contact Information" subtitle="Phone, email, address, map and business hours." action={<SaveButton saving={saving} />} />
      <AdminCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone 1"><input value={data.phone1 ?? ''} onChange={(e) => setData({ ...data, phone1: e.target.value })} className="input" /></Field>
          <Field label="Phone 2"><input value={data.phone2 ?? ''} onChange={(e) => setData({ ...data, phone2: e.target.value })} className="input" /></Field>
          <Field label="WhatsApp"><input value={data.whatsapp ?? ''} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} className="input" /></Field>
          <Field label="Email"><input value={data.email ?? ''} onChange={(e) => setData({ ...data, email: e.target.value })} className="input" /></Field>
          <Field label="Address"><input value={data.address ?? ''} onChange={(e) => setData({ ...data, address: e.target.value })} className="input" /></Field>
          <Field label="Business Hours"><input value={data.business_hours ?? ''} onChange={(e) => setData({ ...data, business_hours: e.target.value })} className="input" /></Field>
          <div className="sm:col-span-2">
            <Field label="Google Maps Embed URL" hint="Paste the src URL from Google Maps embed code.">
              <input value={data.map_url ?? ''} onChange={(e) => setData({ ...data, map_url: e.target.value })} className="input" />
            </Field>
          </div>
        </div>
      </AdminCard>
    </form>
  );
}
