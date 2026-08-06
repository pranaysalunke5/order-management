import { v4 as uuidv4 } from 'uuid';
import { getMenuItemById } from './menuStore.js';

export const ORDER_STATUSES = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

const orders = new Map();

export function createOrder({ cartItems, deliveryDetails }) {
  const lineItems = cartItems.map(({ menuItemId, quantity }) => {
    const menuItem = getMenuItemById(menuItemId);
    return {
      menuItemId,
      name: menuItem.name,
      unitPrice: menuItem.price,
      quantity,
      subtotal: Number((menuItem.price * quantity).toFixed(2)),
    };
  });

  const total = Number(
    lineItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
  );

  const order = {
    id: uuidv4(),
    items: lineItems,
    total,
    deliveryDetails,
    status: ORDER_STATUSES[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.set(order.id, order);
  return order;
}

export function getOrderById(id) {
  return orders.get(id);
}

export function getAllOrders() {
  return Array.from(orders.values());
}

export function updateOrderStatus(id, status) {
  const order = orders.get(id);
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}