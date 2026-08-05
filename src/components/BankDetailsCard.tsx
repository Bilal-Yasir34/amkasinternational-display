import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Copy, Check } from 'lucide-react';
import type { BankDetails } from '@/types/database';

export default function BankDetailsCard({ bank }: { bank: BankDetails | null }) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!bank) return null;

  const fields: { key: string; label: string; value: string | null; show: boolean }[] = [
    { key: 'bank_name', label: 'Bank Name', value: bank.bank_name, show: bank.show_bank_name },
    { key: 'account_title', label: 'Account Title', value: bank.account_title, show: bank.show_account_title },
    { key: 'account_number', label: 'Account Number', value: bank.account_number, show: bank.show_account_number },
    { key: 'iban', label: 'IBAN', value: bank.iban, show: bank.show_iban },
    { key: 'swift_code', label: 'SWIFT Code', value: bank.swift_code, show: bank.show_swift_code },
    { key: 'branch_name', label: 'Branch Name', value: bank.branch_name, show: bank.show_branch_name },
  ].filter((f) => f.show && f.value);

  if (fields.length === 0) return null;

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <section className="bg-beige-50 py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow mb-3">Bank Details</p>
          <h2 className="section-title">Payment Information</h2>
          <p className="mt-4 text-ink-600">Use the details below for wire transfers. Tap any field to copy.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-6 py-4">
              <Landmark className="h-5 w-5 text-gold-600" />
              <h3 className="font-serif text-lg font-medium text-ink-900">Bank Account Details</h3>
            </div>
            <dl className="divide-y divide-ink-100">
              {fields.map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">{f.label}</dt>
                    <dd className="mt-0.5 truncate text-sm font-medium text-ink-800 sm:text-base">{f.value}</dd>
                  </div>
                  <button
                    onClick={() => copy(f.key, f.value!)}
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                    aria-label={`Copy ${f.label}`}
                  >
                    {copied === f.key ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
