import Link from 'next/link';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-16 pb-20 md:pb-0">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3 text-sm">
            <div className="inline-flex items-center gap-0.5 px-2 py-1.5 bg-accent border-2 border-accent rounded-md w-fit leading-none">
              <span className="font-serif font-black text-[18px] text-ink">АЛАН</span>
              <span className="font-serif font-black text-[18px] text-ink">ПИР</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mt-2">
              Осетинские пироги по традиционным рецептам. Печём под заказ и доставляем горячими.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold mb-1">Контакты</h4>
            <a href="tel:+79263863370" className="flex items-center gap-2 text-white/80 hover:text-accent transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" /> +7 (926) 386-33-70
            </a>
            <a href="https://wa.me/79263863370" className="flex items-center gap-2 text-white/80 hover:text-accent transition-colors">
              <MessageCircle className="w-3.5 h-3.5 shrink-0" /> WhatsApp
            </a>
            <a href="mailto:rizvanovibragim@yandex.ru" className="flex items-center gap-2 text-white/80 hover:text-accent transition-colors break-all">
              <Mail className="w-3.5 h-3.5 shrink-0" /> rizvanovibragim@yandex.ru
            </a>
            <span className="flex items-start gap-2 text-white/80">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-1" /> Москва, Тихвинская 20
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold mb-1">Режим работы</h4>
            <div>
              <div className="text-white/60 text-xs">Приём заказов</div>
              <div className="text-white/80">будни 8:30–20:00</div>
              <div className="text-white/80">выходные 10:00–17:00</div>
            </div>
            <div>
              <div className="text-white/60 text-xs">Доставка</div>
              <div className="text-white/80">40–120 минут</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold mb-1">Разделы</h4>
            <Link href="/catalog" className="text-white/80 hover:text-accent transition-colors">Каталог</Link>
            <Link href="/about" className="text-white/80 hover:text-accent transition-colors">О нас</Link>
            <Link href="/reviews" className="text-white/80 hover:text-accent transition-colors">Отзывы</Link>
            <Link href="/account" className="text-white/80 hover:text-accent transition-colors">Личный кабинет</Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} АланПир</span>
            <span>ИП Ризванов Р. Р.</span>
            <span>ИНН 151312781405</span>
            <span>ОГРН 320151300020414</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">Политика конфиденциальности</Link>
            <Link href="/offer" className="hover:text-accent transition-colors">Публичная оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
