import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

const validOrderPayload = {
  cartItems: [{ menuItemId: 'itm-001', quantity: 2 }],
  deliveryDetails: {
    name: '',
    address: '',
    phone: '',
  },
};

describe('POST /api/orders', () => {
  it('creates an order with valid data', async () => {
    const res = await request(app).post('/api/orders').send(validOrderPayload);

    expect(res.status).toBe(201);
    expect(res.body.order).toHaveProperty('id');
    expect(res.body.order.status).toBe('Order Received');
    expect(res.body.order.items[0].quantity).toBe(2);
  });

  it('calculates the total from server-side prices, not client input', async () => {
    const res = await request(app).post('/api/orders').send(validOrderPayload);

    expect(res.body.order.total).toBe(19.98);
  });

  it('rejects an empty cart', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, cartItems: [] });

    expect(res.status).toBe(400);
  });

  it('rejects a cart item with quantity 0', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        ...validOrderPayload,
        cartItems: [{ menuItemId: 'itm-001', quantity: 0 }],
      });

    expect(res.status).toBe(400);
  });

  it('rejects a non-integer quantity', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        ...validOrderPayload,
        cartItems: [{ menuItemId: 'itm-001', quantity: 1.5 }],
      });

    expect(res.status).toBe(400);
  });

  it('rejects an unknown menu item id', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        ...validOrderPayload,
        cartItems: [{ menuItemId: 'itm-does-not-exist', quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.unknownIds).toContain('itm-does-not-exist');
  });

  it('rejects missing delivery details', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ cartItems: validOrderPayload.cartItems, deliveryDetails: { name: '' } });

    expect(res.status).toBe(400);
  });

  it('rejects an invalid phone number', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        ...validOrderPayload,
        deliveryDetails: { ...validOrderPayload.deliveryDetails, phone: 'abc' },
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/orders/:id', () => {
  it('returns the created order', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    const res = await request(app).get(`/api/orders/${created.body.order.id}`);

    expect(res.status).toBe(200);
    expect(res.body.order.id).toBe(created.body.order.id);
  });

  it('returns 404 for a non-existent order', async () => {
    const res = await request(app).get('/api/orders/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('updates the status forward', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    const res = await request(app)
      .patch(`/api/orders/${created.body.order.id}/status`)
      .send({ status: 'Preparing' });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('Preparing');
  });

  it('rejects moving status backward', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    await request(app)
      .patch(`/api/orders/${created.body.order.id}/status`)
      .send({ status: 'Preparing' });

    const res = await request(app)
      .patch(`/api/orders/${created.body.order.id}/status`)
      .send({ status: 'Order Received' });

    expect(res.status).toBe(400);
  });

  it('rejects an invalid status value', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    const res = await request(app)
      .patch(`/api/orders/${created.body.order.id}/status`)
      .send({ status: 'Cooking Dinner' });

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent order', async () => {
    const res = await request(app)
      .patch('/api/orders/does-not-exist/status')
      .send({ status: 'Preparing' });

    expect(res.status).toBe(404);
  });
});