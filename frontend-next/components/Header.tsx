'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User, PhoneCall, X, MessageCircle } from 'lucide-react';

const MAX_URL = 'https://max.ru/AlanPir';
import { useCart } from '@/hooks/useCart';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { openCart, totalQty } = useCart();
  const { openAuthModal, isAuth } = useAuthModal();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleUserClick = () => {
    if (isAuth) router.push('/account');
    else openAuthModal();
  };

  const cartItemsCount = totalQty;

  return (
    <>
      <header className="h-[72px] md:h-[96px] bg-surface shadow-sm sticky top-0 z-40 border-b border-border-warm transition-all">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Menu Handle + Logo */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-ink p-1.5 -ml-1.5">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src="/logo-alanpir.png"
                alt="АланПир"
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
            
            {/* Nav: Desktop (Visible lg+) */}
            <nav className="hidden lg:block ml-2 xl:ml-6">
              <ul className="flex items-center gap-5 xl:gap-8">
                <li>
                  <Link href="/catalog" className="text-[13px] xl:text-sm font-bold text-ink uppercase tracking-wide hover:text-accent transition-colors">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-[13px] xl:text-sm font-bold text-ink uppercase tracking-wide hover:text-accent transition-colors">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-[13px] xl:text-sm font-bold text-ink uppercase tracking-wide hover:text-accent transition-colors">
                    Отзывы
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Mobile Phone — inline on one row (< sm) */}
          <a href="tel:+79264990099" className="sm:hidden flex items-center gap-1.5 text-[13px] font-bold text-ink hover:text-accent transition-colors whitespace-nowrap min-w-0">
            <PhoneCall className="w-4 h-4 text-accent shrink-0" />
            <span>+7 (926) 499-00-99</span>
          </a>

          {/* Right: Phone (tablet/desktop) + Actions */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5 shrink-0">
            
            {/* Desktop/Tablet Phone */}
            <a href="tel:+79264990099" className="hidden sm:flex flex-col items-end justify-center mr-1 md:mr-2 group">
              <span className="flex items-center gap-1.5 text-ink group-hover:text-accent transition-colors">
                <PhoneCall className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                <span className="font-sans font-bold text-sm md:text-base lg:text-lg xl:text-xl tracking-tight whitespace-nowrap">
                  +7 (926) 499-00-99
                </span>
              </span>
              <span className="hidden xl:block text-[10px] text-muted font-medium mt-0.5 whitespace-nowrap">
                Приём заказов круглосуточно · пекарня 7:40–20:00
              </span>
            </a>

            <a
              href={MAX_URL}
              aria-label="Max"
              className="hidden lg:flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-bg-warm text-ink hover:text-accent transition-colors shrink-0"
              title="Max"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={handleUserClick}
              className="hidden lg:flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-bg-warm text-ink hover:text-accent transition-colors shrink-0"
              title="Личный кабинет"
            >
              <User className="w-5 h-5" />
            </button>
            
            <button 
              onClick={openCart}
              className="relative bg-accent text-white h-10 md:h-11 px-4 md:px-5 rounded-full text-xs sm:text-sm font-bold tracking-wide hover:bg-accent-dark transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm shrink-0"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Корзина</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 md:static md:ml-1 md:mt-0 flex items-center justify-center min-w-[20px] h-[20px] bg-ink text-white text-[10px] rounded-full px-1.5 font-black">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
          
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-[300px] max-w-[85vw] h-full bg-surface shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <img src="/logo-alanpir.png" alt="АланПир" className="h-10 w-auto object-contain" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="text-muted hover:text-ink p-1 -mr-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 text-lg font-bold text-ink uppercase tracking-wide">
              <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>Каталог</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>О нас</Link>
              <Link href="/reviews" onClick={() => setIsMenuOpen(false)}>Отзывы</Link>
              <button onClick={() => { setIsMenuOpen(false); handleUserClick(); }} className="text-left w-full flex items-center gap-3 uppercase">
                 <User className="w-5 h-5 text-accent"/> Личный кабинет
              </button>
            </nav>

            <div className="mt-auto pt-8 border-t border-border-warm flex flex-col gap-4">
              <a href="tel:+79264990099" className="flex items-center gap-3 text-ink hover:text-accent transition-colors font-bold text-xl">
                <PhoneCall className="w-6 h-6 text-accent" />
                +7 (926) 499-00-99
              </a>
              <div className="flex flex-col gap-1 text-xs text-muted font-medium">
                <span>Приём заказов: круглосуточно</span>
                <span>Пекарня: ежедневно 7:40–20:00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
