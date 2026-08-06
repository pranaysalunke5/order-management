import { Router } from 'express';
import { getMenuItemById } from '../models/menuStore.js';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  ORDER_STATUSES,
} from '../models/orderStore.js';
import { createOrderSchema, updateStatusSchema } from '../validation/orderSchemas.js';
import { publishOrderUpdate } from '../sse/orderEvents.js';
import { startOrderSimulation } from '../simulation/statusSimulator.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ orders: getAllOrders() });
});

router.post('/', (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid order data',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { cartItems, deliveryDetails } = parsed.data;

  const unknownIds = cartItems
    .map((item) => item.menuItemId)
    .filter((id) => !getMenuItemById(id));

  if (unknownIds.length > 0) {
    return res.status(400).json({
      error: 'One or more cart items reference an unknown menu item',
      unknownIds,
    });
  }

  const order = createOrder({ cartItems, deliveryDetails });
  startOrderSimulation(order.id);
  res.status(201).json({ order });
});

router.get('/:id', (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

router.patch('/:id/status', (req, res) => {
  const existing = getOrderById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid status',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const currentIndex = ORDER_STATUSES.indexOf(existing.status);
  const nextIndex = ORDER_STATUSES.indexOf(parsed.data.status);

  if (nextIndex < currentIndex) {
    return res.status(400).json({
      error: `Cannot move status backward from "${existing.status}" to "${parsed.data.status}"`,
    });
  }

  const updated = updateOrderStatus(req.params.id, parsed.data.status);
  publishOrderUpdate(updated);
  res.json({ order: updated });
});

export default router;