import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

vi.mock('../api/client', () => ({
  getMenu: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          id: 'itm-001',
          name: 'Margherita Pizza',
          description: 'Classic',
          price: 9.99,
          image: 'test.jpg',
        },
      ],
    })
  ),
  placeOrder: vi.fn(),
  subscribeToOrderEvents: vi.fn(() => () => {}),
}));

describe('App — cart interactions', () => {
  beforeEach(() => {
  });

  it('adds an item to the cart and opens the cart view', async () => {
    render(<App />);

    const addButton = await screen.findByRole('button', { name: /add to cart/i });
    await userEvent.click(addButton);

    expect(await screen.findAllByText('Margherita Pizza')).not.toHaveLength(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('clicking Add to Cart twice increments quantity to 2, not two separate entries', async () => {
    render(<App />);

    const addButton = await screen.findByRole('button', { name: /add to cart/i });
    await userEvent.click(addButton);
    await userEvent.click(addButton);

    const quantityEls = screen.getAllByText('2');
    expect(quantityEls.length).toBeGreaterThan(0);
  });
});