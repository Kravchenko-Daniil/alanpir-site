'use client';

import { useAuthModal } from '@/hooks/useAuthModal';
import { User, MapPin, Package, Settings, LogOut } from 'lucide-react';
import AddressForm from '@/components/checkout/AddressForm';
import { useState } from 'react';

export default function AccountPage() {
  const { isAuth, setIsAuth, openAuthModal } = useAuthModal();
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  if (!isAuth) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-bg-warm rounded-full flex items-center justify-center text-terracotta mb-6">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif text-ink mb-4">Войдите в личный кабинет</h1>
        <p className="text-muted mb-8 max-w-md">
          Смотрите историю заказов, сохранённые адреса и копите бонусы.
        </p>
        <button 
          onClick={openAuthModal}
          className="bg-terracotta text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
        >
          Войти или зарегистрироваться
        </button>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl md:text-5xl mb-8 text-ink font-serif">Личный кабинет</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
        
        {/* Sidebar */}
        <div className="bg-surface rounded-2xl border border-border-warm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-terracotta text-white flex items-center justify-center text-2xl font-serif mb-4">
            ИР
          </div>
          <h2 className="text-xl font-bold text-ink mb-1">Ибрагим Ризванов</h2>
          <p className="text-sm text-muted mb-1">+7 (926) 386-33-70</p>
          <p className="text-sm text-muted mb-8">rizvanovibragim@yandex.ru</p>
          
          <button 
            onClick={() => setIsAuth(false)}
            className="w-full py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          
          {/* Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-ink" />
              <h3 className="text-xl font-serif text-ink">Мои заказы</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface rounded-2xl border border-border-warm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-semibold text-ink">Заказ №1024</span>
                    <span className="text-sm text-muted ml-2">от 12 апреля</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-[#34C759]/10 text-[#34C759] text-xs font-bold uppercase">
                    Доставлен
                  </div>
                </div>
                <p className="text-sm text-muted mb-4">Фыдджын (мясной), Цахараджын, Морс клюквенный</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">2 550 ₽</span>
                  <button className="text-sm font-medium text-terracotta hover:underline">Повторить заказ</button>
                </div>
              </div>
              <div className="bg-surface rounded-2xl border border-border-warm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-semibold text-ink">Заказ №980</span>
                    <span className="text-sm text-muted ml-2">от 5 марта</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-bg-warm text-muted text-xs font-bold uppercase">
                    Отменён
                  </div>
                </div>
                <p className="text-sm text-muted mb-4">Пирог с сёмгой, Картофджын</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">2 730 ₽</span>
                  <button className="text-sm font-medium text-terracotta hover:underline">Повторить заказ</button>
                </div>
              </div>
            </div>
          </section>

          {/* Addresses */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-ink" />
              <h3 className="text-xl font-serif text-ink">Мои адреса</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface rounded-2xl border border-border-warm p-5 flex items-start justify-between">
                <div>
                  <div className="font-medium text-ink mb-1">Москва, ул. Ленина, 10</div>
                  <div className="text-sm text-muted">Подъезд 1, этаж 5, кв 42</div>
                </div>
                <div className="flex gap-3">
                  <button className="text-sm text-terracotta hover:underline">Редактировать</button>
                  <button className="text-sm text-muted hover:text-red-500 transition-colors">Удалить</button>
                </div>
              </div>
              
              {!isAddingAddress ? (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-4 border-2 border-dashed border-border-warm rounded-2xl text-sm font-medium text-ink hover:border-terracotta hover:text-terracotta transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  + Добавить адрес
                </button>
              ) : (
                <AddressForm onCancel={() => setIsAddingAddress(false)} onSave={() => setIsAddingAddress(false)} />
              )}
            </div>
          </section>

          {/* Personal Data */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-ink" />
              <h3 className="text-xl font-serif text-ink">Личные данные</h3>
            </div>
            <div className="bg-surface rounded-2xl border border-border-warm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Имя</label>
                  <input type="text" defaultValue="Ибрагим" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Телефон</label>
                  <input type="tel" defaultValue="+7 (926) 386-33-70" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Email</label>
                  <input type="email" defaultValue="rizvanovibragim@yandex.ru" className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors" />
                </div>
              </div>
              <button className="bg-ink text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity">
                Сохранить изменения
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
