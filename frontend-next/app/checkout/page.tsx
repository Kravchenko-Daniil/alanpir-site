'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MapPin, CreditCard, Smartphone, Banknote, Info, X } from 'lucide-react';
import StepCard from '@/components/checkout/StepCard';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import ContactFields, { isContactValid, type ContactValue } from '@/components/checkout/ContactFields';
import type { SavedAddress } from '@/lib/address';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useCart } from '@/hooks/useCart';
import { useSavedAddresses } from '@/hooks/useSavedAddresses';
import { useToast } from '@/hooks/useToast';
import { api, ApiError, describeApiError } from '@/lib/api';

interface DeliveryZone {
  id: string;
  label: string;
  minOrder: number;
  deliveryCost: number | null;
}

const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'nearby', label: 'Соседние станции (Достоевская, Марьина роща)', minOrder: 0, deliveryCost: 0 },
  { id: 'sadovoe', label: 'Садовое кольцо', minOrder: 1000, deliveryCost: 150 },
  { id: 'ttk', label: 'ТТК (Третье транспортное кольцо)', minOrder: 1500, deliveryCost: 250 },
  { id: 'mkad', label: 'В пределах МКАД', minOrder: 2000, deliveryCost: 250 },
  { id: 'beyond', label: 'За МКАД', minOrder: 5000, deliveryCost: null },
];

const DEFAULT_ZONE_ID = 'mkad';

