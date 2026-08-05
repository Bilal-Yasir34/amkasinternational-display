import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, Tag, Star, Inbox, TrendingUp } from 'lucide-react';
import { AdminHeader, AdminCard } from '@/components/admin/AdminUI';
import { fetchAllProductsAdmin, fetchCollections, fetchCategories, fetchInquiries } from '@/lib/api';
import type { Inquiry } from '@/types/database';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, collections: 0, categories: 0, featured: 0, inquiries: 0 });
  const [recent, setRecent] = useState<Inquiry[]>([]);

  useEffect(() => {
    Promise.all([fetchAllProductsAdmin(), fetchCollections(), fetchCategories(), fetchInquiries()])
      .then(([p, c, cat, inq]) => {
        setStats({
          products: p.length,
          collections: c.length,
          categories: cat.length,
          featured: p.filter((x) => x.featured).length,
          inquiries: inq.length,
        });
        setRecent(inq.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: Package, to: '/admin/products' },
    { label: 'Featured', value: stats.featured, icon: Star, to: '/admin/featured' },
    { label: 'Collections', value: stats.collections, icon: Layers, to: '/admin/collections' },
    { label: 'Categories', value: stats.categories, icon: Tag, to: '/admin/categories' },
    { label: 'Inquiries', value: stats.inquiries, icon: Inbox, to: '/admin' },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Overview of your website content and activity." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card p-5 transition hover:shadow-lift">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-semibold text-ink-900">{c.value}</p>
            <p className="text-sm text-ink-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <AdminCard className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-ink-400" />
          <h2 className="font-serif text-lg font-medium text-ink-900">Recent Inquiries</h2>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-400">No inquiries yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {recent.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{i.name}</p>
                  <p className="text-xs text-ink-500">{i.email ?? i.phone ?? '—'}</p>
                </div>
                <span className="text-xs text-ink-400">{new Date(i.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}


