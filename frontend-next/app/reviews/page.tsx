import type { Metadata } from 'next';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Отзывы о пироговой АланПир',
  description:
    'Что говорят наши гости. Отзывы о доставке осетинских пирогов АланПир в Москве. Рейтинг 5 звёзд на Яндекс.Картах.',
  alternates: { canonical: '/reviews/' },
};

const REVIEWS = [
  { id: 1, name: 'Анна С.', date: '12 апреля 2024', text: 'Заказывали на день рождения в офис. Пироги приехали горячими, начинки очень много, тесто тончайшее. Коллеги в восторге!', rating: 5 },
  { id: 2, name: 'Михаил', date: '5 апреля 2024', text: 'Лучший фыдджын в Москве. Мясо рубленое, бульон внутри просто сказка. Спасибо поварам!', rating: 5 },
  { id: 3, name: 'Елена В.', date: '28 марта 2024', text: 'Очень вкусные пироги с сыром и свекольной ботвой. Доставка быстрая, курьер вежливый.', rating: 5 },
  { id: 4, name: 'Дмитрий', date: '15 марта 2024', text: 'Берем здесь постоянно. Качество стабильно высокое. Радует, что всегда горячие.', rating: 5 },
  { id: 5, name: 'Ольга', date: '2 марта 2024', text: 'Сладкий пирог с вишней — это любовь с первого укуса. Рекомендую всем сладкоежкам.', rating: 5 },
  { id: 6, name: 'Алексей П.', date: '20 февраля 2024', text: 'Отличный сервис. Заказ оформил быстро, привезли вовремя. Пироги сытные и очень вкусные.', rating: 5 },
];

export default function ReviewsPage() {
  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl mb-4 text-ink">Что говорят наши гости</h1>
          <p className="text-muted">Средняя оценка 5.0 на основе 340+ отзывов</p>
        </div>
        <a href="#" className="text-terracotta font-semibold hover:underline">
          Читать все отзывы на Яндекс Картах →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-surface p-6 rounded-2xl border border-border-warm flex flex-col">
            <div className="flex items-center gap-1 text-terracotta mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-ink text-sm leading-relaxed mb-6 flex-1">"{review.text}"</p>
            <div className="flex items-center justify-between text-xs text-muted mt-auto">
              <span className="font-semibold text-ink">{review.name}</span>
              <span>{review.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F2F2F7] rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-serif text-ink mb-2">Оставить отзыв</h2>
        <p className="text-muted text-sm mb-8">Поделитесь своими впечатлениями о нашем сервисе и пирогах</p>
        
        <form className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Ваше имя</label>
            <input 
              type="text" 
              className="w-full h-12 px-4 rounded-lg border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors"
              placeholder="Как к вам обращаться?"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Оценка</label>
            <div className="flex gap-2 text-border-warm">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className="hover:text-terracotta transition-colors">
                  <Star className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Отзыв</label>
            <textarea 
              className="w-full p-4 rounded-lg border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors min-h-[120px] resize-y"
              placeholder="Напишите пару слов..."
            ></textarea>
          </div>
          <button 
            type="button"
            className="mt-2 bg-terracotta text-white h-12 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
          >
            Отправить отзыв
          </button>
        </form>
      </div>
    </div>
  );
}
