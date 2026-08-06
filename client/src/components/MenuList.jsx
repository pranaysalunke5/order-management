import { useEffect, useState } from 'react';
import { getMenu } from '../api/client';

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

  if (status === 'loading') {
    return <p className="text-ink/50 p-6 font-body">Loading menu…</p>;
  }

  if (status === 'error') {
    return (
      <p className="text-red-600 p-6">
        Couldn't load the menu. Is the server running?
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group border border-line rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-baseline gap-2">
              <h3 className="font-display text-lg leading-snug">{item.name}</h3>
              <span className="font-mono text-sm text-ink/70 shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-ink/60 mt-1 leading-relaxed">
              {item.description}
            </p>
            <button
              onClick={() => onAddToCart(item)}
              className="mt-4 w-full bg-saffron text-ink rounded-full py-2.5 text-sm font-medium hover:bg-saffron-dark transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}