import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import SiteLayout from '@/layouts/SiteLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('@/pages/CollectionDetailPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminFeatured = lazy(() => import('@/pages/admin/AdminFeatured'));
const AdminCollections = lazy(() => import('@/pages/admin/AdminCollections'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminHomepage = lazy(() => import('@/pages/admin/AdminHomepage'));
const AdminCompany = lazy(() => import('@/pages/admin/AdminCompany'));
const AdminContact = lazy(() => import('@/pages/admin/AdminContact'));
const AdminBank = lazy(() => import('@/pages/admin/AdminBank'));
const AdminMedia = lazy(() => import('@/pages/admin/AdminMedia'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

function PageFallback() {
  return <LoadingScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CollectionDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="featured" element={<AdminFeatured />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="company" element={<AdminCompany />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="bank" element={<AdminBank />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
