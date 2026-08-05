import { MessageCircle } from 'lucide-react';
import type { ContactInfo } from '@/types/database';

export default function WhatsAppButton({ info }: { info: ContactInfo | null }) {
  const wa = info?.whatsapp?.replace(/[^0-9]/g, '');
  if (!wa) return null;
  return (
    <a
      href={`https://wa.me/${wa}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
