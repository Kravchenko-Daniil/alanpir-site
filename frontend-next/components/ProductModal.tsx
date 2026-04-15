'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf } from 'lucide-react';
import Image from 'next/image';
import { useProductModal } from '@/hooks/useProductModal';
import { useToast } from '@/hooks/useToast';

export default function ProductModal() {
  const { isOpen, closeModal, product } = useProductModal();
  const { show } = useToast();
  const [weight, setWeight] = useState('1000 г');
  const [qty, setQty] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setWeight(product.weight || '1000 г');
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const getPriceMultiplier = (w: string) => {
    if (w === '600 г') return 0.8;
    if (w === '1200 г') return 1.2;
    return 1;
  };

  const currentPrice = Math.round(product.price * getPriceMultiplier(weight));

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
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-bg-warm p-6 flex flex-col items-center justify-center min-h-[240px] md:min-h-[400px]">
              <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center text-8xl mb-6">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.title} fill className="object-cover rounded-full" />
                ) : (
                  product.imageEmoji || '🥧'
                )}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-lg bg-surface border flex items-center justify-center text-xl ${i === 1 ? 'border-terracotta' : 'border-border-warm opacity-60'}`}>
                    {product.imageEmoji || '🥧'}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
              <div className="p-6 md:p-8 flex-1">
                {product.badge && (
                  <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase text-white mb-3 ${product.badge.type === 'hit' ? 'bg-ink' : 'bg-terracotta'}`}>
                    {product.badge.text}
                  </div>
                )}
                
                <h2 className="text-3xl font-serif text-ink mb-2">{product.title}</h2>
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  Традиционный осетинский пирог с обильной начинкой. Готовится вручную после вашего заказа.
                </p>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Вес</div>
                  <div className="flex gap-2">
                    {['600 г', '1000 г', '1200 г'].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeight(w)}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors border ${
                          weight === w 
                            ? 'bg-ink text-white border-ink' 
                            : 'bg-bg-warm text-ink border-border-warm hover:border-ink'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Состав</div>
                  <ul className="text-sm text-muted space-y-1.5">
                    <li>• Пшеничная мука высшего сорта</li>
                    <li>• Фирменная начинка</li>
                    <li>• Сливочное масло</li>
                    <li>• Соль, специи</li>
                  </ul>
                  {product.isVegan && (
                    <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-medium mt-3 bg-[#34C759]/10 inline-flex px-2 py-1 rounded-md">
                      <Leaf className="w-3.5 h-3.5" />
                      Постный продукт
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Bottom Action */}
              <div className="p-6 border-t border-border-warm bg-surface sticky bottom-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-between bg-bg-warm rounded-xl px-2 py-1 w-32 h-12">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-ink font-medium hover:text-terracotta">-</button>
                    <span className="text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center text-ink font-medium hover:text-terracotta">+</button>
                  </div>
                  <div className="text-2xl font-bold text-ink text-right flex-1">
                    {(currentPrice * qty).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-terracotta text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
                >
                  Добавить в корзину
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
