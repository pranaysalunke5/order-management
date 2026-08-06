import { getOrderById, updateOrderStatus, ORDER_STATUSES } from '../models/orderStore.js';
import { publishOrderUpdate } from '../sse/orderEvents.js';

const STEP_DELAY_MS = 8000;

export function startOrderSimulation(orderId) {
  let index = ORDER_STATUSES.indexOf('Order Received');

  const interval = setInterval(() => {
    const order = getOrderById(orderId);
    if (!order) {
      clearInterval(interval);
      return;
    }

    index += 1;
    if (index >= ORDER_STATUSES.length) {
      clearInterval(interval);
      return;
    }

    const updated = updateOrderStatus(orderId, ORDER_STATUSES[index]);
    publishOrderUpdate(updated);
  }, STEP_DELAY_MS);
}