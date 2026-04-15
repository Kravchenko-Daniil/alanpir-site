'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { openCart, items } = useCart();
  const { openAuthModal, isAuth } = useAuthModal();
  const router = useRouter();

  const handleUserClick = () => {
    if (isAuth) router.push('/account');
    else openAuthModal();
  };

  return (
    <header className="h-20 border-b border-border-warm bg-bg-warm sticky top-0 z-40">
      <div className="w-full max-w-[940px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-ink">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-terracotta uppercase">
            АланПир
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/catalog" className="text-sm font-medium text-ink uppercase tracking-wider hover:text-terracotta transition-colors">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-ink uppercase tracking-wider hover:text-terracotta transition-colors">
                О нас
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="text-sm font-medium text-ink uppercase tracking-wider hover:text-terracotta transition-colors">
                Отзывы
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <a href="tel:+79263863370" className="hidden md:block font-semibold text-sm text-ink hover:text-terracotta transition-colors">
            +7 (926) 386-33-70
          </a>
          <button 
            onClick={handleUserClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border-warm text-ink hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            onClick={openCart}
            className="bg-terracotta text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-opacity-90 transition-opacity flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 md:hidden" />
            <span className="hidden md:inline">Корзина ({items.length})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
