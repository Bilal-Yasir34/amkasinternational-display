import { useEffect, useState } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchBankDetails, updateBankDetails } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { BankDetails } from '@/types/database';

export default function AdminBank() {
  const toast = useToast();
  const [data, setData] = useState<BankDetails | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBankDetails().then(setData).catch(() => toast('Failed to load', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await updateBankDetails(data);
      toast('Bank details saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="skeleton h-96 rounded-3xl" />;

  const fields: { key: keyof BankDetails; label: string }[] = [
    { key: 'bank_name', label: 'Bank Name' },
    { key: 'account_title', label: 'Account Title' },
    { key: 'account_number', label: 'Account Number' },
    { key: 'iban', label: 'IBAN' },
    { key: 'swift_code', label: 'SWIFT Code' },
    { key: 'branch_name', label: 'Branch Name' },
  ];
  const visibilityKeys: Record<string, keyof BankDetails> = {
    bank_name: 'show_bank_name',
    account_title: 'show_account_title',
    account_number: 'show_account_number',
    iban: 'show_iban',
    swift_code: 'show_swift_code',
    branch_name: 'show_branch_name',
  };

  return (
    <form onSubmit={save}>
      <AdminHeader title="Bank Details" subtitle="Bank information shown on the About page. Toggle each field's visibility." action={<SaveButton saving={saving} />} />
      <AdminCard>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <Field label={f.label}>
                <input value={(data[f.key] as string) ?? ''} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="input" />
              </Field>
              <label className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                <input
                  type="checkbox"
                  checked={data[visibilityKeys[f.key]] as boolean}
                  onChange={(e) => setData({ ...data, [visibilityKeys[f.key]]: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-ink-300"
                />
                Show on website
              </label>
            </div>
          ))}
        </div>
      </AdminCard>
    </form>
  );
}
