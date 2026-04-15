'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf } from 'lucide-react';
import Image from 'next/image';
import { useProductModal } from '@/hooks/useProductModal';
import { useToast } from '@/hooks/useToast';

const BADGE_LABEL = { hit: 'Хит', new: 'Новинка' } as const;

export default function ProductModal() {
  const { isOpen, closeModal, product } = useProductModal();
  const { show } = useToast();
  const [weightIdx, setWeightIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setWeightIdx(0);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const hasWeights = product.weights.length > 0;
  const current = hasWeights ? product.weights[weightIdx] : null;
  const unitPrice = current?.price ?? 0;
  const compositionItems = product.composition
    ? product.composition
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleAddToCart = () => {
    show(`Добавлено в корзину: ${product.title}`, 'success');
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[680px] bg-surface rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-bg-warm/80 backdrop-blur text-ink hover:bg-border-warm transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 bg-bg-warm p-6 flex flex-col items-center justify-center min-h-[240px] md:min-h-[400px]">
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center text-8xl mb-6">
                {product.image ? (
                  <Image src={product.image} alt={product.title} fill className="object-cover rounded-full" />
                ) : (
                  product.emoji
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex gap-2 mb-3">
                  {product.badge && (
                    <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase text-white ${product.badge === 'hit' ? 'bg-ink' : 'bg-terracotta'}`}>
                      {BADGE_LABEL[product.badge]}
                    </div>
                  )}
                  <div className="inline-block px-2 py-1 rounded text-[10px] font-medium uppercase text-muted bg-bg-warm">
                    {product.category}
                  </div>
                </div>

                <h2 className="text-3xl font-serif text-ink mb-4">{product.title}</h2>

                {hasWeights && (
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Вес</div>
                    <div className="flex gap-2 flex-wrap">
                      {product.weights.map((w, i) => (
                        <button
                          key={w.weight}
                          onClick={() => setWeightIdx(i)}
                          className={`py-2 px-4 rounded-full text-sm font-medium transition-colors border ${
                            weightIdx === i
                              ? 'bg-ink text-white border-ink'
                              : 'bg-bg-warm text-ink border-border-warm hover:border-ink'
                          }`}
                        >
                          {w.weight} · {w.price.toLocaleString('ru-RU')} ₽
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {compositionItems.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Состав</div>
                    <ul className="text-sm text-muted space-y-1.5">
                      {compositionItems.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                    {product.isLean && (
                      <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-medium mt-3 bg-[#34C759]/10 w-fit px-2 py-1 rounded-md">
                        <Leaf className="w-3.5 h-3.5" />
                        Постный продукт
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border-warm bg-surface sticky bottom-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-between bg-bg-warm rounded-xl px-2 py-1 w-32 h-12">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-ink font-medium hover:text-terracotta">−</button>
                    <span className="text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center text-ink font-medium hover:text-terracotta">+</button>
                  </div>
                  <div className="text-2xl font-bold text-ink text-right flex-1">
                    {hasWeights ? `${(unitPrice * qty).toLocaleString('ru-RU')} ₽` : 'По запросу'}
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!hasWeights}
                  className="w-full bg-terracotta text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasWeights ? 'Добавить в корзину' : 'Уточнить по телефону'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
