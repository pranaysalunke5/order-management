import { z } from 'zod';
import { ORDER_STATUSES } from '../models/orderStore.js';

const cartItemSchema = z.object({
  menuItemId: z.string().min(1, 'menuItemId is required'),
  quantity: z
    .number({ invalid_type_error: 'quantity must be a number' })
    .int('quantity must be a whole number')
    .positive('quantity must be at least 1')
    .max(50, 'quantity is too large'),
});

const deliveryDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required')
    .max(100)
    .regex(/^[A-Za-z\s]+$/, 'name can only contain letters'),
  address: z.string().trim().min(1, 'address is required').max(300),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'phone must be exactly 10 digits'),
});

export const createOrderSchema = z.object({
  cartItems: z
    .array(cartItemSchema)
    .min(1, 'cart must contain at least one item'),
  deliveryDetails: deliveryDetailsSchema,
});

export const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    errorMap: () => ({
      message: `status must be one of: ${ORDER_STATUSES.join(', ')}`,
    }),
  }),
});