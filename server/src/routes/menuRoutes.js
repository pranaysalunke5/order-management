import { Router } from 'express';
import { getMenu } from '../models/menuStore.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ items: getMenu() });
});

export default router;