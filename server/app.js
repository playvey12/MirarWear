const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { guestAuth } = require('./utils/guestAuth');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const statsRouter = require('./routes/stats');
const cartRouter = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: (origin, callback) => callback(null, origin || true),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use(guestAuth);

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString('ru-RU')}] ${req.method} ${req.url} (guest: ${req.guestId})`);
  next();
});


app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/cart', cartRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), guestId: req.guestId });
});

// Обработка ошибок — чтобы сервер не падал молча
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`✅ API сервер MirarWear запущен: http://localhost:${PORT}`);
  console.log(`   Данные хранятся в: ${require('path').join(__dirname, 'data')}`);
});
