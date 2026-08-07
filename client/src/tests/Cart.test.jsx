import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Cart from '../components/Cart';

const items = [
  { id: 'itm-001', name: 'Margherita Pizza', price: 9.99, quantity: 2 },
  { id: 'itm-003', name: 'Classic Cheeseburger', price: 8.49, quantity: 1 },
];

describe('Cart', () => {
  it('shows an empty state when there are no items', () => {
    render(<Cart cartItems={[]} onIncrement={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} onCheckout={vi.fn()} />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it('renders each item with its quantity', () => {
    render(<Cart cartItems={items} onIncrement={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} onCheckout={vi.fn()} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
  });

  it('calculates and displays the correct total', () => {
    render(<Cart cartItems={items} onIncrement={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} onCheckout={vi.fn()} />);
    expect(screen.getByText('₹28.47')).toBeInTheDocument();
  });

  it('calls onIncrement with the correct item id', async () => {
    const onIncrement = vi.fn();
    render(<Cart cartItems={items} onIncrement={onIncrement} onDecrement={vi.fn()} onRemove={vi.fn()} onCheckout={vi.fn()} />);

    await userEvent.click(screen.getByLabelText('Increase quantity of Margherita Pizza'));
    expect(onIncrement).toHaveBeenCalledWith('itm-001');
  });

  it('calls onDecrement with the correct item id', async () => {
    const onDecrement = vi.fn();
    render(<Cart cartItems={items} onIncrement={vi.fn()} onDecrement={onDecrement} onRemove={vi.fn()} onCheckout={vi.fn()} />);

    await userEvent.click(screen.getByLabelText('Decrease quantity of Classic Cheeseburger'));
    expect(onDecrement).toHaveBeenCalledWith('itm-003');
  });

  it('calls onCheckout when the checkout button is clicked', async () => {
    const onCheckout = vi.fn();
    render(<Cart cartItems={items} onIncrement={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} onCheckout={onCheckout} />);

    await userEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(onCheckout).toHaveBeenCalled();
  });
});