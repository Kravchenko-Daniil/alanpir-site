import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const MAX_URL = 'https://max.ru/AlanPir';

export default function Footer() {
  return (
    <footer className="bg-ink text-surface py-12 md:py-16 mt-10 md:mt-16 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="w-full max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
          
          {/* Column 1: Contacts */}
          <div className="flex flex-col gap-3 md:gap-4 text-sm">
            <Link href="/" className="inline-block mb-1 md:mb-2">
              <img src="/logo-alanpir.png" alt="АланПир" className="h-12 w-auto object-contain" />
            </Link>
            <a href="tel:+79264990099" className="text-xl md:text-2xl font-bold hover:text-accent transition-colors">+7 (926) 499-00-99</a>
            <a href="https://wa.me/79264990099" className="text-white/70 hover:text-accent transition-colors font-medium">Написать в WhatsApp</a>
            <div className="flex items-center gap-3 mt-1">
              <a
                href={MAX_URL}
                aria-label="Max"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <a href="mailto:rizvanovibragim@yandex.ru" className="text-white/70 hover:text-accent transition-colors mt-1">rizvanovibragim@yandex.ru</a>
            <span className="text-white/70 mt-1 md:mt-2">Москва, Трифоновская 4</span>
          </div>

          {/* Column 2: Working Hours */}
          <div className="flex flex-col gap-2 md:gap-3 text-sm">
            <h4 className="font-serif text-lg font-bold mb-1 md:mb-2 text-white">Режим работы</h4>
            <span className="text-white/70 font-bold text-white uppercase text-xs tracking-wide">Приём заказов:</span>
            <span className="text-white/70">круглосуточно</span>
            <span className="text-white/70 font-bold text-white uppercase text-xs tracking-wide mt-2">Пекарня:</span>
            <span className="text-white/70">ежедневно 7:40–20:00</span>
            <span className="text-white/70 font-bold text-white uppercase text-xs tracking-wide mt-2">Доставка:</span>
            <span className="text-white/70">Соседние станции — бесплатно</span>
            <span className="text-white/70">Садовое — от 1000 ₽, 150 ₽</span>
            <span className="text-white/70">ТТК — от 1500 ₽, 250 ₽</span>
            <span className="text-white/70">В пределах МКАД — от 2000 ₽, 250 ₽</span>
            <span className="text-white/70">За МКАД — от 5000 ₽, по согласованию</span>
          </div>

          {/* Column 3: Navigation */}
          <div className="flex flex-col gap-2 md:gap-3 text-sm">
            <h4 className="font-serif text-lg font-bold mb-1 md:mb-2 text-white">Разделы</h4>
            <Link href="/catalog" className="text-white/70 hover:text-accent transition-colors">Каталог</Link>
            <Link href="/about" className="text-white/70 hover:text-accent transition-colors">О нас</Link>
            <Link href="/reviews" className="text-white/70 hover:text-accent transition-colors">Отзывы</Link>
            <Link href="/account" className="text-white/70 hover:text-accent transition-colors">Личный кабинет</Link>
            <Link href="/privacy/" className="text-white/70 hover:text-accent transition-colors mt-2 md:mt-3 border-t border-white/10 pt-3 md:pt-4">Политика конфиденциальности</Link>
            <Link href="/offer/" className="text-white/70 hover:text-accent transition-colors">Публичная оферта</Link>
          </div>

          {/* Column 4: Requisites */}
          <div className="flex flex-col gap-2 md:gap-3 text-sm">
            <h4 className="font-serif text-lg font-bold mb-1 md:mb-2 text-white">Реквизиты</h4>
            <span className="text-white/70">ИП Ризванов Рамиль Русланович</span>
            <span className="text-white/70">ИНН 151312781405</span>
            <span className="text-white/70">ОГРН 320151300020414</span>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 text-xs text-white/40 text-center sm:text-left">
          <span>© {new Date().getFullYear()} АланПир</span>
          <span>Разработано с заботой о традициях</span>
        </div>
      </div>
    </footer>
  );
}
