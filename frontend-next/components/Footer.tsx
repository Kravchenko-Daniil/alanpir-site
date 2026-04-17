import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-warm bg-bg-warm py-12 mt-16">
      <div className="w-full max-w-[940px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-serif text-lg text-ink mb-2">Контакты</h4>
            <a href="tel:+79263863370" className="text-ink font-medium hover:text-terracotta transition-colors">+7 (926) 386-33-70</a>
            <a href="https://wa.me/79263863370" className="text-muted hover:text-terracotta transition-colors">WhatsApp</a>
            <a href="mailto:rizvanovibragim@yandex.ru" className="text-muted hover:text-terracotta transition-colors">rizvanovibragim@yandex.ru</a>
            <span className="text-muted">Москва, Тихвинская 20</span>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-serif text-lg text-ink mb-2">Режим работы</h4>
            <span className="text-muted">Приём заказов — круглосуточно</span>
            <span className="text-muted">Доставка — 08:30–19:00</span>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-serif text-lg text-ink mb-2">Разделы</h4>
            <Link href="/catalog" className="text-muted hover:text-terracotta transition-colors">Каталог</Link>
            <Link href="/about" className="text-muted hover:text-terracotta transition-colors">О нас</Link>
            <Link href="/reviews" className="text-muted hover:text-terracotta transition-colors">Отзывы</Link>
            <Link href="/account" className="text-muted hover:text-terracotta transition-colors">Личный кабинет</Link>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-serif text-lg text-ink mb-2">Реквизиты</h4>
            <span className="text-muted">ИП Ризванов Рамиль Русланович</span>
            <span className="text-muted">ИНН 151312781405</span>
            <span className="text-muted">ОГРН 320151300020414</span>
          </div>
        </div>
        <div className="border-t border-border-warm pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} АланПир</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-terracotta transition-colors">Политика конфиденциальности</Link>
            <Link href="#" className="hover:text-terracotta transition-colors">Публичная оферта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
