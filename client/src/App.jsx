import { useState } from 'react';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderStatus from './components/OrderStatus';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState('shop');
  const [placedOrder, setPlacedOrder] = useState(null);

  function addToCart(item) {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function increment(id) {
    setCartItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity + 1 } : c))
    );
  }

  function decrement(id) {
    setCartItems((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function remove(id) {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  }

  function goToCheckout() {
    setCartOpen(false);
    setView('checkout');
  }

  function handleOrderPlaced(order) {
    setPlacedOrder(order);
    setCartItems([]);
    setView('status');
  }

  const itemCount = cartItems.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setView('shop')}
            className="font-display text-2xl tracking-tight"
          >
           FoodPanda
          </button>
          {view === 'shop' && (
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10 transition"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-saffron text-ink text-xs font-mono font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {view === 'shop' && (
        <>
          <div className="bg-ink text-paper">
            <div className="max-w-6xl mx-auto px-4 pb-8 pt-2">
              <p className="font-display text-3xl sm:text-4xl leading-tight max-w-md">
                Good food, tracked from kitchen to door.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto lg:flex lg:gap-6 lg:px-4 lg:py-6">
            <main className="flex-1">
              <MenuList onAddToCart={addToCart} />
            </main>

            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24">
                <Cart
                  cartItems={cartItems}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={remove}
                  onCheckout={goToCheckout}
                />
              </div>
            </aside>
          </div>

          {cartOpen && (
            <div className="lg:hidden fixed inset-0 z-30">
              <div
                className="absolute inset-0 bg-ink/50"
                onClick={() => setCartOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-paper shadow-xl overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-line">
                  <h2 className="font-display text-xl">Your Cart</h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-2xl leading-none"
                    aria-label="Close cart"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-4">
                  <Cart
                    cartItems={cartItems}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onRemove={remove}
                    onCheckout={goToCheckout}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          onOrderPlaced={handleOrderPlaced}
          onBack={() => setView('shop')}
        />
      )}

      {view === 'status' && placedOrder && (
        <div className="max-w-lg mx-auto p-6">
          <p className="font-display text-2xl">Order placed!</p>
          <p className="text-sm text-ink/50 mt-2 font-mono">#{placedOrder.id}</p>
        </div>
      )}
      {view === 'status' && placedOrder && (
        <OrderStatus
          order={placedOrder}
          onNewOrder={() => {
            setPlacedOrder(null);
            setView('shop');
          }}
        />
      )}
    </div>
  );
}