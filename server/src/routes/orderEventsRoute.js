import { Router } from 'express';
import { getOrderById } from '../models/orderStore.js';
import { subscribe, unsubscribe } from '../sse/orderEvents.js';

const router = Router();

router.get('/:id/events', (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(order)}\n\n`);

  subscribe(req.params.id, res);

  req.on('close', () => {
    unsubscribe(req.params.id, res);
  });
});

export default router;