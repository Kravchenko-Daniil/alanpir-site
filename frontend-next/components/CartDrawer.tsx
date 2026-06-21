'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

export default function CartDrawer() {
  const { isOpen, closeCart, items, displayItems, subtotal, updateQty, removeItem } = useCart();

  const discount = 0;
  const delivery = subtotal > 0 ? 140 : 0;
  const total = subtotal - discount + delivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-surface shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-warm">
              <h2 className="text-xl font-serif text-ink">Корзина ({items.length})</h2>
              <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-warm text-ink hover:bg-border-warm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-bg-warm rounded-full flex items-center justify-center text-terracotta mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-serif text-ink mb-2">Корзина пуста</h3>
                  <p className="text-sm text-muted mb-6">Добавьте что-нибудь из каталога</p>
                  <Link href="/catalog" onClick={closeCart} className="bg-terracotta text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity">
                    В каталог
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="flex flex-col gap-4">
                    {displayItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-3xl shrink-0 overflow-hidden relative">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          ) : (
                            item.imageEmoji
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-semibold text-ink leading-tight mb-1">{item.name}</div>
                              <div className="flex items-center gap-1.5">
                                <div className="inline-block px-2 py-0.5 bg-bg-warm rounded-full text-[10px] font-medium text-muted">
                                  {item.weight}
                                </div>
                                {item.isBonus && (
                                  <div className="inline-block px-2 py-0.5 bg-terracotta/10 rounded-full text-[10px] font-semibold text-terracotta">
                                    Бонус
                                  </div>
                                )}
                              </div>
                            </div>
                            {!item.isBonus && (
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label="Удалить из корзины"
                                className="text-muted hover:text-terracotta transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {item.isBonus ? (
                              <span className="text-xs font-medium text-muted">В подарок к заказу</span>
                            ) : (
                              <div className="flex items-center gap-3 bg-bg-warm rounded-full px-2 py-1">
                                <button
                                  onClick={() => updateQty(item.id, item.qty - 1)}
                                  aria-label="Уменьшить количество"
                                  className="w-6 h-6 flex items-center justify-center text-ink font-medium hover:text-terracotta"
                                >
                                  −
                                </button>
                                <span className="text-xs font-semibold w-4 text-center">{item.qty}</span>
                                <button
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  aria-label="Увеличить количество"
                                  className="w-6 h-6 flex items-center justify-center text-ink font-medium hover:text-terracotta"
                                >
                                  +
                                </button>
                              </div>
                            )}
                            <div className="text-sm font-bold text-ink">
                              {item.isBonus ? 'Бесплатно' : `${(item.price * item.qty).toLocaleString('ru-RU')} ₽`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo */}
                  <div className="mt-auto pt-6 border-t border-border-warm">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Промокод"
                        className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
                      />
                      <button disabled className="h-12 px-6 rounded-xl bg-ink text-white text-sm font-medium opacity-50 cursor-not-allowed">
                        Применить
                      </button>
                    </div>
                    <p className="text-[10px] text-muted mt-2">Промокоды временно недоступны</p>
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-2 text-sm pt-4 border-t border-border-warm">
                    <div className="flex justify-between text-muted">
                      <span>Товары:</span>
                      <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-terracotta">
                        <span>Скидка:</span>
                        <span>−{discount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted">
                      <span>Доставка:</span>
                      <span>{delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-base font-semibold text-ink">Итого:</span>
                      <span className="text-2xl font-bold text-ink">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border-warm bg-surface flex flex-col gap-3">
                <Link 
                  href="/checkout" 
                  onClick={closeCart}
                  className="w-full bg-terracotta text-white py-4 rounded-xl font-semibold text-center hover:bg-opacity-90 transition-opacity"
                >
                  Оформить заказ
                </Link>
                <button 
                  onClick={closeCart}
                  className="w-full py-4 rounded-xl font-semibold text-ink hover:bg-bg-warm transition-colors"
                >
                  Продолжить покупки
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
