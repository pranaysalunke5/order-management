export default function Cart({ cartItems, onIncrement, onDecrement, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="card-elevate p-6 rounded-2xl bg-white text-center">
        <div className="w-12 h-12 rounded-full bg-paper border border-line mx-auto mb-3 flex items-center justify-center text-xl">
          🛒
        </div>
        <h2 className="font-display text-lg mb-1">Your cart is empty</h2>
        <p className="text-ink/50 text-sm">Add something tasty from the menu.</p>
      </div>
    );
  }

  return (
    <div className="card-elevate p-5 rounded-2xl bg-white">
      <h2 className="font-display text-xl mb-4">Your Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between animate-[fadeIn_0.2s_ease]"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-ink/50 font-mono">₹{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center border border-line rounded-full overflow-hidden">
                <button
                  onClick={() => onDecrement(item.id)}
                  className="w-7 h-7 text-sm hover:bg-paper transition-colors"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
                <button
                  onClick={() => onIncrement(item.id)}
                  className="w-7 h-7 text-sm hover:bg-paper transition-colors"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-xs text-red-500/70 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-line flex justify-between items-baseline">
        <span className="text-sm text-ink/60">Total</span>
        <span className="font-mono text-lg font-semibold">₹{total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCheckout}
        className="mt-4 w-full bg-ink text-paper rounded-full py-3 text-sm font-medium hover:bg-saffron hover:text-ink transition-colors duration-200"
      >
        Checkout
      </button>
    </div>
  );
}