import { useEffect, useState } from 'react';
import { getMenu } from '../api/client';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-line">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 rounded skeleton" />
        <div className="h-3 w-full rounded skeleton" />
        <div className="h-3 w-4/5 rounded skeleton" />
        <div className="h-9 w-full rounded-full skeleton mt-2" />
      </div>
    </div>
  );
}

export default function MenuList({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getMenu()
      .then((data) => {
        setItems(data.items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'error') {
    return (
      <div className="m-4 p-6 rounded-2xl border border-red-200 bg-red-50 text-center">
        <p className="text-red-700 font-medium">Couldn't load the menu</p>
        <p className="text-red-600/70 text-sm mt-1">Is the server running?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 p-4">
      {status === 'loading' &&
        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

      {status === 'ready' &&
        items.map((item) => (
          <div
            key={item.id}
            className="card-elevate group rounded-2xl overflow-hidden bg-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              {item.category && (
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="font-display text-lg leading-snug">{item.name}</h3>
                <span className="font-mono text-sm text-ink/70 shrink-0">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-ink/55 mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <button
                onClick={() => onAddToCart(item)}
                className="mt-4 w-full bg-ink text-paper rounded-full py-2.5 text-sm font-medium hover:bg-saffron hover:text-ink transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}