'use client';

import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface AddressFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export default function AddressForm({ onCancel, onSave }: AddressFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-bg-warm/50 rounded-xl p-4 md:p-6 border border-border-warm mt-4 space-y-4">
        <h4 className="font-semibold text-ink text-sm uppercase tracking-wide mb-2">Новый адрес</h4>
        
        {/* DaData Mock Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted" />
          </div>
          <input
            type="text"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors"
            placeholder="Город, улица, дом..."
            defaultValue="Москва, ул. Ленина, 10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Квартира</label>
            <input type="text" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Подъезд</label>
            <input type="text" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Этаж</label>
            <input type="text" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Домофон</label>
            <input type="text" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-medium text-ink bg-surface border border-border-warm hover:bg-bg-warm transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 rounded-xl font-medium text-white bg-ink hover:bg-opacity-90 transition-opacity"
          >
            Сохранить
          </button>
        </div>
      </div>
    </motion.div>
  );
}
