import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderEventsRoute from './routes/orderEventsRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderEventsRoute);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Order Management API running on http://localhost:${PORT}`);
});

export default app;