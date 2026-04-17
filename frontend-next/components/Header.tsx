'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useRouter } from 'next/navigation';

function Logo() {
  return (
    <Link href="/" className="shrink-0 group" aria-label="АланПир — главная">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-white border-2 border-ink rounded-md leading-none">
        <span className="font-serif font-black text-[18px] text-ink tracking-tight">АЛАН</span>
        <span className="font-serif font-black text-[18px] text-ink tracking-tight">ПИР</span>
      </div>
    </Link>
  );
}

export default function Header() {
  const { openCart, items } = useCart();
  const { openAuthModal, isAuth } = useAuthModal();
  const router = useRouter();

  const handleUserClick = () => {
    if (isAuth) router.push('/account');
    else openAuthModal();
  };

  return (
    <header className="bg-accent sticky top-0 z-40 border-b border-black/5">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center gap-4 md:gap-8">
        <Logo />

        <div className="flex-1 min-w-0 flex flex-col items-center text-center leading-tight">
          <a href="tel:+79263863370" className="font-extrabold text-lg md:text-2xl text-ink whitespace-nowrap hover:opacity-80 transition-opacity">
            +7 (926) 386-33-70
          </a>
          <div className="hidden sm:flex gap-x-4 gap-y-0 flex-wrap justify-center text-[11px] md:text-xs text-ink/80 mt-0.5">
            <span>Приём заказов: будни 8:30–20:00, выходные 10:00–17:00</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Доставка 40–120 мин</span>
          </div>
          <div className="sm:hidden text-[10px] text-ink/80 mt-0.5">
            Доставка 40–120 мин
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-semibold text-ink hover:opacity-70 transition-opacity">Каталог</Link>
          <Link href="/about" className="text-sm font-semibold text-ink hover:opacity-70 transition-opacity">О нас</Link>
          <Link href="/reviews" className="text-sm font-semibold text-ink hover:opacity-70 transition-opacity">Отзывы</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={handleUserClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 text-ink hover:bg-ink hover:text-white transition-colors"
            aria-label={isAuth ? 'Личный кабинет' : 'Войти'}
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-4 rounded-full bg-ink text-white hover:bg-action-hover transition-colors"
            aria-label="Корзина"
          >
            <ShoppingCart className="w-5 h-5 md:hidden" />
            <span className="hidden md:inline text-sm font-semibold">Корзина</span>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 md:static md:ml-2 min-w-[20px] h-5 px-1 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button className="lg:hidden text-ink" aria-label="Меню">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
