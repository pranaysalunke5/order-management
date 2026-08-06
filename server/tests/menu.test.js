import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';


describe('GET /api/menu', () => {
  it('returns a list of menu items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('each item has the required fields', async () => {
    const res = await request(app).get('/api/menu');

    for (const item of res.body.items) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('image');
    }
  });
});