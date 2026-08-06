import { useState } from 'react';
import { placeOrder } from '../api/client';

export default function Checkout({ cartItems, onOrderPlaced, onBack }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameChange(e) {
    const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, '');
    updateField('name', cleaned);
  }

  function handlePhoneChange(e) {
    const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    updateField('phone', cleaned);
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      next.name = 'Name can only contain letters';
    }

    if (!form.address.trim()) next.address = 'Address is required';

    if (!form.phone.trim()) {
      next.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid 10-digit phone number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        cartItems: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        deliveryDetails: form,
      };
      const { order } = await placeOrder(payload);
      onOrderPlaced(order);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <button
        onClick={onBack}
        className="text-sm text-ink/50 hover:text-ink transition-colors mb-6 flex items-center gap-1"
      >
        ← Back to cart
      </button>

      <div className="card-elevate bg-white rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-2xl mb-1">Delivery details</h2>
        <p className="text-sm text-ink/50 mb-6">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · ₹{total.toFixed(2)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Pranay Salunke"
              className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-shadow"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="address">
              Delivery address
            </label>
            <textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Flat / House no., Street, Area, City"
              className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent resize-none transition-shadow"
            />
            {errors.address && <p className="text-xs text-red-600 mt-1.5">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="phone">
              Phone number
            </label>
            <div className="flex items-center border border-line rounded-xl focus-within:ring-2 focus-within:ring-saffron transition-shadow overflow-hidden">
              <span className="pl-4 pr-3 text-sm text-ink/50 font-mono border-r border-line py-3">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="98765 43210"
                maxLength={10}
                className="w-full px-4 py-3 text-sm focus:outline-none"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1.5">{errors.phone}</p>}
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper rounded-full py-3.5 text-sm font-medium hover:bg-saffron hover:text-ink transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper flex items-center justify-center gap-2"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
            )}
            {submitting ? 'Placing order…' : `Place order · ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
