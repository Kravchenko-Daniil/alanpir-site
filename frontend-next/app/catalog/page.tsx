'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { MENU, CATEGORIES, type CategorySlug } from '@/lib/menu';

export default function CatalogPage() {
  const [active, setActive] = useState<CategorySlug>('all');
  const [leanOnly, setLeanOnly] = useState(false);

  const products = useMemo(() => {
    let list = active === 'all' ? MENU : MENU.filter((p) => p.categorySlug === active);
    if (leanOnly) list = list.filter((p) => p.isLean);
    return list;
  }, [active, leanOnly]);

  return (
    <div className="py-6 md:py-10">
      <h1 className="text-3xl md:text-5xl mb-6 md:mb-8 text-ink font-serif font-bold">
        Каталог
      </h1>

      <div className="sticky top-20 md:top-24 bg-white/95 backdrop-blur py-3 md:py-4 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6 border-b border-border-warm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 max-w-[1360px] mx-auto">
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active === c.slug
                    ? 'bg-ink text-white'
                    : 'bg-bg-warm text-ink hover:bg-border-warm'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={leanOnly}
                  onChange={(e) => setLeanOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-border-warm rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </div>
              Только постные
            </label>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-muted">
          В этой категории пока нет позиций
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
