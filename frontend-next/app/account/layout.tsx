import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Личный кабинет',
  description: 'Личный кабинет АланПир: история заказов, сохранённые адреса и личные данные.',
  alternates: { canonical: '/account/' },
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
