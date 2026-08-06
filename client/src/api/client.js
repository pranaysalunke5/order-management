// const BASE_URL = 'http://localhost:4000/api';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export function getMenu() {
  return request('/menu');
}

export function placeOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export function subscribeToOrderEvents(orderId, onUpdate) {
  const source = new EventSource(`${BASE_URL}/orders/${orderId}/events`);
  source.onmessage = (event) => {
    onUpdate(JSON.parse(event.data));
  };
  return () => source.close();
}