export default function CheckoutPage() {
  const router = useRouter();
  const { show } = useToast();
  const { isAuth, name: authName, logout, openAuthModal } = useAuthModal();
  const { items: cartItems, displayItems, subtotal, clear: clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryTime, setDeliveryTime] = useState<'asap' | 'scheduled'>('asap');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'cash'>('card');

  const [zoneId, setZoneId] = useState<string>(DEFAULT_ZONE_ID);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { addresses, selectedId: selectedAddressId, setSelectedId: setSelectedAddressId, addAddress, removeAddress } = useSavedAddresses();

  const [contact, setContact] = useState<ContactValue>({ name: '', phone: '', email: '' });
  const [comment, setComment] = useState('');
  const [noCall, setNoCall] = useState(false);
  const [needUtensils, setNeedUtensils] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleAddAddress = (addr: SavedAddress) => {
    addAddress(addr);
    setIsAddingAddress(false);
  };

  const isDelivery = deliveryMethod === 'delivery';
  const selectedZone = DELIVERY_ZONES.find((z) => z.id === zoneId) ?? DELIVERY_ZONES.find((z) => z.id === DEFAULT_ZONE_ID)!;

  const isBelowMinOrder = isDelivery && subtotal < selectedZone.minOrder;
  const missingForMinOrder = selectedZone.minOrder - subtotal;

  let discount = 0;
  if (!isDelivery) discount += subtotal * 0.1;

  // null deliveryCost («за МКАД» — уточняется у оператора) не добавляем в total как число
  const deliveryCost = isDelivery ? (selectedZone.deliveryCost ?? 0) : 0;
  const deliveryUnknown = isDelivery && selectedZone.deliveryCost === null;
  const total = subtotal - discount + deliveryCost;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const handleSubmit = async () => {
    if (cartItems.length === 0) { show('Корзина пустая', 'error'); return; }
    if (!isContactValid(contact)) { show('Заполните имя и телефон корректно', 'error'); return; }
    if (isDelivery) {
      if (!selectedAddress) { show('Выберите или добавьте адрес доставки', 'error'); return; }
      if (!selectedAddress.street || !selectedAddress.house) {
        show('Адрес не полный — выберите из подсказок с номером дома', 'error');
        return;
      }
      if (isBelowMinOrder) {
        show(`До минимального заказа не хватает ${missingForMinOrder} ₽`, 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const pickupAddress = 'Самовывоз: г. Москва, ул. Трифоновская, 4';
      const payload = {
        phone: contact.phone,
        name: contact.name,
        email: contact.email || null,
        address: isDelivery ? selectedAddress?.fullValue : pickupAddress,
        addressData: isDelivery && selectedAddress ? {
          street: selectedAddress.street || '',
          house: selectedAddress.house || '',
          apt: selectedAddress.apt,
          entrance: selectedAddress.entrance,
          floor: selectedAddress.floor,
          code: selectedAddress.intercom,
        } : null,
        paymentMethod,
        items: displayItems.map((i) => ({
          id: i.id,
          name: i.name,
          title: i.name,
          weight: i.weight,
          price: i.price,
          qty: i.qty,
          isBonus: i.isBonus ?? false,
        })),
        promo: null,
        deliveryZone: isDelivery ? selectedZone.label : null,
        subtotal,
        discount: Math.round(discount),
        delivery: deliveryCost,
        total: Math.round(total),
        comment: comment || null,
        noCall,
        needUtensils,
        deliveryTime: deliveryTime === 'asap' ? null : 'scheduled',
      };

      const res = await api<{ ok: true; orderId: number }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      router.push(`/order/?id=${res.orderId}`);
    } catch (err) {
      if (err instanceof ApiError) {
        show(describeApiError(err.code), 'error');
      } else {
        show('Нет связи с сервером. Попробуйте ещё раз.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-bg-warm rounded-full flex items-center justify-center text-terracotta mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif text-ink mb-4">В корзине пока пусто</h1>
        <p className="text-muted mb-8 max-w-md">
          Добавьте вкусные осетинские пироги из нашего меню, чтобы оформить заказ.
        </p>
        <Link
          href="/catalog"
          className="bg-terracotta text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl mb-8 text-ink font-serif">
        Оформление <span className="text-terracotta italic">заказа</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-start">

        {/* Left Column: Steps */}
        <div className="flex flex-col gap-6">

          {/* Step 1: Contacts */}
          <StepCard step={1} title="Контакты">
            {isAuth ? (
              <div className="bg-bg-warm border border-border-warm rounded-xl p-4 flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-ink">
                  Вы вошли{authName ? ` как ${authName}` : ''}
                </span>
                <button type="button" onClick={logout} className="text-sm text-terracotta hover:underline">Выйти</button>
              </div>
            ) : (
              <div className="mb-6 text-sm">
                <button type="button" onClick={openAuthModal} className="text-terracotta font-medium hover:underline">Войти</button>
                <span className="text-muted">, чтобы быстрее оформить заказ и копить бонусы.</span>
              </div>
            )}

            <ContactFields value={contact} onChange={setContact} />
          </StepCard>

          {/* Step 2: Delivery Method */}
          <StepCard step={2} title="Способ получения">
            <div className="flex p-1 bg-bg-warm border border-border-warm rounded-xl mb-6">
              <button
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  deliveryMethod === 'delivery' ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Доставка
              </button>
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  deliveryMethod === 'pickup' ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Самовывоз
              </button>
            </div>

            <AnimatePresence mode="wait">
              {deliveryMethod === 'delivery' ? (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-3 font-sans">Куда доставить?</h3>
                    {addresses.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {addresses.map((a) => {
                          const details = [
                            a.apt && `кв ${a.apt}`,
                            a.entrance && `подъезд ${a.entrance}`,
                            a.floor && `эт ${a.floor}`,
                            a.intercom && `домофон ${a.intercom}`,
                          ].filter(Boolean).join(', ');
                          const isSelected = selectedAddressId === a.id;
                          return (
                            <label
                              key={a.id}
                              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                                isSelected ? 'border-terracotta bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'
                              }`}
                            >
                              <input
                                type="radio"
                                name="saved_address"
                                checked={isSelected}
                                onChange={() => setSelectedAddressId(a.id)}
                                className="mt-1 text-terracotta focus:ring-terracotta"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-ink text-sm truncate">{a.shortLabel}</div>
                                {details && <div className="text-xs text-muted mt-0.5 truncate">{details}</div>}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAddress(a.id); }}
                                aria-label="Удалить адрес"
                                className="text-muted hover:text-danger transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {!isAddingAddress ? (
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="w-full py-4 border-2 border-dashed border-border-warm rounded-xl text-sm font-medium text-ink hover:border-terracotta hover:text-terracotta transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        {addresses.length > 0 ? '+ Добавить ещё адрес' : '+ Добавить адрес'}
                      </button>
                    ) : (
                      <AddressForm
                        onCancel={() => setIsAddingAddress(false)}
                        onSave={handleAddAddress}
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink mb-3 font-sans">Зона доставки</h3>
                    <select
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none text-sm"
                    >
                      {DELIVERY_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>{z.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink mb-3 font-sans">Когда доставить?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${deliveryTime === 'asap' ? 'border-terracotta bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                        <input
                          type="radio"
                          name="time"
                          checked={deliveryTime === 'asap'}
                          onChange={() => setDeliveryTime('asap')}
                          className="text-terracotta focus:ring-terracotta"
                        />
                        <span className="text-sm font-medium text-ink">Как можно скорее<br /><span className="text-xs text-muted font-normal">~ 60-90 минут</span></span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${deliveryTime === 'scheduled' ? 'border-terracotta bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                        <input
                          type="radio"
                          name="time"
                          checked={deliveryTime === 'scheduled'}
                          onChange={() => setDeliveryTime('scheduled')}
                          className="text-terracotta focus:ring-terracotta"
                        />
                        <span className="text-sm font-medium text-ink">Ко времени<br /><span className="text-xs text-muted font-normal">Выбрать интервал</span></span>
                      </label>
                    </div>

                    <AnimatePresence>
                      {deliveryTime === 'scheduled' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 overflow-hidden"
                        >
                          <select className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none text-sm">
                            <option>Сегодня</option>
                            <option>Завтра</option>
                          </select>
                          <select className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none text-sm">
                            <option>12:00 - 12:30</option>
                            <option>12:30 - 13:00</option>
                            <option>13:00 - 13:30</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="bg-bg-warm rounded-xl p-3 flex items-start gap-2 text-xs text-muted">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-ink" />
                    <p>Соседние станции — бесплатно, без минимума. Садовое кольцо — от 1000 ₽, 150 ₽. ТТК — от 1500 ₽, 250 ₽. В пределах МКАД — от 2000 ₽, 250 ₽. За МКАД — от 5000 ₽, стоимость уточняется у оператора.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="pickup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-3 font-sans">Пункт выдачи</h3>
                    <div className="border border-border-warm rounded-xl overflow-hidden">
                      <div className="p-4 bg-surface">
                        <div className="font-medium text-ink text-sm mb-1">Москва, ул. Трифоновская, 4</div>
                        <div className="text-xs text-muted">Ежедневно 7:40–20:00</div>
                      </div>
                      <iframe
                        src="https://yandex.ru/map-widget/v1/?ll=37.6229%2C55.7925&mode=search&oid=1111111111&ol=biz&z=16&text=%D1%83%D0%BB.%20%D0%A2%D1%80%D0%B8%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2C%204%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0"
                        width="100%"
                        height="240"
                        frameBorder="0"
                        allowFullScreen
                        title="Карта: АланПир, Трифоновская 4"
                        className="block"
                      />
                    </div>
                  </div>

                  <div className="bg-terracotta/10 border border-terracotta/20 rounded-xl p-3 flex items-start gap-2 text-sm text-terracotta">
                    <Info className="w-5 h-5 shrink-0" />
                    <p>При самовывозе действует <b>скидка 10%</b> на весь заказ.</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink mb-3 font-sans">Когда заберете?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${deliveryTime === 'asap' ? 'border-terracotta bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                        <input
                          type="radio"
                          name="pickup_time"
                          checked={deliveryTime === 'asap'}
                          onChange={() => setDeliveryTime('asap')}
                          className="text-terracotta focus:ring-terracotta"
                        />
                        <span className="text-sm font-medium text-ink">Как можно скорее<br /><span className="text-xs text-muted font-normal">Через 20-30 минут</span></span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${deliveryTime === 'scheduled' ? 'border-terracotta bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                        <input
                          type="radio"
                          name="pickup_time"
                          checked={deliveryTime === 'scheduled'}
                          onChange={() => setDeliveryTime('scheduled')}
                          className="text-terracotta focus:ring-terracotta"
                        />
                        <span className="text-sm font-medium text-ink">Ко времени<br /><span className="text-xs text-muted font-normal">Выбрать время</span></span>
                      </label>
                    </div>
                    <AnimatePresence>
                      {deliveryTime === 'scheduled' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 overflow-hidden"
                        >
                          <select className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none text-sm">
                            <option>Сегодня</option>
                            <option>Завтра</option>
                          </select>
                          <select className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none text-sm">
                            <option>12:00</option>
                            <option>12:30</option>
                            <option>13:00</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </StepCard>

          {/* Step 3: Payment */}
          <StepCard step={3} title="Оплата">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-terracotta border-2 bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-terracotta' : 'text-ink'}`} />
                <div>
                  <div className="font-semibold text-sm text-ink mb-0.5">Банковская карта</div>
                  <div className="text-xs text-muted">МИР, Visa, MasterCard</div>
                </div>
              </label>

              <label className={`flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'sbp' ? 'border-terracotta border-2 bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} />
                <Smartphone className={`w-6 h-6 ${paymentMethod === 'sbp' ? 'text-terracotta' : 'text-ink'}`} />
                <div>
                  <div className="font-semibold text-sm text-ink mb-0.5">СБП</div>
                  <div className="text-xs text-muted">Через приложение банка</div>
                </div>
              </label>

              <label className={`flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-terracotta border-2 bg-terracotta/5' : 'border-border-warm bg-surface hover:bg-bg-warm'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-terracotta' : 'text-ink'}`} />
                <div>
                  <div className="font-semibold text-sm text-ink mb-0.5">При получении</div>
                  <div className="text-xs text-muted">Наличные или карта</div>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted mt-4">
              Нажимая «Оформить заказ», вы соглашаетесь с условиями публичной оферты.
            </p>
          </StepCard>

          {/* Step 4: Comments */}
          <StepCard step={4} title="Комментарий к заказу">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors min-h-[100px] resize-y mb-4 text-sm"
              placeholder="Дополнения, аллергии, пожелания курьеру..."
            />

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-5 h-5 border rounded bg-surface group-hover:border-terracotta transition-colors ${noCall ? 'border-terracotta' : 'border-border-warm'}`}>
                  <input
                    type="checkbox"
                    checked={noCall}
                    onChange={(e) => setNoCall(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="hidden peer-checked:block w-3 h-3 bg-terracotta rounded-sm"></div>
                </div>
                <span className="text-sm text-ink">Не звонить, привезти молча</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-5 h-5 border rounded bg-surface group-hover:border-terracotta transition-colors ${needUtensils ? 'border-terracotta' : 'border-border-warm'}`}>
                  <input
                    type="checkbox"
                    checked={needUtensils}
                    onChange={(e) => setNeedUtensils(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="hidden peer-checked:block w-3 h-3 bg-terracotta rounded-sm"></div>
                </div>
                <span className="text-sm text-ink">Нужны приборы и салфетки</span>
              </label>
            </div>
          </StepCard>

        </div>

        {/* Right Column: Order Summary */}
        <div className="relative">
          <OrderSummary
            items={displayItems}
            deliveryMethod={deliveryMethod}
            subtotal={subtotal}
            discount={discount}
            deliveryCost={deliveryCost}
            deliveryUnknown={deliveryUnknown}
            total={total}
            isBelowMinOrder={isBelowMinOrder}
            missingForMinOrder={missingForMinOrder}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>

      </div>
    </div>
  );
}
