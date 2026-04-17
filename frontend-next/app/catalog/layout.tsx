import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог пирогов',
  description:
    'Все осетинские, мясные, сырные, картофельные, куриные, рыбные и сладкие пироги. Сеты, соусы, напитки. Доставка горячими по Москве.',
  alternates: { canonical: '/catalog/' },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
