const subscribers = new Map();

export function subscribe(orderId, res) {
  if (!subscribers.has(orderId)) {
    subscribers.set(orderId, new Set());
  }
  subscribers.get(orderId).add(res);
}

export function unsubscribe(orderId, res) {
  const set = subscribers.get(orderId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) subscribers.delete(orderId);
}

export function publishOrderUpdate(order) {
  const set = subscribers.get(order.id);
  if (!set) return;

  const payload = `data: ${JSON.stringify(order)}\n\n`;
  for (const res of set) {
    res.write(payload);
  }
}