export default function Cart({ cartItems, onIncrement, onDecrement, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-5 border border-line rounded-2xl bg-white">
        <h2 className="font-display text-xl mb-1">Your Cart</h2>
        <p className="text-ink/50 text-sm">Nothing here yet — add something tasty.</p>
      </div>
    );
  }

  return (
    <div className="p-5 border border-line rounded-2xl bg-white">
      <h2 className="font-display text-xl mb-4">Your Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-ink/50 font-mono">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onDecrement(item.id)}
                className="w-7 h-7 rounded-full border border-line text-sm hover:bg-paper transition"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-mono">{item.quantity}</span>
              <button
                onClick={() => onIncrement(item.id)}
                className="w-7 h-7 rounded-full border border-line text-sm hover:bg-paper transition"
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="ml-1 text-xs text-red-500/80 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-line flex justify-between items-baseline">
        <span className="text-sm text-ink/60">Total</span>
        <span className="font-mono text-lg font-semibold">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCheckout}
        className="mt-4 w-full bg-ink text-paper rounded-full py-3 text-sm font-medium hover:bg-ink/90 transition"
      >
        Checkout
      </button>
    </div>
  );
}