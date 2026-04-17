import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Заказ принят',
  description: 'Страница подтверждения заказа АланПир.',
  alternates: { canonical: '/order/' },
  robots: { index: false, follow: false },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
