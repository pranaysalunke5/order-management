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
    <div className="max-w-lg mx-auto p-4">
      <button onClick={onBack} className="text-sm text-ink/60 hover:text-ink mb-4">
        &larr; Back to cart
      </button>

      <h2 className="font-display text-2xl mb-1">Delivery details</h2>
      <p className="text-sm text-ink/50 mb-6">
        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · ₹
        {total.toFixed(2)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleNameChange}
            placeholder="e.g. Priya Sharma"
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Delivery address
          </label>
          <textarea
            id="address"
            rows={2}
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Flat / House no., Street, Area, City"
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
          />
          {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone number
          </label>
          <div className="flex items-center border border-line rounded-lg focus-within:ring-2 focus-within:ring-saffron">
            <span className="pl-3 pr-2 text-sm text-ink/50 font-mono border-r border-line py-2.5">
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
              className="w-full px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>

        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper rounded-full py-3 text-sm font-medium hover:bg-ink/90 transition disabled:opacity-50"
        >
          {submitting ? 'Placing order…' : `Place order · ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}