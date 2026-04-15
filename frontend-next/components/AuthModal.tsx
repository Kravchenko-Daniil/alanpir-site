'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useToast } from '@/hooks/useToast';

export default function AuthModal() {
  const { isOpen, closeAuthModal, setIsAuth } = useAuthModal();
  const { show } = useToast();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuth(true);
    closeAuthModal();
    show('Вы успешно авторизовались', 'success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] bg-surface rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={closeAuthModal} 
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-bg-warm text-ink hover:bg-border-warm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-serif text-ink mb-6">
                {tab === 'login' ? 'Вход' : 'Регистрация'}
              </h2>

              {/* Tabs */}
              <div className="flex p-1 bg-bg-warm border border-border-warm rounded-xl mb-6">
                <button
                  onClick={() => setTab('login')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    tab === 'login' ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
                  }`}
                >
                  Вход
                </button>
                <button
                  onClick={() => setTab('register')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    tab === 'register' ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {tab === 'register' && (
                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder="Ваше имя" 
                      className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
                    />
                  </div>
                )}
                
                <div>
                  <input 
                    type="tel" 
                    required
                    placeholder="+7 (___) ___-__-__" 
                    className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
                  />
                </div>

                {tab === 'register' && (
                  <div>
                    <input 
                      type="email" 
                      required
                      placeholder="Email" 
                      className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    placeholder="Пароль" 
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {tab === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-terracotta hover:underline">
                      Забыли пароль?
                    </button>
                  </div>
                )}

                {tab === 'register' && (
                  <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <div className="relative flex items-center justify-center w-5 h-5 border border-border-warm rounded bg-surface group-hover:border-terracotta transition-colors shrink-0">
                      <input type="checkbox" required className="peer sr-only" />
                      <div className="hidden peer-checked:block w-3 h-3 bg-terracotta rounded-sm"></div>
                    </div>
                    <span className="text-xs text-muted leading-tight">
                      Я согласен с обработкой персональных данных
                    </span>
                  </label>
                )}

                <button 
                  type="submit"
                  className="w-full bg-terracotta text-white h-12 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity mt-2"
                >
                  {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-border-warm text-center">
                <p className="text-[10px] text-muted">Мы не передаём данные третьим лицам</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
