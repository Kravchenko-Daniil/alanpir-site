'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UtensilsCrossed, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuthModal } from '@/hooks/useAuthModal';

export default function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, items } = useCart();
  const { openAuthModal, isAuth } = useAuthModal();

  const handleUserClick = () => {
    if (isAuth) router.push('/account');
    else openAuthModal();
  };

  const isCatalog = pathname?.startsWith('/catalog');
  const isAccount = pathname?.startsWith('/account');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-warm px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-1">
        <Link
          href="/catalog"
          className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors ${
            isCatalog ? 'text-ink' : 'text-muted'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-medium">Меню</span>
        </Link>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg text-muted hover:text-ink transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Корзина</span>
          {items.length > 0 && (
            <span className="absolute top-1 right-[calc(50%-20px)] min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>

        <button
          onClick={handleUserClick}
          className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors ${
            isAccount ? 'text-ink' : 'text-muted hover:text-ink'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{isAuth ? 'Профиль' : 'Войти'}</span>
        </button>
      </div>
    </nav>
  );
}
