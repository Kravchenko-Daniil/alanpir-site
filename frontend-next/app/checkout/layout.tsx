import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Оформите заказ осетинских пирогов с доставкой по Москве или самовывозом.',
  alternates: { canonical: '/checkout/' },
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
