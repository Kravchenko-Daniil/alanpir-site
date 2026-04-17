'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useToast } from '@/hooks/useToast';
import { isValidPhone, isValidEmail, isValidName, isValidPassword } from '@/lib/validation';
import { api, ApiError, describeApiError } from '@/lib/api';

type Errors = {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  consent?: string;
  form?: string;
};

export default function AuthModal() {
  const { isOpen, closeAuthModal, login } = useAuthModal();
  const { show } = useToast();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setTouched({});
      setSubmitting(false);
    }
  }, [isOpen]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (tab === 'register' && !isValidName(name)) e.name = 'Введите имя (минимум 2 символа)';
    if (!isValidPhone(phone)) e.phone = 'Введите корректный номер';
    if (tab === 'register' && !isValidEmail(email)) e.email = 'Введите корректный email';
    if (!isValidPassword(password)) e.password = 'Минимум 6 символов';
    if (tab === 'register' && !consent) e.consent = 'Нужно согласие на обработку данных';
    return e;
  };

  const onBlur = (field: keyof Errors) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, password: true, consent: true });
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'register'
        ? JSON.stringify({ phone, password, name })
        : JSON.stringify({ phone, password });
      const res = await api<{ ok: true; phone: string; name?: string | null }>(endpoint, {
        method: 'POST',
        body,
      });
      login({ phone: res.phone, name: res.name ?? (tab === 'register' ? name : null) });
      closeAuthModal();
      show(tab === 'login' ? 'Вы успешно вошли' : 'Регистрация прошла успешно', 'success');
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = describeApiError(err.code);
        setErrors({ form: msg });
        show(msg, 'error');
      } else {
        const msg = 'Нет связи с сервером. Проверьте интернет.';
        setErrors({ form: msg });
        show(msg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError?: string) =>
    `w-full h-12 px-4 rounded-xl border bg-surface focus:outline-none transition-colors text-sm ${
      hasError ? 'border-danger focus:border-danger' : 'border-border-warm focus:border-accent'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
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
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-serif text-ink mb-6">
              {tab === 'login' ? 'Вход' : 'Регистрация'}
            </h2>

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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {tab === 'register' && (
                <div>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => onBlur('name')}
                    className={fieldClass(touched.name ? errors.name : undefined)}
                  />
                  {touched.name && errors.name && (
                    <p className="text-xs text-danger mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <IMaskInput
                  mask="+{7} (000) 000-00-00"
                  value={phone}
                  onAccept={(value: string) => setPhone(value)}
                  type="tel"
                  inputMode="tel"
                  placeholder="+7 (___) ___-__-__"
                  onBlur={() => onBlur('phone')}
                  className={fieldClass(touched.phone ? errors.phone : undefined)}
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-danger mt-1">{errors.phone}</p>
                )}
              </div>

              {tab === 'register' && (
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => onBlur('email')}
                    className={fieldClass(touched.email ? errors.email : undefined)}
                  />
                  {touched.email && errors.email && (
                    <p className="text-xs text-danger mt-1">{errors.email}</p>
                  )}
                </div>
              )}

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => onBlur('password')}
                    className={fieldClass(touched.password ? errors.password : undefined) + ' pr-12'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password}</p>
                )}
              </div>

              {tab === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-accent hover:underline">
                    Забыли пароль?
                  </button>
                </div>
              )}

              {tab === 'register' && (
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <div className={`relative flex items-center justify-center w-5 h-5 border rounded bg-surface transition-colors shrink-0 ${errors.consent && touched.consent ? 'border-danger' : 'border-border-warm group-hover:border-accent'}`}>
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => { setConsent(e.target.checked); onBlur('consent'); }}
                        className="peer sr-only"
                      />
                      <div className="hidden peer-checked:block w-3 h-3 bg-accent rounded-sm" />
                    </div>
                    <span className="text-xs text-muted leading-tight">
                      Я согласен с обработкой персональных данных
                    </span>
                  </label>
                  {touched.consent && errors.consent && (
                    <p className="text-xs text-danger mt-1 ml-8">{errors.consent}</p>
                  )}
                </div>
              )}

              {errors.form && (
                <p className="text-xs text-danger text-center -mb-1">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-white h-12 rounded-xl font-semibold hover:bg-accent-dark transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Отправка…' : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-warm text-center">
              <p className="text-[10px] text-muted">Мы не передаём данные третьим лицам</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
