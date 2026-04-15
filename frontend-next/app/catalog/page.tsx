import ProductCard from '@/components/ProductCard';

const CATEGORIES = ['Все', 'Новинки', 'Хиты', 'Мясные', 'Сырные', 'Постные', 'Сладкие'];

export default function CatalogPage() {
  return (
    <div className="py-10">
      <h1 className="text-4xl md:text-5xl mb-8 text-ink">Все пироги и сеты</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-20 bg-bg-warm/95 backdrop-blur py-4 z-40">
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <button 
              key={cat}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0 
                  ? 'bg-ink text-white' 
                  : 'bg-[#F2F2F7] text-ink hover:bg-border-warm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-6 bg-border-warm peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta"></div>
            </div>
            Только постные
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard 
          title="Фыдджын (мясной)"
          weight="1000 г • Тонкое тесто"
          price={1290}
          imageEmoji="🥩"
          badge={{ text: 'Хит', type: 'hit' }}
        />
        <ProductCard 
          title="Цахараджын"
          weight="1000 г • Сыр и листья свеклы"
          price={1120}
          imageEmoji="🍃"
        />
        <ProductCard 
          title="Пирог с сёмгой"
          weight="700 г • Шпинат и рыба"
          price={1740}
          imageEmoji="🐟"
          badge={{ text: 'Новинка', type: 'new' }}
        />
        <ProductCard 
          title="Уалибах (сырный)"
          weight="1000 г • Осетинский сыр"
          price={1120}
          imageEmoji="🧀"
        />
        <ProductCard 
          title="Картофджын"
          weight="1000 г • Картофель и сыр"
          price={990}
          imageEmoji="🥔"
        />
        <ProductCard 
          title="Фыдджын мини"
          weight="600 г • Тонкое тесто"
          price={1020}
          imageEmoji="🥩"
        />
      </div>
    </div>
  );
}
