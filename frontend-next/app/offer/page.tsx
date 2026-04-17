import type { Metadata } from 'next';
import { SITE_NAME, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Публичная оферта',
  description: `Публичная оферта на оказание услуг доставки продукции ${SITE_NAME}`,
  alternates: { canonical: '/offer/' },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = '17 апреля 2026 года';

export default function OfferPage() {
  return (
    <article className="py-10 md:py-14 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink mb-4">
        Публичная оферта
      </h1>
      <p className="text-muted text-sm mb-10">Редакция от {LAST_UPDATED}</p>

      <section className="space-y-6 text-ink leading-relaxed">
        <p>
          Настоящий документ является официальным предложением (публичной офертой) индивидуального предпринимателя
          Ризванова Рамиля Руслановича (ИНН 151312781405, ОГРН 320151300020414, далее — «Продавец») любому физическому лицу
          (далее — «Покупатель») заключить договор купли-продажи продукции на условиях, изложенных ниже.
        </p>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">1. Предмет договора</h2>
          <p>
            1.1. Продавец обязуется передать в собственность Покупателя продукцию (осетинские пироги и сопутствующие товары),
            а Покупатель обязуется принять и оплатить продукцию в соответствии с условиями настоящей оферты.
          </p>
          <p>
            1.2. Заказ оформляется Покупателем через сайт <a href={SITE_URL} className="text-accent hover:underline">{SITE_URL}</a>.
            Оформление заказа является акцептом настоящей оферты.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">2. Цена и оплата</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Цены на продукцию указаны на сайте и могут быть изменены Продавцом в одностороннем порядке</li>
            <li>Цена на заказ фиксируется в момент оформления и не подлежит изменению</li>
            <li>Оплата производится банковской картой (МИР, Visa, MasterCard), через СБП или наличными/картой курьеру при получении</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">3. Доставка и самовывоз</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Доставка осуществляется в черте города Москвы ежедневно с 08:30 до 19:00</li>
            <li>Ориентировочное время доставки — 40–120 минут с момента подтверждения заказа</li>
            <li>Минимальный заказ для доставки — 2 000 рублей</li>
            <li>Стоимость доставки — от 20 ₽/км по МКАД, за МКАД — по согласованию</li>
            <li>При заказе от 5 000 рублей доставка в пределах МКАД бесплатная</li>
            <li>Самовывоз — по адресу {SITE_ADDRESS.city}, {SITE_ADDRESS.street}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">4. Права и обязанности</h2>
          <p><strong>Продавец обязуется:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Изготовить и передать продукцию надлежащего качества</li>
            <li>Доставить продукцию в согласованный с Покупателем срок</li>
            <li>Обеспечить конфиденциальность персональных данных Покупателя</li>
          </ul>
          <p className="mt-3"><strong>Покупатель обязуется:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Предоставить корректные данные для доставки</li>
            <li>Оплатить заказ в соответствии с выбранным способом</li>
            <li>Принять заказ в оговорённое время или обеспечить возможность передачи</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">5. Возврат и отказ от заказа</h2>
          <p>
            5.1. Согласно Постановлению Правительства РФ №55 пищевая продукция надлежащего качества возврату и обмену не подлежит.
          </p>
          <p>
            5.2. В случае получения продукции ненадлежащего качества Покупатель вправе требовать замены или возврата денежных средств.
            Претензии принимаются в день получения заказа.
          </p>
          <p>
            5.3. Покупатель вправе отказаться от заказа до момента его передачи в работу. При этом, если оплата уже произведена,
            денежные средства возвращаются в полном объёме в течение 10 рабочих дней.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">6. Ответственность сторон</h2>
          <p>
            Стороны несут ответственность в соответствии с действующим законодательством Российской Федерации.
            Продавец не несёт ответственности за задержку доставки, вызванную форс-мажорными обстоятельствами
            (пробки, погодные условия, действия третьих лиц).
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">7. Персональные данные</h2>
          <p>
            Оформляя заказ, Покупатель даёт согласие на обработку персональных данных в соответствии с{' '}
            <a href="/privacy/" className="text-accent hover:underline">Политикой конфиденциальности</a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-3">8. Реквизиты Продавца</h2>
          <ul className="list-none space-y-1">
            <li><strong>ИП:</strong> Ризванов Рамиль Русланович</li>
            <li><strong>ИНН:</strong> 151312781405</li>
            <li><strong>ОГРН:</strong> 320151300020414</li>
            <li><strong>Адрес:</strong> {SITE_ADDRESS.city}, {SITE_ADDRESS.street}</li>
            <li><strong>Телефон:</strong> <a href="tel:+79264990099" className="text-accent hover:underline">{SITE_PHONE}</a></li>
            <li><strong>Email:</strong> <a href={`mailto:${SITE_EMAIL}`} className="text-accent hover:underline">{SITE_EMAIL}</a></li>
          </ul>
        </div>
      </section>
    </article>
  );
}
