import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-warm bg-bg-warm py-8 mt-16">
      <div className="w-full max-w-[940px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center md:text-left">
          <span>© {new Date().getFullYear()} АланПир</span>
          <span>Москва, ул. Тихвинская, 20</span>
          <span>Режим работы: 08:30 – 19:00</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center md:text-left">
          <span>ИП Ризванов Р.Р.</span>
          <Link href="#" className="hover:text-terracotta transition-colors">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  );
}
